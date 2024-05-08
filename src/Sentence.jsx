import React, { useEffect, useRef } from "react";

export default function Sentence({
  sentence,
  errorIndexes,
  spaceErrorIndexes,
  typedKey,
  allWordCount,
}) {
  const containerRef = useRef(null);

  // These can just be state.
  const wordCountForScroll = useRef(0);
  const prevAllWordCount = useRef(allWordCount);

  // Handle auto scroll.
  useEffect(() => {
    if (allWordCount > prevAllWordCount.current && allWordCount > 12) {
      wordCountForScroll.current++;
    }

    if (allWordCount < prevAllWordCount.current && allWordCount < 80) {
      wordCountForScroll.current = Math.max(0, wordCountForScroll.current - 1);
      const container = containerRef.current;
      container.scrollTop -= 4;
    }
    prevAllWordCount.current = allWordCount;

    if (wordCountForScroll.current === 13) {
      const container = containerRef.current;
      container.scrollTop += allWordCount;
      wordCountForScroll.current = 1;
    }
  }, [allWordCount]);

  return (
    <div className="main-text" ref={containerRef}>
      {sentence.split("").map((letter, index) => {
        const isError = errorIndexes.includes(index);
        const isSpaceError = spaceErrorIndexes.includes(index);
        const typedCharacter = typedKey.charAt(index);

        return (
          <span
            key={index}
            className={
              index < typedKey.length
                ? isError
                  ? "error-highlight"
                  : "success-highlight"
                : "neutral-highlight"
            }
          >
            {(isSpaceError && typedCharacter) || letter}
          </span>
        );
      })}
    </div>
  );
}
