import React, { useState, useEffect } from 'react';
import { Users, AlertCircle, MapPin, LogOut } from 'lucide-react';
import DialogueScreen from './components/DialogueScreen.jsx';
import EventScreen from './components/EventScreen.jsx';
import { npcs, getAvailableDialogue } from './data/npcs.js';
import { dialogues } from './data/dialogues.js';
import { worldEvents, getTriggeredEvents } from './data/worldEvents.js';

const defaultGameState = {
  turn: 1,
  deck: 'upper',
  resources: { influence: 15, wealth: 10, followers: 3 },
  unrest: { upper: 35, lower: 62 },
  loyalty: {
    captain_voss: 10,
    lucia_reeves: 15,
    marcus_steel: 8,
    tech_collective: 12,
  },
  log: ['You wake in your quarters. The ship hums with tension.'],
  gameEnded: false,
  ending: null,
};

export default function App() {
  const [gamePhase, setGamePhase] = useState('lobby');
  const [playerName, setPlayerName] = useState('');
  const [sessionCode, setSessionCode] = useState('');
  const [playerId, setPlayerId] = useState('');
  const [players, setPlayers] = useState([]);
  
  const [gameState, setGameState] = useState(defaultGameState);
  const [loading, setLoading] = useState(false);
  
  // New state for dialogue/event system
  const [currentDialogueNpc, setCurrentDialogueNpc] = useState(null);
  const [currentDialogueKey, setCurrentDialogueKey] = useState(null);
  const [currentWorldEvent, setCurrentWorldEvent] = useState(null);
  const [playerActionLog, setPlayerActionLog] = useState([]);
  const [hasWorldEvent, setHasWorldEvent] = useState(false);

  const locations = {
    upper: [
      { name: "Governor's Tower", npcId: 'captain_voss', control: 'Captain', activity: 'High' },
      { name: 'Merchant Quarter', npcId: 'lucia_reeves', control: 'Merchants', activity: 'Medium' },
      { name: 'Grand Plaza', npcId: null, control: 'Public', activity: 'Medium' },
    ],
    lower: [
      { name: 'Steel Works', npcId: 'marcus_steel', control: 'Labor', activity: 'High' },
      { name: 'Tech Market', npcId: 'tech_collective', control: 'Collective', activity: 'Variable' },
      { name: 'The Undercity', npcId: null, control: 'Unknown', activity: 'Low' },
    ],
  };

  // Check for world events at turn start
  useEffect(() => {
    if (gamePhase === 'game' && !hasWorldEvent) {
      const triggeredEvents = getTriggeredEvents(gameState.turn, gameState);
      if (triggeredEvents.length > 0) {
        const event = triggeredEvents[0];
        setCurrentWorldEvent(event.event);
        setHasWorldEvent(true);
      }
    }
  }, [gameState.turn, gamePhase, hasWorldEvent]);

  const createGame = () => {
    if (!playerName.trim()) return;
    setLoading(true);
    setTimeout(() => {
      const code = Math.random().toString(36).substring(2, 8).toUpperCase();
      const newPlayerId = Math.random().toString(36).substring(2, 9);
      setSessionCode(code);
      setPlayerId(newPlayerId);
      setGameState(defaultGameState);
      setPlayers([{ id: newPlayerId, name: playerName }]);
      setGamePhase('game');
      setLoading(false);
    }, 500);
  };

  const joinGame = () => {
    if (!playerName.trim()) return;
    setLoading(true);
    setTimeout(() => {
      const newPlayerId = Math.random().toString(36).substring(2, 9);
      setPlayerId(newPlayerId);
      setPlayers(prev => [...prev, { id: newPlayerId, name: playerName }]);
      setGamePhase('game');
      setLoading(false);
    }, 500);
  };

  const startDialogue = (npcId) => {
    const loyaltyLevel = gameState.loyalty[npcId] || 0;
    const dialogueKey = getAvailableDialogue(npcId, loyaltyLevel);
    if (dialogueKey && dialogues[dialogueKey]) {
      setCurrentDialogueNpc(npcs[npcId]);
      setCurrentDialogueKey(dialogueKey);
    }
  };

  const handleDialogueChoice = (choiceIndex, choice) => {
    // Update NPC loyalty
    const newLoyalty = { ...gameState.loyalty };
    if (choice.loyaltyChange) {
      const npcId = currentDialogueNpc.id;
      newLoyalty[npcId] = (newLoyalty[npcId] || 0) + choice.loyaltyChange;
      newLoyalty[npcId] = Math.max(0, Math.min(20, newLoyalty[npcId]));
    }

    // Log action
    const action = `${playerName} spoke with ${currentDialogueNpc.name}`;
    const newLog = [...gameState.log, action];
    if (choice.reveals) newLog.push(`  → ${choice.reveals}`);

    setGameState(prev => ({
      ...prev,
      loyalty: newLoyalty,
      log: newLog,
    }));

    setPlayerActionLog(prev => [...prev, action]);
    setCurrentDialogueNpc(null);
    setCurrentDialogueKey(null);
  };

  const handleEventChoice = (choiceIndex, choice) => {
    // Update unrest
    const newUnrest = { ...gameState.unrest };
    if (choice.unrestChange) {
      newUnrest.upper = Math.max(0, Math.min(100, newUnrest.upper + (choice.unrestChange.upper || 0)));
      newUnrest.lower = Math.max(0, Math.min(100, newUnrest.lower + (choice.unrestChange.lower || 0)));
    }

    // Update loyalty for multiple NPCs
    const newLoyalty = { ...gameState.loyalty };
    if (choice.loyaltyImpact) {
      Object.entries(choice.loyaltyImpact).forEach(([npcKey, change]) => {
        // Convert npc name to id
        const npcId = Object.keys(npcs).find(id => npcs[id].name.toLowerCase().replace(' ', '_') === npcKey);
        if (npcId) {
          newLoyalty[npcId] = (newLoyalty[npcId] || 0) + change;
          newLoyalty[npcId] = Math.max(0, Math.min(20, newLoyalty[npcId]));
        }
      });
    }

    // Handle ending
    if (choice.ending) {
      setGameState(prev => ({
        ...prev,
        gameEnded: true,
        ending: choice.ending,
        unrest: newUnrest,
        loyalty: newLoyalty,
        log: [...prev.log, `⚔️ THE FINAL CHOICE: ${choice.text}`],
      }));
      setCurrentWorldEvent(null);
      setHasWorldEvent(false);
      return;
    }

    // Log action
    const action = `${playerName} chose: ${choice.text}`;
    const newLog = [...gameState.log, action];
    if (choice.reveals) newLog.push(`  → ${choice.reveals}`);

    setGameState(prev => ({
      ...prev,
      unrest: newUnrest,
      loyalty: newLoyalty,
      log: newLog,
    }));

    setPlayerActionLog(prev => [...prev, action]);
    setCurrentWorldEvent(null);
    setHasWorldEvent(false);
  };

  const advanceTurn = () => {
    if (gameState.turn >= 50) {
      setGameState(prev => ({ ...prev, gameEnded: true, ending: 'turns_expired' }));
    } else {
      setGameState(prev => ({ ...prev, turn: prev.turn + 1 }));
    }
  };

  const leaveGame = () => {
    setGamePhase('lobby');
    setPlayerName('');
    setSessionCode('');
    setPlayers([]);
    setGameState(defaultGameState);
    setCurrentDialogueNpc(null);
    setCurrentWorldEvent(null);
    setPlayerActionLog([]);
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
              disabled={!playerName.trim() || loading}
              className="w-full bg-amber-600 hover:bg-amber-500 disabled:bg-slate-600 p-3 rounded font-semibold"
            >
              {loading ? 'Creating...' : 'Create New Game'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (gameState.gameEnded) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-black text-slate-100 p-4 flex items-center justify-center">
        <div className="max-w-md w-full text-center">
          <h1 className="text-3xl font-bold text-amber-400 mb-4">GAME OVER</h1>
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 mb-6">
            <p className="text-lg font-semibold text-amber-300 mb-4">
              Ending: {gameState.ending.toUpperCase()}
            </p>
            <p className="text-slate-300 mb-6">
              You survived {gameState.turn} turns on the City on Deck.
            </p>
            <p className="text-sm text-slate-400">Final Unrest:</p>
            <p className="text-slate-300">Upper: {gameState.unrest.upper}% / Lower: {gameState.unrest.lower}%</p>
          </div>
          <button
            onClick={leaveGame}
            className="w-full bg-amber-600 hover:bg-amber-500 p-3 rounded font-semibold"
          >
            Return to Lobby
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-black text-slate-100 p-4 pb-20">
      {/* Dialogue and Event Overlays */}
      {currentDialogueNpc && currentDialogueKey && (
        <DialogueScreen
          npc={currentDialogueNpc}
          dialogue={dialogues[currentDialogueKey]}
          onChoice={handleDialogueChoice}
          onClose={() => setCurrentDialogueNpc(null)}
        />
      )}
      
      {currentWorldEvent && (
        <EventScreen
          event={currentWorldEvent}
          onChoice={handleEventChoice}
          playerName={playerName}
        />
      )}

      {/* Header */}
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

        {/* Status */}
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

      {/* Locations and NPCs */}
      <div className="max-w-3xl mx-auto mb-6">
        <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
          <MapPin size={20} /> {gameState.deck === 'upper' ? '🏛️ Upper Deck' : '⚙️ Lower Deck'}
        </h2>
        <div className="space-y-2">
          {locations[gameState.deck].map((loc, i) => (
            <div key={i} className="p-3 bg-slate-700 rounded border border-slate-600">
              <p className="font-semibold text-sm">{loc.name}</p>
              {loc.npcId && (
                <button
                  onClick={() => startDialogue(loc.npcId)}
                  className="mt-2 text-xs bg-amber-700 hover:bg-amber-600 px-3 py-1 rounded transition"
                >
                  Talk to {npcs[loc.npcId].name}
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Deck Toggle */}
        <button
          onClick={() => setGameState(prev => ({ ...prev, deck: prev.deck === 'upper' ? 'lower' : 'upper' }))}
          className="w-full mt-4 p-2 bg-slate-700 hover:bg-slate-600 rounded text-xs transition"
        >
          Move to {gameState.deck === 'upper' ? 'Lower' : 'Upper'} Deck
        </button>
      </div>

      {/* Recent Events */}
      <div className="max-w-3xl mx-auto mb-6">
        <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
          <AlertCircle size={20} /> Events
        </h2>
        <div className="bg-slate-800 rounded p-4 border border-slate-700 max-h-32 overflow-y-auto text-xs">
          {gameState.log.slice(-6).reverse().map((entry, i) => (
            <p key={i} className="text-slate-300 mb-1 italic">{entry}</p>
          ))}
        </div>
      </div>

      {/* Action Button */}
      <div className="max-w-3xl mx-auto">
        <button
          onClick={advanceTurn}
          disabled={currentDialogueNpc || currentWorldEvent}
          className="w-full p-3 bg-green-700 hover:bg-green-600 disabled:bg-slate-600 font-semibold rounded transition"
        >
          End Turn (Turn {gameState.turn} → {gameState.turn + 1})
        </button>
      </div>
    </div>
  );
}
