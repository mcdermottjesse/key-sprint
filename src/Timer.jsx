import { useEffect, useState } from "react";

export default function Timer({ handleEndOfTest }) {
  const [countDown, setCountdown] = useState(30);
  const [startTimer, setStartTimer] = useState(false);

  useEffect(() => {
    let timer;

    if (startTimer) {
      timer = setTimeout(() => {
        setCountdown((prevCountDown) => Math.max(0, prevCountDown - 1));
      }, 1000);
    } else {
      document.addEventListener("keydown", handleFirstKeyPress);
    }

    if (countDown === 0) {
      handleEndOfTest();
    }

    return () => {
      clearTimeout(timer);
      // As the event listener is added conditionally this is not neccessary,
      // however still good practice to remove the listener.
      if (!startTimer) {
        document.removeEventListener("keydown", handleFirstKeyPress);
      }
    };
  }, [countDown, startTimer]);

  const handleFirstKeyPress = (event) => {
    const isLetter = /^[a-z ]$/;
    if (isLetter.test(event.key)) {
      setStartTimer(true);
    }
  };

  return <div className="timer">{countDown}</div>;
}
