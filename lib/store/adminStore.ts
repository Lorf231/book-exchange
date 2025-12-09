import { create } from 'zustand';
import { User } from '@/types/user';
import { userService } from '@/lib/services/userService';
import toast from 'react-hot-toast';

interface AdminState {
  users: User[];
  isLoading: boolean;
  
  
}

interface AdminAction {
  fetchUsers: () => Promise<void>;
  createUser: (data: { name: string, email: string }) => Promise<string>;
  deleteUser: (userId: string) => Promise<void>;
  updateUserRole: (userId: string, newRole: 'admin' | 'user') => Promise<void>;
}

interface IAdminStore extends AdminState, AdminAction {}

const initialState: AdminState = {
  users: [],
  isLoading: false,
}

export const useAdminStore = create<IAdminStore>((set, get) => ({
  ...initialState,

  fetchUsers: async () => {
    set({ isLoading: true });
    try {
      const users = await userService.getAllUsers();
      set({ users });
    } catch (error) {
      console.error(error);
      toast.error('Не вдалося завантажити користувачів');
    } finally {
      set({ isLoading: false });
    }
  },

  createUser: async (data) => {
    try {
      const password = await userService.createFullUser(data);
      await get().fetchUsers();
      return password;
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Невідома помилка";
      console.error(errorMessage);
      if (errorMessage === 'auth/email-already-in-use') {
        throw new Error('Цей email вже зайнятий');
      }
      throw new Error('Помилка створення користувача');
    }
  },

  deleteUser: async (userId) => {
    try {
      await userService.deleteUserDoc(userId);
      set((state) => ({
        users: state.users.filter((u) => u.uid !== userId)
      }));
      toast.success('Користувача видалено з БД');
    } catch (error) {
      console.error(error);
      toast.error('Помилка видалення');
    }
  },

  updateUserRole: async (userId, newRole) => {
    try {
      await userService.updateUserRole(userId, newRole);
      set((state) => ({
        users: state.users.map((u) => 
          u.uid === userId ? { ...u, role: newRole } : u
        )
      }));
      toast.success('Роль користувача оновлено');
    } catch (error) {
      console.error(error);
      toast.error('Не вдалося змінити роль');
    }
  }
}));