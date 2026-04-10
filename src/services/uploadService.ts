import { promises as fs } from 'fs';
import { del, put } from '@vercel/blob';
import path from 'path';

type UploadedPdf = {
  originalFilename?: string | null;
  mimetype?: string | null;
  size: number;
};

export class UploadService {
  private maxFileSize: number = 5 * 1024 * 1024; // 5MB

  async ensureUploadDir(): Promise<void> {
    // Kept for backward compatibility with existing route flow.
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

  async uploadPdf(file: File): Promise<{ url: string; pathname: string }> {
    const extension = file.name.toLowerCase().endsWith('.pdf') ? '.pdf' : '';
    const safeBaseName = file.name
      .replace(/\.[^.]+$/, '')
      .replace(/[^a-zA-Z0-9-_]/g, '_')
      .slice(0, 80);
    const blobPath = `uploads/${Date.now()}_${safeBaseName}${extension}`;

    const result = await put(blobPath, file, {
      access: 'public',
      addRandomSuffix: true,
    });

    return {
      url: result.url,
      pathname: result.pathname,
    };
  }

  async deleteFile(filePath: string): Promise<void> {
    if (filePath.startsWith('http://') || filePath.startsWith('https://')) {
      try {
        await del(filePath);
        return;
      } catch (error) {
        console.error('Error deleting blob file:', error);
      }
    }

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
