import { getDatabase } from '@/lib/db';
import Database from 'better-sqlite3';

export interface Selection {
  id: number;
  member_id: number;
  main_area_id: number;
  area_preference_order: string; // JSON array: [2, 3, 4, 5]
  articles_selected: string; // JSON object: { "1": "article_name", "2": "article_name" }
  custom_pdf_path: string | null;
  custom_pdf_name: string | null;
  submitted_at: string;
}

export interface SelectionWithMember extends Selection {
  matricula: string;
  full_name: string;
}

class SelectionRepository {
  private db: Database.Database;

  constructor() {
    this.db = getDatabase();
  }

  findByMemberId(memberId: number): Selection | undefined {
    const stmt = this.db.prepare('SELECT * FROM selections WHERE member_id = ?');
    return stmt.get(memberId) as Selection | undefined;
  }

  findByMemberIdWithMatricula(memberId: number): SelectionWithMember | undefined {
    const stmt = this.db.prepare(`
      SELECT s.*, m.matricula, m.full_name
      FROM selections s
      JOIN members m ON s.member_id = m.id
      WHERE s.member_id = ?
    `);
    return stmt.get(memberId) as SelectionWithMember | undefined;
  }

  findAll(): SelectionWithMember[] {
    const stmt = this.db.prepare(`
      SELECT s.*, m.matricula, m.full_name
      FROM selections s
      JOIN members m ON s.member_id = m.id
      ORDER BY s.submitted_at DESC
    `);
    return stmt.all() as SelectionWithMember[];
  }

  findById(id: number): Selection | undefined {
    const stmt = this.db.prepare('SELECT * FROM selections WHERE id = ?');
    return stmt.get(id) as Selection | undefined;
  }

  create(
    memberId: number,
    mainAreaId: number,
    areaPreferenceOrder: number[],
    articlesSelected: { [key: number]: string },
    customPdfPath?: string,
    customPdfName?: string
  ): Selection {
    const submittedAt = new Date().toISOString();

    const stmt = this.db.prepare(`
      INSERT INTO selections
      (member_id, main_area_id, area_preference_order, articles_selected, custom_pdf_path, custom_pdf_name, submitted_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      memberId,
      mainAreaId,
      JSON.stringify(areaPreferenceOrder),
      JSON.stringify(articlesSelected),
      customPdfPath || null,
      customPdfName || null,
      submittedAt
    );

    return {
      id: result.lastInsertRowid as number,
      member_id: memberId,
      main_area_id: mainAreaId,
      area_preference_order: JSON.stringify(areaPreferenceOrder),
      articles_selected: JSON.stringify(articlesSelected),
      custom_pdf_path: customPdfPath || null,
      custom_pdf_name: customPdfName || null,
      submitted_at: submittedAt,
    };
  }

  update(
    memberId: number,
    mainAreaId: number,
    areaPreferenceOrder: number[],
    articlesSelected: { [key: number]: string },
    customPdfPath?: string,
    customPdfName?: string
  ): Selection {
    const stmt = this.db.prepare(`
      UPDATE selections
      SET main_area_id = ?, area_preference_order = ?, articles_selected = ?,
          custom_pdf_path = ?, custom_pdf_name = ?
      WHERE member_id = ?
    `);

    stmt.run(
      mainAreaId,
      JSON.stringify(areaPreferenceOrder),
      JSON.stringify(articlesSelected),
      customPdfPath || null,
      customPdfName || null,
      memberId
    );

    const selection = this.findByMemberId(memberId);
    if (!selection) {
      throw new Error('Failed to update selection');
    }

    return selection;
  }

  delete(memberId: number): boolean {
    const stmt = this.db.prepare('DELETE FROM selections WHERE member_id = ?');
    const result = stmt.run(memberId);
    return result.changes > 0;
  }

  deleteById(id: number): boolean {
    const stmt = this.db.prepare('DELETE FROM selections WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }

  existsByMemberId(memberId: number): boolean {
    const stmt = this.db.prepare('SELECT 1 FROM selections WHERE member_id = ? LIMIT 1');
    return stmt.get(memberId) !== undefined;
  }
}

export const selectionRepository = new SelectionRepository();
