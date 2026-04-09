import { NextRequest, NextResponse } from 'next/server';
import { selectionService } from '@/services/selectionService';
import { uploadService } from '@/services/uploadService';
import { IncomingForm } from 'formidable';
import path from 'path';
import { promises as fs } from 'fs';

export async function POST(req: NextRequest) {
  try {
    // Ensure upload directory exists
    await uploadService.ensureUploadDir();

    // Parse FormData
    const formData = await req.formData();

    const matricula = formData.get('matricula') as string;
    const mainAreaId = parseInt(formData.get('mainAreaId') as string, 10);
    const areaPreferenceOrder = JSON.parse(formData.get('areaPreferenceOrder') as string);
    const articlesSelected = JSON.parse(formData.get('articlesSelected') as string);
    const pdfFile = formData.get('pdf') as File | null;

    // Validate inputs
    const validation = selectionService.validateSelection({
      matricula,
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

    // Check if matricula already exists
    if (selectionService.checkMatriculaExists(matricula)) {
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
      } as any);

      if (!pdfValidation.valid) {
        return NextResponse.json(
          { success: false, error: pdfValidation.error },
          { status: 400 }
        );
      }

      // Save PDF
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      const filename = `${Date.now()}_${pdfFile.name}`;
      const filePath = path.join(uploadDir, filename);

      const buffer = await pdfFile.arrayBuffer();
      await fs.writeFile(filePath, Buffer.from(buffer));

      pdfPath = `/uploads/${filename}`;
      pdfName = pdfFile.name;
    }

    // Submit selection
    const result = selectionService.submitSelection({
      matricula,
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
