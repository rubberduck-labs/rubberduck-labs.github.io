import React from 'react';
import { LottieAnimation } from './LottieAnimation';
import christmasAnimation from '../lottie/christmas.json';
import prideAnimation from '../lottie/pride.json';
import easterAnimation from '../lottie/easter.json';
import newYearAnimation from '../lottie/newyears.json';
import halloweenAnimation from '../lottie/halloween.json';
import piDayAnimation from '../lottie/pi.json';

interface Holiday {
  name: string;
  animation: any;
  colors: string[];
  lines: string[];
}

declare global {
  interface Window {
    setHoliday?: (holiday: string | null) => void;
  }
}

export function SeasonalBanner() {
  const [holidayOverride, setHolidayOverride] = React.useState<string | null>(null);

  React.useEffect(() => {
    window.setHoliday = (holiday: string | null) => {
      setHolidayOverride(holiday?.toLowerCase() || null);
    };

    return () => {
      window.setHoliday = undefined;
    };
  }, []);

  const currentDate = new Date();
  const month = currentDate.getMonth();
  const day = currentDate.getDate();

  const isDateInRange = (startMonth: number, startDay: number, endMonth: number, endDay: number): boolean => {
    const today = new Date();
    const start = new Date(today.getFullYear(), startMonth, startDay);
    const end = new Date(today.getFullYear(), endMonth, endDay);
    return today >= start && today <= end;
  };

  const getCurrentHoliday = (): Holiday | null => {
    if (holidayOverride) {
      switch (holidayOverride) {
        case 'christmas':
          return {
            name: 'Christmas',
            animation: christmasAnimation,
            colors: ['bg-red-500', 'bg-green-500', 'bg-red-500', 'bg-green-500', 'bg-red-500', 'bg-green-500'],
            lines: ['God jul!', '']
          };
        case 'pride':
          return {
            name: 'Pride',
            animation: prideAnimation,
            colors: [
              'bg-[#FF0000]',
              'bg-[#FF8D00]',
              'bg-[#FFEE00]',
              'bg-[#028121]',
              'bg-[#004CFF]',
              'bg-[#770088]'
            ],
            lines: ['Happy', 'Pride!']
          };
        case 'easter':
          return {
            name: 'Easter',
            animation: easterAnimation,
            colors: ['bg-yellow-200', 'bg-blue-200', 'bg-pink-200', 'bg-green-200', 'bg-purple-200', 'bg-orange-200'],
            lines: ['God', 'påske!']
          };
        case 'newyear':
          return {
            name: 'NewYear',
            animation: newYearAnimation,
            colors: ['bg-blue-400', 'bg-purple-400', 'bg-pink-400', 'bg-yellow-400', 'bg-green-400', 'bg-red-400'],
            lines: ['Godt', 'nyttår!']
          };
        case 'halloween':
          return {
            name: 'Halloween',
            animation: halloweenAnimation,
            colors: ['bg-orange-500', 'bg-purple-500', 'bg-orange-500', 'bg-purple-500', 'bg-orange-500', 'bg-purple-500'],
            lines: ['Knask', 'eller knep!']
          };
        case 'piday':
          return {
            name: 'Pi Day',
            animation: piDayAnimation,
            colors: ['bg-blue-600', 'bg-indigo-600', 'bg-violet-600', 'bg-purple-600', 'bg-fuchsia-600', 'bg-pink-600'],
            lines: ['Happy', 'π Day!']
          };
        default:
          return null;
      }
    }

    // Pi Day - March 14
    if (month === 2 && day === 14) {
      return {
        name: 'Pi Day',
        animation: piDayAnimation,
        colors: ['bg-blue-600', 'bg-indigo-600', 'bg-violet-600', 'bg-purple-600', 'bg-fuchsia-600', 'bg-pink-600'],
        lines: ['Happy', 'π Day!']
      };
    }

    if (isDateInRange(11, 1, 11, 26)) {
      return {
        name: 'Christmas',
        animation: christmasAnimation,
        colors: ['bg-red-500', 'bg-green-500', 'bg-red-500', 'bg-green-500', 'bg-red-500', 'bg-green-500'],
        lines: ['God jul!', '']
      };
    }
    
    if (month === 5) {
      return {
        name: 'Pride',
        animation: prideAnimation,
        colors: [
          'bg-[#FF0000]',
          'bg-[#FF8D00]',
          'bg-[#FFEE00]',
          'bg-[#028121]',
          'bg-[#004CFF]',
          'bg-[#770088]'
        ],
        lines: ['Happy', 'Pride!']
      };
    }
    
    const easterDate = getEasterDate(currentDate.getFullYear());
    const easterMonth = easterDate.getMonth();
    const easterDay = easterDate.getDate();
    
    if (
      (month === easterMonth && day >= easterDay - 3) && 
      (month === easterMonth && day <= easterDay + 3)
    ) {
      return {
        name: 'Easter',
        animation: easterAnimation,
        colors: ['bg-yellow-200', 'bg-blue-200', 'bg-pink-200', 'bg-green-200', 'bg-purple-200', 'bg-orange-200'],
        lines: ['God', 'påske!']
      };
    }

    if ((month === 11 && day === 31) || (month === 0 && day === 1)) {
      return {
        name: 'NewYear',
        animation: newYearAnimation,
        colors: ['bg-blue-400', 'bg-purple-400', 'bg-pink-400', 'bg-yellow-400', 'bg-green-400', 'bg-red-400'],
        lines: ['Godt', 'nyttår!']
      };
    }

    if (month === 9 && day === 31) {
      return {
        name: 'Halloween',
        animation: halloweenAnimation,
        colors: ['bg-orange-500', 'bg-purple-500', 'bg-orange-500', 'bg-purple-500', 'bg-orange-500', 'bg-purple-500'],
        lines: ['Knask', 'eller knep!']
      };
    }
    
    return null;
  };

  const currentHoliday = getCurrentHoliday();
  
  if (!currentHoliday) return null;

  return (
    <div className="flex-shrink-0 w-full sm:w-[180px] h-[48px] flex items-center justify-center sm:justify-start gap-4">
      {/* Animation container with fixed size and overflow control */}
      <div className="w-20 h-20 flex-shrink-0 flex items-center justify-center overflow-hidden transform group-hover:scale-110 transition-transform duration-300">
        {currentHoliday.animation ? (
          <div className="w-full h-full relative">
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
      {/* Text container with fixed width */}
      <div className="w-auto sm:w-[100px] flex-shrink-0 flex flex-col text-base font-medium text-custom-dark/80 dark:text-white/80">
        {currentHoliday.lines.map((line, index) => (
          <span
            key={index}
            className="animate-fade-in-up whitespace-nowrap text-center sm:text-left"
            style={{ animationDelay: `${0.1 * (index + 1)}s` }}
          >
            {line}
          </span>
        ))}
      </div>
    </div>
  );
}

function getEasterDate(year: number): Date {
  const f = Math.floor;
  const G = year % 19;
  const C = f(year / 100);
  const H = (C - f(C / 4) - f((8 * C + 13) / 25) + 19 * G + 15) % 30;
  const I = H - f(H / 28) * (1 - f(29 / (H + 1)) * f((21 - G) / 11));
  const J = (year + f(year / 4) + I + 2 - C + f(C / 4)) % 7;
  const L = I - J;
  const month = 3 + f((L + 40) / 44);
  const day = L + 28 - 31 * f(month / 4);
  
  return new Date(year, month - 1, day);
}