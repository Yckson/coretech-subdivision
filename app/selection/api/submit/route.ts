import { NextRequest, NextResponse } from 'next/server';
import { selectionService } from '@/services/selectionService';
import { uploadService } from '@/services/uploadService';

export async function POST(req: NextRequest) {
  try {
    // Ensure upload directory exists
    await uploadService.ensureUploadDir();

    // Parse FormData
    const formData = await req.formData();

    const matricula = formData.get('matricula') as string;
    const fullName = formData.get('fullName') as string;
    const mainAreaId = parseInt(formData.get('mainAreaId') as string, 10);
    const areaPreferenceOrder = JSON.parse(formData.get('areaPreferenceOrder') as string);
    const articlesSelected = JSON.parse(formData.get('articlesSelected') as string);
    const pdfFile = formData.get('pdf') as File | null;

    // Validate inputs
    const validation = selectionService.validateSelection({
      matricula,
      fullName,
      mainAreaId,
      areaPreferenceOrder,
      articlesSelected,
    });

    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 }
      );
    }

    if (!selectionService.isMatriculaAllowed(matricula)) {
      return NextResponse.json(
        { success: false, error: 'Matrícula não está na lista de permitidos' },
        { status: 403 }
      );
    }

    if (selectionService.isExternalAccessMatricula(matricula)) {
      return NextResponse.json(
        {
          success: true,
          message: 'Acesso externo validado com sucesso',
          redirectUrl: '/selection/success',
        },
        { status: 201 }
      );
    }

    // Check if matricula already exists
    if (await selectionService.checkMatriculaExists(matricula)) {
      return NextResponse.json(
        { success: false, error: 'Esta matrícula já realizou a seleção', redirectUrl: '/selection/already-registered' },
        { status: 409 }
      );
    }

    let pdfPath: string | undefined;
    let pdfName: string | undefined;

    // Process PDF if provided
    if (pdfFile && pdfFile.size > 0) {
      // Validate PDF
      const pdfValidation = uploadService.validatePDF({
        originalFilename: pdfFile.name,
        mimetype: pdfFile.type,
        size: pdfFile.size,
      });

      if (!pdfValidation.valid) {
        return NextResponse.json(
          { success: false, error: pdfValidation.error },
          { status: 400 }
        );
      }

      const uploaded = await uploadService.uploadPdf(pdfFile);
      pdfPath = uploaded.url;
      pdfName = pdfFile.name;
    }

    // Submit selection
    const result = await selectionService.submitSelection({
      matricula,
      fullName,
      mainAreaId,
      areaPreferenceOrder,
      articlesSelected,
      customPdfPath: pdfPath,
      customPdfName: pdfName,
    });

    if (!result.success) {
      // Delete uploaded file if selection fails
      if (pdfPath) {
        await uploadService.deleteFile(pdfPath);
      }

      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Seleção realizada com sucesso',
        memberId: result.memberId,
        redirectUrl: '/selection/success',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error submitting selection:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao processar seleção' },
      { status: 500 }
    );
  }
}
