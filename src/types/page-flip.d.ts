// page-flip leveres uten typer. Dette er bare metodene FlipBook bruker.
declare module 'page-flip' {
  export class PageFlip {
    getCurrentPageIndex(): number;
    flipNext(): void;
    flipPrev(): void;
    turnToNextPage(): void;
    turnToPrevPage(): void;
    turnToPage(page: number): void;
  }
}
