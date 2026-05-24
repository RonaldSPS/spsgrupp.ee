interface TwoToneHeadingProps {
  text: string;
  className?: string;
}

export default function TwoToneHeading({ text, className = "" }: TwoToneHeadingProps) {
  const words = text.split(' ');
  const midpoint = Math.ceil(words.length / 2);
  const firstHalf = words.slice(0, midpoint).join(' ');
  const secondHalf = words.slice(midpoint).join(' ');

  return (
    <h2 className={`section-title ${className}`}>
      <span style={{ 
        fontFamily: 'Ubuntu', 
        fontWeight: 400, 
        color: 'var(--navy)',
        display: 'block'
      }}>
        {firstHalf}
      </span>
      <span style={{ 
        fontFamily: 'Ubuntu', 
        fontWeight: 600, 
        color: 'var(--sky-text)',
        display: 'block'
      }}>
        {secondHalf}
      </span>
    </h2>
  );
}
