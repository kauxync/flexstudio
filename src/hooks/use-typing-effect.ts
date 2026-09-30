"use client";

import { useState, useEffect, useCallback } from "react";

interface UseTypingEffectOptions {
  words: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
  loop?: boolean;
}

export function useTypingEffect({
  words,
  typingSpeed = 80,
  deletingSpeed = 50,
  pauseDuration = 2000,
  loop = true,
}: UseTypingEffectOptions) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const tick = useCallback(() => {
    const currentWord = words[currentWordIndex];

    if (isPaused) return;

    if (!isDeleting) {
      setCurrentText(currentWord.substring(0, currentText.length + 1));

      if (currentText === currentWord) {
        setIsPaused(true);
        setTimeout(() => {
          setIsPaused(false);
          setIsDeleting(true);
        }, pauseDuration);
      }
    } else {
      setCurrentText(currentWord.substring(0, currentText.length - 1));

      if (currentText === "") {
        setIsDeleting(false);
        setCurrentWordIndex((prev) => (prev + 1) % words.length);
      }
    }
  }, [currentText, isDeleting, isPaused, currentWordIndex, words, pauseDuration]);

  useEffect(() => {
    if (!loop && currentWordIndex === words.length - 1 && currentText === words[words.length - 1] && !isDeleting) {
      return;
    }

    const speed = isDeleting ? deletingSpeed : typingSpeed;
    const timer = setTimeout(tick, speed);
    return () => clearTimeout(timer);
  }, [tick, isDeleting, typingSpeed, deletingSpeed, loop, currentWordIndex, words, currentText]);

  return { currentText, currentWordIndex, isDeleting, isPaused };
}
