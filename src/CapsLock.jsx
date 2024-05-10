import { useState, useEffect } from "react";

export default function CapsLock() {
  const [showCapsMessage, setShowCapsMessage] = useState(false);

  useEffect(() => {
    const handleCapsLockPress = (event) => {
      setShowCapsMessage(event.getModifierState("CapsLock"));
    };

    document.addEventListener("keydown", handleCapsLockPress);
    document.addEventListener("keyup", handleCapsLockPress);

    return () => {
      document.removeEventListener("keydown", handleCapsLockPress);
      document.removeEventListener("keyup", handleCapsLockPress);
    };
  }, []);
  return (
    showCapsMessage && (
      <div className="caps-message">
        <img className="lock-icon" src="/lock-solid.svg" alt="lock-icon" />
        Caps Lock
      </div>
    )
  );
}
