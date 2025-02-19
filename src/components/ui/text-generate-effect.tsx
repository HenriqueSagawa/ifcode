"use client";
import { useEffect, useState } from "react";

export const TextGenerateEffect = ({
  words,
  className = "",
}: {
  words: string;
  className?: string;
}) => {
  const [displayText, setDisplayText] = useState("");
  
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i <= words.length) {
        setDisplayText(words.slice(0, i));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [words]);

  return <p className={className}>{displayText}</p>;
}; 