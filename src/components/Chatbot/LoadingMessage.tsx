'use client';

import Image from 'next/image';
import { Loader2 } from 'lucide-react';
import { Card } from "@/components/ui/card";

export function LoadingMessage() {
    return (
        <div className="flex justify-start gap-2 mb-4">
            <div className="h-8 w-8 rounded-full bg-transparent flex items-center justify-center">
            <Image src="/img/logo ifcode.png" alt="Logo" width={100} priority height={100} className="rounded-full w-full h-full" />
            </div>
            <Card className="max-w-[80%] p-3 bg-muted/50">
                <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    <p className="text-sm">Digitando...</p>
                </div>
            </Card>
        </div>
    );
} 