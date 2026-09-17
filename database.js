// database.js
// Uses better-sqlite3 for a database file on disk. Schema now stores 5
// subjects instead of 3.

const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'results.db');
const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    class TEXT,
    subject1 INTEGER NOT NULL,
    subject2 INTEGER NOT NULL,
    subject3 INTEGER NOT NULL,
    subject4 INTEGER NOT NULL,
    subject5 INTEGER NOT NULL,
    total INTEGER,
    average REAL,
    percentage REAL,
    grade TEXT
  )
`);

module.exports = db;
