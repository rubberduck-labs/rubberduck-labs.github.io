import React from 'react';

export function RubberDuck() {
  return (
    <svg
      viewBox="0 0 100 100"
      className="w-24 h-24 mb-8 transform transition-transform group-hover:scale-110 group-hover:rotate-3"
    >
      {/* Body */}
      <circle cx="50" cy="50" r="35" fill="#FFD43B" />
      {/* Wing */}
      <path
        d="M75 50a25 25 0 0 1-15 23c-5-8-5-16 0-24 5-8 10-8 15 1z"
        fill="#FFC107"
      />
      {/* Head */}
      <circle cx="35" cy="40" r="20" fill="#FFD43B" />
      {/* Eye */}
      <circle cx="30" cy="35" r="3" fill="#1F2937" />
      {/* Beak */}
      <path
        d="M45 45c-2-2-4-2-6 0-2 2-2 4 0 6 2 2 4 2 6 0 2-2 2-4 0-6z"
        fill="#FF9800"
      />
    </svg>
  );
}