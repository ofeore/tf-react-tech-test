# 🧪 JavaScript Developer Technical Test

**Estimated Time:** ~2 hours  
**Stack:** React · TypeScript · Node.js · Express.js  
**Node Version:** 22.22.0 (see `.nvmrc`)

---

## 👋 Welcome

This test is designed to give you a chance to show us how you think and build. There are no trick questions — we're genuinely interested in how you approach problems, how you structure your code, and how you handle the unexpected. Feel free to be creative!

---

## 📋 What You'll Be Building

A simple **Task Manager App** — a full-stack mini application with a React/TypeScript frontend and a Node.js/Express backend.

Don't worry about making it look beautiful (though that's a bonus!) — we care more about how your code works and how you've structured it.

---

## 🗂 Project Structure

```
tf-react-tech-test/
├── src/
│   ├── App.tsx              ← Main React component — start here for the frontend
│   ├── types.ts             ← Shared TypeScript types — extend these as needed
│   ├── api.ts               ← API helper functions — already wired up
│   └── main.tsx             ← React entry point (no changes needed)
├── server/
│   └── index.ts             ← Express server — start here for the backend
├── public/
│   └── index.html
├── tsconfig.app.json        ← TypeScript config for the frontend
├── tsconfig.server.json     ← TypeScript config for the backend
├── package.json
├── .nvmrc                   ← Node version (22.22.0)
└── README.md
```

---

## ✅ Tasks

The app is **fully working** out of the box — once you run `npm start` you'll see a basic task manager in your browser connected to a live Express backend. Your job is to extend it.

### Part 1 — Backend (Express + Node.js) ~45 mins

Open `server/index.ts`. The four core routes are already implemented. Now make them better:

- Add a `priority` field (`low` / `medium` / `high`) to tasks
- Add a query param to filter tasks: `GET /api/tasks?priority=high` or `?completed=true`
- Improve validation — what should happen if someone sends an empty title?
- Add any other fields or endpoints you think would be useful

> 💡 **Tip:** The `Task` interface and in-memory store are defined at the top of the file — extend them from there.

---

### Part 2 — Frontend (React + TypeScript) ~45 mins

Open `src/App.tsx`. The basic UI renders tasks and connects to the API. Make it genuinely useful:

- Show task priority visually (colour, badge, icon — your choice)
- Add a priority selector when creating a task
- Add filtering or sorting (e.g. show only completed, sort by priority)
- Improve the styling — make it look like something you'd actually want to use

**Requirements:**
- Use TypeScript properly — no `any` types please!
- Keep using the types in `src/types.ts` — extend them if needed
- Keep API calls going through `src/api.ts`

> 💡 **Tip:** Feel free to create new component files under `src/` — you're not limited to `App.tsx`.

---

### Part 3 — Your Call (~30 mins)

Pick **one** of the following, or come up with your own idea:

- **Optimistic UI updates** — update the UI before the server responds, roll back on error
- **Persistence** — save tasks to `localStorage` so they survive a page refresh
- **Filtering UI** — a proper filter bar (All / Active / Completed / by Priority)
- **Something else entirely** — surprise us! Just tell us what and why in your `NOTES.md`

---

## 🚀 Getting Started

```bash
# 1. Switch to the correct Node version (requires nvm)
nvm install   # installs 22.22.0 from .nvmrc
nvm use       # switches to 22.22.0

# 2. Install dependencies
npm install

# 3. Run both frontend and backend together
npm start
```

This will start:
- **Frontend** (React + Vite) at `http://localhost:5173`
- **Backend** (Express) at `http://localhost:3001`

Or run them separately in two terminals:

```bash
# Terminal 1 — backend
npm run server

# Terminal 2 — frontend
npm run dev
```

> ⚠️ **Node version:** This project requires **Node 22.22.0**. The `.nvmrc` file handles this automatically if you use [nvm](https://github.com/nvm-sh/nvm). If you use a different version manager (volta, asdf, fnm), a `.node-version` file is also included.

---

## 📝 Please Create a NOTES.md File

When you're done, add a `NOTES.md` to the root with a few sentences covering:

1. What you built and any decisions you made
2. What you'd improve with more time
3. Anything you found tricky or interesting

This helps us understand your thinking — it's just as important as the code!

---

## 📦 Submitting

Push your completed code to a **public GitHub repository** and send us the link.

Good luck — we're rooting for you! 🎉
# tf-react-tech-test
