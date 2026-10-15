const form = document.getElementById("studentForm");
const list = document.getElementById("studentList");
const message = document.getElementById("message");
let students = [];
let editingId = null;

async function loadStudents() {
  try {
    const response = await fetch("/api/students");
    students = await response.json();
    renderStudents();
  } catch {
    message.textContent = "Could not connect. Start the server using npm start.";
  }
}
form.addEventListener("submit", async event => {
  event.preventDefault();
  const student = {
    studentId: document.getElementById("studentId").value.trim(),
    name: document.getElementById("name").value.trim(),
    email: document.getElementById("email").value.trim(),
    department: document.getElementById("department").value
  };
  if (!student.studentId || !student.name || !student.email || !student.department) {
    message.textContent = "Please fill every field."; return;
  }
  try {
    const response = await fetch(editingId ? `/api/students/${encodeURIComponent(editingId)}` : "/api/students", {
      method: editingId ? "PUT" : "POST",
      headers: {"Content-Type":"application/json"}, body: JSON.stringify(student)
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Request failed.");
    message.textContent = editingId ? "Student updated." : "Student registered.";
    editingId = null; form.reset(); await loadStudents();
  } catch (e) { message.textContent = e.message || "Could not save."; }
});
function renderStudents() {
  list.replaceChildren();
  for (const s of students) {
    const row = document.createElement("tr");
    [s.studentId,s.name,s.email,s.department].forEach(value => {
      const td = document.createElement("td"); td.textContent = value ?? ""; row.appendChild(td);
    });
    const actions = document.createElement("td");
    const edit = document.createElement("button"); edit.type = "button"; edit.textContent = "Edit";
    edit.addEventListener("click", () => {
      editingId = s.id;
      document.getElementById("studentId").value = s.studentId;
      document.getElementById("name").value = s.name;
      document.getElementById("email").value = s.email;
      document.getElementById("department").value = s.department;
      message.textContent = "Edit fields, then click Register / Update.";
    });
    const del = document.createElement("button"); del.type = "button"; del.className = "danger"; del.textContent = "Delete";
    del.addEventListener("click", async () => {
      if (!confirm("Delete this student?")) return;
      try {
        const r = await fetch(`/api/students/${encodeURIComponent(s.id)}`, {method:"DELETE"});
        const data = await r.json(); if (!r.ok) throw new Error(data.error || "Delete failed");
        message.textContent = "Student deleted."; await loadStudents();
      } catch (e) { message.textContent = e.message; }
    });
    actions.append(edit,del); row.appendChild(actions); list.appendChild(row);
  }
}
form.addEventListener("reset", () => { editingId = null; message.textContent = ""; });
loadStudents();
