# Canvas Assignment Reminder

A local Canvas assignment dashboard for MCPS. It checks Canvas with your access token, shows upcoming assignments in a calendar and list, and can show browser reminders while the app is open.

## Start

1. Open PowerShell in this folder.
2. Run:

```powershell
node server.js
```

3. Open:

```text
http://localhost:4177
```

The first run creates `config.json`. Keep that file private because it contains your Canvas token.

## Put It Online

Use a Node host such as Render, Railway, or Fly.io. Do not put `config.json` online. Use environment variables instead:

```text
CANVAS_BASE_URL=https://mcpsmd.instructure.com
CANVAS_ACCESS_TOKEN=your-new-canvas-token
DASHBOARD_PASSWORD=a-password-for-the-site
SESSION_SECRET=a-long-random-secret
LOOK_AHEAD_DAYS=45
REFRESH_MINUTES=15
```

For Render, upload this folder to a private GitHub repo, create a new Web Service, and use:

```text
Build command: npm install
Start command: npm start
```

This folder also includes `render.yaml` if you want Render to detect the service settings automatically.

## Reminder Notes

- Browser notifications work while the dashboard is open in your browser.
- The app refreshes Canvas every 15 minutes.
- Reminder choices are saved in your browser.
- The server only reads Canvas data. It does not submit or change assignments.

## Token Safety

If your token was shared anywhere, revoke it in Canvas and generate a new one. Then update `config.json`.
