import React, { useEffect, useState } from "react";
import "./App.css";

export default function App() {
  const [typedKey, setTypedKey] = useState("");
  const [trackKeyIndex, setTrackKeyIndex] = useState(1);
  const [errorIndexes, setErrorIndexes] = useState([]);
  // Not needed, as wordIndex replaces what this does.
  const [wordErrorArray, setWordErrorArray] = useState([]);
  const [spaceErrorIndexes, setSpaceErrorIndexes] = useState([]);
  const [sentence, setSentence] = useState(
    "the curious cat quietly explores the mysterious garden at every flower and chasing butterflies in the warm sunlight  "
  );
  const [correctWordCount, setCorrectWordCount] = useState(0);
  const [allWordCount, setAllWordCount] = useState(0);
  const [trackKeyCount, setTrackKeyCount] = useState([0]);
  // Rename as this indexes incorrect spelt words.
  const [wordIndex, setWordIndex] = useState([]);

  const nextLetterIndex = typedKey.length;
  const currentLetter = sentence[nextLetterIndex];
  const lastErrorIndex = errorIndexes[errorIndexes.length - 1];
  const sentenceArray = sentence.split(" ").filter(Boolean); // Removes empty strings from array.
  const previousLetter = sentence[nextLetterIndex - 1];
  const currentWord = sentenceArray[allWordCount];

  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [typedKey, correctWordCount, trackKeyIndex, allWordCount, trackKeyCount]);

  const handleKeyPress = (event) => {
    // Handle Shift and Tab. Display message if caps lock.

    if (currentLetter === " " && event.key === " ") {
      endOfWord();
    }
    if (event.key === currentLetter) {
      // Counts the correctly typed words.
      handleCorrectKey(currentLetter, currentWord);
    } else if (event.key === "Backspace") {
      handleBackspace(
        nextLetterIndex,
        lastErrorIndex,
        previousLetter,
        currentLetter
      );
    } else if (currentLetter === " " && event.key !== " ") {
      // If a letter is typed instead of a space, display the letter.
      handleSpaceError(event.key, nextLetterIndex, currentWord);
    } else {
      handleIncorrectLetter(currentLetter, nextLetterIndex, currentWord);
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

  const handleCorrectKey = (currentLetter, currentWord) => {
    setTypedKey((prevTypedKey) => prevTypedKey + currentLetter);

    setTrackKeyIndex((prevTrackKeyIndex) => prevTrackKeyIndex + 1);

    if (currentLetter !== " " && !wordIndex.includes(allWordCount)) {
      if (wordErrorArray.length > 0 && currentWord.length === trackKeyIndex) {
        setCorrectWordCount((prevCorrectWordCount) => prevCorrectWordCount + 1);
      }
      if (wordErrorArray.length === 0 && currentWord.length === trackKeyIndex) {
        setCorrectWordCount((prevCorrectWordCount) => prevCorrectWordCount + 1);
      }
    }
  };

  function handleBackspace(
    nextLetterIndex,
    lastErrorIndex,
    previousLetter,
    currentLetter
  ) {
    setTypedKey((prevTypedKey) => prevTypedKey.slice(0, -1));

    // Ensure trackKeyIndex does not go below one.
    setTrackKeyIndex((prevTrackKeyIndex) => Math.max(1, prevTrackKeyIndex - 1));

    if (trackKeyIndex === 1) {
      setTrackKeyIndex(Math.max(1, trackKeyCount[allWordCount]));
    }

    if (nextLetterIndex - 1 === lastErrorIndex) {
      setErrorIndexes((prevErrorIndexes) => prevErrorIndexes.slice(0, -1));
      setWordErrorArray((prevWordErrorArray) =>
        prevWordErrorArray.slice(0, -1)
      );

      setWordIndex((prevWordIndex) => prevWordIndex.slice(0, -1));

      const fliterWordIndex = wordIndex.filter(
        (index) => index === allWordCount
      );

      if (previousLetter === " " && fliterWordIndex.length === 1) {
        setCorrectWordCount((prevCorrectWordCount) => prevCorrectWordCount + 1);
      }

      if (previousLetter === " ") {
        setSentence(
          (prevSentence) =>
            prevSentence.slice(0, nextLetterIndex - 1) +
            prevSentence.slice(nextLetterIndex)
        );
      }

      return;
    }

    if (previousLetter === " ") {
      setAllWordCount((prevAllWordCount) => prevAllWordCount - 1);
      // Ensure the trackKeyCount applies to the current word.
      setTrackKeyCount((prevTrackKeyCount) => prevTrackKeyCount.slice(0, -1));
    }

    if (currentLetter === " " && !wordIndex.includes(allWordCount)) {
      setCorrectWordCount((prevCorrectWordCount) => prevCorrectWordCount - 1);
    }
  }

  function handleSpaceError(incorrectTypedKey, nextLetterIndex, currentWord) {
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

    if (correctWordCount > 0 && !wordIndex.includes(allWordCount)) {
      setCorrectWordCount((prevCorrectWordCount) => prevCorrectWordCount - 1);
    }

    setWordIndex((prevWordIndex) => [...prevWordIndex, allWordCount]);

    setTrackKeyIndex((prevTrackKeyIndex) => prevTrackKeyIndex + 1);

    setWordErrorArray((prevWordErrorArray) => [
      ...prevWordErrorArray,
      currentWord,
    ]);
  }

  function handleIncorrectLetter(currentLetter, nextLetterIndex, currentWord) {
    setTypedKey((prevTypedKey) => prevTypedKey + currentLetter);
    setErrorIndexes((prevErrorIndexes) => [
      ...prevErrorIndexes,
      nextLetterIndex,
    ]);

    setWordIndex((prevWordIndex) => [...prevWordIndex, allWordCount]);

    setTrackKeyIndex((prevTrackKeyIndex) => prevTrackKeyIndex + 1);

    // Set the wordErrorArray to contain all the incorrect spelt words.
    setWordErrorArray((prevWordErrorArray) => [
      ...prevWordErrorArray,
      currentWord,
    ]);
  }

  return (
    <div className="page">
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
  );
}
