const express = require("express");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

let students = [];
let nextId = 1;

// READ
app.get("/api/students", (req, res) => res.json(students));

// CREATE
app.post("/api/students", (req, res) => {
  const { studentId, name, email, department } = req.body || {};
  if (!studentId || !name || !email || !department)
    return res.status(400).json({ error: "All fields are required." });
  const student = { id: String(nextId++), studentId, name, email, department };
  students.push(student);
  res.status(201).json(student);
});

// UPDATE
app.put("/api/students/:id", (req, res) => {
  const index = students.findIndex(s => s.id === req.params.id);
  if (index < 0) return res.status(404).json({ error: "Student not found." });
  const { studentId, name, email, department } = req.body || {};
  if (!studentId || !name || !email || !department)
    return res.status(400).json({ error: "All fields are required." });
  students[index] = { id: req.params.id, studentId, name, email, department };
  res.json(students[index]);
});

// DELETE
app.delete("/api/students/:id", (req, res) => {
  const index = students.findIndex(s => s.id === req.params.id);
  if (index < 0) return res.status(404).json({ error: "Student not found." });
  res.json({ message: "Deleted", student: students.splice(index, 1)[0] });
});

app.listen(PORT, () => console.log(`App running at http://localhost:${PORT} (in-memory data)`));
