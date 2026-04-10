import { getDatabase } from '@/lib/db';
import crypto from 'crypto';

export interface AdminSession {
  id: number;
  token: string;
  username: string;
  expires_at: string;
  created_at: string;
}

class AdminSessionRepository {
  private mapAdminSession(row: Record<string, unknown> | undefined): AdminSession | undefined {
    if (!row) {
      return undefined;
    }

    return {
      id: Number(row.id),
      token: String(row.token),
      username: String(row.username),
      expires_at: String(row.expires_at),
      created_at: String(row.created_at),
    };
  }

  generateToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  async create(username: string, expiresInHours: number = 24): Promise<AdminSession> {
    const token = this.generateToken();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + expiresInHours);

    const db = await getDatabase();
    const result = await db.execute({
      sql: `
      INSERT INTO admin_sessions (token, username, expires_at)
      VALUES (?, ?, ?)
    `,
      args: [token, username, expiresAt.toISOString()],
    });

    return {
      id: Number(result.lastInsertRowid),
      token,
      username,
      expires_at: expiresAt.toISOString(),
      created_at: new Date().toISOString(),
    };
  }

  async findByToken(token: string): Promise<AdminSession | undefined> {
    const db = await getDatabase();
    const result = await db.execute({
      sql: `
      SELECT * FROM admin_sessions
      WHERE token = ? AND datetime(expires_at) > datetime('now')
    `,
      args: [token],
    });
    return this.mapAdminSession(result.rows[0] as Record<string, unknown> | undefined);
  }

  async deleteByToken(token: string): Promise<boolean> {
    const db = await getDatabase();
    const result = await db.execute({
      sql: 'DELETE FROM admin_sessions WHERE token = ?',
      args: [token],
    });
    return result.rowsAffected > 0;
  }

  async deleteExpired(): Promise<number> {
    const db = await getDatabase();
    const result = await db.execute(
      `DELETE FROM admin_sessions WHERE datetime(expires_at) <= datetime('now')`
    );
    return result.rowsAffected;
  }

  async isValid(token: string): Promise<boolean> {
    return (await this.findByToken(token)) !== undefined;
  }
}

export const adminSessionRepository = new AdminSessionRepository();
