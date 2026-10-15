require("dotenv").config();
const express = require("express");
const path = require("path");
const { MongoClient, ObjectId } = require("mongodb");
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/student_lab";
const dbName = process.env.MONGODB_DATABASE || "student_lab";
let students;
const valid = b => b && b.studentId && b.name && b.email && b.department;

app.get("/api/students", async (req, res) => {
  try {
    const rows = await students.find({}).sort({_id:-1}).toArray();
    res.json(rows.map(s => ({ id: String(s._id), studentId:s.studentId, name:s.name, email:s.email, department:s.department })));
  } catch { res.status(500).json({error:"Could not read students."}); }
});
app.post("/api/students", async (req, res) => {
  if (!valid(req.body)) return res.status(400).json({error:"All fields are required."});
  try {
    const doc = Object.fromEntries(["studentId","name","email","department"].map(k => [k, String(req.body[k]).trim()]));
    const r = await students.insertOne(doc);
    res.status(201).json({id:String(r.insertedId), ...doc});
  } catch { res.status(500).json({error:"Could not insert student."}); }
});
app.put("/api/students/:id", async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) return res.status(400).json({error:"Invalid student ID."});
  if (!valid(req.body)) return res.status(400).json({error:"All fields are required."});
  try {
    const doc = Object.fromEntries(["studentId","name","email","department"].map(k => [k, req.body[k]]));
    const r = await students.updateOne({_id:new ObjectId(req.params.id)}, {$set:doc});
    if (!r.matchedCount) return res.status(404).json({error:"Student not found."});
    res.json({id:req.params.id, ...doc});
  } catch { res.status(500).json({error:"Could not update student."}); }
});
app.delete("/api/students/:id", async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) return res.status(400).json({error:"Invalid student ID."});
  try {
    const r = await students.deleteOne({_id:new ObjectId(req.params.id)});
    if (!r.deletedCount) return res.status(404).json({error:"Student not found."});
    res.json({message:"Student deleted."});
  } catch { res.status(500).json({error:"Could not delete student."}); }
});
async function start() {
  const client = new MongoClient(uri);
  await client.connect();
  students = client.db(dbName).collection("students");
  app.listen(PORT, () => console.log(`MongoDB app at http://localhost:${PORT}`));
}
start().catch(e => { console.error("MongoDB connection failed:", e.message); process.exit(1); });
