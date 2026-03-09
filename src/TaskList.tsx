import type { TaskListProps } from "./types";

export default function TaskList({
  title,
  tasks,
  isCompletedList = false,
  emptyMessage,
  showTaskCount,
  onToggleComplete,
  onDeleteTask,
}: TaskListProps) {
  if (tasks.length === 0) {
    return emptyMessage ? <p>{emptyMessage}</p> : null;
  }

  return (
    <>
      <div className="active-tasks">
        <h2>{title}</h2>
        {showTaskCount && <p className="active-tasks-number">{tasks.length}</p>}
      </div>

      <ul style={{ listStyle: "none", padding: 0 }}>
        {tasks.map((task) => (
          <li key={task.id} className="list-item">
            {isCompletedList ? (
              <img
                src="../assets/tick-circle.svg"
                style={{ maxWidth: 25, maxHeight: 25 }}
              />
            ) : (
              <>
                {task.priority === "low" && (
                  <img
                    src="../assets/low-priority.svg"
                    style={{ maxWidth: 25, maxHeight: 25 }}
                  />
                )}
                {task.priority === "medium" && (
                  <img
                    src="../assets/medium-priority.svg"
                    style={{ maxWidth: 25, maxHeight: 25 }}
                  />
                )}
                {task.priority === "high" && (
                  <img
                    src="../assets/high-priority.svg"
                    style={{ maxWidth: 25, maxHeight: 25 }}
                  />
                )}
              </>
            )}

            <span
              style={
                isCompletedList
                  ? {
                      textDecoration: "line-through",
                      color: "#666",
                      flex: 1,
                    }
                  : { flex: 1 }
              }
            >
              {task.title}
            </span>

            <button onClick={() => onToggleComplete(task)}>
              {isCompletedList ? "Undo" : "Complete"}
            </button>

            <button onClick={() => onDeleteTask(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </>
  );
}
