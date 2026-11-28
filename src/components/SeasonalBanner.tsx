import { LottieAnimation } from './LottieAnimation';
import christmasAnimation from '../lottie/christmas.json';
import prideAnimation from '../lottie/pride.json';
import easterAnimation from '../lottie/easter.json';
import halloweenAnimation from '../lottie/halloween.json';
import piDayAnimation from '../lottie/pi.json';

import { useHoliday, type HolidayKey } from '../hooks/useHoliday';

interface Holiday {
  name: string;
  animation: any;
  colors: string[];
  lines: string[];
  /** Forstørrer animasjonen når figuren er liten i sitt eget lerret. */
  scale?: number;
}

const HOLIDAYS: Record<HolidayKey, Holiday> = {
  christmas: {
    name: 'Christmas',
    animation: christmasAnimation,
    colors: ['bg-red-500', 'bg-green-500', 'bg-red-500', 'bg-green-500', 'bg-red-500', 'bg-green-500'],
    lines: ['God jul!', '']
  },
  pride: {
    name: 'Pride',
    animation: prideAnimation,
    colors: ['bg-[#FF0000]', 'bg-[#FF8D00]', 'bg-[#FFEE00]', 'bg-[#028121]', 'bg-[#004CFF]', 'bg-[#770088]'],
    lines: ['Happy', 'Pride!'],
    scale: 1.6
  },
  easter: {
    name: 'Easter',
    animation: easterAnimation,
    colors: ['bg-yellow-200', 'bg-blue-200', 'bg-pink-200', 'bg-green-200', 'bg-purple-200', 'bg-orange-200'],
    lines: ['God', 'påske!']
  },
  // Fyrverkeriet går over hele siden i nyttårsmodus, så her er det bare boblen. Linjene settes med riktig år under.
  newyear: {
    name: 'NewYear',
    animation: null,
    colors: [],
    lines: []
  },
  halloween: {
    name: 'Halloween',
    animation: halloweenAnimation,
    colors: ['bg-orange-500', 'bg-purple-500', 'bg-orange-500', 'bg-purple-500', 'bg-orange-500', 'bg-purple-500'],
    lines: ['Knask', 'eller knep!'],
    scale: 1.9
  },
  piday: {
    name: 'Pi Day',
    animation: piDayAnimation,
    colors: ['bg-blue-600', 'bg-indigo-600', 'bg-violet-600', 'bg-purple-600', 'bg-fuchsia-600', 'bg-pink-600'],
    lines: ['Happy', 'π Day!']
  }
};

export function SeasonalBanner() {
  const holiday = useHoliday();
  const currentHoliday = holiday ? HOLIDAYS[holiday] : null;
  
  if (!currentHoliday) return null;

  // Nyttårsaften ønsker vi godt nytt for året som kommer, 1. januar for året som har begynt.
  const today = new Date();
  const newYear = today.getMonth() === 11 ? today.getFullYear() + 1 : today.getFullYear();
  const lines = holiday === 'newyear' ? ['Godt nyttår', `${newYear}!`] : currentHoliday.lines.filter(Boolean);
  const hasFigure = Boolean(currentHoliday.animation) || currentHoliday.colors.length > 0;

  return (
    <div className="flex-shrink-0 w-full sm:w-auto h-[48px] flex items-center justify-center sm:justify-start gap-5">
      {/* Animation container with fixed size and overflow control */}
      {hasFigure && (
      <div
        className={`w-20 h-20 flex-shrink-0 flex items-center justify-center ${currentHoliday.scale ? 'overflow-visible' : 'overflow-hidden'} ${currentHoliday.name === 'Halloween' ? 'dark:[filter:drop-shadow(0_0_8px_rgba(251,146,60,0.6))]' : ''} transform group-hover:scale-110 transition-transform duration-300`}
        // En forstørret figur stikker ut av boksen sin, så den får plass på sidene og ikke dekker boblen.
        style={currentHoliday.scale ? { marginInline: `${(currentHoliday.scale - 1) * 30}px` } : undefined}
      >
        {currentHoliday.animation ? (
          <div className="w-full h-full relative" style={currentHoliday.scale ? { transform: `scale(${currentHoliday.scale})` } : undefined}>
            <LottieAnimation
              animationData={currentHoliday.animation}
              className="absolute inset-0 w-full h-full object-contain"
            />
          </div>
        ) : (
          <div className="w-16 h-12 rounded-sm overflow-hidden shadow-sm flex flex-col">
            {currentHoliday.colors.map((color, index) => (
              <div key={index} className={`h-[16.67%] ${color}`} />
            ))}
          </div>
        )}
      </div>
      )}
      {/* Snakkeboble, samme stil som tankeboblen i heroen, med hale som peker mot figuren */}
      <div className="relative z-10 flex-shrink-0 opacity-0 motion-reduce:animate-none motion-reduce:opacity-100 animate-[pop-in_0.5s_cubic-bezier(0.175,0.885,0.32,1.275)_0.4s_forwards]">
        {hasFigure && (
          <div className="absolute left-0 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-white" aria-hidden="true" />
        )}
        <p className="relative flex flex-col rounded-2xl bg-white px-4 py-2 text-base font-medium leading-snug text-custom-dark shadow-lg">
          {lines.map((line) => (
            <span key={line} className="whitespace-nowrap">{line}</span>
          ))}
        </p>
      </div>
    </div>
  );
}
