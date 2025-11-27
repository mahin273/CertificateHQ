import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';

let db: Database | null = null;
let initPromise: Promise<void> | null = null;

export async function initDB() {
  if (db) return; // Already initialized

  if (initPromise) {
    // Initialization in progress, wait for it
    await initPromise;
    return;
  }

  initPromise = (async () => {
    db = await open({
      filename: '/tmp/database.sqlite',
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

      CREATE TABLE IF NOT EXISTS certificate_config (
        key TEXT PRIMARY KEY,
        value TEXT
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

    // Seed default certificate config
    const certConfig = await db.get('SELECT value FROM certificate_config WHERE key = ?', 'style');
    if (!certConfig) {
      const defaultStyle = JSON.stringify({
        backgroundColor: '#f5f5f5',
        borderColor: '#2c3e50',
        innerBorderColor: '#3498db',
        titleText: 'CERTIFICATE OF COMPLETION',
        titleFontSize: 48,
        titleColor: '#2c3e50',
        subtitleText: 'This certificate is proudly presented to',
        subtitleFontSize: 24,
        subtitleColor: '#7f8c8d',
        nameFontSize: 56,
        nameColor: '#e74c3c',
        footerText: 'For successfully completing the course',
        footerFontSize: 20,
        footerColor: '#2c3e50'
      });
      await db.run('INSERT INTO certificate_config (key, value) VALUES (?, ?)', 'style', defaultStyle);
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
