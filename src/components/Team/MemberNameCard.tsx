import { TeamMember } from "./types";

interface MemberNameCardProps {
  member: TeamMember
}

export const MemberNameCard = ({ member }: MemberNameCardProps) => {
  return (
    <div className="absolute bottom-0 left-0 right-0 p-4 text-custom-dark/90">
      <h3 className="font-fun font-semibold text-base lg:text-2xl md:text-md leading-[1.2rem]">
        {member.name}
      </h3>
      <p className="font-fun text-sm sm:text-lg text-custom-dark/90">
        {member.role}
      </p>
    </div>
  )
}
