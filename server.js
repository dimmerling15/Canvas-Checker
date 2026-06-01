const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const PORT = Number(process.env.PORT || 4177);
const ROOT = __dirname;
const CONFIG_PATH = path.join(ROOT, "config.json");
const CACHE_PATH = path.join(ROOT, "assignments-cache.json");
const SESSION_COOKIE = "assignment_reminder_session";

const DEFAULT_CONFIG = {
  canvasBaseUrl: "https://mcpsmd.instructure.com",
  accessToken: "paste-your-canvas-token-here",
  lookAheadDays: 45,
  refreshMinutes: 15
};

let state = {
  assignments: [],
  lastChecked: null,
  lastError: null,
  refreshing: false
};

function ensureConfig() {
  if (!fs.existsSync(CONFIG_PATH)) {
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(DEFAULT_CONFIG, null, 2));
  }
}

function readConfig() {
  ensureConfig();
  const fileConfig = JSON.parse(fs.readFileSync(CONFIG_PATH, "utf8"));
  return {
    canvasBaseUrl: process.env.CANVAS_BASE_URL || fileConfig.canvasBaseUrl,
    accessToken: process.env.CANVAS_ACCESS_TOKEN || fileConfig.accessToken,
    lookAheadDays: Number(process.env.LOOK_AHEAD_DAYS || fileConfig.lookAheadDays || 45),
    refreshMinutes: Number(process.env.REFRESH_MINUTES || fileConfig.refreshMinutes || 15)
  };
}

function writeCache() {
  fs.writeFileSync(CACHE_PATH, JSON.stringify({
    assignments: state.assignments,
    lastChecked: state.lastChecked,
    lastError: state.lastError
  }, null, 2));
}

function readCache() {
  if (!fs.existsSync(CACHE_PATH)) return;
  try {
    const cached = JSON.parse(fs.readFileSync(CACHE_PATH, "utf8"));
    state.assignments = Array.isArray(cached.assignments) ? cached.assignments : [];
    state.lastChecked = cached.lastChecked || null;
    state.lastError = cached.lastError || null;
  } catch {
    state.lastError = "Could not read the local assignment cache.";
  }
}

function json(res, status, body) {
  const text = JSON.stringify(body);
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": Buffer.byteLength(text),
    "Cache-Control": "no-store"
  });
  res.end(text);
}

function sendFile(res, filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const types = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "application/javascript; charset=utf-8",
    ".svg": "image/svg+xml"
  };

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }
    res.writeHead(200, {
      "Content-Type": types[ext] || "application/octet-stream",
      "Cache-Control": "no-store"
    });
    res.end(data);
  });
}

function redirect(res, location) {
  res.writeHead(302, { Location: location });
  res.end();
}

function getDashboardPassword() {
  return process.env.DASHBOARD_PASSWORD || "";
}

function getSessionSecret() {
  return process.env.SESSION_SECRET || getDashboardPassword() || "local-assignment-reminder";
}

function sign(value) {
  return crypto
    .createHmac("sha256", getSessionSecret())
    .update(value)
    .digest("base64url");
}

function parseCookies(req) {
  const header = req.headers.cookie || "";
  return Object.fromEntries(
    header
      .split(";")
      .map(part => part.trim().split("="))
      .filter(pair => pair.length === 2 && pair[0])
  );
}

function hasAccess(req) {
  const password = getDashboardPassword();
  if (!password) return true;
  const cookies = parseCookies(req);
  const token = cookies[SESSION_COOKIE];
  return token === `ok.${sign("ok")}`;
}

function requireAccess(req, res) {
  if (hasAccess(req)) return true;
  if (req.url.startsWith("/api/")) {
    json(res, 401, { error: "Password required." });
  } else {
    redirect(res, "/login.html");
  }
  return false;
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", chunk => {
      body += chunk;
      if (body.length > 8192) {
        reject(new Error("Request is too large."));
        req.destroy();
      }
    });
    req.on("end", () => resolve(body));
    req.on("error", reject);
  });
}

function absoluteCanvasUrl(baseUrl, url) {
  if (!url) return "";
  if (/^https?:\/\//i.test(url)) return url;
  return `${baseUrl}${url.startsWith("/") ? "" : "/"}${url}`;
}

function toLocalDueText(dateValue) {
  if (!dateValue) return "No due date";
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(dateValue));
}

function normalizeAssignment(item, baseUrl) {
  const assignment = item.plannable || {};
  const submissions = item.submissions || {};
  return {
    id: `${item.course_id || "user"}-${item.plannable_id}`,
    title: assignment.title || "Untitled assignment",
    course: item.context_name || "Canvas",
    dueAt: item.plannable_date || assignment.due_at || null,
    dueText: toLocalDueText(item.plannable_date || assignment.due_at),
    points: typeof assignment.points_possible === "number" ? assignment.points_possible : null,
    submitted: Boolean(submissions.submitted || submissions.workflow_state === "submitted"),
    url: absoluteCanvasUrl(baseUrl, item.html_url),
    type: item.plannable_type || "assignment"
  };
}

async function fetchPlannerPage(config, startDate, endDate) {
  if (!config.accessToken || config.accessToken === "paste-your-canvas-token-here") {
    throw new Error("Canvas token is missing. Set CANVAS_ACCESS_TOKEN or update config.json.");
  }

  const url = new URL("/api/v1/planner/items", config.canvasBaseUrl);
  url.searchParams.set("start_date", startDate.toISOString());
  url.searchParams.set("end_date", endDate.toISOString());
  url.searchParams.set("per_page", "100");

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${config.accessToken}`,
      Accept: "application/json"
    }
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Canvas returned ${response.status}: ${text.slice(0, 180)}`);
  }

  return response.json();
}

async function refreshAssignments() {
  if (state.refreshing) return state;
  state.refreshing = true;

  try {
    const config = readConfig();
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(end.getDate() + Number(config.lookAheadDays || 45));

    const items = await fetchPlannerPage(config, start, end);
    const assignments = items
      .filter(item => item.plannable_type === "assignment")
      .map(item => normalizeAssignment(item, config.canvasBaseUrl))
      .sort((a, b) => {
        if (!a.dueAt && !b.dueAt) return a.title.localeCompare(b.title);
        if (!a.dueAt) return 1;
        if (!b.dueAt) return -1;
        return new Date(a.dueAt) - new Date(b.dueAt);
      });

    state.assignments = assignments;
    state.lastChecked = new Date().toISOString();
    state.lastError = null;
    writeCache();
  } catch (error) {
    state.lastError = error.message || "Could not refresh Canvas.";
    state.lastChecked = new Date().toISOString();
    writeCache();
  } finally {
    state.refreshing = false;
  }

  return state;
}

function publicState() {
  const config = readConfig();
  return {
    assignments: state.assignments,
    lastChecked: state.lastChecked,
    lastError: state.lastError,
    refreshing: state.refreshing,
    lookAheadDays: config.lookAheadDays,
    refreshMinutes: config.refreshMinutes,
    canvasBaseUrl: config.canvasBaseUrl
  };
}

function startAutoRefresh() {
  const config = readConfig();
  const minutes = Math.max(1, Number(config.refreshMinutes || 15));
  refreshAssignments();
  setInterval(refreshAssignments, minutes * 60 * 1000);
}

async function handleRequest(req, res) {
  const url = new URL(req.url, `http://localhost:${PORT}`);

  if (url.pathname === "/api/login" && req.method === "POST") {
    const expected = getDashboardPassword();
    const params = new URLSearchParams(await readBody(req));
    const actual = params.get("password") || "";
    if (!expected || actual !== expected) {
      json(res, 401, { error: "That password did not work." });
      return;
    }
    res.writeHead(204, {
      "Set-Cookie": `${SESSION_COOKIE}=ok.${sign("ok")}; HttpOnly; SameSite=Lax; Path=/; Max-Age=2592000`
    });
    res.end();
    return;
  }

  if (url.pathname === "/api/logout" && req.method === "POST") {
    res.writeHead(204, {
      "Set-Cookie": `${SESSION_COOKIE}=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0`
    });
    res.end();
    return;
  }

  if (url.pathname === "/login.html") {
    if (hasAccess(req)) {
      redirect(res, "/");
      return;
    }
    sendFile(res, path.join(ROOT, "public", "login.html"));
    return;
  }

  if (url.pathname === "/api/status") {
    if (!requireAccess(req, res)) return;
    json(res, 200, publicState());
    return;
  }

  if (url.pathname === "/api/refresh" && req.method === "POST") {
    if (!requireAccess(req, res)) return;
    refreshAssignments().then(() => json(res, 200, publicState()));
    return;
  }

  if (url.pathname === "/" || url.pathname === "/index.html") {
    if (!requireAccess(req, res)) return;
    sendFile(res, path.join(ROOT, "public", "index.html"));
    return;
  }

  const safePath = path.normalize(url.pathname).replace(/^(\.\.[/\\])+/, "");
  const filePath = path.join(ROOT, "public", safePath);
  if (!filePath.startsWith(path.join(ROOT, "public"))) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }
  sendFile(res, filePath);
}

ensureConfig();
readCache();
startAutoRefresh();

http.createServer(handleRequest).listen(PORT, () => {
  console.log(`Canvas Assignment Reminder is running at http://localhost:${PORT}`);
  console.log(`Private config: ${CONFIG_PATH}`);
});
