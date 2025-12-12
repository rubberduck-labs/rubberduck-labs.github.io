import { CartoonBox } from "../CartoonBox";
import { TeamMember } from "./types";

interface MemberImageProps {
  member: TeamMember

}

export const MemberImage = ({ member }: MemberImageProps) => {
  return (
    <div className="relative overflow-hidden h-full">
      <img
        src={member.image}
        alt={member.name}
        className="absolute inset-0 w-full h-full object-contain object-top transition-transform duration-300 hover-supported:group-hover:scale-110 z-9 filter drop-shadow-[10px_5px_10px_rgba(0,0,0,0.45)] lg:pt-[40px] lg:pb-[60px] lg:pl-[40px] lg:pr-[40px] pt-[10px] pb-[50px] pl-[20px] pr-[20px]"
        style={{
          objectPosition: '50% 50%',
        }}
      />
      <img
        src={member.image}
        alt={member.name}
        className="hidden dark:block absolute inset-0 w-full h-full object-contain object-top transition-all duration-300 hover-supported:group-hover:scale-110 z-9 lg:pt-[40px] lg:pb-[60px] lg:pl-[40px] lg:pr-[40px] pt-[10px] pb-[50px] pl-[20px] pr-[20px]"
        style={{
          objectPosition: '50% 50%',
          filter: `
                  drop-shadow(1px 0 white)
                  drop-shadow(-1px 0 white)
                  drop-shadow(0 1px white)
                  drop-shadow(0 -1px white)
                  `
        }}
      />
      <div
        className="absolute inset-x-0 bottom-0  rounded-t-2xl lg:h-[160px] h-[120px] hover-supported:group-hover:h-full transition-all duration-300">
        <CartoonBox />
      </div>
      <img
        src={member.image}
        alt={member.name}
        className="absolute inset-0 w-full h-full object-contain object-top transition-transform duration-300 hover-supported:group-hover:scale-110 z-11 lg:pt-[40px] lg:pb-[60px] lg:pl-[40px] lg:pr-[40px] pt-[10px] pb-[50px] pl-[20px] pr-[20px]"
        style={{
          objectPosition: '50% 50%',
        }}
      />
    </div>
  )
}
