// server.js
// Each route here corresponds to one item in your C++ program's main menu.
// C++ menu option      -> HTTP route
// 1. Add Student        -> POST   /api/students
// 2. View Results        -> GET    /api/students
// 3. Search Student      -> GET    /api/students/:student_id
// 4. Calculate Result    -> (done automatically inside Add/Update)
// 5. Update Student      -> PUT    /api/students/:student_id
// 6. Delete Student      -> DELETE /api/students/:student_id
// 7. Exit                -> closing the browser tab / server process

const express = require('express');
const cors = require('cors');
const db = require('./database');
const calculateResult = require('./calculateResult');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('../frontend')); // serves the website files

// 1. ADD STUDENT
app.post('/api/students', (req, res) => {
  const { student_id, name, class: studentClass, subject1, subject2, subject3 } = req.body;

  if (!student_id || !name || subject1 == null || subject2 == null || subject3 == null) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const { total, average, percentage, grade } = calculateResult(subject1, subject2, subject3);

  const sql = `INSERT INTO students
    (student_id, name, class, subject1, subject2, subject3, total, average, percentage, grade)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  db.run(sql, [student_id, name, studentClass, subject1, subject2, subject3, total, average, percentage, grade],
    function (err) {
      if (err) {
        if (err.message.includes('UNIQUE')) {
          return res.status(409).json({ error: 'Student ID already exists' });
        }
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ id: this.lastID, total, average, percentage, grade });
    });
});

// 2. VIEW ALL RESULTS
app.get('/api/students', (req, res) => {
  db.all('SELECT * FROM students', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// 3. SEARCH STUDENT (by student_id)
app.get('/api/students/:student_id', (req, res) => {
  db.get('SELECT * FROM students WHERE student_id = ?', [req.params.student_id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Student not found' });
    res.json(row);
  });
});

// 5. UPDATE STUDENT
app.put('/api/students/:student_id', (req, res) => {
  const { name, class: studentClass, subject1, subject2, subject3 } = req.body;
  const { total, average, percentage, grade } = calculateResult(subject1, subject2, subject3);

  const sql = `UPDATE students SET
    name = ?, class = ?, subject1 = ?, subject2 = ?, subject3 = ?,
    total = ?, average = ?, percentage = ?, grade = ?
    WHERE student_id = ?`;

  db.run(sql, [name, studentClass, subject1, subject2, subject3, total, average, percentage, grade, req.params.student_id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0) return res.status(404).json({ error: 'Student not found' });
      res.json({ total, average, percentage, grade });
    });
});

// 6. DELETE STUDENT
app.delete('/api/students/:student_id', (req, res) => {
  db.run('DELETE FROM students WHERE student_id = ?', [req.params.student_id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Student not found' });
    res.json({ message: 'Deleted successfully' });
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
