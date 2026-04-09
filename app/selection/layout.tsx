import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Seleção de Subáreas - Coretech',
  description: 'Fluxo de seleção de subáreas e artigos',
};

export default function SelectionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950">
      {children}
    </div>
  );
}
