'use client';

import { useState, useEffect } from 'react';

interface TypingEffectProps {
    text: string;
    speed?: number;
    onComplete?: () => void;
    onUpdate?: (text: string) => void;
}

export function TypingEffect({ text, speed = 30, onComplete, onUpdate }: TypingEffectProps) {
    const [displayedText, setDisplayedText] = useState('');
    const words = text.split(' ');
    const [currentWordIndex, setCurrentWordIndex] = useState(0);

    useEffect(() => {
        if (currentWordIndex < words.length) {
            const timeout = setTimeout(() => {
                const newText = displayedText + (displayedText ? ' ' : '') + words[currentWordIndex];
                setDisplayedText(newText);
                if (onUpdate) {
                    onUpdate(newText);
                }
                setCurrentWordIndex(prev => prev + 1);
            }, speed);

            return () => clearTimeout(timeout);
        } else if (onComplete) {
            onComplete();
        }
    }, [currentWordIndex, words, speed, onComplete, onUpdate, displayedText]);

    return <>{displayedText}</>;
} 