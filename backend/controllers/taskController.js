import { TaskModel } from "../models/taskModel.js";

export const TaskController = {
  async create(req, res) {
    try {
      const { title, description } = req.body;

      if (!title) {
        return res.status(400).json({ error: "Title is required" });
      }

      const task = await TaskModel.createTask(title, description);

      req.io.emit("task_created", task);

      res.status(201).json(task);
    } catch (err) {
      res.status(500).json({ error: "Failed to create task" });
    }
  },

  async getAll(req, res) {
    try {
      const { status } = req.query;
      const tasks = await TaskModel.getAllTasks(status);
      res.status(200).json(tasks);
    } catch {
      res.status(500).json({ error: "Failed to fetch tasks" });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!["pending", "in-progress", "completed"].includes(status)) {
        return res.status(400).json({ error: "Invalid status" });
      }

      const updatedTask = await TaskModel.updateStatus(id, status);

      req.io.emit("task_updated", updatedTask);

      res.status(200).json(updatedTask);
    } catch {
      res.status(500).json({ error: "Failed to update task" });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;
      await TaskModel.deleteTask(id);

      req.io.emit("task_deleted", { id });

      res.status(204).send();
    } catch {
      res.status(500).json({ error: "Failed to delete task" });
    }
  }
};
