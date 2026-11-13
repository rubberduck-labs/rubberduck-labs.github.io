import { MemberImage } from "./MemberImage";
import { MemberNameCard } from "./MemberNameCard";
import { FileText } from "lucide-react";
import { useEffect, useState } from "react";
import { TeamMember } from "./types";
import { CustomDialog } from "../CustomDialog";
import { track } from "../../utils/track";

interface MemberCardProps {
  member: TeamMember;
  setSelectedMember: (member: TeamMember) => void;
}


// Nettstedet slår mørk modus av og på med klassen «dark» på <html>. Spillet i rammen følger ellers bare operativsystemet.
function useSiteDark(): boolean {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'));
  useEffect(() => {
    const el = document.documentElement;
    setDark(el.classList.contains('dark')); // klassen kan ha kommet etter første tegning
    const obs = new MutationObserver(() => setDark(el.classList.contains('dark')));
    obs.observe(el, { attributes: true, attributeFilter: ['class'] });
    return () => obs.disconnect();
  }, []);
  return dark;
}

export const MemberCard = ({ member, setSelectedMember }: MemberCardProps) => {
  const [hikuOpen, setHikuOpen] = useState(false);
  const siteDark = useSiteDark();
  const hasHiku = member.name === 'Espen Schulstad';
  const [hikuNumber] = useState(() => 1 + Math.floor(Math.random() * 5)); // som tallene på brettet, 1 til 5
  // Dagens Hiku lastes først når noen åpner det. Skriptet monterer spillet i alle [data-hiku] på siden.
  useEffect(() => {
    if (!hikuOpen || document.querySelector('script[data-hiku-embed]')) return;
    const script = document.createElement('script');
    script.src = 'https://hikupuzzle.com/daily/embed.js';
    script.async = true;
    script.dataset.hikuEmbed = '1';
    document.head.appendChild(script);
  }, [hikuOpen]);

  // Åpnet: telles når modalen vises. Spilte: spillet står i en ramme vi ikke kan se inn i, men når noen trykker i den
  // mister siden fokus og rammen blir aktivt element. Det telles én gang per åpning.
  useEffect(() => {
    if (!hikuOpen) return;
    track('hiku_open');
    let played = false;
    const onBlur = () => {
      setTimeout(() => {
        const active = document.activeElement;
        if (!played && active instanceof HTMLIFrameElement && active.closest('[data-hiku]')) {
          played = true;
          track('hiku_play');
        }
      }, 0);
    };
    window.addEventListener('blur', onBlur);
    return () => window.removeEventListener('blur', onBlur);
  }, [hikuOpen]);
  return (
    <div
      className={`group relative  rounded-xl overflow-visible  transition-all duration-300 lg:h-[500px] h-[300px]`}
    >
      <MemberImage member={member} />
      <MemberNameCard member={member} />

      {/* Enhanced CV Button */}
      <button
        onClick={() => setSelectedMember(member)}
        className="absolute top-0 right-0 bottom-0 left-0 flex items-center justify-center bg-black/0  transition-colors group lg:pt-80"
        aria-label="Se CV"
      >
        <div
          className="transform translate-y-8 group-hover:translate-y-0 opacity-0 hover-supported:group-hover:opacity-100 transition-all duration-300 bg-white dark:bg-custom-dark text-custom-dark dark:text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full flex items-center gap-2 shadow-lg">
          <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="text-sm sm:text-base font-semibold">Se CV</span>
        </div>
      </button>

      {hasHiku && (
        <>
          <button
            type="button"
            onClick={() => setHikuOpen(true)}
            className="hiku-tile absolute bottom-5 right-6 z-10 flex h-9 w-9 items-center justify-center text-lg"
            aria-label="Dagens hiku"
            title="Dagens hiku"
          >
            {hikuNumber}
            <span className="hiku-dots" aria-hidden="true">
              {Array.from({ length: hikuNumber }, (_, i) => <i key={i} />)}
            </span>
          </button>
          <CustomDialog open={hikuOpen} onClose={() => setHikuOpen(false)} widthClass="sm:max-w-[460px]">
            <div className="pt-8">
              {/* key: spillet monteres én gang per element, så et tema-bytte trenger et nytt element */}
              <div key={siteDark ? 'dark' : 'light'} data-hiku data-lang="nb" data-color="#ffcc14" data-theme={siteDark ? 'dark' : 'light'} />
            </div>
          </CustomDialog>
        </>
      )}
    </div>
  )
}
