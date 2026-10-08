interface TwoToneHeadingProps {
  text: string;
  /** Optional exact trailing part of `text` that must become the accent
   *  (second, light-blue) line. Falls back to the word-midpoint split. */
  accentText?: string;
  className?: string;
}

export default function TwoToneHeading({ text, accentText, className = "" }: TwoToneHeadingProps) {
  let firstHalf: string;
  let secondHalf: string;
  if (accentText && text.endsWith(accentText)) {
    firstHalf = text.slice(0, -accentText.length).trim();
    secondHalf = accentText;
  } else {
    const words = text.split(' ');
    const midpoint = Math.ceil(words.length / 2);
    firstHalf = words.slice(0, midpoint).join(' ');
    secondHalf = words.slice(midpoint).join(' ');
  }

  return (
    <h2 className={`section-title ${className}`}>
      <span className="two-tone-heading-primary">{firstHalf}</span>{" "}
      <span className="two-tone-heading-accent">{secondHalf}</span>
    </h2>
  );
}
