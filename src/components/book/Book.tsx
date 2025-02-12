import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Bookmark, Menu } from 'lucide-react';
import { BookCover } from './BookCover';
import { BookSection } from './BookSection';
import { bookChapters } from './chapters';

interface BookProps {
  icon: React.ReactNode;
}

export default function Book({ icon }: BookProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentChapter, setCurrentChapter] = useState<keyof typeof bookChapters>('frontMatter');
  const [currentPage, setCurrentPage] = useState(0);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const allPages = [
    ...bookChapters.frontMatter,
    ...bookChapters.introduction,
    ...bookChapters.values,
    ...bookChapters.salaryBenefits
  ];

  const totalPages = allPages.length;

  const nextPage = () => {
    setCurrentPage(prevPage => {
      const nextPage = prevPage + 2;
      if (nextPage < totalPages) {
        let pageCount = 0;
        for (const [chapter, pages] of Object.entries(bookChapters)) {
          const nextPageCount = pageCount + pages.length;
          if (nextPage >= pageCount && nextPage < nextPageCount) {
            setCurrentChapter(chapter as keyof typeof bookChapters);
            break;
          }
          pageCount = nextPageCount;
        }
        return nextPage;
      }
      return prevPage;
    });
  };

  const prevPage = () => {
    setCurrentPage(prevPage => {
      const newPage = prevPage - 2;
      if (newPage >= 0) {
        let pageCount = 0;
        for (const [chapter, pages] of Object.entries(bookChapters)) {
          const nextPageCount = pageCount + pages.length;
          if (newPage >= pageCount && newPage < nextPageCount) {
            setCurrentChapter(chapter as keyof typeof bookChapters);
            break;
          }
          pageCount = nextPageCount;
        }
        return newPage;
      }
      return prevPage;
    });
  };

  const goToChapter = (chapter: keyof typeof bookChapters) => {
    let pageIndex = 0;
    for (const [key, pages] of Object.entries(bookChapters)) {
      if (key === chapter) {
        setCurrentPage(pageIndex);
        setCurrentChapter(chapter);
        setShowMobileMenu(false);
        break;
      }
      pageIndex += pages.length;
    }
  };

  const bookmarks = [
    {
      id: 'introduction',
      title: 'Introduksjon',
      chapter: 'introduction' as keyof typeof bookChapters,
      color: 'from-rose-400 to-rose-500',
      shadowColor: 'shadow-rose-500/20'
    },
    {
      id: 'values',
      title: 'Våre verdier',
      chapter: 'values' as keyof typeof bookChapters,
      color: 'from-blue-400 to-blue-500',
      shadowColor: 'shadow-blue-500/20'
    },
    {
      id: 'salaryBenefits',
      title: 'Lønn og goder',
      chapter: 'salaryBenefits' as keyof typeof bookChapters,
      color: 'from-emerald-400 to-emerald-500',
      shadowColor: 'shadow-emerald-500/20'
    }
  ];

  return (
    <div className={`max-w-6xl w-full mx-auto flex ${!isOpen && 'justify-center'}`}>
      {/* Bookmarks - only visible when book is open on desktop */}
      {isOpen && (
        <div className="hidden lg:flex flex-col gap-4 pt-4">
          {bookmarks.map((bookmark) => (
            <button
              key={bookmark.id}
              onClick={() => goToChapter(bookmark.chapter)}
              className="relative"
            >
              <div
                className={`
                  relative flex items-center gap-2 px-4 py-3
                  bg-gradient-to-r ${bookmark.color}
                  shadow-lg ${bookmark.shadowColor}
                `}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent" />
                <Bookmark className="w-4 h-4 text-white relative z-10" />
                <span className="text-sm font-medium text-white relative z-10 whitespace-nowrap">
                  {bookmark.title}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Book */}
      <div className={`relative ${isOpen ? 'flex-1' : 'w-full max-w-lg'}`}>
        {!isOpen ? (
          // Closed book
          <button
            onClick={() => setIsOpen(true)}
            className="w-full aspect-[3/4] bg-custom-dark dark:bg-white rounded-lg shadow-2xl overflow-hidden group relative transition-transform hover:scale-105"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-black/5 to-black/20 dark:via-white/5 dark:to-white/20" />
            <BookCover />
            <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-black/20 to-transparent dark:from-white/20" />
          </button>
        ) : (
          <div className="space-y-4">
            {/* Mobile menu bar */}
            <div className="lg:hidden flex items-center justify-between px-4 py-2 bg-white dark:bg-zinc-800 rounded-lg shadow-md">
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="flex items-center gap-2 text-sm font-medium text-custom-dark dark:text-white"
              >
                <Menu className="w-4 h-4" />
                {bookChapters[currentChapter][0].title}
              </button>
            </div>

            {/* Mobile chapter menu dropdown */}
            {showMobileMenu && (
              <div className="lg:hidden">
                <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-lg p-2 space-y-2">
                  {bookmarks.map((bookmark) => (
                    <button
                      key={bookmark.id}
                      onClick={() => goToChapter(bookmark.chapter)}
                      className={`
                        w-full text-left px-4 py-3 rounded-lg
                        bg-gradient-to-r ${bookmark.color}
                        transition-transform hover:scale-[1.02]
                      `}
                    >
                      <span className="text-white font-medium">
                        {bookmark.title}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Open book */}
            <div className="aspect-[3/4] lg:aspect-[3/2] bg-white dark:bg-zinc-900 rounded-lg shadow-2xl overflow-hidden relative">
              {/* Book content */}
              <div className="absolute inset-0">
                {/* Mobile: Single page view */}
                <div className="block lg:hidden h-full">
                  <div className="h-full p-8 bg-white dark:bg-zinc-900">
                    <BookSection 
                      page={allPages[currentPage]} 
                      pageNumber={currentPage + 1} 
                      isRightPage={false} 
                    />
                  </div>
                </div>

                {/* Desktop: Two page view */}
                <div className="hidden lg:flex h-full">
                  {/* Left page */}
                  <div className="flex-1 p-8 border-r border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
                    <BookSection 
                      page={allPages[currentPage]} 
                      pageNumber={currentPage + 1} 
                      isRightPage={false} 
                    />
                  </div>

                  {/* Right page */}
                  <div className="flex-1 p-8 bg-gradient-to-r from-white to-gray-50 dark:from-zinc-900 dark:to-zinc-800">
                    <BookSection 
                      page={allPages[currentPage + 1]} 
                      pageNumber={currentPage + 2} 
                      isRightPage={true} 
                    />
                  </div>
                </div>

                {/* Navigation buttons */}
                <div className="flex justify-between items-center absolute bottom-8 left-1/2 -translate-x-1/2 w-[calc(100%-4rem)] max-w-2xl">
                  <button
                    onClick={prevPage}
                    disabled={currentPage === 0}
                    className={`
                      p-3 rounded-full transition-all
                      ${currentPage === 0
                        ? 'bg-gray-200 text-gray-400 dark:bg-zinc-700 dark:text-zinc-500'
                        : 'bg-custom-dark text-white dark:bg-white dark:text-custom-dark hover:scale-110'
                      }
                    `}
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={nextPage}
                    disabled={currentPage >= totalPages - 2}
                    className={`
                      p-3 rounded-full transition-all
                      ${currentPage >= totalPages - 2
                        ? 'bg-gray-200 text-gray-400 dark:bg-zinc-700 dark:text-zinc-500'
                        : 'bg-custom-dark text-white dark:bg-white dark:text-custom-dark hover:scale-110'
                      }
                    `}
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>

            {/* Close button */}
            <button
              onClick={() => setIsOpen(false)}
              className="text-sm text-custom-dark/60 dark:text-white/60 hover:text-custom-dark dark:hover:text-white transition-colors text-center w-full"
            >
              Lukk boken
            </button>
          </div>
        )}
      </div>
    </div>
  );
}