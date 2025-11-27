import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';

let db: Database;

export async function initDB() {
    db = await open({
        filename: './database.sqlite',
        driver: sqlite3.Database
    });

    await db.exec(`
    CREATE TABLE IF NOT EXISTS email_config (
      key TEXT PRIMARY KEY,
      value TEXT
    );

    CREATE TABLE IF NOT EXISTS logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT,
      name TEXT,
      sent_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

    // Seed default config if not exists
    const subject = await db.get('SELECT value FROM email_config WHERE key = ?', 'subject');
    if (!subject) {
        await db.run('INSERT INTO email_config (key, value) VALUES (?, ?)', 'subject', 'Your Certificate is Here!');
    }

    const body = await db.get('SELECT value FROM email_config WHERE key = ?', 'body');
    if (!body) {
        await db.run('INSERT INTO email_config (key, value) VALUES (?, ?)', 'body', 'Dear {name},\n\nPlease find your certificate attached.\n\nBest regards,\nAdmin');
    }

    console.log('Database initialized');
}

export function getDB() {
    if (!db) {
        throw new Error('Database not initialized');
    }
    return db;
}
