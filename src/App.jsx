import React, { useEffect, useState } from "react";
import "./App.css";

export default function App() {
  const [typedKey, setTypedKey] = useState("");
  const [trackKeyIndex, setTrackKeyIndex] = useState(1);
  const [errorCount, setErrorCount] = useState(0);
  const [errorIndexes, setErrorIndexes] = useState([]);
  const [wordErrorArray, setWordErrorArray] = useState([]);
  const [spaceErrorIndexes, setSpaceErrorIndexes] = useState([]);
  const [sentence, setSentence] = useState("type anything key only keyboard ");
  const [correctWordCount, setCorrectWordCount] = useState(0);
  const [allWordCount, setAllWordCount] = useState(0);

  useEffect(() => {
    const handleKeyPress = (event) => {
      const nextLetterIndex = typedKey.length;
      const currentLetter = sentence[nextLetterIndex];
      const lastErrorIndex = errorIndexes[errorIndexes.length - 1];
      const wordArray = sentence.split(" ");
      const previousLetter = sentence[nextLetterIndex - 1];
      const currentWord = wordArray[allWordCount];
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
        handleSpaceError(event.key, nextLetterIndex);
      } else {
        handleIncorrectLetter(currentLetter, nextLetterIndex, currentWord);
      }
    };

    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [typedKey, correctWordCount, trackKeyIndex, allWordCount, errorCount]);

  function endOfWord() {
    setAllWordCount((prevAllWordCount) => prevAllWordCount + 1);
    setTrackKeyIndex(1);
  }

  function handleCorrectKey(currentLetter, wordArray, currentWord) {
    setTypedKey((prevTypedKey) => prevTypedKey + currentLetter);

    if (
      currentLetter !== " " &&
      !filterUndefinedElements(wordErrorArray).includes(currentWord)
    ) {
      setTrackKeyIndex((prevTrackKeyIndex) => prevTrackKeyIndex + 1);
      const updatedArray = wordArray.filter(
        (word) => !wordErrorArray.includes(word)
      );

      const currentWord = updatedArray[correctWordCount];

      if (
        filterUndefinedElements(wordErrorArray).length > 0 &&
        currentWord?.length === trackKeyIndex
      ) {
        setCorrectWordCount((prevCorrectWordCount) => prevCorrectWordCount + 1);
      }
      if (
        filterUndefinedElements(wordErrorArray).length === 0 &&
        currentWord.length === trackKeyIndex
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

    // Return the wordErrorArray of the current word if it has an incorrect letter/s.
    const currentWordInError = filterUndefinedElements(wordErrorArray).filter(
      (wordError) => wordError === currentWord
    );

    if (previousLetter === " ") {
      setAllWordCount((prevAllWordCount) => prevAllWordCount - 1);
    }

    if (currentLetter === " ") {
      setTrackKeyIndex(currentWord.length - currentWordInError.length + 1);
    }

    if (nextLetterIndex - 1 === lastErrorIndex) {
      setErrorIndexes((prevErrorIndexes) => prevErrorIndexes.slice(0, -1));
      setWordErrorArray((prevWordErrorArray) =>
        prevWordErrorArray.slice(0, -1)
      );
      setErrorCount((prevErrorCount) => prevErrorCount - 1);
      return;
    }

    if (currentLetter !== " " && trackKeyIndex > 1) {
      setTrackKeyIndex((prevTrackKeyIndex) => prevTrackKeyIndex - 1);
      return;
    }

    if (correctWordCount > 0 && currentLetter === " ") {
      setTrackKeyIndex(currentWord.length - currentWordInError.length);
      if (!filterUndefinedElements(wordErrorArray).includes(currentWord)) {
        setCorrectWordCount((prevCorrectWordCount) => prevCorrectWordCount - 1);
      }
    }

    // setTypedKey((prevTypedKey) => prevTypedKey.slice(0, -1));
    // console.log("trackKeyIndex IN BACKSPACE", trackKeyIndex);
    // console.log("wordArray[allWordCount]IN BACKSPACE", wordArray[allWordCount]);
    // setTrackKeyIndex(wordArray[allWordCount].length);
    // if (previousLetter === " ") {
    //   //   console.log("nextLetterIndex", nextLetterIndex);
    //   //   console.log("lastErrorIndex", lastErrorIndex);
    //   // setAllWordCount((prevAllWordCount) => prevAllWordCount - 1);
    //   //   // setTrackKeyIndex(wordArray[allWordCount - 1].length - 1);
    //   //   // setTrackKeyIndex(wordArray[correctWordCount - 1]?.length - 1);
    // }
    // if (nextLetterIndex - 1 === lastErrorIndex) {
    //   setErrorIndexes((prevErrorIndexes) => prevErrorIndexes.slice(0, -1));
    //   // if (trackKeyIndex > 0) {
    //   //   console.log("FOOOOOOO");
    //   //   setTrackKeyIndex((prevTrackKeyIndex) => prevTrackKeyIndex - 1);
    //   // }
    //   setWordErrorArray((prevWordErrorArray) =>
    //     prevWordErrorArray.slice(0, -1)
    //   );
    //   if (errorCount > 0) {
    //     setErrorCount((prevErrorCount) => prevErrorCount - 1);
    //   }
    //   if (previousLetter === " ") {
    //     setSentence(
    //       (prevSentence) =>
    //         prevSentence.slice(0, nextLetterIndex - 1) +
    //         prevSentence.slice(nextLetterIndex)
    //     );
    //   }
    // } else {
    //   if (previousLetter !== " ") {
    //     if (trackKeyIndex > 0) {
    //       console.log("IN IF bspace");
    //       setTrackKeyIndex((prevTrackKeyIndex) => prevTrackKeyIndex - 1);
    //     } else if (correctWordCount > 0 && errorCount === 0) {
    //       console.log("IN ELSE IF bspace");
    //       setTrackKeyIndex(wordArray[correctWordCount - 1]?.length - 1);
    //       setCorrectWordCount(
    //         (prevCorrectWordCount) => prevCorrectWordCount - 1
    //       );
    //     }
    //   }
    // }
  }

  function handleSpaceError(incorrectTypedKey, nextLetterIndex) {
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
  }

  function handleIncorrectLetter(currentLetter, nextLetterIndex, currentWord) {
    setTypedKey((prevTypedKey) => prevTypedKey + currentLetter);
    setErrorIndexes((prevErrorIndexes) => [
      ...prevErrorIndexes,
      nextLetterIndex,
    ]);

    setErrorCount((prevErrorCount) => prevErrorCount + 1);

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
  return (
    <>
      <div>
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
                  : "other"
              }
            >
              {(isSpaceError && typedCharacter) || letter}
            </span>
          );
        })}
      </div>
      <div>{correctWordCount}</div>
    </>
  );
}
