import { create } from 'zustand';
import { User as UserType } from '../types/user';

interface UserState {
  User: UserType[];
  loading: boolean;
  selectedUser: UserType | null;
  sidebarOpen: boolean;
  pageTitle: string;
  setUser: (User: UserType[]) => void;
  setLoading: (loading: boolean) => void;
  setSelectedUser: (User: UserType | null) => void;
  toggleSidebar: () => void;
  setPageTitle: (title: string) => void;
}

export const useUserStore = create<UserState>((set) => ({
  User: [],
  loading: true,
  selectedUser: null,
  sidebarOpen: true,
  pageTitle: '',
  setUser: (User) => set({ User }),
  setLoading: (loading) => set({ loading }),
  setSelectedUser: (User) => set({ selectedUser: User }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setPageTitle: (title) => set({ pageTitle: title }),
}));
