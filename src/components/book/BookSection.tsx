import React from 'react';

export interface BookPage {
  title: string;
  content: string[];
  isSpecial?: boolean;
}

interface BookSectionProps {
  page: BookPage;
  pageNumber: number;
  isRightPage?: boolean;
}

export function BookSection({ page, pageNumber, isRightPage }: BookSectionProps) {
  if (!page) return null;

  return (
    <div className="h-full flex flex-col">
      {page.isSpecial ? (
        <div className="flex-1 flex flex-col justify-center">
          <div className="space-y-1 sm:space-y-2 text-custom-dark dark:text-white">
            {page.content.map((line, index) => (
              <p 
                key={index} 
                className={`
                  text-center text-xs sm:text-sm lg:text-base
                  ${line === '' ? 'my-1 sm:my-2 lg:my-4' : ''}
                `}
              >
                {line}
              </p>
            ))}
          </div>
        </div>
      ) : (
        <>
          <h2 className="text-lg sm:text-xl lg:text-3xl font-bold text-custom-dark dark:text-white mb-3 lg:mb-6">
            {page.title}
          </h2>
          <div className="space-y-2 lg:space-y-4 overflow-y-auto">
            {page.content.map((paragraph, index) => (
              <p 
                key={index} 
                className="text-xs sm:text-sm lg:text-base text-custom-dark/90 dark:text-white/90"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </>
      )}
      
      {/* Page number */}
      {!page.isSpecial && (
        <div 
          className={`
            absolute bottom-2 sm:bottom-4 
            ${isRightPage ? 'right-2 sm:right-4' : 'left-2 sm:left-4'} 
            text-[10px] sm:text-xs lg:text-sm 
            text-custom-dark/60 dark:text-white/60
          `}
        >
          {pageNumber}
        </div>
      )}
    </div>
  );
}