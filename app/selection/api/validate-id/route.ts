import { NextRequest, NextResponse } from 'next/server';
import { ValidateMatriculaSchema } from '@/schemas/selection';
import { selectionService } from '@/services/selectionService';
import { ZodError } from 'zod';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate input
    const validated = ValidateMatriculaSchema.parse({
      matricula: body.matricula,
    });

    // Check if matricula is valid format
    const matriculaValid = selectionService.validateMatricula(validated.matricula);
    if (!matriculaValid.valid) {
      return NextResponse.json(
        { valid: false, error: matriculaValid.error },
        { status: 400 }
      );
    }

    if (!selectionService.isMatriculaAllowed(validated.matricula)) {
      return NextResponse.json(
        { valid: false, error: 'Matrícula não está na lista de permitidos' },
        { status: 403 }
      );
    }

    // External access matriculas should always remain available in the UI flow.
    const exists = selectionService.isExternalAccessMatricula(validated.matricula)
      ? false
      : await selectionService.checkMatriculaExists(validated.matricula);

    return NextResponse.json({
      valid: true,
      exists,
      message: exists ? 'Matrícula já registrada' : 'Matrícula disponível',
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { valid: false, error: error.issues[0]?.message || 'Erro de validação' },
        { status: 400 }
      );
    }

    console.error('Error validating matricula:', error);

    return NextResponse.json(
      { valid: false, error: 'Erro ao processar requisição' },
      { status: 500 }
    );
  }
}
