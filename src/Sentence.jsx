import React, { useEffect, useState, useRef } from "react";

export default function Sentence({
  sentence,
  errorIndexes,
  spaceErrorIndexes,
  typedKey,
  allWordCount,
}) {
  const containerRef = useRef(null);

  const [wordCountForScroll, setWordCountForScroll] = useState(0);
  const [prevAllWordCount, setPrevAllWordCount] = useState(allWordCount);

  // Handle auto scroll.
  // Would be better to use the width instead to handle this.
  useEffect(() => {
    if (allWordCount > prevAllWordCount && allWordCount > 12) {
      setWordCountForScroll(
        (prevWordCountForScroll) => prevWordCountForScroll + 1
      );
    }

    if (allWordCount < prevAllWordCount && allWordCount < 80) {
      setWordCountForScroll((prevWordCountForScroll) =>
        Math.max(0, prevWordCountForScroll - 1)
      );

      const container = containerRef.current;
      container.scrollTop -= 4;
    }

    setPrevAllWordCount(allWordCount);

    if (wordCountForScroll === 13) {
      const container = containerRef.current;
      container.scrollTop += allWordCount;
      setWordCountForScroll(1);
    }
  }, [allWordCount]);

  const cursorIndex = typedKey.replace(/\s/g, " ").length;

  return (
    <div className="main-text" ref={containerRef}>
      {sentence.split("").map((letter, index) => {
        const isError = errorIndexes.includes(index);
        const isSpaceError = spaceErrorIndexes.includes(index);
        const typedCharacter = typedKey.charAt(index);

        const isCursor = index === cursorIndex;

        let className = "neutral-highlight";

        if (isCursor) {
          className = "cursor";
        }

        if (index < typedKey.length) {
          className = isError ? "error-highlight" : "success-highlight";
        }

        return (
          <span key={index} className={className}>
            {(isSpaceError && typedCharacter) || letter}
          </span>
        );
      })}
    </div>
  );
}
