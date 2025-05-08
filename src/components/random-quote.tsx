import React from 'react';

const quotes = [
  {
    text: "The best way to predict the future is to create it.",
    author: "Abraham Lincoln"
  },
  {
    text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Winston Churchill"
  },
  {
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs"
  }
];

export function RandomQuote() {
  const [quote] = React.useState(() => 
    quotes[Math.floor(Math.random() * quotes.length)]
  );

  return (
    <blockquote className="border-l-4 border-gray-300 pl-4 italic">
      <p className="text-lg mb-2">"{quote.text}"</p>
      <footer className="text-sm text-gray-600">— {quote.author}</footer>
    </blockquote>
  );
} 