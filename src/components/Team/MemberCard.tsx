import { MemberImage } from "./MemberImage";
import { MemberNameCard } from "./MemberNameCard";
import { FileText, Grid2x2 } from "lucide-react";
import { useEffect, useState } from "react";
import { TeamMember } from "./types";
import { CustomDialog } from "../CustomDialog";

interface MemberCardProps {
  member: TeamMember;
  setSelectedMember: (member: TeamMember) => void;
}


export const MemberCard = ({ member, setSelectedMember }: MemberCardProps) => {
  const [hikuOpen, setHikuOpen] = useState(false);
  const hasHiku = member.name === 'Espen Schulstad';
  // Dagens Hiku lastes først når noen åpner det. Skriptet monterer spillet i alle [data-hiku] på siden.
  useEffect(() => {
    if (!hikuOpen || document.querySelector('script[data-hiku-embed]')) return;
    const script = document.createElement('script');
    script.src = 'https://hikupuzzle.com/daily/embed.js';
    script.async = true;
    script.dataset.hikuEmbed = '1';
    document.head.appendChild(script);
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
            className="absolute bottom-4 right-5 z-10 flex h-8 w-8 items-center justify-center rounded-full text-custom-dark/80 hover:bg-custom-dark/10 hover:text-custom-dark transition-colors"
            aria-label="Dagens hiku"
            title="Dagens hiku"
          >
            <Grid2x2 className="h-4 w-4" />
          </button>
          <CustomDialog open={hikuOpen} onClose={() => setHikuOpen(false)} widthClass="sm:max-w-[460px]">
            <div className="pt-8"><div data-hiku data-lang="nb" /></div>
          </CustomDialog>
        </>
      )}
    </div>
  )
}
