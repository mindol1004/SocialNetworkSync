import { api } from '@/lib/axios';

export const loginApi = {
  loginWithEmail: (email: string, password: string) =>
    api.post('/api/auth/signin', { email, password }),
  
  loginWithGoogle: (googleIdToken: string) =>
    api.post('/api/auth/signin/google', { googleIdToken })
    
};