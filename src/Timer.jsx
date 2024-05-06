import React, { useEffect, useState } from "react";

export default function Timer({ handleShowWordCount }) {
  const [countDown, setCountdown] = useState(30);
  const [showTimer, setShowTimer] = useState(false);

  useEffect(() => {
    document.addEventListener("keydown", handleFirstKeyPress);

    const timer = setTimeout(() => {
      setCountdown((prevCountDown) => Math.max(0, prevCountDown - 1));
    }, 1000);

    if (countDown <= 0) {
      handleShowWordCount();
    }

    return () => {
      document.addEventListener("keydown", handleFirstKeyPress);
      clearTimeout(timer);
    };
  }, [countDown]);

  const handleFirstKeyPress = () => {
    setShowTimer(true);
  };

  return <div className="timer">{showTimer && countDown}</div>;
}
