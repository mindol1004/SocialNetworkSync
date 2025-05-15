
'use client'

import MainLayout from '@/components/layout/MainLayout'

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <MainLayout>
      {children}
    </MainLayout>
  );
}
