import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/services/authService';
import { selectionRepository } from '@/repositories/selectionRepository';
import { promises as fs } from 'fs';
import path from 'path';

const SESSION_COOKIE_NAME = 'admin_session';

function getPdfCandidatePaths(storedPath: string): string[] {
  const normalizedPath = storedPath.replace(/\\/g, '/').replace(/^\/+/, '');
  const candidates = new Set<string>();

  // Direct path as stored in DB (legacy compatibility).
  candidates.add(path.join(process.cwd(), normalizedPath));

  // Current upload location under public/uploads.
  if (!normalizedPath.startsWith('public/')) {
    candidates.add(path.join(process.cwd(), 'public', normalizedPath));
  }

  return Array.from(candidates);
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;

    if (!token || !authService.validateToken(token)) {
      return NextResponse.json(
        { success: false, error: 'Não autenticado' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const selectionId = parseInt(id, 10);
    const selection = selectionRepository.findAll().find((s) => s.id === selectionId);

    if (!selection || !selection.custom_pdf_path) {
      return NextResponse.json(
        { success: false, error: 'PDF não encontrado' },
        { status: 404 }
      );
    }

    const candidatePaths = getPdfCandidatePaths(selection.custom_pdf_path);

    for (const candidatePath of candidatePaths) {
      try {
        const fileBuffer = await fs.readFile(candidatePath);

        // Return PDF with proper headers
        return new NextResponse(fileBuffer, {
          status: 200,
          headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="${selection.custom_pdf_name || 'document.pdf'}"`,
            'Cache-Control': 'no-cache, no-store, must-revalidate',
          },
        });
      } catch (fileError) {
        const error = fileError as NodeJS.ErrnoException;
        if (error.code !== 'ENOENT') {
          throw fileError;
        }
      }
    }

    console.error('File not found. Tried paths:', candidatePaths);
    return NextResponse.json(
      { success: false, error: 'Arquivo não encontrado no servidor' },
      { status: 404 }
    );
  } catch (error) {
    console.error('Error downloading PDF:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao baixar arquivo' },
      { status: 500 }
    );
  }
}
