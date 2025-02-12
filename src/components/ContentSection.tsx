import React from 'react';
import Book from './book/Book';

interface ContentSectionProps {
  id: string;
  title: string;
  content: string;
  icon: React.ReactNode;
  type: 'standard' | 'book';
}

export function ContentSection({ id, title, content, icon, type }: ContentSectionProps) {
  if (type === 'book') {
    return (
      <section
        id={id}
        className="min-h-screen flex items-center justify-center p-8 bg-gradient-to-b from-custom-yellow/10 to-transparent dark:from-custom-dark/10"
      >
        <Book icon={icon} />
      </section>
    );
  }

  // Standard section
  return (
    <section
      id={id}
      className="min-h-screen flex items-center justify-center p-8"
    >
      <div className="max-w-4xl mx-auto text-center">
        <div className="flex justify-center text-custom-dark dark:text-white">
          {icon}
        </div>
        <h2 className="text-4xl md:text-5xl font-bold text-custom-dark dark:text-white mb-6">
          {title}
        </h2>
        <p className="text-lg md:text-xl text-custom-dark dark:text-gray-300">
          {content}
        </p>
      </div>
    </section>
  );
}