import React, { useState } from 'react';
import { Users, AlertCircle, MapPin, LogOut } from 'lucide-react';

export default function App() {
  const [gamePhase, setGamePhase] = useState('lobby');
  const [playerName, setPlayerName] = useState('');
  const [sessionCode, setSessionCode] = useState('');
  const [playerId, setPlayerId] = useState('');
  const [players, setPlayers] = useState([]);
  const [gameState, setGameState] = useState({
    turn: 1,
    deck: 'upper',
    resources: { influence: 15, wealth: 10, followers: 3 },
    unrest: { upper: 35, lower: 62 },
    log: ['You wake in your quarters. The ship hums with tension.'],
  });

  const createGame = () => {
    if (!playerName.trim()) return;
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    const newPlayerId = Math.random().toString(36).substring(2, 9);
    setSessionCode(code);
    setPlayerId(newPlayerId);
    setPlayers([{ id: newPlayerId, name: playerName }]);
    setGamePhase('game');
  };

  const leaveGame = () => {
    setGamePhase('lobby');
    setPlayerName('');
    setSessionCode('');
  };

  if (gamePhase === 'lobby') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-black text-slate-100 p-4 flex items-center justify-center">
        <div className="max-w-md w-full">
          <h1 className="text-3xl font-bold text-amber-400 mb-2 text-center">THE CITY ON DECK</h1>
          <p className="text-sm text-slate-400 text-center mb-8">A strategy game of power and revolution</p>
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 space-y-4">
            <div>
              <label className="block text-sm mb-2">Your Name</label>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Enter your name"
                className="w-full bg-slate-700 border border-slate-600 rounded p-2 text-slate-100"
              />
            </div>
            <button
              onClick={createGame}
              disabled={!playerName.trim()}
              className="w-full bg-amber-600 hover:bg-amber-500 disabled:bg-slate-600 p-3 rounded font-semibold"
            >
              Create New Game
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-black text-slate-100 p-4 pb-20">
      <div className="max-w-3xl mx-auto mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-2xl font-bold text-amber-400">THE CITY ON DECK</h1>
            <p className="text-xs text-slate-400">Turn {gameState.turn}/50</p>
          </div>
          <button onClick={leaveGame} className="p-2 hover:bg-slate-700 rounded text-sm">
            <LogOut size={16} /> Leave
          </button>
        </div>

        <div className="bg-slate-700 p-3 rounded mb-4">
          <p className="text-xs text-slate-400 mb-2">Players ({players.length}):</p>
          <div className="flex flex-wrap gap-2">
            {players.map(p => (
              <div key={p.id} className="text-xs bg-slate-800 px-2 py-1 rounded text-cyan-300">
                {p.name}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-slate-700 p-3 rounded">
            <p className="text-xs text-slate-400">Upper Deck Unrest</p>
            <div className="w-full bg-slate-800 rounded h-2 mt-1">
              <div className="bg-blue-500 h-full rounded" style={{ width: `${gameState.unrest.upper}%` }}></div>
            </div>
            <p className="text-xs mt-1">{gameState.unrest.upper}%</p>
          </div>
          <div className="bg-slate-700 p-3 rounded">
            <p className="text-xs text-slate-400">Lower Deck Unrest</p>
            <div className="w-full bg-slate-800 rounded h-2 mt-1">
              <div className="bg-red-500 h-full rounded" style={{ width: `${gameState.unrest.lower}%` }}></div>
            </div>
            <p className="text-xs mt-1">{gameState.unrest.lower}%</p>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto mb-6">
        <h2 className="text-lg font-bold mb-3">📍 Locations</h2>
        <div className="bg-slate-700 p-3 rounded border border-slate-600">
          <p className="text-sm">🏛️ {gameState.deck === 'upper' ? 'Upper Deck' : 'Lower Deck'}</p>
          <button
            onClick={() => setGameState(prev => ({ ...prev, deck: prev.deck === 'upper' ? 'lower' : 'upper' }))}
            className="mt-2 w-full p-2 bg-slate-800 hover:bg-slate-600 rounded text-xs transition"
          >
            Move to {gameState.deck === 'upper' ? 'Lower' : 'Upper'} Deck
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto mb-6">
        <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
          <AlertCircle size={20} /> Events
        </h2>
        <div className="bg-slate-800 rounded p-4 border border-slate-700 text-xs">
          {gameState.log.slice(-3).reverse().map((entry, i) => (
            <p key={i} className="text-slate-300 mb-1">{entry}</p>
          ))}
        </div>
      </div>

      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => setGameState(prev => ({ ...prev, turn: prev.turn + 1 }))}
          className="w-full p-3 bg-green-700 hover:bg-green-600 font-semibold rounded"
        >
          End Turn (Turn {gameState.turn} → {gameState.turn + 1})
        </button>
      </div>
    </div>
  );
}
