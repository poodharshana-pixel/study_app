require("dotenv").config();
const express = require("express");
const path = require("path");
const mysql = require("mysql2/promise");
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || "127.0.0.1",
  port: Number(process.env.MYSQL_PORT || 3306),
  user: process.env.MYSQL_USER || "root",
  password: process.env.MYSQL_PASSWORD || "",
  database: process.env.MYSQL_DATABASE || "student_lab",
  waitForConnections: true, connectionLimit: 10
});
app.get("/api/mysql/students", async (req,res) => {
  try { const [rows] = await pool.query("SELECT id, student_id AS studentId, name, email, department FROM students ORDER BY id DESC"); res.json(rows); }
  catch { res.status(500).json({error:"Could not read students; check database/table."}); }
});
app.post("/api/mysql/students", async (req,res) => {
  const {studentId,name,email,department} = req.body || {};
  if (!studentId || !name || !email || !department) return res.status(400).json({error:"All fields are required."});
  try {
    const [r] = await pool.execute("INSERT INTO students (student_id,name,email,department) VALUES (?,?,?,?)",[studentId,name,email,department]);
    res.status(201).json({id:r.insertId,studentId,name,email,department});
  } catch { res.status(500).json({error:"Insert failed; check database/table."}); }
});
app.put("/api/mysql/students/:id", async (req,res) => {
  const {studentId,name,email,department} = req.body || {};
  if (!studentId || !name || !email || !department) return res.status(400).json({error:"All fields are required."});
  try {
    const [r] = await pool.execute("UPDATE students SET student_id=?,name=?,email=?,department=? WHERE id=?",[studentId,name,email,department,req.params.id]);
    if (!r.affectedRows) return res.status(404).json({error:"Student not found."});
    res.json({id:Number(req.params.id),studentId,name,email,department});
  } catch { res.status(500).json({error:"Update failed."}); }
});
app.delete("/api/mysql/students/:id", async (req,res) => {
  try {
    const [r] = await pool.execute("DELETE FROM students WHERE id=?",[req.params.id]);
    if (!r.affectedRows) return res.status(404).json({error:"Student not found."});
    res.json({message:"Deleted"});
  } catch { res.status(500).json({error:"Delete failed."}); }
});
app.listen(PORT, () => console.log(`MySQL app at http://localhost:${PORT}`));
