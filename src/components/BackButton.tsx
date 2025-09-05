'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BackButtonProps {
  className?: string;
  variant?: 'default' | 'outline' | 'ghost' | 'link' | 'destructive' | 'secondary';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  children?: React.ReactNode;
  fallbackUrl?: string;
}

export function BackButton({ 
  className, 
  variant = 'outline', 
  size = 'default',
  children = 'Voltar',
  fallbackUrl = '/'
}: BackButtonProps) {
  const router = useRouter();

  const handleBack = () => {
    // Verifica se há histórico no navegador
    if (window.history.length > 1) {
      router.back();
    } else {
      // Se não há histórico, redireciona para a URL de fallback
      router.push(fallbackUrl);
    }
  };

  return (
    <Button
      onClick={handleBack}
      variant={variant}
      size={size}
      className={cn(
        'flex items-center gap-2 transition-all duration-200 hover:scale-105',
        className
      )}
    >
      <ArrowLeft className="h-4 w-4" />
      {children}
    </Button>
  );
}
