import React, { useEffect, useState } from "react";
import "./App.css";
import CapsLock from "./CapsLock";
import Sentence from "./Sentence";
import Timer from "./Timer";
import WordCount from "./WordCount";

export default function App() {
  const [typedKey, setTypedKey] = useState("");
  const [trackKeyIndex, setTrackKeyIndex] = useState(1);
  const [errorIndexes, setErrorIndexes] = useState([]);
  const [spaceErrorIndexes, setSpaceErrorIndexes] = useState([]);
  const [sentence, setSentence] = useState("");
  const [correctWordCount, setCorrectWordCount] = useState(0);
  const [allWordCount, setAllWordCount] = useState(0);
  const [trackKeyCount, setTrackKeyCount] = useState([0]);
  const [wordErrorIndex, setWordErrorIndex] = useState([]);
  const [endOfTest, setEndOfTest] = useState(false);
  const [loading, setLoading] = useState(true);

  const nextLetterIndex = typedKey.length;
  const currentLetter = sentence[nextLetterIndex];
  const lastErrorIndex = errorIndexes[errorIndexes.length - 1];
  const sentenceArray = sentence.split(" ").filter(Boolean); // Removes empty strings from array.
  const previousLetter = sentence[nextLetterIndex - 1];
  const currentWord = sentenceArray[allWordCount];
  const noErrorInWord = !wordErrorIndex.includes(allWordCount);

  const fetchData = async () => {
    try {
      const response = await fetch(
        "https://random-word-api.vercel.app/api?words=100&length=5"
      );
      const data = await response.json();
      setSentence(data.join(" "));
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    // Prevent further typing when the test ends.
    if (!endOfTest && !loading) {
      document.addEventListener("keydown", handleKeyPress);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [trackKeyIndex, endOfTest, loading]);

  const handleKeyPress = (event) => {
    switch (event.key) {
      case " ":
        // Prevent spacebar from scrolling down.
        event.preventDefault();
        currentLetter === " " ? endOfWord() : handleIncorrectLetter();
        break;
      case currentLetter:
        // Counts the correctly typed words.
        handleCorrectKey();

        break;
      case "Backspace":
        handleBackspace();
        break;
      default:
        const isLetter = /^[a-z]$/;
        if (isLetter.test(event.key)) {
          // If a letter is typed instead of a space, display the letter.
          // Only display the letter once to help manage the autoscroll state.
          if (currentLetter === " " && trackKeyIndex < currentWord.length + 2) {
            handleSpaceError(event.key);
          }
          if (trackKeyIndex < currentWord.length + 1) {
            handleIncorrectLetter();
          }
          break;
        }
    }
  };

  const endOfWord = () => {
    setTypedKey((prevTypedKey) => prevTypedKey + currentLetter);
    setAllWordCount((prevAllWordCount) => prevAllWordCount + 1);
    setTrackKeyCount((prevTrackKeyCount) => [
      ...prevTrackKeyCount,
      trackKeyIndex,
    ]);
    setTrackKeyIndex(1);
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

  const handleEndOfTest = () => {
    setEndOfTest(true);
    // As the test is 30 seconds long, we want to ensure the word count is based on WPM.
    // If the last word is atleast half completed it counts as one word.
    if (
      noErrorInWord &&
      currentLetter !== " " &&
      trackKeyIndex * 2 > currentWord.length + 1
    ) {
      setCorrectWordCount((prevCorrectWordCount) => prevCorrectWordCount + 0.5);
    }
  };

  const newTest = () => {
    // Reset the state when a test is reset.
    setLoading(true);
    setTypedKey("");
    setTrackKeyIndex(1);
    setErrorIndexes([]);
    setSpaceErrorIndexes([]);
    fetchData();
    setCorrectWordCount(0);
    setAllWordCount(0);
    setTrackKeyCount([0]);
    setWordErrorIndex([]);
    setEndOfTest(false);
  };

  return (
    <div className="page">
      <div className="logo">
        <img className="logo-icon" src="/keyboard.svg" alt="keyboard" />
        <div className="logo-text">key sprint</div>
      </div>
      {!loading &&
        (!endOfTest ? (
          <>
            <CapsLock />
            <div className="text-container">
              <Timer handleEndOfTest={handleEndOfTest} />
              <Sentence
                sentence={sentence}
                errorIndexes={errorIndexes}
                spaceErrorIndexes={spaceErrorIndexes}
                typedKey={typedKey}
                allWordCount={allWordCount}
              />
              <div
                className="cursor"
                style={{ left: `${nextLetterIndex * 10}px` }}
              ></div>
              <div className="button-container">
                <button className="main-button" onClick={newTest}>
                  <img
                    className="restart-icon"
                    src="/arrows-rotate.svg"
                    alt="reset"
                  />
                </button>
                <div className="main-hover-text">restart test</div>
              </div>
            </div>
            <div className="restart-message">
              <div className="restart-hint">quick restart:</div>
              <div className="restart-shortcut">tab + enter</div>
            </div>
          </>
        ) : (
          <WordCount onClose={newTest} count={correctWordCount} />
        ))}
    </div>
  );
}
