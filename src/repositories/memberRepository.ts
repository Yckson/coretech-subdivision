import { getDatabase } from '@/lib/db';

export interface Member {
  id: number;
  matricula: string;
  full_name: string;
  created_at: string;
}

class MemberRepository {
  private mapMember(row: Record<string, unknown> | undefined): Member | undefined {
    if (!row) {
      return undefined;
    }

    return {
      id: Number(row.id),
      matricula: String(row.matricula),
      full_name: String(row.full_name),
      created_at: String(row.created_at),
    };
  }

  async findByMatricula(matricula: string): Promise<Member | undefined> {
    const db = await getDatabase();
    const result = await db.execute({
      sql: 'SELECT * FROM members WHERE matricula = ?',
      args: [matricula],
    });
    return this.mapMember(result.rows[0] as Record<string, unknown> | undefined);
  }

  async findById(id: number): Promise<Member | undefined> {
    const db = await getDatabase();
    const result = await db.execute({
      sql: 'SELECT * FROM members WHERE id = ?',
      args: [id],
    });
    return this.mapMember(result.rows[0] as Record<string, unknown> | undefined);
  }

  async create(matricula: string, fullName: string): Promise<Member> {
    const db = await getDatabase();
    const result = await db.execute({
      sql: 'INSERT INTO members (matricula, full_name) VALUES (?, ?)',
      args: [matricula, fullName],
    });

    return {
      id: Number(result.lastInsertRowid),
      matricula,
      full_name: fullName,
      created_at: new Date().toISOString(),
    };
  }

  async updateFullName(id: number, fullName: string): Promise<boolean> {
    const db = await getDatabase();
    const result = await db.execute({
      sql: 'UPDATE members SET full_name = ? WHERE id = ?',
      args: [fullName, id],
    });

    return result.rowsAffected > 0;
  }

  async getAll(): Promise<Member[]> {
    const db = await getDatabase();
    const result = await db.execute('SELECT * FROM members ORDER BY created_at DESC');
    return result.rows.map((row) => this.mapMember(row as Record<string, unknown>)).filter(Boolean) as Member[];
  }

  async delete(id: number): Promise<boolean> {
    const db = await getDatabase();
    const result = await db.execute({
      sql: 'DELETE FROM members WHERE id = ?',
      args: [id],
    });
    return result.rowsAffected > 0;
  }
}

export const memberRepository = new MemberRepository();
