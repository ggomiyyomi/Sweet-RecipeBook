import client from './client';
import type { User, LoginRequest, RegisterRequest } from '../types';

// 백엔드 실제 응답 형식
interface LoginResponseRaw {
  accessToken: string;
  userId: number;
  name: string;
  email: string;
}

export interface AuthResult {
  token: string;
  user: User;
}

export const authApi = {
  login: async (data: LoginRequest): Promise<AuthResult> => {
    const res = await client.post<LoginResponseRaw>('/auth/login', data);
    const { accessToken, userId, name, email } = res.data;
    return {
      token: accessToken,
      user: { userId, name, email, createdAt: new Date().toISOString() },
    };
  },

  // 회원가입은 201 + body 없음 → 완료 후 자동 로그인
  signup: async (data: RegisterRequest): Promise<AuthResult> => {
    await client.post('/auth/signup', data);
    return authApi.login({ email: data.email, password: data.password });
  },

  logout: () => client.post('/auth/logout'),
};
