import React from 'react';
import { Book } from 'lucide-react';
import { ContentSection } from '../components/ContentSection';

export function HandbookPage() {
  return (
    <div>
      <ContentSection
        id="handbok"
        title="Håndbok"
        icon={<Book className="w-8 h-8 mb-4" />}
        content=""
        type="book"
      />
    </div>
  );
}