export interface User {
  id: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  username: string;
  bio?: string;
  createdAt: number;
  updatedAt?: number;
  followers?: Record<string, boolean>;
  following?: Record<string, boolean>;
  profession?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  confirmPassword: string;
  displayName: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}