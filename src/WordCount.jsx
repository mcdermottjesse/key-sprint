import React, { useState } from "react";
export default function WordCount({ count, onClose }) {
  const [close, setClose] = useState(false);

  const handlePopUp = () => {
    setClose(true);
    onClose();
  };

  return (
    !close && (
      <div className="popup">
        <div className="word-counter">{count} WPM</div>
        <button className="button" onClick={handlePopUp}>
          <img className="reset-icon" src="/arrows-rotate.svg" alt="reset" />
        </button>
        <div className="hover-text">reset</div>
      </div>
    )
  );
}
