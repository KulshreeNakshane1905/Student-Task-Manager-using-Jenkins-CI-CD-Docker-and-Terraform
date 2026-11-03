const express = require("express");
const fs = require("node:fs");
const path = require("node:path");
const { randomUUID } = require("node:crypto");

const app = express();
const PORT = Number(process.env.PORT || 3000);
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, "data");
const DATA_FILE = path.join(DATA_DIR, "tasks.json");

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

function ensureDataFile() {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, "[]", "utf8");
}
function readTasks() {
  ensureDataFile();
  try { return JSON.parse(fs.readFileSync(DATA_FILE, "utf8")); }
  catch { return []; }
}
function writeTasks(tasks) {
  ensureDataFile();
  fs.writeFileSync(DATA_FILE, JSON.stringify(tasks, null, 2), "utf8");
}

app.get("/health", (_req, res) => res.json({ status: "ok", application: "Student Task Manager" }));
app.get("/api/tasks", (_req, res) => res.json(readTasks()));

app.post("/api/tasks", (req, res) => {
  const title = typeof req.body.title === "string" ? req.body.title.trim() : "";
  const description = typeof req.body.description === "string" ? req.body.description.trim() : "";
  if (!title) return res.status(400).json({ error: "Task title is required." });
  const task = { id: randomUUID(), title, description, status: "Pending", createdAt: new Date().toISOString() };
  const tasks = readTasks();
  tasks.unshift(task);
  writeTasks(tasks);
  return res.status(201).json(task);
});

app.patch("/api/tasks/:id", (req, res) => {
  const allowed = ["Pending", "In Progress", "Completed"];
  const tasks = readTasks();
  const task = tasks.find(item => item.id === req.params.id);
  if (!task) return res.status(404).json({ error: "Task not found." });
  if (!allowed.includes(req.body.status)) return res.status(400).json({ error: "Invalid task status." });
  task.status = req.body.status;
  writeTasks(tasks);
  return res.json(task);
});

app.delete("/api/tasks/:id", (req, res) => {
  const tasks = readTasks();
  const remaining = tasks.filter(item => item.id !== req.params.id);
  if (remaining.length === tasks.length) return res.status(404).json({ error: "Task not found." });
  writeTasks(remaining);
  return res.status(204).end();
});

if (require.main === module) {
  app.listen(PORT, "0.0.0.0", () => console.log(`Student Task Manager listening on port ${PORT}`));
}
module.exports = app;
