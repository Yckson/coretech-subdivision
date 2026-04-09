import { getDatabase } from '@/lib/db';
import Database from 'better-sqlite3';
import crypto from 'crypto';

export interface AdminSession {
  id: number;
  token: string;
  username: string;
  expires_at: string;
  created_at: string;
}

class AdminSessionRepository {
  private db: Database.Database;

  constructor() {
    this.db = getDatabase();
  }

  generateToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  create(username: string, expiresInHours: number = 24): AdminSession {
    const token = this.generateToken();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + expiresInHours);

    const stmt = this.db.prepare(`
      INSERT INTO admin_sessions (token, username, expires_at)
      VALUES (?, ?, ?)
    `);

    const result = stmt.run(token, username, expiresAt.toISOString());

    return {
      id: result.lastInsertRowid as number,
      token,
      username,
      expires_at: expiresAt.toISOString(),
      created_at: new Date().toISOString(),
    };
  }

  findByToken(token: string): AdminSession | undefined {
    const stmt = this.db.prepare(`
      SELECT * FROM admin_sessions
      WHERE token = ? AND datetime(expires_at) > datetime('now')
    `);
    return stmt.get(token) as AdminSession | undefined;
  }

  deleteByToken(token: string): boolean {
    const stmt = this.db.prepare('DELETE FROM admin_sessions WHERE token = ?');
    const result = stmt.run(token);
    return result.changes > 0;
  }

  deleteExpired(): number {
    const stmt = this.db.prepare(
      `DELETE FROM admin_sessions WHERE datetime(expires_at) <= datetime('now')`
    );
    const result = stmt.run();
    return result.changes;
  }

  isValid(token: string): boolean {
    return this.findByToken(token) !== undefined;
  }
}

export const adminSessionRepository = new AdminSessionRepository();
