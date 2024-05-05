import React, { useEffect, useState } from "react";
import "./App.css";

export default function App() {
  const [typedKey, setTypedKey] = useState("");
  const [trackKeyIndex, setTrackKeyIndex] = useState(1);
  const [errorIndexes, setErrorIndexes] = useState([]);
  const [spaceErrorIndexes, setSpaceErrorIndexes] = useState([]);
  const [sentence, setSentence] = useState(
    "the curious cat quietly explores the mysterious garden at every flower and chasing butterflies in the warm sunlight   "
  );
  const [correctWordCount, setCorrectWordCount] = useState(0);
  const [allWordCount, setAllWordCount] = useState(0);
  const [trackKeyCount, setTrackKeyCount] = useState([0]);
  const [wordErrorIndex, setWordErrorIndex] = useState([]);

  const nextLetterIndex = typedKey.length;
  const currentLetter = sentence[nextLetterIndex];
  const lastErrorIndex = errorIndexes[errorIndexes.length - 1];
  const sentenceArray = sentence.split(" ").filter(Boolean); // Removes empty strings from array.
  const previousLetter = sentence[nextLetterIndex - 1];
  const currentWord = sentenceArray[allWordCount];
  const noErrorInWord = !wordErrorIndex.includes(allWordCount);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [trackKeyIndex]);

  const handleKeyPress = (event) => {
    // Handle Shift and Tab. Display message if caps lock.
    if (currentLetter === " " && event.key === " ") {
      endOfWord();
    }
    if (event.key === currentLetter) {
      // Counts the correctly typed words.
      handleCorrectKey();
    } else if (event.key === "Backspace") {
      handleBackspace();
    } else if (currentLetter === " " && event.key !== " ") {
      // If a letter is typed instead of a space, display the letter.
      handleSpaceError(event.key);
    } else {
      handleIncorrectLetter();
    }
  };

  const endOfWord = () => {
    setAllWordCount((prevAllWordCount) => prevAllWordCount + 1);
    setTrackKeyCount((prevTrackKeyCount) => [
      ...prevTrackKeyCount,
      trackKeyIndex,
    ]);
    setTrackKeyIndex(0);
  };

  const handleCorrectKey = () => {
    setTypedKey((prevTypedKey) => prevTypedKey + currentLetter);

    setTrackKeyIndex((prevTrackKeyIndex) => prevTrackKeyIndex + 1);

    if (currentWord.length === trackKeyIndex && noErrorInWord) {
      setCorrectWordCount((prevCorrectWordCount) => prevCorrectWordCount + 1);
    }
  };

  const handleBackspace = () => {
    setTypedKey((prevTypedKey) => prevTypedKey.slice(0, -1));

    // Ensure trackKeyIndex does not go below one.
    if (trackKeyIndex === 1) {
      setTrackKeyIndex(Math.max(1, trackKeyCount[allWordCount]));
    } else {
      setTrackKeyIndex((prevTrackKeyIndex) =>
        Math.max(1, prevTrackKeyIndex - 1)
      );
    }

    if (nextLetterIndex - 1 === lastErrorIndex) {
      setErrorIndexes((prevErrorIndexes) => prevErrorIndexes.slice(0, -1));
      setWordErrorIndex((prevWordErrorIndex) =>
        prevWordErrorIndex.slice(0, -1)
      );

      if (previousLetter === " ") {
        setSentence(
          (prevSentence) =>
            prevSentence.slice(0, nextLetterIndex - 1) +
            prevSentence.slice(nextLetterIndex)
        );

        const fliterWordErrorIndex = wordErrorIndex.filter(
          (index) => index === allWordCount
        );

        if (fliterWordErrorIndex.length === 1) {
          setCorrectWordCount(
            (prevCorrectWordCount) => prevCorrectWordCount + 1
          );
        }
      }

      return;
    }

    if (previousLetter === " ") {
      setAllWordCount((prevAllWordCount) => prevAllWordCount - 1);
      setTrackKeyCount((prevTrackKeyCount) => prevTrackKeyCount.slice(0, -1));
    }

    if (currentLetter === " " && noErrorInWord) {
      setCorrectWordCount((prevCorrectWordCount) => prevCorrectWordCount - 1);
    }
  };

  const handleSpaceError = (incorrectTypedKey) => {
    setTypedKey((prevTypedKey) => prevTypedKey + incorrectTypedKey);

    const updatedSentence =
      sentence.slice(0, nextLetterIndex) +
      " " +
      sentence.slice(nextLetterIndex);

    setSentence(updatedSentence);

    setSpaceErrorIndexes((prevErrorIndexes) => [
      ...prevErrorIndexes,
      nextLetterIndex,
    ]);

    setErrorIndexes((prevErrorIndexes) => [
      ...prevErrorIndexes,
      nextLetterIndex,
    ]);

    if (correctWordCount > 0 && noErrorInWord) {
      setCorrectWordCount((prevCorrectWordCount) => prevCorrectWordCount - 1);
    }

    setWordErrorIndex((prevWordErrorIndex) => [
      ...prevWordErrorIndex,
      allWordCount,
    ]);

    setTrackKeyIndex((prevTrackKeyIndex) => prevTrackKeyIndex + 1);
  };

  const handleIncorrectLetter = () => {
    setTypedKey((prevTypedKey) => prevTypedKey + currentLetter);
    setErrorIndexes((prevErrorIndexes) => [
      ...prevErrorIndexes,
      nextLetterIndex,
    ]);

    setWordErrorIndex((prevWordErrorIndex) => [
      ...prevWordErrorIndex,
      allWordCount,
    ]);

    setTrackKeyIndex((prevTrackKeyIndex) => prevTrackKeyIndex + 1);
  };

  return (
    <div className="page">
      <div className="logo">
        <img className="logo-icon" src="/keyboard.svg" alt="Keyboard" />
        <div className="logo-text">Key Sprint</div>
      </div>
      <div className="main-text">
        <div className="words-style">
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
        <div className="word-counter">{correctWordCount}</div>
      </div>
    </div>
  );
}
