import { promises as fs } from 'fs';
import path from 'path';

type UploadedPdf = {
  originalFilename?: string | null;
  mimetype?: string | null;
  size: number;
};

export class UploadService {
  private uploadDir: string;
  private maxFileSize: number = 5 * 1024 * 1024; // 5MB

  constructor() {
    this.uploadDir = path.join(process.cwd(), 'public', 'uploads');
  }

  async ensureUploadDir(): Promise<void> {
    try {
      await fs.mkdir(this.uploadDir, { recursive: true });
    } catch (error) {
      console.error('Error creating upload directory:', error);
    }
  }

  validatePDF(file: UploadedPdf | null | undefined): { valid: boolean; error?: string } {
    if (!file) {
      return { valid: true }; // PDF is optional
    }

    // Check file extension
    if (!file.originalFilename?.endsWith('.pdf')) {
      return { valid: false, error: 'O arquivo deve ser um PDF' };
    }

    // Check MIME type
    if (file.mimetype !== 'application/pdf') {
      return { valid: false, error: 'O arquivo deve ser um PDF válido' };
    }

    // Check file size
    if (file.size > this.maxFileSize) {
      return { valid: false, error: 'O arquivo PDF não pode exceder 5MB' };
    }

    return { valid: true };
  }

  getRelativePath(absolutePath: string): string {
    return absolutePath.replace(process.cwd(), '');
  }

  async deleteFile(filePath: string): Promise<void> {
    const normalizedPath = filePath.replace(/\\/g, '/').replace(/^\/+/, '');
    const candidatePaths = new Set<string>([path.join(process.cwd(), normalizedPath)]);

    if (!normalizedPath.startsWith('public/')) {
      candidatePaths.add(path.join(process.cwd(), 'public', normalizedPath));
    }

    for (const fullPath of candidatePaths) {
      try {
        await fs.unlink(fullPath);
        return;
      } catch (error) {
        const unlinkError = error as NodeJS.ErrnoException;
        if (unlinkError.code !== 'ENOENT') {
          console.error('Error deleting file:', unlinkError);
          return;
        }
      }
    }
  }
}

export const uploadService = new UploadService();
