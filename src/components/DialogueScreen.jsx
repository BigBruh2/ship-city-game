import React from 'react';
import { Users } from 'lucide-react';

export default function DialogueScreen({ npc, dialogue, onChoice, onClose }) {
  if (!npc || !dialogue) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-end z-50">
      <div className="w-full bg-slate-900 border-t-2 border-amber-500 p-6">
        {/* NPC Header */}
        <div className="flex items-center gap-3 mb-4">
          <Users size={24} className="text-amber-400" />
          <div>
            <h2 className="text-xl font-bold text-amber-300">{npc.name}</h2>
            <p className="text-xs text-slate-400">{npc.location}</p>
          </div>
        </div>

        {/* Dialogue Text */}
        <div className="bg-slate-800 p-4 rounded mb-6 border border-slate-700 min-h-24">
          <p className="text-slate-100 text-sm leading-relaxed italic">
            "{dialogue.text}"
          </p>
        </div>

        {/* NPC Loyalty */}
        <div className="mb-4">
          <p className="text-xs text-slate-400 mb-1">Disposition toward you</p>
          <div className="w-full bg-slate-700 rounded h-2">
            <div 
              className="bg-amber-500 h-full rounded" 
              style={{ width: '60%' }}
            ></div>
          </div>
        </div>

        {/* Choices */}
        <div className="space-y-2">
          {dialogue.choices.map((choice, index) => (
            <button
              key={index}
              onClick={() => onChoice(index, choice)}
              className="w-full text-left p-3 bg-slate-800 border border-slate-600 rounded hover:border-amber-500 hover:bg-slate-700 transition text-sm text-slate-100"
            >
              {choice.text}
              {choice.loyaltyChange > 0 && (
                <span className="float-right text-green-400 text-xs">+{choice.loyaltyChange}</span>
              )}
              {choice.loyaltyChange < 0 && (
                <span className="float-right text-red-400 text-xs">{choice.loyaltyChange}</span>
              )}
            </button>
          ))}
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full mt-4 p-2 text-xs text-slate-400 hover:text-slate-200 transition"
        >
          Close Dialogue
        </button>
      </div>
    </div>
  );
}
