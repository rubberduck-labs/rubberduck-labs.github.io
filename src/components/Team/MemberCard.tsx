import { MemberImage } from "./MemberImage";
import { MemberNameCard } from "./MemberNameCard";
import { FileText } from "lucide-react";
import { TeamMember } from "./types";

interface MemberCardProps {
  member: TeamMember;
  setSelectedMember: (member: TeamMember) => void;
}


export const MemberCard = ({ member, setSelectedMember }: MemberCardProps) => {
  return (
    <div
      className="group relative  rounded-xl overflow-visible  transition-all duration-300 lg:h-[500px] h-[300px]"
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
    </div>
  )
}
