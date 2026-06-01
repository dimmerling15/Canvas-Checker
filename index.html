const state = {
  assignments: [],
  visibleMonth: new Date(),
  notified: new Set(JSON.parse(localStorage.getItem("notifiedAssignments") || "[]"))
};

const els = {
  refreshButton: document.querySelector("#refreshButton"),
  logoutButton: document.querySelector("#logoutButton"),
  notifyButton: document.querySelector("#notifyButton"),
  nextDue: document.querySelector("#nextDue"),
  openCount: document.querySelector("#openCount"),
  lastChecked: document.querySelector("#lastChecked"),
  errorBox: document.querySelector("#errorBox"),
  leadTime: document.querySelector("#leadTime"),
  hideSubmitted: document.querySelector("#hideSubmitted"),
  monthTitle: document.querySelector("#monthTitle"),
  calendarGrid: document.querySelector("#calendarGrid"),
  assignmentList: document.querySelector("#assignmentList"),
  prevMonth: document.querySelector("#prevMonth"),
  nextMonth: document.querySelector("#nextMonth")
};

const savedLeadTime = localStorage.getItem("leadTimeMinutes");
if (savedLeadTime) els.leadTime.value = savedLeadTime;

function parseDue(assignment) {
  return assignment.dueAt ? new Date(assignment.dueAt) : null;
}

function sameDay(a, b) {
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();
}

function dateKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function formatShort(date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(date);
}

function formatLastChecked(value) {
  if (!value) return "Never";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(value));
}

function dueSoon(assignment) {
  const due = parseDue(assignment);
  if (!due || assignment.submitted) return false;
  const now = new Date();
  const leadMs = Number(els.leadTime.value || 60) * 60 * 1000;
  const diff = due - now;
  return diff > 0 && diff <= leadMs;
}

function visibleAssignments() {
  const hideSubmitted = els.hideSubmitted.checked;
  return state.assignments.filter(item => !(hideSubmitted && item.submitted));
}

function updateSummary(data) {
  const open = state.assignments.filter(item => !item.submitted);
  const next = open.find(item => parseDue(item) && parseDue(item) >= new Date());

  els.nextDue.textContent = next ? `${next.title} (${formatShort(parseDue(next))})` : "Nothing upcoming";
  els.openCount.textContent = String(open.length);
  els.lastChecked.textContent = formatLastChecked(data.lastChecked);

  if (data.lastError) {
    els.errorBox.hidden = false;
    els.errorBox.textContent = data.lastError;
  } else {
    els.errorBox.hidden = true;
    els.errorBox.textContent = "";
  }
}

function renderCalendar() {
  const month = state.visibleMonth;
  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  const first = new Date(year, monthIndex, 1);
  const start = new Date(first);
  start.setDate(1 - first.getDay());

  els.monthTitle.textContent = new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric"
  }).format(month);

  const byDay = new Map();
  for (const assignment of visibleAssignments()) {
    const due = parseDue(assignment);
    if (!due) continue;
    const key = dateKey(due);
    if (!byDay.has(key)) byDay.set(key, []);
    byDay.get(key).push(assignment);
  }

  els.calendarGrid.innerHTML = "";
  const today = new Date();

  for (let i = 0; i < 42; i += 1) {
    const day = new Date(start);
    day.setDate(start.getDate() + i);

    const cell = document.createElement("div");
    cell.className = "day";
    if (day.getMonth() !== monthIndex) cell.classList.add("muted");
    if (sameDay(day, today)) cell.classList.add("today");

    const number = document.createElement("div");
    number.className = "dayNumber";
    number.textContent = String(day.getDate());
    cell.append(number);

    const dots = document.createElement("div");
    dots.className = "dots";
    for (const assignment of (byDay.get(dateKey(day)) || []).slice(0, 4)) {
      const item = document.createElement("a");
      item.className = "dot";
      if (assignment.submitted) item.classList.add("submitted");
      if (dueSoon(assignment)) item.classList.add("dueSoon");
      item.href = assignment.url;
      item.target = "_blank";
      item.rel = "noreferrer";
      item.title = `${assignment.title} - ${assignment.course}`;
      item.textContent = assignment.title;
      dots.append(item);
    }
    cell.append(dots);
    els.calendarGrid.append(cell);
  }
}

function renderList() {
  const items = visibleAssignments();
  els.assignmentList.innerHTML = "";

  if (!items.length) {
    const empty = document.createElement("div");
    empty.className = "empty";
    empty.textContent = "No assignments to show.";
    els.assignmentList.append(empty);
    return;
  }

  for (const assignment of items) {
    const card = document.createElement("article");
    card.className = "assignment";
    if (assignment.submitted) card.classList.add("submitted");
    if (dueSoon(assignment)) card.classList.add("dueSoon");

    const title = document.createElement("h3");
    title.textContent = assignment.title;

    const meta = document.createElement("div");
    meta.className = "meta";

    const due = document.createElement("span");
    due.className = "pill";
    due.textContent = assignment.dueText;
    meta.append(due);

    const course = document.createElement("span");
    course.className = "pill";
    course.textContent = assignment.course;
    meta.append(course);

    if (assignment.points !== null) {
      const points = document.createElement("span");
      points.className = "pill";
      points.textContent = `${assignment.points} pts`;
      meta.append(points);
    }

    if (assignment.submitted) {
      const done = document.createElement("span");
      done.className = "pill done";
      done.textContent = "Submitted";
      meta.append(done);
    } else if (dueSoon(assignment)) {
      const soon = document.createElement("span");
      soon.className = "pill soon";
      soon.textContent = "Reminder window";
      meta.append(soon);
    }

    const link = document.createElement("a");
    link.href = assignment.url;
    link.target = "_blank";
    link.rel = "noreferrer";
    link.textContent = "Open in Canvas";

    card.append(title, meta, link);
    els.assignmentList.append(card);
  }
}

function saveNotified() {
  localStorage.setItem("notifiedAssignments", JSON.stringify([...state.notified].slice(-200)));
}

function maybeNotify() {
  if (!("Notification" in window) || Notification.permission !== "granted") return;

  for (const assignment of state.assignments) {
    if (!dueSoon(assignment) || state.notified.has(assignment.id)) continue;
    const due = parseDue(assignment);
    const notification = new Notification("Canvas assignment due soon", {
      body: `${assignment.title}\n${assignment.course}\nDue ${formatShort(due)}`
    });
    notification.onclick = () => window.open(assignment.url, "_blank", "noreferrer");
    state.notified.add(assignment.id);
  }
  saveNotified();
}

function render(data) {
  state.assignments = data.assignments || [];
  updateSummary(data);
  renderCalendar();
  renderList();
  maybeNotify();
}

async function loadStatus() {
  const response = await fetch("/api/status");
  render(await response.json());
}

async function refresh() {
  els.refreshButton.disabled = true;
  els.refreshButton.querySelector("span:last-child").textContent = "Refreshing";
  try {
    const response = await fetch("/api/refresh", { method: "POST" });
    render(await response.json());
  } finally {
    els.refreshButton.disabled = false;
    els.refreshButton.querySelector("span:last-child").textContent = "Refresh";
  }
}

els.refreshButton.addEventListener("click", refresh);
els.logoutButton.addEventListener("click", async () => {
  await fetch("/api/logout", { method: "POST" });
  window.location.href = "/login.html";
});

els.notifyButton.addEventListener("click", async () => {
  if (!("Notification" in window)) {
    alert("This browser does not support notifications.");
    return;
  }
  await Notification.requestPermission();
  maybeNotify();
});

els.leadTime.addEventListener("change", () => {
  localStorage.setItem("leadTimeMinutes", els.leadTime.value);
  renderCalendar();
  renderList();
  maybeNotify();
});

els.hideSubmitted.addEventListener("change", () => {
  renderCalendar();
  renderList();
});

els.prevMonth.addEventListener("click", () => {
  state.visibleMonth = new Date(state.visibleMonth.getFullYear(), state.visibleMonth.getMonth() - 1, 1);
  renderCalendar();
});

els.nextMonth.addEventListener("click", () => {
  state.visibleMonth = new Date(state.visibleMonth.getFullYear(), state.visibleMonth.getMonth() + 1, 1);
  renderCalendar();
});

loadStatus();
setInterval(loadStatus, 60 * 1000);
