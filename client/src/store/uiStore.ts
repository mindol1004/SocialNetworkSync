import { create } from 'zustand';

interface UIState {
  isMobileMenuOpen: boolean;
  isSearchOpen: boolean;
  isNotificationsOpen: boolean;
  toggleMobileMenu: () => void;
  setMobileMenuOpen: (isOpen: boolean) => void;
  toggleSearch: () => void;
  setSearchOpen: (isOpen: boolean) => void;
  toggleNotifications: () => void;
  setNotificationsOpen: (isOpen: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isMobileMenuOpen: false,
  isSearchOpen: false,
  isNotificationsOpen: false,
  
  toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
  setMobileMenuOpen: (isOpen) => set({ isMobileMenuOpen: isOpen }),
  
  toggleSearch: () => set((state) => ({ isSearchOpen: !state.isSearchOpen })),
  setSearchOpen: (isOpen) => set({ isSearchOpen: isOpen }),
  
  toggleNotifications: () => set((state) => ({ isNotificationsOpen: !state.isNotificationsOpen })),
  setNotificationsOpen: (isOpen) => set({ isNotificationsOpen: isOpen }),
}));
