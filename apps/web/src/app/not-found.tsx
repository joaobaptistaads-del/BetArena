'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function NotFound() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/');
    }, 2000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-white">404</h1>
      <p className="text-slate-400 mt-4">Página não encontrada</p>
      <p className="text-slate-500 mt-2">Redirecionando...</p>
    </div>
  );
}
