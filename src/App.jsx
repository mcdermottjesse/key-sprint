import React, { useEffect, useState } from "react";
import "./App.css";

export default function App() {
  const [typedKey, setTypedKey] = useState("");
  const [trackKeyIndex, setTrackKeyIndex] = useState(1);
  const [errorIndexes, setErrorIndexes] = useState([]);
  const [wordErrorArray, setWordErrorArray] = useState([]);
  const [spaceErrorIndexes, setSpaceErrorIndexes] = useState([]);
  const [sentence, setSentence] = useState(
    "the curious cat quietly explores the mysterious garden at every flower and chasing butterflies in the warm sunlight  "
  );
  const [correctWordCount, setCorrectWordCount] = useState(0);
  const [allWordCount, setAllWordCount] = useState(0);
  const [trackKeyCount, setTrackKeyCount] = useState(1);

  const nextLetterIndex = typedKey.length;
  const currentLetter = sentence[nextLetterIndex];
  const lastErrorIndex = errorIndexes[errorIndexes.length - 1];
  const wordArray = sentence.split(" ").filter(Boolean); // Removes empty strings from array.
  const previousLetter = sentence[nextLetterIndex - 1];
  const currentWord = wordArray[allWordCount];
  const noErrorsInCurrentWord =
    !filterUndefinedElements(wordErrorArray).includes(currentWord);

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
      handleCorrectKey(currentLetter, wordArray);
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

  const endOfWord = () => {
    setAllWordCount((prevAllWordCount) => prevAllWordCount + 1);
    setTrackKeyCount(trackKeyIndex);
    setTrackKeyIndex(0);
  };

  const handleCorrectKey = (currentLetter, wordArray) => {
    setTypedKey((prevTypedKey) => prevTypedKey + currentLetter);

    console.log("trackKeyIndex", trackKeyIndex);
    console.log("currentWord.length", currentWord.length);
    console.log("trackKeyCount", trackKeyCount);
    console.log("correctWordCount", correctWordCount);

    setTrackKeyIndex((prevTrackKeyIndex) => prevTrackKeyIndex + 1);

    if (currentLetter !== " " && noErrorsInCurrentWord) {
      const wordArrayWithoutErrors = wordArray.filter(
        (word) => !wordErrorArray.includes(word)
      );

      // correctCurrentWOrd causes a bug where if a letter appears more than
      // once and is spelt incorrectly the correctCurrentWord ends up being the next word.
      const correctCurrentWord = wordArrayWithoutErrors[correctWordCount];
      console.log("correctCurrentWord", correctCurrentWord);

      if (
        filterUndefinedElements(wordErrorArray).length > 0 &&
        correctCurrentWord.length === trackKeyIndex
      ) {
        console.log("FIRST");
        setCorrectWordCount((prevCorrectWordCount) => prevCorrectWordCount + 1);
      }
      if (
        filterUndefinedElements(wordErrorArray).length === 0 &&
        correctCurrentWord.length === trackKeyIndex
      ) {
        console.log("SECOND");
        setCorrectWordCount((prevCorrectWordCount) => prevCorrectWordCount + 1);
      }
    }
  };

  function handleBackspace(
    nextLetterIndex,
    lastErrorIndex,
    previousLetter,
    currentWord,
    currentLetter
  ) {
    setTypedKey((prevTypedKey) => prevTypedKey.slice(0, -1));

    console.log("trackKeyIndex", trackKeyIndex);
    console.log("currentWord.length", currentWord.length);
    console.log("previousLetter", previousLetter);
    console.log("currentLetter", currentLetter);

    console.log("trackKeyCount", trackKeyCount);

    // Ensure trackKeyIndex does not go below one.
    setTrackKeyIndex((prevTrackKeyIndex) => Math.max(1, prevTrackKeyIndex - 1));

    if (trackKeyIndex === 1 && previousLetter !== undefined) {
      setTrackKeyIndex(trackKeyCount);
    }

    if (nextLetterIndex - 1 === lastErrorIndex) {
      setErrorIndexes((prevErrorIndexes) => prevErrorIndexes.slice(0, -1));
      setWordErrorArray((prevWordErrorArray) =>
        prevWordErrorArray.slice(0, -1)
      );

      if (trackKeyIndex > currentWord.length) {
        if (
          previousLetter === " " &&
          currentWordInError(wordErrorArray).length === 1
        ) {
          setCorrectWordCount(
            (prevCorrectWordCount) => prevCorrectWordCount + 1
          );
        }
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
      setTrackKeyCount(currentWord.length + 1);
    }

    if (currentLetter === " " && noErrorsInCurrentWord) {
      setCorrectWordCount((prevCorrectWordCount) => prevCorrectWordCount - 1);
    }
  }

  function handleSpaceError(incorrectTypedKey, nextLetterIndex, currentWord) {
    setTypedKey((prevTypedKey) => prevTypedKey + incorrectTypedKey);

    console.log("trackKeyIndex", trackKeyIndex);
    console.log("currentWord.length", currentWord.length);

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

    console.log("trackKeyIndex", trackKeyIndex);
    console.log("currentWord.length", currentWord.length);

    setTrackKeyIndex((prevTrackKeyIndex) => prevTrackKeyIndex + 1);

    // Set the wordErrorArray to contain all the incorrect spelt words.
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

  // Remove undefined values from wordErrorArray.
  function filterUndefinedElements(wordErrorArray) {
    return wordErrorArray.filter((element) => element !== undefined);
  }

  // Return the wordErrorArray just with the current word if it is spelt incorrectly.
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
