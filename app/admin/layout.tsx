import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin - Coretech Subdivision',
  description: 'Painel de administração da seleção de sub-áreas',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
