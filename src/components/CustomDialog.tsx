import React, { useEffect, useId, useRef } from "react";
import { X } from "lucide-react";

interface CustomDialogProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  /** Overstyrer maksbredden fra sm og opp, for eksempel «sm:max-w-md». */
  widthClass?: string;
  children: React.ReactNode;
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function CustomDialog({ open, onClose, title, widthClass = "sm:max-w-3xl", children }: CustomDialogProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const scrollYRef = useRef<number>(0);
  const opener = useRef<HTMLElement | null>(null);
  const titleId = useId();

  // Husk hva som hadde fokus da dialogen åpnet, flytt fokus inn (til tittelen, så tastaturet ikke åpner seg av seg selv),
  // og gi fokus tilbake til knappen som åpnet den når dialogen lukkes.
  useEffect(() => {
    if (!open) return;
    opener.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const frame = requestAnimationFrame(() => (titleRef.current ?? contentRef.current)?.focus({ preventScroll: true }));
    return () => {
      cancelAnimationFrame(frame);
      opener.current?.focus({ preventScroll: true });
    };
  }, [open]);

  // Lukk med Escape, og hold Tab-fokuset inne i dialogen.
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab" || !contentRef.current) return;
      const items = Array.from(contentRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((el) => el.offsetParent !== null);
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && (active === first || active === titleRef.current || active === contentRef.current)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  // Ingen rulling av siden bak mens dialogen er åpen.
  useEffect(() => {
    if (!open) return;

    const body = document.body;
    scrollYRef.current = window.scrollY || window.pageYOffset;

    const prevStyles = {
      overflow: body.style.overflow,
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      width: body.style.width,
    };

    body.style.position = "fixed";
    body.style.top = `-${scrollYRef.current}px`;
    body.style.left = "0";
    body.style.width = "100%";
    body.style.overflow = "hidden";

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

  const closeButton = (
    <button
      type="button"
      onClick={onClose}
      aria-label="Lukk"
      className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white shadow-[-1px_2px_0px_rgba(0,0,0,0.05)] hover:bg-gray-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-custom-dark dark:focus-visible:ring-white"
    >
      <X className="w-6 h-6 text-gray-600 dark:text-gray-300" aria-hidden="true" />
    </button>
  );

  return (
    <div
      className="fixed inset-0 bg-black/50 flex sm:items-center sm:justify-center p-0 sm:p-4 z-50"
      onMouseDown={handleOutsideClick}
    >
      <div
        ref={contentRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-label={title ? undefined : "Dialog"}
        tabIndex={-1}
        className={`relative bg-white dark:bg-zinc-900 dark:text-zinc-100 w-full h-full sm:h-auto sm:max-h-[90vh] ${widthClass} rounded-none sm:rounded-xl overflow-hidden flex flex-col dark:ring-1 dark:ring-white/20 focus:outline-none`}
      >
        {/* Med tittel ligger lukk-knappen i en egen topplinje. Uten tittel (lagspillere, spill) flyter den over innholdet som før. */}
        {title ? (
          <div className="px-4 py-2 border-b shrink-0 flex justify-between items-center gap-3 min-h-[3.75rem]">
            <h2 id={titleId} ref={titleRef} tabIndex={-1} className="text-lg font-bold focus:outline-none">{title}</h2>
            {closeButton}
          </div>
        ) : (
          <div className="absolute top-2 right-3 z-10">{closeButton}</div>
        )}

        <div className="flex-1 min-h-0 overflow-y-auto p-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
          {children}
        </div>
      </div>
    </div>
  );
}
