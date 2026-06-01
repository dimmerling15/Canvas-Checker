:root {
  color-scheme: light;
  --ink: #1c2428;
  --muted: #657276;
  --line: #d9e1df;
  --paper: #f7faf9;
  --panel: #ffffff;
  --blue: #2767b1;
  --blue-dark: #184b84;
  --green: #2b7b57;
  --amber: #a86514;
  --red: #b13c3c;
  --shadow: 0 14px 36px rgba(24, 41, 54, 0.12);
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  min-height: 100vh;
  font-family: Arial, Helvetica, sans-serif;
  color: var(--ink);
  background: linear-gradient(180deg, #eef5f4 0%, #f8fbfb 44%, #f4f7f6 100%);
}

button,
select,
input {
  font: inherit;
}

.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 28px clamp(18px, 4vw, 48px) 18px;
}

.eyebrow {
  margin: 0 0 4px;
  color: var(--blue);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0;
  text-transform: uppercase;
}

h1,
h2 {
  margin: 0;
  letter-spacing: 0;
}

h1 {
  font-size: clamp(28px, 4vw, 42px);
  line-height: 1.05;
}

h2 {
  font-size: 20px;
}

.actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: flex-end;
}

button {
  min-height: 42px;
  border: 1px solid var(--blue);
  border-radius: 8px;
  padding: 0 14px;
  background: var(--blue);
  color: white;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
}

button:hover {
  background: var(--blue-dark);
}

button.ghost {
  color: var(--blue);
  background: white;
}

button.ghost:hover {
  background: #edf5ff;
}

main {
  padding: 0 clamp(18px, 4vw, 48px) 42px;
}

.status {
  display: grid;
  grid-template-columns: repeat(4, minmax(160px, 1fr));
  gap: 12px;
  margin-bottom: 16px;
}

.status > div {
  min-height: 84px;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.82);
  padding: 14px;
  box-shadow: 0 4px 18px rgba(18, 38, 50, 0.06);
}

.label {
  display: block;
  margin-bottom: 8px;
  color: var(--muted);
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
}

.status strong {
  display: block;
  font-size: 17px;
  line-height: 1.25;
}

select {
  width: 100%;
  min-height: 38px;
  border: 1px solid var(--line);
  border-radius: 6px;
  background: white;
  color: var(--ink);
  padding: 0 10px;
}

.error {
  margin-bottom: 16px;
  border: 1px solid #e3aaaa;
  border-radius: 8px;
  background: #fff0f0;
  color: #842a2a;
  padding: 12px 14px;
}

.workspace {
  display: grid;
  grid-template-columns: minmax(0, 1.35fr) minmax(320px, 0.65fr);
  gap: 16px;
  align-items: start;
}

.calendarPanel,
.listPanel {
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--panel);
  box-shadow: var(--shadow);
}

.calendarPanel {
  padding: 16px;
}

.calendarHeader,
.listHeader {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
}

.iconButton {
  width: 38px;
  min-height: 38px;
  justify-content: center;
  padding: 0;
  font-size: 24px;
}

.weekdays,
.calendarGrid {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
}

.weekdays {
  color: var(--muted);
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  border-bottom: 1px solid var(--line);
}

.weekdays span {
  padding: 8px;
}

.calendarGrid {
  min-height: 610px;
}

.day {
  position: relative;
  min-height: 104px;
  border-right: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
  padding: 8px;
  background: #fff;
  overflow: hidden;
}

.day:nth-child(7n) {
  border-right: 0;
}

.day.muted {
  background: #f5f7f7;
  color: #8a9699;
}

.day.today {
  outline: 2px solid var(--blue);
  outline-offset: -2px;
}

.dayNumber {
  font-weight: 700;
  font-size: 13px;
}

.dots {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 8px;
}

.dot {
  display: block;
  width: 100%;
  border-radius: 5px;
  background: #eaf2fb;
  border-left: 4px solid var(--blue);
  color: var(--ink);
  padding: 4px 6px;
  font-size: 12px;
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dot.submitted {
  background: #edf8f2;
  border-left-color: var(--green);
  color: #315b45;
}

.dot.dueSoon {
  background: #fff4de;
  border-left-color: var(--amber);
}

.listPanel {
  padding: 16px;
  max-height: 760px;
  overflow: auto;
}

.listHeader label {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--muted);
  font-size: 14px;
}

.assignmentList {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.assignment {
  border: 1px solid var(--line);
  border-radius: 8px;
  padding: 12px;
  background: #fbfdfd;
}

.assignment.dueSoon {
  border-color: #e8c783;
  background: #fff9ed;
}

.assignment.submitted {
  background: #f1faf5;
}

.assignment h3 {
  margin: 0 0 8px;
  font-size: 16px;
  line-height: 1.25;
}

.meta {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 10px;
}

.pill {
  border-radius: 999px;
  background: #eef2f2;
  padding: 4px 8px;
  color: var(--muted);
  font-size: 12px;
  font-weight: 700;
}

.pill.done {
  color: #236645;
  background: #dff2e7;
}

.pill.soon {
  color: #7d4a0c;
  background: #fde9bc;
}

.assignment a {
  color: var(--blue);
  font-weight: 700;
  text-decoration: none;
}

.assignment a:hover {
  text-decoration: underline;
}

.empty {
  border: 1px dashed var(--line);
  border-radius: 8px;
  color: var(--muted);
  padding: 18px;
  text-align: center;
}

.loginBody {
  display: grid;
  place-items: center;
  padding: 24px;
}

.loginPanel {
  width: min(420px, 100%);
  border: 1px solid var(--line);
  border-radius: 8px;
  background: white;
  box-shadow: var(--shadow);
  padding: 26px;
}

.loginForm {
  display: grid;
  gap: 12px;
  margin-top: 22px;
}

.loginForm label {
  color: var(--muted);
  font-size: 13px;
  font-weight: 700;
}

.loginForm input {
  min-height: 44px;
  border: 1px solid var(--line);
  border-radius: 8px;
  padding: 0 12px;
}

.loginForm button {
  justify-content: center;
}

.loginError {
  margin: 0;
  border: 1px solid #e3aaaa;
  border-radius: 8px;
  background: #fff0f0;
  color: #842a2a;
  padding: 10px 12px;
}

@media (max-width: 960px) {
  .topbar,
  .workspace {
    grid-template-columns: 1fr;
  }

  .topbar {
    align-items: flex-start;
    flex-direction: column;
  }

  .actions {
    justify-content: flex-start;
  }

  .status {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .workspace {
    display: block;
  }

  .listPanel {
    margin-top: 16px;
    max-height: none;
  }
}

@media (max-width: 620px) {
  .status {
    grid-template-columns: 1fr;
  }

  .calendarPanel {
    padding: 10px;
  }

  .calendarGrid {
    min-height: 520px;
  }

  .day {
    min-height: 78px;
    padding: 5px;
  }

  .dot {
    width: 10px;
    height: 10px;
    padding: 0;
    border-radius: 50%;
    color: transparent;
    border: 0;
  }
}
