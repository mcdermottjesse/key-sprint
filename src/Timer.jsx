import React, { useEffect, useState } from "react";

export default function Timer({ handleShowWordCount }) {
  const [countDown, setCountdown] = useState(30);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCountdown((prevCountDown) => prevCountDown - 1);
    }, 1000);

    if (countDown <= 0) {
      handleShowWordCount();
    }

    return () => {
      clearTimeout(timer);
    };
  }, [countDown]);

  return <div className="timer">{countDown >= 0 && countDown}</div>;
}
