export default function Sentence({
  sentence,
  errorIndexes,
  spaceErrorIndexes,
  typedKey,
}) {
  return (
    <div className="main-text">
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
