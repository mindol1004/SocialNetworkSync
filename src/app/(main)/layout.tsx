import { AppProviders } from '@components/providers/AppProviders';

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AppProviders>
      {children}
    </AppProviders>
  );
}