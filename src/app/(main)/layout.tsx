'use client'

import MainLayout from '@/components/layout/MainLayout'
import { AuthProvider } from '@/components/providers/AuthProviders';

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <MainLayout>
        {children}
      </MainLayout>
    </AuthProvider>
  );
}
