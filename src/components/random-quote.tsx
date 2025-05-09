import { useState, useEffect } from 'react';

const quotes = [
  {
    text: 'Every child is an artist. The problem is how to remain an artist once we grow up.',
    author: 'Pablo Picasso',
  },
  {
    text: 'Children must be taught how to think, not what to think.',
    author: 'Margaret Mead',
  },
  {
    text: 'Play is the highest form of research.',
    author: 'Albert Einstein',
  },
];

export function RandomQuote() {
  const [quote, setQuote] = useState(quotes[0]);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setQuote(quotes[randomIndex]);
  }, []);

  return (
    <div className="text-center p-4">
      <p className="text-lg font-medium mb-2">{quote.text}</p>
      <p className="text-sm text-gray-600">- {quote.author}</p>
    </div>
  );
} 