// Diretiva do Next.js para Client Component, pois usa useState e useEffect.
'use client';

import { useState, useEffect } from 'react';

/**
 * Props para o componente TypingEffect.
 * @typedef {object} TypingEffectProps
 * @property {string} text - O texto completo que deve ser exibido com o efeito.
 * @property {number} [speed=30] - Velocidade do efeito em milissegundos entre cada *palavra*. Default é 30ms.
 * @property {() => void} [onComplete] - Callback opcional chamado quando todo o texto foi exibido.
 * @property {(text: string) => void} [onUpdate] - Callback opcional chamado a cada atualização (adição de uma palavra) do texto exibido. Recebe o texto atual.
 */
interface TypingEffectProps {
    text: string;
    speed?: number; // Velocidade em ms entre as palavras
    onComplete?: () => void; // Callback ao finalizar
    onUpdate?: (text: string) => void; // Callback a cada atualização
}

/**
 * Componente que simula um efeito de digitação, exibindo um texto
 * palavra por palavra em um intervalo de tempo configurável.
 *
 * @component
 * @param {TypingEffectProps} props - As propriedades do componente.
 * @returns {JSX.Element} Um fragmento React contendo o texto exibido progressivamente.
 */
export function TypingEffect({ text, speed = 30, onComplete, onUpdate }: TypingEffectProps) {
    // Estado para armazenar a parte do texto que já foi "digitada" e está visível.
    const [displayedText, setDisplayedText] = useState('');
    // Divide o texto completo em um array de palavras. O efeito opera sobre este array.
    const words = text.split(' ');
    // Estado para rastrear o índice da próxima palavra a ser adicionada ao `displayedText`.
    const [currentWordIndex, setCurrentWordIndex] = useState(0);

    /**
     * Efeito principal que controla a lógica do "typing".
     * Roda sempre que `currentWordIndex` ou outras dependências mudarem.
     */
    useEffect(() => {
        // Verifica se ainda há palavras a serem adicionadas.
        if (currentWordIndex < words.length) {
            // Configura um timeout para adicionar a próxima palavra após o `speed` definido.
            const timeout = setTimeout(() => {
                // Constrói o novo texto: texto atual + espaço (se não for a primeira palavra) + próxima palavra.
                const newText = displayedText + (displayedText ? ' ' : '') + words[currentWordIndex];
                // Atualiza o estado com o novo texto visível.
                setDisplayedText(newText);
                // Chama o callback onUpdate (se existir) com o texto atualizado.
                if (onUpdate) {
                    onUpdate(newText);
                }
                // Incrementa o índice para processar a próxima palavra na próxima execução do efeito.
                setCurrentWordIndex(prev => prev + 1);
            }, speed);

            // Função de limpeza: Cancela o timeout se o componente for desmontado
            // ou se as dependências mudarem antes do timeout completar. Essencial para evitar leaks.
            return () => clearTimeout(timeout);
        } else if (onComplete) {
            // Se todas as palavras já foram processadas (`currentWordIndex` >= `words.length`),
            // chama o callback onComplete (se existir).
            onComplete();
        }
        // Dependências do efeito:
        // - currentWordIndex: Para re-executar quando uma palavra é adicionada.
        // - words: Se o texto original mudar (embora menos comum para props).
        // - speed, onComplete, onUpdate: Se essas funções/valores mudarem.
        // - displayedText: Para garantir que a construção de `newText` use o valor mais recente.
    }, [currentWordIndex, words, speed, onComplete, onUpdate, displayedText]);

    // Renderiza apenas o texto que está atualmente no estado `displayedText`.
    // Usa um Fragment (<>) pois não precisa de um elemento DOM extra envolvendo o texto.
    return <>{displayedText}</>;
}