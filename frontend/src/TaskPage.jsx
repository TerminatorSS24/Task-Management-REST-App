import { useEffect, useState } from "react";
import { api } from "./api";
import { socket } from "./socket";
import "./styles.css";

export default function TaskPage() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const [deletingId, setDeletingId] = useState(null);
  const [undoTask, setUndoTask] = useState(null);
  const [showSnackbar, setShowSnackbar] = useState(false);

  const loadTasks = async () => {
    const res = await api.get("/tasks");
    setTasks(res.data);
  };

  const addTask = async () => {
    if (!title.trim()) return;

    await api.post("/tasks", { title, description });
    setTitle("");
    setDescription("");
  };

  const updateStatus = async (id, status) => {
    await api.patch(`/tasks/${id}`, { status });
  };

  const startEdit = (task) => {
    setEditingId(task.id);
    setEditTitle(task.title);
    setEditDescription(task.description || "");
  };

  const saveEdit = async (id) => {
    await api.patch(`/tasks/${id}`, {
      title: editTitle,
      description: editDescription,
    });
    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const deleteTask = async (task) => {
    setDeletingId(task.id);
    setUndoTask(task);

    setTimeout(async () => {
      await api.delete(`/tasks/${task.id}`);
      setDeletingId(null);
      setShowSnackbar(true);

      setTimeout(() => {
        setShowSnackbar(false);
        setUndoTask(null);
      }, 4000);
    }, 250);
  };

  const undoDelete = async () => {
    if (!undoTask) return;
    await api.post("/tasks", {
      title: undoTask.title,
      description: undoTask.description,
    });
    setShowSnackbar(false);
    setUndoTask(null);
  };

  useEffect(() => {
    loadTasks();

    socket.on("task_created", (task) =>
      setTasks((prev) => [task, ...prev])
    );

    socket.on("task_updated", (updated) =>
      setTasks((prev) =>
        prev.map((t) => (t.id === updated.id ? updated : t))
      )
    );

    socket.on("task_deleted", ({ id }) =>
      setTasks((prev) => prev.filter((t) => t.id !== Number(id)))
    );

    return () => {
      socket.off("task_created");
      socket.off("task_updated");
      socket.off("task_deleted");
    };
  }, []);

  return (
    <div className="app-container">
      <h1>📝 Task Manager (Real-Time)</h1>

      {/* Add task */}
      <div className="task-input">
        <input
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Task description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button onClick={addTask}>Add Task</button>
      </div>

      {/* Task list */}
      <ul className="task-list">
        {tasks.map((task) => (
          <li
            key={task.id}
            className={`task-item ${
              deletingId === task.id ? "deleting" : ""
            }`}
          >
            {editingId === task.id ? (
              <div className="task-content">
                <input
                  className="edit-input"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                />
                <textarea
                  className="edit-textarea"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                />

                <div className="edit-actions">
                  <button onClick={() => saveEdit(task.id)}>Save</button>
                  <button className="cancel" onClick={cancelEdit}>
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="task-content">
                  <div className="task-header">
                    <span className="task-title">{task.title}</span>
                    <span className={`status-badge ${task.status}`}>
                      {task.status}
                    </span>
                  </div>

                  {task.description && (
                    <p className="task-description">
                      {task.description}
                    </p>
                  )}
                </div>

                <div className="task-actions">
                  <select
                    value={task.status}
                    onChange={(e) =>
                      updateStatus(task.id, e.target.value)
                    }
                  >
                    <option value="pending">pending</option>
                    <option value="in-progress">in-progress</option>
                    <option value="completed">completed</option>
                  </select>

                  <button
                    className="edit-btn"
                    onClick={() => startEdit(task)}
                  >
                    ✏️
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => deleteTask(task)}
                  >
                    ✕
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>

      {/* Snackbar */}
      {showSnackbar && (
        <div className="snackbar">
          Task deleted
          <button onClick={undoDelete}>UNDO</button>
        </div>
      )}
    </div>
  );
}
