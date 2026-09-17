// database.js
// Sets up the SQLite database file and creates the students table if it
// doesn't exist yet. This replaces the file-handling (fstream) logic from
// the C++ version — SQLite is just a self-contained database file on disk.

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'results.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS students (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      class TEXT,
      subject1 INTEGER NOT NULL,
      subject2 INTEGER NOT NULL,
      subject3 INTEGER NOT NULL,
      total INTEGER,
      average REAL,
      percentage REAL,
      grade TEXT
    )
  `);
});

module.exports = db;
