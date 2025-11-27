import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';

let db: Database | null = null;
let initPromise: Promise<void> | null = null;

export async function initDB() {
  if (db) return; // Already initialized

  if (initPromise) {
    // Initialization in progress, wait for it

      CREATE TABLE IF NOT EXISTS logs(
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
      await db.run('INSERT INTO email_config (key, value) VALUES (?, ?)', 'body', 'Dear {name},\\n\\nPlease find your certificate attached.\\n\\nBest regards,\\nAdmin');
    }

    console.log('Database initialized');
  })();

  await initPromise;
}

export async function getDB() {
  if (!db) {
    // Lazy initialization - initialize on first use
    await initDB();
  }
  if (!db) {
    throw new Error('Database not initialized');
  }
  return db;
}
