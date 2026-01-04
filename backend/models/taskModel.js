import { pool } from "../db.js";

export const TaskModel = {
  async createTask(title, description) {
    const result = await pool.query(
      `INSERT INTO tasks (title, description)
       VALUES ($1, $2)
       RETURNING *`,
      [title, description]
    );
    return result.rows[0];
  },

  async getAllTasks(status) {
    if (status) {
      const result = await pool.query(
        `SELECT * FROM tasks WHERE status = $1 ORDER BY createdat DESC`,
        [status]
      );
      return result.rows;
    }

    const result = await pool.query(
      `SELECT * FROM tasks ORDER BY createdat DESC`
    );
    return result.rows;
  },

  async updateStatus(id, status) {
    const result = await pool.query(
      `UPDATE tasks
       SET status = $1, updatedat = NOW()
       WHERE id = $2
       RETURNING *`,
      [status, id]
    );
    return result.rows[0];
  },

  async deleteTask(id) {
    await pool.query(`DELETE FROM tasks WHERE id = $1`, [id]);
  }
};
