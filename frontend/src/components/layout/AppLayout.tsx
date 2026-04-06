import type { ReactNode } from 'react';
import { Header } from './Header';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="relative min-h-screen">
      {/* 배경 장식 오브 - 글라스모피즘 강화 */}
      <div aria-hidden className="pointer-events-none">
        <div className="bg-orb w-[500px] h-[500px] top-[-120px] right-[-80px] bg-orange-200 opacity-45" />
        <div className="bg-orb w-[400px] h-[400px] bottom-[10%] left-[-100px] bg-amber-200 opacity-35" />
        <div className="bg-orb w-[300px] h-[300px] top-[40%] left-[30%] bg-yellow-100 opacity-25" />
        <div className="bg-orb w-[250px] h-[250px] top-[20%] left-[10%] bg-rose-100 opacity-20" />
      </div>

      <Header />

      <main className="pt-20 pb-12 px-4 max-w-6xl mx-auto">
        {children}
      </main>
    </div>
  );
}
