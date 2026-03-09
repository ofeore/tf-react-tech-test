// server/index.ts
// This Express server is fully wired up and working.
// The four core routes are implemented — run it and the frontend will connect straight away.
//
// TODO: This is where you can get creative!
//   - Add a priority field to tasks (low / medium / high)
//   - Add filtering: GET /api/tasks?priority=high or ?completed=true
//   - Add input validation and better error messages
//   - Anything else you think would make this better!

import express, { Request, Response } from "express";

import cors from "cors";
import { v4 as uuidv4 } from "uuid";

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// ─── Types ────────────────────────────────────────────────────────────────────

type Priority = "low" | "medium" | "high";

interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
  priority?: Priority;
}

const validPriorities: Priority[] = ["low", "medium", "high"];

// ─── In-memory store ──────────────────────────────────────────────────────────

let tasks: Task[] = [];

// ─── Routes ───────────────────────────────────────────────────────────────────

// GET /api/tasks — return all tasks
app.get("/api/tasks", (req: Request, res: Response) => {
  const { priority } = req.query;
  let tasksCopy = [...tasks];

  if (priority !== undefined) {
    if (
      typeof priority !== "string" ||
      !validPriorities.includes(priority as Priority)
    ) {
      res.status(400).json({
        error: "Priority must be one of: low, medium, high",
      });
      return;
    }

    tasksCopy = tasksCopy.filter((task) => task.priority === priority);
  }
  res.json(tasksCopy);
});

// POST /api/tasks — create a new task
app.post("/api/tasks", (req: Request, res: Response) => {
  const { title, priority } = req.body as {
    title?: string;
    priority?: Priority;
  };

  if (priority !== undefined && !validPriorities.includes(priority)) {
    res.status(400).json({
      error: "Priority must be one of: low, medium, high",
    });
    return;
  }

  if (typeof title !== "string") {
    res.status(400).json({ error: "Title is required" });
    return;
  }

  const trimmedTitle = title.trim();

  if (trimmedTitle.length === 0) {
    res.status(400).json({ error: "Title cannot be empty" });
    return;
  }

  if (trimmedTitle.length > 100) {
    res.status(400).json({ error: "Title must be 100 characters or fewer" });
    return;
  }

  const newTask: Task = {
    id: uuidv4(),
    title: trimmedTitle,
    completed: false,
    createdAt: new Date().toISOString(),
    priority: priority,
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
});

// PATCH /api/tasks/:id — update a task
app.patch("/api/tasks/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const index = tasks.findIndex((t) => t.id === id);

  if (index === -1) {
    res.status(404).json({ error: `Task with id "${id}" not found` });
    return;
  }

  const updates = req.body as Partial<Omit<Task, "id" | "createdAt">>;

  if (updates.title !== undefined) {
    if (typeof updates.title !== "string") {
      res.status(400).json({ error: "Title must be a string" });
      return;
    }

    const trimmedTitle = updates.title.trim();

    if (trimmedTitle.length === 0) {
      res.status(400).json({ error: "Title cannot be empty" });
      return;
    }

    if (trimmedTitle.length > 100) {
      res.status(400).json({ error: "Title must be 100 characters or fewer" });
      return;
    }

    updates.title = trimmedTitle;
  }

  if (updates.priority !== undefined) {
    if (!validPriorities.includes(updates.priority)) {
      res.status(400).json({
        error: "Priority must be one of: low, medium, high",
      });
      return;
    }
  }

  if (
    updates.completed !== undefined &&
    typeof updates.completed !== "boolean"
  ) {
    res.status(400).json({ error: "Completed must be a boolean" });
    return;
  }

  tasks[index] = { ...tasks[index], ...updates };
  res.json(tasks[index]);
});

// DELETE /api/tasks/:id — delete a task
app.delete("/api/tasks/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const index = tasks.findIndex((t) => t.id === id);

  if (index === -1) {
    res.status(404).json({ error: `Task with id "${id}" not found` });
    return;
  }

  tasks = tasks.filter((t) => t.id !== id);
  res.status(204).send();
});

// ─── Start ────────────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
