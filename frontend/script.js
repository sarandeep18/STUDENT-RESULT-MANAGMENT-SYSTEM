// script.js
// Every function here corresponds to one C++ menu option, but instead of
// scanf/cout it uses fetch() to talk to the Express server over HTTP.

const API = '/api/students';

const form = document.getElementById('studentForm');
const resultsBody = document.getElementById('resultsBody');
const formMessage = document.getElementById('formMessage');
const formTitle = document.getElementById('formTitle');
const submitBtn = document.getElementById('submitBtn');
const cancelEditBtn = document.getElementById('cancelEditBtn');

let editingId = null; // if set, the form is in "update" mode instead of "add"

// ---------- VIEW ALL (menu option 2) ----------
async function loadStudents() {
  const res = await fetch(API);
  const students = await res.json();
  renderTable(students);
}

function renderTable(students) {
  resultsBody.innerHTML = '';
  students.forEach(s => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${s.student_id}</td>
      <td>${s.name}</td>
      <td>${s.class ?? ''}</td>
      <td>${s.subject1}</td>
      <td>${s.subject2}</td>
      <td>${s.subject3}</td>
      <td>${s.subject4}</td>
      <td>${s.subject5}</td>
      <td>${s.total}</td>
      <td>${s.average.toFixed(2)}</td>
      <td>${s.percentage.toFixed(2)}</td>
      <td>${s.grade}</td>
      <td>
        <button onclick="editStudent('${s.student_id}')">Edit</button>
        <button onclick="deleteStudent('${s.student_id}')">Delete</button>
      </td>
    `;
    resultsBody.appendChild(row);
  });
}

// ---------- ADD (menu option 1) / UPDATE (menu option 5) ----------
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  formMessage.textContent = '';

  const payload = {
    student_id: document.getElementById('student_id').value.trim(),
    name: document.getElementById('name').value.trim(),
    class: document.getElementById('class').value.trim(),
    subject1: Number(document.getElementById('subject1').value),
    subject2: Number(document.getElementById('subject2').value),
    subject3: Number(document.getElementById('subject3').value),
    subject4: Number(document.getElementById('subject4').value),
    subject5: Number(document.getElementById('subject5').value),
  };

  try {
    let res;
    if (editingId) {
      res = await fetch(`${API}/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } else {
      res = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    }

    const data = await res.json();
    if (!res.ok) {
      formMessage.textContent = data.error || 'Something went wrong';
      return;
    }

    resetForm();
    loadStudents();
  } catch (err) {
    formMessage.textContent = 'Could not reach the server. Is it running?';
  }
});

function resetForm() {
  form.reset();
  editingId = null;
  formTitle.textContent = 'Add Student';
  submitBtn.textContent = 'Add Student';
  cancelEditBtn.style.display = 'none';
  document.getElementById('student_id').disabled = false;
}

cancelEditBtn.addEventListener('click', resetForm);

// ---------- EDIT (loads a student into the form, menu option 5) ----------
async function editStudent(student_id) {
  const res = await fetch(`${API}/${student_id}`);
  const s = await res.json();
  if (!res.ok) return;

  document.getElementById('student_id').value = s.student_id;
  document.getElementById('name').value = s.name;
  document.getElementById('class').value = s.class ?? '';
  document.getElementById('subject1').value = s.subject1;
  document.getElementById('subject2').value = s.subject2;
  document.getElementById('subject3').value = s.subject3;
  document.getElementById('subject4').value = s.subject4;
  document.getElementById('subject5').value = s.subject5;
  document.getElementById('student_id').disabled = true; // ID shouldn't change

  editingId = student_id;
  formTitle.textContent = 'Update Student';
  submitBtn.textContent = 'Update Student';
  cancelEditBtn.style.display = 'inline-block';
}

// ---------- DELETE (menu option 6) ----------
async function deleteStudent(student_id) {
  if (!confirm(`Delete student ${student_id}?`)) return;
  await fetch(`${API}/${student_id}`, { method: 'DELETE' });
  loadStudents();
}

// ---------- SEARCH (menu option 3) ----------
document.getElementById('searchBtn').addEventListener('click', async () => {
  const id = document.getElementById('searchId').value.trim();
  if (!id) return;
  const res = await fetch(`${API}/${id}`);
  if (!res.ok) {
    resultsBody.innerHTML = '<tr><td colspan="13">No student found</td></tr>';
    return;
  }
  const s = await res.json();
  renderTable([s]);
});

document.getElementById('clearSearchBtn').addEventListener('click', () => {
  document.getElementById('searchId').value = '';
  loadStudents();
});

// initial load
loadStudents();
