import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/services/authService';
import { selectionRepository } from '@/repositories/selectionRepository';
import { uploadService } from '@/services/uploadService';

const SESSION_COOKIE_NAME = 'admin_session';

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;

    if (!token || !(await authService.validateToken(token))) {
      return NextResponse.json(
        { success: false, error: 'Não autenticado' },
        { status: 401 }
      );
    }

    const { id } = await context.params;
    const selectionId = Number.parseInt(id, 10);

    if (!Number.isInteger(selectionId) || selectionId <= 0) {
      return NextResponse.json(
        { success: false, error: 'ID da seleção inválido' },
        { status: 400 }
      );
    }

    const selection = await selectionRepository.findById(selectionId);

    if (!selection) {
      return NextResponse.json(
        { success: false, error: 'Seleção não encontrada' },
        { status: 404 }
      );
    }

    const deleted = await selectionRepository.deleteById(selectionId);

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Não foi possível remover a seleção' },
        { status: 500 }
      );
    }

    if (selection.custom_pdf_path) {
      await uploadService.deleteFile(selection.custom_pdf_path);
    }

    return NextResponse.json({
      success: true,
      message: 'Seleção removida com sucesso',
    });
  } catch (error) {
    console.error('Error deleting selection:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao remover seleção' },
      { status: 500 }
    );
  }
}
