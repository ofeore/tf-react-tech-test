// src/App.tsx
// This is your starting point. Build out the UI here.
// You're welcome to split this into multiple components if you'd like!

import { useState, useEffect } from "react";
import { Task, Priority } from "./types";
import { getTasks, createTask, updateTask, deleteTask } from "./api";
import TaskList from "./TaskList";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addTaskError, setAddTaskError] = useState<string | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState<Priority | "">("");
  const [priorityFilter, setPriorityFilter] = useState<Priority | "">("");

  // Fetch tasks on mount
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const allTasks = await getTasks();
        const filteredTasks = await getTasks(priorityFilter);

        setTasks(filteredTasks.filter((task) => !task.completed));
        setCompletedTasks(allTasks.filter((task) => task.completed));
      } catch {
        setError("Failed to load tasks");
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, [priorityFilter]);

  // TODO: Customise this — add priority, due dates, or anything else you like!

  const handleAddTask = async () => {
    function sanitiseInput(taskTitle: string) {
      const lower = taskTitle.toLowerCase().trim();

      if (!lower) {
        return "";
      }

      return lower[0].toUpperCase() + lower.slice(1);
    }

    if (!newTaskTitle.trim()) {
      setAddTaskError("Please enter a task title.");
      return;
    }

    setAddTaskError(null);
    setError(null);

    const optimisticTask: Task = {
      id: `temp-${Date.now()}`,
      title: sanitiseInput(newTaskTitle),
      completed: false,
      createdAt: new Date().toISOString(),
      priority: newTaskPriority || undefined,
    };

    if (priorityFilter === "" || optimisticTask.priority === priorityFilter) {
      setTasks((prev) => [...prev, optimisticTask]);
    }

    setNewTaskTitle("");
    setNewTaskPriority("");

    try {
      const createdTask = await createTask({
        title: optimisticTask.title,
        completed: false,
        priority: optimisticTask.priority,
      });

      setTasks((prev) =>
        prev.map((task) =>
          task.id === optimisticTask.id ? createdTask : task,
        ),
      );
    } catch (err) {
      setTasks((prev) => prev.filter((task) => task.id !== optimisticTask.id));
      setError(err instanceof Error ? err.message : "Failed to create task");
    }
  };

  // TODO: Expand this if you add extra fields to update
  const handleToggleComplete = async (task: Task) => {
    try {
      setError(null);

      const updated = await updateTask(task.id, { completed: !task.completed });

      if (updated.completed) {
        setTasks((prev) => prev.filter((t) => t.id !== updated.id));
        setCompletedTasks((prev) => [...prev, updated]);
      } else {
        setCompletedTasks((prev) => prev.filter((t) => t.id !== updated.id));
        setTasks((prev) => [...prev, updated]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update task");
    }
  };

  // TODO: Add a confirmation step, or an undo feature if you like!
  const handleDeleteTask = async (id: string) => {
    setError(null);

    const taskToRestore: Task | undefined =
      tasks.find((task) => task.id === id) ??
      completedTasks.find((task) => task.id === id);

    setTasks((prev) => prev.filter((t) => t.id !== id));
    setCompletedTasks((prev) => prev.filter((t) => t.id !== id));

    if (taskToRestore) {
      try {
        await deleteTask(id);
      } catch (err) {
        if (!taskToRestore.completed) {
          setTasks((prev) => [...prev, taskToRestore]);
        } else {
          setCompletedTasks((prev) => [...prev, taskToRestore]);
        }

        setError(err instanceof Error ? err.message : "Failed to delete task");
      }
    }
  };

  if (loading) return <p>Loading tasks...</p>;

  return (
    <div className="task-manager-container">
      <h2>Task Manager</h2>
      {error && <p className="error-message">{error}</p>}

      {/* TODO: Improve this input — add priority, labels, due date, etc. */}
      <div className="task-input-bar">
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="Add a new task..."
        />

        <select
          value={newTaskPriority}
          onChange={(e) => setNewTaskPriority(e.target.value as Priority | "")}
        >
          <option value="">No priority</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <button className="add-task-button" onClick={handleAddTask}>
          Add
        </button>
        {addTaskError && <p className="error-message">{addTaskError}</p>}
      </div>

      <div style={{ marginBottom: 16 }}>
        <label htmlFor="priorityFilter" style={{ marginRight: 8 }}>
          Filter by priority:
        </label>
        <select
          id="priorityFilter"
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value as Priority | "")}
        >
          <option value="">All</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      {/* TODO: Style this list — make it your own! */}

      {tasks.length === 0 && completedTasks.length === 0 ? (
        <p>No tasks yet. Add one above!</p>
      ) : (
        <>
          <TaskList
            title="Active Tasks"
            tasks={tasks}
            showTaskCount
            emptyMessage={
              priorityFilter
                ? `No ${priorityFilter} priority active tasks.`
                : "You have no active tasks left."
            }
            onToggleComplete={handleToggleComplete}
            onDeleteTask={handleDeleteTask}
          />

          <TaskList
            title="Completed Tasks"
            tasks={completedTasks}
            isCompletedList
            onToggleComplete={handleToggleComplete}
            onDeleteTask={handleDeleteTask}
          />
        </>
      )}
    </div>
  );
}

export default App;
