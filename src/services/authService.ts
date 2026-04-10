import { adminSessionRepository } from '@/repositories/adminSessionRepository';

export class AuthService {
  private adminUsername: string;
  private adminPassword: string;

  constructor() {
    this.adminUsername = process.env.ADMIN_USERNAME || 'admin';
    this.adminPassword = process.env.ADMIN_PASSWORD || 'admin';
  }

  async authenticate(
    username: string,
    password: string
  ): Promise<{ success: boolean; token?: string; error?: string }> {
    if (username !== this.adminUsername || password !== this.adminPassword) {
      return { success: false, error: 'Credenciais inválidas' };
    }

    const session = await adminSessionRepository.create(username);
    return { success: true, token: session.token };
  }

  async validateToken(token: string): Promise<boolean> {
    return adminSessionRepository.isValid(token);
  }

  async logout(token: string): Promise<boolean> {
    return adminSessionRepository.deleteByToken(token);
  }
}

export const authService = new AuthService();
