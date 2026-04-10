import { getDatabase } from '@/lib/db';

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
  private mapSelection(row: Record<string, unknown> | undefined): Selection | undefined {
    if (!row) {
      return undefined;
    }

    return {
      id: Number(row.id),
      member_id: Number(row.member_id),
      main_area_id: Number(row.main_area_id),
      area_preference_order: String(row.area_preference_order),
      articles_selected: String(row.articles_selected),
      custom_pdf_path: row.custom_pdf_path ? String(row.custom_pdf_path) : null,
      custom_pdf_name: row.custom_pdf_name ? String(row.custom_pdf_name) : null,
      submitted_at: String(row.submitted_at),
    };
  }

  private mapSelectionWithMember(
    row: Record<string, unknown> | undefined
  ): SelectionWithMember | undefined {
    const base = this.mapSelection(row);
    if (!base || !row) {
      return undefined;
    }

    return {
      ...base,
      matricula: String(row.matricula),
      full_name: String(row.full_name),
    };
  }

  async findByMemberId(memberId: number): Promise<Selection | undefined> {
    const db = await getDatabase();
    const result = await db.execute({
      sql: 'SELECT * FROM selections WHERE member_id = ?',
      args: [memberId],
    });
    return this.mapSelection(result.rows[0] as Record<string, unknown> | undefined);
  }

  async findByMemberIdWithMatricula(memberId: number): Promise<SelectionWithMember | undefined> {
    const db = await getDatabase();
    const result = await db.execute({
      sql: `
      SELECT s.*, m.matricula, m.full_name
      FROM selections s
      JOIN members m ON s.member_id = m.id
      WHERE s.member_id = ?
    `,
      args: [memberId],
    });
    return this.mapSelectionWithMember(result.rows[0] as Record<string, unknown> | undefined);
  }

  async findAll(): Promise<SelectionWithMember[]> {
    const db = await getDatabase();
    const result = await db.execute(`
      SELECT s.*, m.matricula, m.full_name
      FROM selections s
      JOIN members m ON s.member_id = m.id
      ORDER BY s.submitted_at DESC
    `);
    return result.rows
      .map((row) => this.mapSelectionWithMember(row as Record<string, unknown>))
      .filter(Boolean) as SelectionWithMember[];
  }

  async findById(id: number): Promise<Selection | undefined> {
    const db = await getDatabase();
    const result = await db.execute({
      sql: 'SELECT * FROM selections WHERE id = ?',
      args: [id],
    });
    return this.mapSelection(result.rows[0] as Record<string, unknown> | undefined);
  }

  async create(
    memberId: number,
    mainAreaId: number,
    areaPreferenceOrder: number[],
    articlesSelected: { [key: number]: string },
    customPdfPath?: string,
    customPdfName?: string
  ): Promise<Selection> {
    const submittedAt = new Date().toISOString();

    const db = await getDatabase();
    const result = await db.execute({
      sql: `
      INSERT INTO selections
      (member_id, main_area_id, area_preference_order, articles_selected, custom_pdf_path, custom_pdf_name, submitted_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
      args: [
        memberId,
        mainAreaId,
        JSON.stringify(areaPreferenceOrder),
        JSON.stringify(articlesSelected),
        customPdfPath || null,
        customPdfName || null,
        submittedAt,
      ],
    });

    return {
      id: Number(result.lastInsertRowid),
      member_id: memberId,
      main_area_id: mainAreaId,
      area_preference_order: JSON.stringify(areaPreferenceOrder),
      articles_selected: JSON.stringify(articlesSelected),
      custom_pdf_path: customPdfPath || null,
      custom_pdf_name: customPdfName || null,
      submitted_at: submittedAt,
    };
  }

  async update(
    memberId: number,
    mainAreaId: number,
    areaPreferenceOrder: number[],
    articlesSelected: { [key: number]: string },
    customPdfPath?: string,
    customPdfName?: string
  ): Promise<Selection> {
    const db = await getDatabase();
    await db.execute({
      sql: `
      UPDATE selections
      SET main_area_id = ?, area_preference_order = ?, articles_selected = ?,
          custom_pdf_path = ?, custom_pdf_name = ?
      WHERE member_id = ?
    `,
      args: [
        mainAreaId,
        JSON.stringify(areaPreferenceOrder),
        JSON.stringify(articlesSelected),
        customPdfPath || null,
        customPdfName || null,
        memberId,
      ],
    });

    const selection = await this.findByMemberId(memberId);
    if (!selection) {
      throw new Error('Failed to update selection');
    }

    return selection;
  }

  async delete(memberId: number): Promise<boolean> {
    const db = await getDatabase();
    const result = await db.execute({
      sql: 'DELETE FROM selections WHERE member_id = ?',
      args: [memberId],
    });
    return result.rowsAffected > 0;
  }

  async deleteById(id: number): Promise<boolean> {
    const db = await getDatabase();
    const result = await db.execute({
      sql: 'DELETE FROM selections WHERE id = ?',
      args: [id],
    });
    return result.rowsAffected > 0;
  }

  async existsByMemberId(memberId: number): Promise<boolean> {
    const db = await getDatabase();
    const result = await db.execute({
      sql: 'SELECT 1 FROM selections WHERE member_id = ? LIMIT 1',
      args: [memberId],
    });
    return result.rows.length > 0;
  }
}

export const selectionRepository = new SelectionRepository();
