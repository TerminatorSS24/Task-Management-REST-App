import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import "./db.js";
import taskRoutes from "./routes/taskRoutes.js";
import dotenv from "dotenv";


dotenv.config();
const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use("/api/tasks", taskRoutes);

app.get("/", (req, res) => {
  res.send("Task Management API with WebSocket running");
});

io.on("connection", (socket) => {
  console.log("🔌 Client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
  });
});

const PORT = 4000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
