import { api } from '../../shared/utils/api';
import { User, CreateUserDTO, UpdateUserDTO } from '../../shared/domain/user/model/User';

export const loginApi = {
  getUser: (id: string) => api.get<User>(`/api/users/${id}`),

  createUser: (userData: CreateUserDTO) => api.post<User>('/api/users', userData),

  updateUser: (id: string, userData: UpdateUserDTO) => api.put<User>(`/api/users/${id}`, userData),

  deleteUser: (id: string) => api.delete<void>(`/api/users/${id}`),
};