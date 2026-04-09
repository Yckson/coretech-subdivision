import { adminSessionRepository } from '@/repositories/adminSessionRepository';

export class AuthService {
  private adminUsername: string;
  private adminPassword: string;

  constructor() {
    this.adminUsername = process.env.ADMIN_USERNAME || 'admin';
    this.adminPassword = process.env.ADMIN_PASSWORD || 'admin';
  }

  authenticate(username: string, password: string): { success: boolean; token?: string; error?: string } {
    if (username !== this.adminUsername || password !== this.adminPassword) {
      return { success: false, error: 'Credenciais inválidas' };
    }

    const session = adminSessionRepository.create(username);
    return { success: true, token: session.token };
  }

  validateToken(token: string): boolean {
    return adminSessionRepository.isValid(token);
  }

  logout(token: string): boolean {
    return adminSessionRepository.deleteByToken(token);
  }
}

export const authService = new AuthService();
