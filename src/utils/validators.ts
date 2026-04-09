import { MATRICULA_REGEX } from './constants';

export function validateMatricula(matricula: string): boolean {
  return MATRICULA_REGEX.test(matricula);
}

export function validatePDFFile(file: File | null): { valid: boolean; error?: string } {
  if (!file) {
    return { valid: true }; // PDF é opcional
  }

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

  if (file.type !== 'application/pdf') {
    return { valid: false, error: 'O arquivo deve ser um PDF válido' };
  }

  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: 'O arquivo PDF não pode exceder 5MB' };
  }

  return { valid: true };
}

export function validateAreaSelection(
  mainArea: number,
  ranking: number[],
  allAreaIds: number[]
): { valid: boolean; error?: string } {
  if (!mainArea || allAreaIds.length === 0) {
    return { valid: false, error: 'Selecione uma área principal' };
  }

  if (!allAreaIds.includes(mainArea)) {
    return { valid: false, error: 'Área principal inválida' };
  }

  if (ranking.length !== 4) {
    return { valid: false, error: 'Complete o ranking das 4 áreas restantes' };
  }

  const uniqueRanking = new Set(ranking);
  if (uniqueRanking.size !== 4) {
    return { valid: false, error: 'Não pode haver áreas duplicadas no ranking' };
  }

  // Check if all areas in ranking are valid and different from main area
  const validRanking = ranking.every(
    (area) => allAreaIds.includes(area) && area !== mainArea
  );

  if (!validRanking) {
    return { valid: false, error: 'Ranking contém áreas inválidas' };
  }

  return { valid: true };
}

export function validateArticleSelection(
  articles: { [key: number]: string },
  validArticles: { [areaId: number]: string[] }
): { valid: boolean; error?: string } {
  if (Object.keys(articles).length === 0) {
    return { valid: false, error: 'Selecione pelo menos um artigo' };
  }

  for (const [areaId, article] of Object.entries(articles)) {
    const area = parseInt(areaId);
    const isCustomPdfArticle = typeof article === 'string' && article.startsWith('CUSTOM_PDF:');

    if (!validArticles[area]) {
      return { valid: false, error: `Artigo inválido para a área ${area}` };
    }

    // Custom PDF entries are represented with a prefix and validated by file checks.
    if (isCustomPdfArticle) {
      continue;
    }

    if (!validArticles[area].includes(article)) {
      return { valid: false, error: `Artigo inválido para a área ${area}` };
    }
  }

  return { valid: true };
}
