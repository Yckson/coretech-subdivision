import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/services/authService';
import { selectionRepository } from '@/repositories/selectionRepository';
import { AREAS } from '@/utils/constants';

const SESSION_COOKIE_NAME = 'admin_session';

function normalizeTimestamp(value: string): string {
  // SQLite commonly stores DATETIME as "YYYY-MM-DD HH:MM:SS" without timezone.
  // In this app this value should be interpreted as UTC.
  const hasTimezone = /[zZ]|[+-]\d{2}:?\d{2}$/.test(value);
  const normalized = value.includes(' ') ? value.replace(' ', 'T') : value;
  return hasTimezone ? normalized : `${normalized}Z`;
}

export async function GET(req: NextRequest) {
  try {
    // Check authentication
    const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;

    if (!token || !authService.validateToken(token)) {
      return NextResponse.json(
        { success:false, error: 'Não autenticado' },
        { status: 401 }
      );
    }

    // Get all selections
    const selections = selectionRepository.findAll();

    // Map selections with area names
    const selectionsWithNames = selections.map((selection) => ({
      ...selection,
      areaPreferenceOrder: JSON.parse(selection.area_preference_order),
      articlesSelected: JSON.parse(selection.articles_selected),
      submitted_at: normalizeTimestamp(selection.submitted_at),
      mainAreaName: AREAS.find((a) => a.id === selection.main_area_id)?.name || 'Desconhecida',
    }));

    return NextResponse.json({
      success: true,
      data: selectionsWithNames,
      total: selectionsWithNames.length,
    });
  } catch (error) {
    console.error('Error fetching selections:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao buscar seleções' },
      { status: 500 }
    );
  }
}
