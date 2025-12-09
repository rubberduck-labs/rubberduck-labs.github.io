import { RubberDuckIcon } from "../Icons/RubberDuckIcon";
import { IconWrapper } from "../IconWrapper";
import { RubberDuckLogo } from "../Icons/RubberDuckLogo";

export function BookCover() {
  return (
    <div className="absolute inset-[2px] bg-zinc-900 dark:bg-zinc-800 rounded-lg overflow-hidden">
      {/* Decorative top pattern */}
      <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-yellow-500/20 to-transparent" />

      {/* Corner decorations */}
      <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-yellow-500/30 rounded-tl-lg" />
      <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-yellow-500/30 rounded-tr-lg" />
      <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-yellow-500/30 rounded-bl-lg" />
      <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-yellow-500/30 rounded-br-lg" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-white">
        <IconWrapper className={'size-32 text-yellow-400'}>
          <RubberDuckIcon />
        </IconWrapper>
        <IconWrapper className={'text-yellow-400 h-auto w-[300px] mb-24'}>
          <RubberDuckLogo />
        </IconWrapper>
        <h2 className="text-4xl font-bold text-center mb-4 relative">
          <span className="relative">
             Håndbok
            {/* Underline decoration */}
            <div className="absolute -bottom-2 left-0 right-0 h-1 bg-yellow-500/30" />
          </span>
        </h2>
        <p className="text-sm opacity-70 mt-4">Klikk for å åpne</p>
      </div>

      {/* Decorative bottom pattern */}
      <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-yellow-500/20 to-transparent" />
    </div>
  );
}
