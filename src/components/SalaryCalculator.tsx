import React, { useState } from 'react';
import { calculateProvision } from '../utils/salary';

export function SalaryCalculator() {
  const [rate, setRate] = useState('1450');
  const [hours, setHours] = useState('1600');

  const result = rate && hours 
    ? calculateProvision(Number(rate), Number(hours))
    : null;

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-zinc-800 p-6 rounded-xl shadow-[5px_5px_0px_0px_rgba(0,0,0,0.3)] dark:shadow-[5px_5px_0px_0px_rgba(255,255,255,0.1)]">
        {/* Display */}
        <div className="bg-[#a7af9f] h-20 mb-4 rounded-lg p-4 font-mono relative overflow-hidden shadow-inner">
          <div className="absolute inset-0 bg-gradient-to-b from-black/5 to-transparent pointer-events-none" />
          <div className="flex flex-col items-end">
            <div className="text-sm opacity-70">Din årlige provisjonslønn</div>
            <div className="text-2xl font-bold tracking-wider">
              {result ? result.rawValue.toLocaleString('no-NO') + ' kr' : '0 kr'}
            </div>
          </div>
        </div>

        {/* Input Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-white/70 mb-1">Timerate (NOK)</label>
            <input
              type="number"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 font-mono"
              placeholder="1450"
            />
          </div>
          <div>
            <label className="block text-sm text-white/70 mb-1">Timer per år</label>
            <input
              type="number"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 font-mono"
              placeholder="1600"
            />
          </div>
        </div>
      </div>
    </div>
  );
}