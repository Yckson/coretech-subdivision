import { memberRepository } from '@/repositories/memberRepository';
import { selectionRepository } from '@/repositories/selectionRepository';
import { validateMatricula, validateAreaSelection, validateArticleSelection } from '@/utils/validators';
import { AREAS, ARTICLES_BY_AREA } from '@/utils/constants';
import fs from 'fs';
import path from 'path';

export interface SelectionData {
  matricula: string;
  fullName: string;
  mainAreaId: number;
  areaPreferenceOrder: number[];
  articlesSelected: { [key: number]: string };
  customPdfPath?: string;
  customPdfName?: string;
}

export class SelectionService {
  private allowedMatriculasCache: Set<string> | null = null;
  private externalAccessMatriculasCache: Set<string> | null = null;

  private getAllowedMatriculas(): Set<string> {
    if (this.allowedMatriculasCache && this.externalAccessMatriculasCache) {
      return this.allowedMatriculasCache;
    }

    try {
      const permitidosPath = path.join(process.cwd(), 'public', 'data', 'permitidos.json');
      const fileContent = fs.readFileSync(permitidosPath, 'utf-8');
      const parsed = JSON.parse(fileContent) as Array<{
        matricula?: string;
        matrícula?: string;
        nome?: string;
        externo?: boolean;
      }>;

      const externalAccessMatriculas = new Set<string>();

      this.allowedMatriculasCache = new Set(
        parsed
          .map((entry) => {
            const matricula = String(entry.matricula ?? entry.matrícula ?? '').trim();
            const isExternal =
              entry.externo === true || entry.nome?.toLowerCase().trim() === 'acesso externo';

            if (matricula && isExternal) {
              externalAccessMatriculas.add(matricula);
            }

            return matricula;
          })
          .filter((matricula) => matricula.length > 0)
      );

      this.externalAccessMatriculasCache = externalAccessMatriculas;
    } catch (error) {
      console.error('Error loading allowed matriculas from permitidos.json:', error);
      this.allowedMatriculasCache = new Set();
      this.externalAccessMatriculasCache = new Set();
    }

    return this.allowedMatriculasCache;
  }

  validateMatricula(matricula: string): { valid: boolean; error?: string } {
    if (!validateMatricula(matricula)) {
      return { valid: false, error: 'Matrícula deve conter 12 dígitos' };
    }
    return { valid: true };
  }

  isMatriculaAllowed(matricula: string): boolean {
    return this.getAllowedMatriculas().has(matricula);
  }

  isExternalAccessMatricula(matricula: string): boolean {
    this.getAllowedMatriculas();
    return this.externalAccessMatriculasCache?.has(matricula) ?? false;
  }

  async checkMatriculaExists(matricula: string): Promise<boolean> {
    const member = await memberRepository.findByMatricula(matricula);
    if (!member) {
      return false;
    }

    return selectionRepository.existsByMemberId(member.id);
  }

  validateSelection(data: Partial<SelectionData>): { valid: boolean; error?: string } {
    // Validate matrícula
    if (!data.matricula) {
      return { valid: false, error: 'Matrícula é obrigatória' };
    }

    const matriculaValid = this.validateMatricula(data.matricula);
    if (!matriculaValid.valid) {
      return matriculaValid;
    }

    if (!data.fullName || !data.fullName.trim()) {
      return { valid: false, error: 'Nome completo é obrigatório' };
    }

    if (data.fullName.trim().length < 3) {
      return { valid: false, error: 'Nome completo deve ter pelo menos 3 caracteres' };
    }

    // Validate area selection
    const areaIds = AREAS.map((a) => a.id);
    const areaValid = validateAreaSelection(data.mainAreaId || 0, data.areaPreferenceOrder || [], areaIds);
    if (!areaValid.valid) {
      return areaValid;
    }

    // Validate articles
    const articleValid = validateArticleSelection(data.articlesSelected || {}, ARTICLES_BY_AREA);
    if (!articleValid.valid) {
      return articleValid;
    }

    return { valid: true };
  }

  async submitSelection(
    data: SelectionData
  ): Promise<{ success: boolean; memberId?: number; error?: string }> {
    // Validate
    const validation = this.validateSelection(data);
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    if (!this.isMatriculaAllowed(data.matricula)) {
      return { success: false, error: 'Matrícula não está na lista de permitidos' };
    }

    // Check if matricula already exists
    let member = await memberRepository.findByMatricula(data.matricula);
    if (member && (await selectionRepository.findByMemberId(member.id))) {
      return { success: false, error: 'Esta matrícula já realizou a seleção' };
    }

    // Create or get member
    if (!member) {
      member = await memberRepository.create(data.matricula, data.fullName.trim());
    }

    // Create selection
    try {
      await selectionRepository.create(
        member.id,
        data.mainAreaId,
        data.areaPreferenceOrder,
        data.articlesSelected,
        data.customPdfPath,
        data.customPdfName
      );

      return { success: true, memberId: member.id };
    } catch (error) {
      return { success: false, error: 'Erro ao salvar seleção' };
    }
  }

  async getSelection(memberId: number) {
    return selectionRepository.findByMemberIdWithMatricula(memberId);
  }

  getAreaName(areaId: number): string {
    const area = AREAS.find((a) => a.id === areaId);
    return area ? area.name : 'Área Desconhecida';
  }

  getAreaColor(areaId: number): string {
    const area = AREAS.find((a) => a.id === areaId);
    return area ? area.color : '#999999';
  }
}

export const selectionService = new SelectionService();
