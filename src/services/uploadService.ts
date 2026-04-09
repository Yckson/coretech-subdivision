import { promises as fs } from 'fs';
import path from 'path';
import { IncomingForm, File as FormidableFile } from 'formidable';
import { NextRequest } from 'next/server';

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

  async processFormData(
    req: NextRequest
  ): Promise<{ fields: { [key: string]: string }; files: { [key: string]: FormidableFile } }> {
    return new Promise((resolve, reject) => {
      const form = new IncomingForm({
        uploadDir: this.uploadDir,
        maxFileSize: this.maxFileSize,
        keepExtensions: true,
        filename: (_name, _file, _origName) => {
          return `${Date.now()}_${_origName}`;
        },
      });

      const fields: { [key: string]: string } = {};
      const files: { [key: string]: FormidableFile } = {};

      form.on('field', (fieldname, value) => {
        fields[fieldname] = value;
      });

      form.on('file', (fieldname, file) => {
        files[fieldname] = file;
      });

      form.on('error', (err) => {
        reject(err);
      });

      form.on('end', () => {
        resolve({ fields, files });
      });

      // Convert Request to Node stream
      const buffer = Buffer.from(req.body || '');
      form.write(buffer);
      form.end();
    });
  }

  validatePDF(file: FormidableFile): { valid: boolean; error?: string } {
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
