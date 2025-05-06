// Diretiva do Next.js (App Router) que marca este como um Client Component.
// Isso permite o uso de hooks como useState e useEffect no navegador.
'use client';

import { useState, useEffect } from 'react';

/**
 * Componente que exibe uma saudação dinâmica baseada na hora atual
 * e o horário formatado (HH:MM).
 * A mensagem e a hora são atualizadas automaticamente a cada minuto.
 *
 * @component
 * @returns {JSX.Element} O elemento JSX que renderiza a saudação e a hora.
 */
export function DinamicMessage() {
    // Estado para armazenar a mensagem de saudação dinâmica (ex: "Bom dia!").
    const [greeting, setGreeting] = useState<string>('');
    // Estado para armazenar a hora atual formatada (ex: "09:30").
    const [currentTime, setCurrentTime] = useState<string>('');

    /**
     * Efeito que executa após a montagem inicial do componente (devido ao array de dependências vazio []).
     * Responsável por:
     * 1. Definir a saudação e hora iniciais chamando `updateGreeting`.
     * 2. Configurar um intervalo (`setInterval`) para chamar `updateGreeting` a cada minuto.
     * 3. Retornar uma função de limpeza (`clearInterval`) que remove o intervalo quando
     *    o componente é desmontado, evitando vazamentos de memória e execuções desnecessárias.
     */
    useEffect(() => {
        // Função interna que calcula e atualiza a saudação e a hora nos estados correspondentes.
        const updateGreeting = () => {
            const now = new Date(); // Obtém a data e hora atuais.
            const hours = now.getHours(); // Extrai a hora (0-23).
            const minutes = now.getMinutes(); // Extrai os minutos (0-59).

            // Atualiza o estado `currentTime`.
            // Formata a hora e os minutos para sempre terem dois dígitos (ex: 09:05).
            setCurrentTime(
                `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
            );

            // Define a saudação apropriada no estado `greeting` com base na hora atual.
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
                // Para qualquer outro horário (22:00 - 04:59)
                setGreeting('Hora de dormir');
            }
        };

        // Chama a função uma vez imediatamente após a montagem para definir os valores iniciais.
        updateGreeting();

        // Configura um intervalo para executar `updateGreeting` repetidamente a cada 60000ms (1 minuto).
        const interval = setInterval(updateGreeting, 60000);

        // Função de limpeza: é executada quando o componente vai ser desmontado.
        // Essencial para parar o intervalo e evitar que ele continue rodando indefinidamente.
        return () => clearInterval(interval);
    }, []); // O array de dependências vazio assegura que o efeito rode apenas uma vez na montagem.

    // Renderização do componente JSX.
    return (
        // Container principal com layout flex, centralização e padding responsivo.
        <div className="flex flex-col items-center justify-center text-center p-2 sm:p-4">
            {/* Título principal exibindo a saudação dinâmica. Tamanho da fonte responsivo. */}
            <h1 className="font-bold text-3xl sm:text-4xl md:text-5xl break-words">{greeting}</h1>
            {/* Parágrafo exibindo a hora atual formatada. */}
            <p className="text-gray-400 text-sm sm:text-base">Agora são {currentTime}</p>
        </div>
    )
}