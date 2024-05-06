export default function WordCount({ count, showWordCount }) {
  return (
    showWordCount && (
      <div className="popup">
        <div className="word-counter">Your WPM: {count}</div>
      </div>
    )
  );
}
