import React from 'react';
import { AlertCircle } from 'lucide-react';

export default function EventScreen({ event, onChoice, playerName }) {
  if (!event) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-2xl bg-slate-900 border-2 border-red-600 rounded-lg p-6">
        {/* Event Header */}
        <div className="flex items-center gap-3 mb-4">
          <AlertCircle size={28} className="text-red-500 animate-pulse" />
          <h2 className="text-xl font-bold text-red-400">WORLD EVENT</h2>
        </div>

        {/* Event Text */}
        <div className="bg-slate-800 p-4 rounded mb-6 border border-red-700 min-h-16">
          <p className="text-slate-100 text-base leading-relaxed">
            {event.text}
          </p>
        </div>

        {/* Player Name Context */}
        <div className="mb-4 p-3 bg-slate-800 rounded border border-slate-700">
          <p className="text-xs text-slate-400">
            Your decision as <span className="text-cyan-300 font-semibold">{playerName}</span> will shape the course of events.
          </p>
        </div>

        {/* Choices */}
        <div className="space-y-2">
          {event.choices.map((choice, index) => (
            <button
              key={index}
              onClick={() => onChoice(index, choice)}
              className={`w-full text-left p-4 rounded border transition text-sm ${
                choice.ending
                  ? 'bg-gradient-to-r from-red-900 to-slate-800 border-red-500 hover:border-red-400'
                  : 'bg-slate-800 border-slate-600 hover:border-amber-500 hover:bg-slate-700'
              }`}
            >
              <div className="text-slate-100">{choice.text}</div>
              {choice.reveals && (
                <div className="text-xs text-slate-400 mt-1 italic">
                  → {choice.reveals}
                </div>
              )}
              {choice.ending && (
                <div className="text-xs text-red-400 mt-1 font-semibold">
                  [This choice will determine the ending]
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
