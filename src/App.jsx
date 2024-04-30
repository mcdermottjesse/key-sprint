import React, { useEffect, useState } from "react";
import "./App.css";

export default function App() {
  const [typedKey, setTypedKey] = useState("");
  const [trackKeyIndex, setTrackKeyIndex] = useState(1);
  const [errorIndexes, setErrorIndexes] = useState([]);
  const [wordErrorArray, setWordErrorArray] = useState([]);
  const [spaceErrorIndexes, setSpaceErrorIndexes] = useState([]);
  const [sentence, setSentence] = useState(
    "the curious cat quietly explores the mysterious garden sniffing at every flower and chasing butterflies in the warm sunlight  "
  );
  const [correctWordCount, setCorrectWordCount] = useState(0);
  const [allWordCount, setAllWordCount] = useState(0);

  const nextLetterIndex = typedKey.length;
  const currentLetter = sentence[nextLetterIndex];
  const lastErrorIndex = errorIndexes[errorIndexes.length - 1];
  const wordArray = sentence.split(" ").filter(Boolean); // Removes empty strings from array.
  const previousLetter = sentence[nextLetterIndex - 1];
  const currentWord = wordArray[allWordCount];

  useEffect(() => {
    const handleKeyPress = (event) => {
      // Handle Shift and Tab. Display message if caps lock.

      if (currentLetter === " " && event.key === " ") {
        endOfWord();
      }
      if (event.key === currentLetter) {
        // Counts the correctly typed words.
        handleCorrectKey(currentLetter, wordArray, currentWord);
      } else if (event.key === "Backspace") {
        handleBackspace(
          nextLetterIndex,
          lastErrorIndex,
          previousLetter,
          currentWord,
          currentLetter
        );
      } else if (currentLetter === " " && event.key !== " ") {
        // If a letter is typed instead of a space, display the letter.
        handleSpaceError(event.key, nextLetterIndex, currentWord);
      } else {
        handleIncorrectLetter(currentLetter, nextLetterIndex, currentWord);
      }
    };

    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [typedKey, correctWordCount, trackKeyIndex, allWordCount]);

  function endOfWord() {
    setAllWordCount((prevAllWordCount) => prevAllWordCount + 1);
    setTrackKeyIndex(0);
  }

  function handleCorrectKey(currentLetter, wordArray, currentWord) {
    setTypedKey((prevTypedKey) => prevTypedKey + currentLetter);

    setTrackKeyIndex((prevTrackKeyIndex) => prevTrackKeyIndex + 1);

    if (
      currentLetter !== " " &&
      !filterUndefinedElements(wordErrorArray).includes(currentWord)
    ) {
      const updatedArray = wordArray.filter(
        (word) => !wordErrorArray.includes(word)
      );

      const correctCurrentWord = updatedArray[correctWordCount];

      if (
        filterUndefinedElements(wordErrorArray).length > 0 &&
        correctCurrentWord.length === trackKeyIndex
      ) {
        setCorrectWordCount((prevCorrectWordCount) => prevCorrectWordCount + 1);
      }
      if (
        filterUndefinedElements(wordErrorArray).length === 0 &&
        correctCurrentWord.length === trackKeyIndex
      ) {
        setCorrectWordCount((prevCorrectWordCount) => prevCorrectWordCount + 1);
      }
    }
  }

  function handleBackspace(
    nextLetterIndex,
    lastErrorIndex,
    previousLetter,
    currentWord,
    currentLetter
  ) {
    setTypedKey((prevTypedKey) => prevTypedKey.slice(0, -1));

    if (currentLetter === " ") {
      setTrackKeyIndex(currentWord.length);
    }

    if (nextLetterIndex - 1 === lastErrorIndex) {
      setErrorIndexes((prevErrorIndexes) => prevErrorIndexes.slice(0, -1));
      setWordErrorArray((prevWordErrorArray) =>
        prevWordErrorArray.slice(0, -1)
      );

      if (currentLetter === " ") {
        if (currentWordInError(wordErrorArray).length === 1) {
          setCorrectWordCount(
            (prevCorrectWordCount) => prevCorrectWordCount + 1
          );
        }
      } else {
        setTrackKeyIndex((prevTrackKeyIndex) => prevTrackKeyIndex - 1);
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
    }

    if (
      currentLetter === " " &&
      !filterUndefinedElements(wordErrorArray).includes(currentWord)
    ) {
      setCorrectWordCount((prevCorrectWordCount) => prevCorrectWordCount - 1);
    }

    if (trackKeyIndex > 1 && currentLetter !== " ") {
      setTrackKeyIndex((prevTrackKeyIndex) => prevTrackKeyIndex - 1);
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

    if (
      correctWordCount > 0 &&
      currentWordInError(wordErrorArray).length === 0
    ) {
      setCorrectWordCount((prevCorrectWordCount) => prevCorrectWordCount - 1);
    }

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

    setTrackKeyIndex((prevTrackKeyIndex) => prevTrackKeyIndex + 1);

    setWordErrorArray((prevWordErrorArray) => [
      ...prevWordErrorArray,
      filterUndefinedElements(wordErrorArray).length === 0 ||
      filterUndefinedElements(wordErrorArray).some((string) =>
        prevWordErrorArray.includes(string)
      )
        ? currentWord
        : null,
    ]);
  }

  function filterUndefinedElements(wordErrorArray) {
    return wordErrorArray.filter((element) => element !== undefined);
  }

  // Return the wordErrorArray just with the current word if it has incorrect letter/s.
  function currentWordInError(wordErrorArray) {
    return filterUndefinedElements(wordErrorArray).filter(
      (wordError) => wordError === currentWord
    );
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
