import React, { useEffect, useRef } from "react";
import { X } from "lucide-react";

interface CustomDialogProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export function CustomDialog({ open, onClose, title, children }: CustomDialogProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const scrollYRef = useRef<number>(0);

  // Close on ESC, prevent focus outline on triggering element
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        (document.activeElement as HTMLElement | null)?.blur();
        onClose();
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  // Prevent scrolling on body when dialog is open.
  useEffect(() => {
    if (!open) return;

    const body = document.body;
    scrollYRef.current = window.scrollY || window.pageYOffset;

    // Freeze body
    const prevStyles = {
      overflow: body.style.overflow,
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      width: body.style.width,
      touchAction: body.style.touchAction,
    };

    body.style.position = "fixed";
    body.style.top = `-${scrollYRef.current}px`;
    body.style.left = "0";
    body.style.width = "100%";
    body.style.overflow = "hidden";
    body.style.touchAction = "none"; // prevent iOS scroll

    return () => {
      Object.assign(body.style, prevStyles);
      window.scrollTo(0, scrollYRef.current);
    };
  }, [open]);

  // Close on click outside
  const handleOutsideClick = (e: React.MouseEvent) => {
    if (window.innerWidth < 640) return; // don't close on mobile outside click
    if (contentRef.current && !contentRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex sm:items-center sm:justify-center p-0 sm:p-4 z-50"
      onMouseDown={handleOutsideClick}
    >
      <div
        ref={contentRef}
        className="relative bg-white w-full h-full sm:h-auto sm:max-h-[90vh] sm:max-w-3xl rounded-none sm:rounded-xl overflow-hidden flex flex-col"
      >
        <div className="absolute top-2 right-4">
          <button
            onClick={onClose}
            className="absolute top-1 right-0 p-2 bg-white hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-colors shadow-[-1px_2px_0px_rgba(0,0,0,0.05)]"
          >
            <X className="w-6 h-6 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {title && (
          <div className="px-4 py-4 border-b shrink-0 flex justify-between items-center">
            <h2 className="text-lg font-bold">{title}</h2>

          </div>
        )}

        <div className="flex-1 overflow-y-auto p-2">
          {children}
        </div>
      </div>
    </div>
  );
}
