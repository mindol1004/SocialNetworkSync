import { api } from '@/lib/axios';

export const loginApi = {
  loginWithEmail: (email: string, password: string) =>
    api.post('/api/user/signin', { email, password }),
  
  loginWithGoogle: (googleIdToken: string) =>
    api.post('/api/user/signin/google', { googleIdToken })
    
};