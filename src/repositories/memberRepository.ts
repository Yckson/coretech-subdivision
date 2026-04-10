import { getDatabase } from '@/lib/db';
import Database from 'better-sqlite3';

export interface Member {
  id: number;
  matricula: string;
  full_name: string;
  created_at: string;
}

class MemberRepository {
  private db: Database.Database;

  constructor() {
    this.db = getDatabase();
  }

  findByMatricula(matricula: string): Member | undefined {
    const stmt = this.db.prepare('SELECT * FROM members WHERE matricula = ?');
    return stmt.get(matricula) as Member | undefined;
  }

  findById(id: number): Member | undefined {
    const stmt = this.db.prepare('SELECT * FROM members WHERE id = ?');
    return stmt.get(id) as Member | undefined;
  }

  create(matricula: string, fullName: string): Member {
    const stmt = this.db.prepare('INSERT INTO members (matricula, full_name) VALUES (?, ?)');
    const result = stmt.run(matricula, fullName);

    return {
      id: result.lastInsertRowid as number,
      matricula,
      full_name: fullName,
      created_at: new Date().toISOString(),
    };
  }

  getAll(): Member[] {
    const stmt = this.db.prepare('SELECT * FROM members ORDER BY created_at DESC');
    return stmt.all() as Member[];
  }

  delete(id: number): boolean {
    const stmt = this.db.prepare('DELETE FROM members WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }
}

export const memberRepository = new MemberRepository();
