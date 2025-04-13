'use client';

import { useState, useEffect } from 'react';

export function DinamicMessage() {
    const [greeting, setGreeting] = useState<string>('');
    const [currentTime, setCurrentTime] = useState<string>('');

    useEffect(() => {
        const updateGreeting = () => {
            const now = new Date();
            const hours = now.getHours();
            const minutes = now.getMinutes();

            setCurrentTime(
                `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
            );

            if (hours >= 5 && hours < 9) {
                setGreeting('Hora do café');
            } else if (hours >= 9 && hours < 12) {
                setGreeting('Bom dia! Tenha um ótimo trabalho');
            } else if (hours >= 12 && hours < 13) {
                setGreeting('Vamos almoçar');
            } else if (hours >= 13 && hours < 16) {
                setGreeting('Boa tarde! Hora de produzir');
            } else if (hours >= 16 && hours < 18) {
                setGreeting('Quase fim de expediente');
            } else if (hours >= 18 && hours < 22) {
                setGreeting('Boa noite! Hora de descansar');
            } else {
                setGreeting('Hora de dormir');
            }
        };

        updateGreeting();

        const interval = setInterval(updateGreeting, 60000);

        return () => clearInterval(interval);
    }, [])

    return (
        <div className="flex flex-col items-center justify-center text-center p-2 sm:p-4">
            <h1 className="font-bold text-3xl sm:text-4xl md:text-5xl break-words">{greeting}</h1>
            <p className="text-gray-400 text-sm sm:text-base">Agora são {currentTime}</p>
        </div>
    )
}