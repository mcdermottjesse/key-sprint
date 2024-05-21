import { useState } from "react";

export default function WordCount({ onClose, correctWordCount, allWordCount }) {
  const [close, setClose] = useState(false);

  const handlePopUp = () => {
    setClose(true);
    onClose();
  };

  const typingAccuracy = () => {
    let accuracy = (correctWordCount / allWordCount) * 100;
    accuracy = Math.round(Math.min(accuracy, 100));
    return `Accuracy: ${accuracy}%`;
  };

  return (
    !close && (
      // As the test is 30 seconds long, we want to ensure the word count is based on WPM.
      <div className="popup">
        <div className="word-counter">{correctWordCount * 2} WPM</div>
        <div className="accuracy">{typingAccuracy()}</div>
        <button className="secondary-button" onClick={handlePopUp}>
          <img
            className="secondary-restart-icon"
            src="/key-sprint/arrows-rotate.svg"
            alt="restart-icon"
          />
        </button>
        <div className="hover-text">restart test</div>
      </div>
    )
  );
}
