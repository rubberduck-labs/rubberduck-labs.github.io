import React from 'react';
import { HeroSection } from '../components/HeroSection';

interface HomePageProps {
  setBackgroundColor: (color: string | null) => void;
}

export function HomePage({ setBackgroundColor }: HomePageProps) {
  return (
    <div>
      <HeroSection setBackgroundColor={setBackgroundColor} />
    </div>
  );
}