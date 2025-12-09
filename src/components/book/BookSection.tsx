import { ReactElement } from 'react';
import { BookPage } from "./types.ts";
import { renderBlock } from "./utils.tsx";

interface BookSectionProps {
  page: BookPage;
  pageNumber: number;
  isRightPage?: boolean;
}


export function BookSection({ page, pageNumber, isRightPage }: BookSectionProps): ReactElement | null {
  if (!page) return null;

  return (
    <div className="h-[90%] flex flex-col overflow-y-auto [mask-image:linear-gradient(to_bottom,black_80%,transparent_100%)] pb-[20%]">
      {page.isSpecial ? (
        <div className="flex-1 flex flex-col justify-center">
          <div className="space-y-4 sm:space-y-4 text-custom-dark dark:text-white">
            {page.content.map((block, index) => (
              renderBlock(block, index)
            ))}
          </div>
        </div>
      ) : (
          <div className="space-y-4 sm:space-y-4 text-custom-dark dark:text-white">
            {page.content.map((block, index) => (
              renderBlock(block, index)
            ))}
          </div>
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
