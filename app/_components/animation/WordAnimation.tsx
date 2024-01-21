import React, { useState, useEffect } from 'react';

type Props = {
    text: string,
    delay: number
}

export const WordByWordRenderer = ({ text, delay }: Props) => {
    const [displayedWords, setDisplayedWords] = useState<string[]>([]);
    const words = text.split(' ');

    useEffect(() => {
        if (words.length > 0) {
            const interval = setInterval(() => {
                setDisplayedWords(currentWords => {
                    const nextWordIndex = currentWords.length;
                    if (nextWordIndex < words.length) {
                        return [...currentWords, words[nextWordIndex]];
                    } else {
                        clearInterval(interval);
                        return currentWords;
                    }
                });
            }, delay);

            return () => clearInterval(interval);
        }
    }, [words, delay]);

    return (
        <div className='text-white text-lg font-medium'>
            {displayedWords.join(' ')}
        </div>
    );
};
