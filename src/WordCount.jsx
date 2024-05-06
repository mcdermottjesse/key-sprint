export default function WordCount({ count, showWordCount }) {
  return showWordCount && <div className="word-counter">{count}</div>;
}
