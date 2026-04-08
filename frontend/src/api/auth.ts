import client from './client';
import type { User, LoginRequest, RegisterRequest } from '../types';

interface AuthResponse {
  token: string;
  user: User;
}

export const authApi = {
  login: (data: LoginRequest) =>
    client.post<AuthResponse>('/auth/login', data).then((r) => r.data),

  signup: (data: RegisterRequest) =>
    client.post<AuthResponse>('/auth/signup', data).then((r) => r.data),

  logout: () => client.post('/auth/logout'),
};
