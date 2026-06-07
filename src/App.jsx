import React, { useState } from 'react';
import { Users, AlertCircle, MapPin, LogOut, X } from 'lucide-react';

// NPC Data
const npcs = {
  captain_voss: { id: 'captain_voss', name: 'Captain Voss', deck: 'upper', location: "Governor's Tower", description: 'Controls the ship. Pragmatic but pressured.', initialLoyalty: 10 },
  lucia_reeves: { id: 'lucia_reeves', name: 'Lucia Reeves', deck: 'upper', location: 'Merchant Quarter', description: 'Upper Deck elite. Values stability.', initialLoyalty: 15 },
  marcus_steel: { id: 'marcus_steel', name: 'Marcus Steel', deck: 'lower', location: 'Steel Works', description: 'Underground organizer. Passionate about equality.', initialLoyalty: 8 },
  tech_collective: { id: 'tech_collective', name: 'The Collective', deck: 'lower', location: 'Tech Market', description: 'Hackers & engineers. Goals unclear.', initialLoyalty: 12 },
};

// Dialogues
const dialogues = {
  captain_voss: [
    { text: 'Captain Voss regards you from behind his desk. "What brings you here?"', choices: [{ text: 'Tell me what\'s really happening', loyaltyChange: 1 }, { text: 'I support the establishment', loyaltyChange: 2 }, { text: 'I\'m just passing through', loyaltyChange: 0 }] },
    { text: 'The captain looks tired. "Things are getting worse. Unrest, shortages... I need people I can trust."', choices: [{ text: 'I\'ll help you', loyaltyChange: 2 }, { text: 'Maybe the lower decks have a point', loyaltyChange: -1 }] },
  ],
  lucia_reeves: [
    { text: 'Lucia Reeves smiles. "I don\'t believe we\'ve met. New arrival?"', choices: [{ text: 'I\'m learning how things work', loyaltyChange: 1 }, { text: 'I\'m interested in business', loyaltyChange: 2 }, { text: 'I\'m concerned about the chaos below', loyaltyChange: -1 }] },
    { text: '"The problem is control," she confides. "If the lower decks challenge us, everything collapses."', choices: [{ text: 'I\'ll help maintain stability', loyaltyChange: 2 }, { text: 'Maybe change isn\'t all bad', loyaltyChange: -1 }] },
  ],
  marcus_steel: [
    { text: 'A figure emerges from the shadows. "You\'re new here. Most people avoid this place."', choices: [{ text: 'I\'m trying to understand the truth', loyaltyChange: 1 }, { text: 'I work for the captain', loyaltyChange: -2 }, { text: 'I just want to survive', loyaltyChange: 1 }] },
    { text: '"The upper decks hoard everything. We\'re starving while they feast. We\'re organizing."', choices: [{ text: 'How can I help?', loyaltyChange: 2 }, { text: 'This sounds dangerous', loyaltyChange: -1 }] },
  ],
  tech_collective: [
    { text: 'A voice from the shadows: "You\'re asking questions. Which are you—useful or a problem?"', choices: [{ text: 'I want the truth', loyaltyChange: 1 }, { text: 'I\'m just trying to survive', loyaltyChange: 0 }] },
    { text: '"We can see everything. Communications, resources, secrets. All encrypted until we choose otherwise."', choices: [{ text: 'Show me something important', loyaltyChange: 1 }, { text: 'Who do you work for?', loyaltyChange: 0 }] },
  ],
};

// Dialogue Screen Component
function DialogueScreen({ npc, dialogueIndex, onChoice, onClose, loyalty }) {
  const dialogue = dialogues[npc.id][dialogueIndex];
  if (!dialogue) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-end z-50">
      <div className="w-full bg-slate-900 border-t-2 border-amber-500 p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-xl font-bold text-amber-300">{npc.name}</h2>
            <p className="text-xs text-slate-400">{npc.location}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200">
            <X size={20} />
          </button>
        </div>

        <div className="mb-4">
          <p className="text-xs text-slate-400 mb-1">Disposition: {loyalty}/20</p>
          <div className="w-full bg-slate-700 rounded h-2">
            <div className="bg-amber-500 h-full rounded" style={{ width: `${(loyalty / 20) * 100}%` }}></div>
          </div>
        </div>

        <div className="bg-slate-800 p-4 rounded mb-6 border border-slate-700">
          <p className="text-slate-100 text-sm leading-relaxed italic">"{dialogue.text}"</p>
        </div>

        <div className="space-y-2">
          {dialogue.choices.map((choice, idx) => (
            <button
              key={idx}
              onClick={() => onChoice(idx, choice)}
              className="w-full text-left p-3 bg-slate-800 border border-slate-600 rounded hover:border-amber-500 hover:bg-slate-700 transition text-sm text-slate-100"
            >
              <span>{choice.text}</span>
              {choice.loyaltyChange > 0 && <span className="float-right text-green-400 text-xs">+{choice.loyaltyChange}</span>}
              {choice.loyaltyChange < 0 && <span className="float-right text-red-400 text-xs">{choice.loyaltyChange}</span>}
            </button>
          ))}
        </div>

        <button onClick={onClose} className="w-full mt-4 p-2 text-xs text-slate-400 hover:text-slate-200 transition">
          Close Conversation
        </button>
      </div>
    </div>
  );
}

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
    loyalty: { captain_voss: 10, lucia_reeves: 15, marcus_steel: 8, tech_collective: 12 },
    log: ['You wake in your quarters. The ship hums with tension.'],
  });

  const [currentDialogueNpc, setCurrentDialogueNpc] = useState(null);
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [sharedActionLog, setSharedActionLog] = useState(['Game started. Multiple players online.']);
  
  const otherPlayers = [
    { id: 'p2', name: 'Sarah', deck: 'upper', status: 'In negotiation' },
    { id: 'p3', name: 'Viktor', deck: 'lower', status: 'Gathering intel' },
  ];

  const locations = {
    upper: [
      { name: "Governor's Tower", npcId: 'captain_voss' },
      { name: 'Merchant Quarter', npcId: 'lucia_reeves' },
      { name: 'Grand Plaza', npcId: null },
    ],
    lower: [
      { name: 'Steel Works', npcId: 'marcus_steel' },
      { name: 'Tech Market', npcId: 'tech_collective' },
      { name: 'The Undercity', npcId: null },
    ],
  };

  const startDialogue = (npcId) => {
    setCurrentDialogueNpc(npcs[npcId]);
    setDialogueIndex(0);
  };

  const handleDialogueChoice = (choiceIndex, choice) => {
    const newLoyalty = { ...gameState.loyalty };
    newLoyalty[currentDialogueNpc.id] = Math.max(0, Math.min(20, newLoyalty[currentDialogueNpc.id] + choice.loyaltyChange));

    const playerAction = `🎭 ${playerName} spoke with ${currentDialogueNpc.name}: "${choice.text}"`;
    const newLog = [...gameState.log, playerAction];
    const newSharedLog = [...sharedActionLog, playerAction];

    setGameState(prev => ({ ...prev, loyalty: newLoyalty, log: newLog }));
    setSharedActionLog(newSharedLog);

    if (dialogueIndex < dialogues[currentDialogueNpc.id].length - 1) {
      setDialogueIndex(dialogueIndex + 1);
    } else {
      setCurrentDialogueNpc(null);
    }
  };

  const simulateOtherPlayersAction = () => {
    const otherPlayerActions = [
      `🎭 Sarah spoke with Captain Voss: "I support whatever keeps this ship running"`,
      `🎭 Viktor spoke with Marcus Steel: "How can I help?"`,
      `🎭 Sarah spoke with Lucia Reeves: "I'm interested in business"`,
      `🎭 Viktor spoke with The Collective: "Show me something important"`,
      `📊 Sarah moved to Lower Deck`,
      `📊 Viktor moved to Upper Deck`,
      `💡 Sarah is gathering intelligence...`,
      `💪 Viktor is recruiting followers...`,
    ];
    
    const numActions = Math.random() > 0.6 ? 2 : 1;
    const actions = [];
    for (let i = 0; i < numActions; i++) {
      actions.push(otherPlayerActions[Math.floor(Math.random() * otherPlayerActions.length)]);
    }
    
    setSharedActionLog(prev => [...prev, ...actions]);
  };

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
    setCurrentDialogueNpc(null);
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
      {currentDialogueNpc && (
        <DialogueScreen npc={currentDialogueNpc} dialogueIndex={dialogueIndex} onChoice={handleDialogueChoice} onClose={() => setCurrentDialogueNpc(null)} loyalty={gameState.loyalty[currentDialogueNpc.id]} />
      )}

      <div className="max-w-3xl mx-auto mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-2xl font-bold text-amber-400">THE CITY ON DECK</h1>
            <p className="text-xs text-slate-400">Turn {gameState.turn}/50 • Session: {sessionCode}</p>
          </div>
          <button onClick={leaveGame} className="p-2 hover:bg-slate-700 rounded text-sm"><LogOut size={16} /> Leave</button>
        </div>

        <div className="bg-slate-700 p-3 rounded mb-4">
          <p className="text-xs text-slate-400 mb-2">Players in Session ({players.length + otherPlayers.length}):</p>
          <div className="space-y-1">
            <div className="flex justify-between items-center text-xs bg-slate-800 px-2 py-1 rounded text-cyan-300">
              <span>👤 {playerName} (You)</span>
              <span className="text-slate-500">🏛️ {gameState.deck}</span>
            </div>
            {otherPlayers.map(p => (
              <div key={p.id} className="flex justify-between items-center text-xs bg-slate-800 px-2 py-1 rounded text-amber-300">
                <span>👥 {p.name}</span>
                <span className="text-slate-500">{p.status}</span>
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
        <h2 className="text-lg font-bold mb-3 flex items-center gap-2"><MapPin size={20} /> {gameState.deck === 'upper' ? '🏛️ Upper Deck' : '⚙️ Lower Deck'}</h2>
        <div className="space-y-2">
          {locations[gameState.deck].map((loc, i) => (
            <div key={i} className="p-3 bg-slate-700 rounded border border-slate-600">
              <p className="font-semibold text-sm">{loc.name}</p>
              {loc.npcId && (
                <div className="mt-2 space-y-1">
                  <p className="text-xs text-slate-400">{npcs[loc.npcId].description}</p>
                  <button onClick={() => startDialogue(loc.npcId)} className="text-xs bg-amber-700 hover:bg-amber-600 px-3 py-1 rounded transition">
                    Talk to {npcs[loc.npcId].name}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        <button onClick={() => setGameState(prev => ({ ...prev, deck: prev.deck === 'upper' ? 'lower' : 'upper' }))} className="w-full mt-4 p-2 bg-slate-700 hover:bg-slate-600 rounded text-xs transition">
          Move to {gameState.deck === 'upper' ? 'Lower' : 'Upper'} Deck
        </button>
      </div>

      <div className="max-w-3xl mx-auto mb-6">
        <h2 className="text-lg font-bold mb-3 flex items-center gap-2"><Users size={20} /> NPC Loyalty</h2>
        <div className="space-y-2">
          {Object.values(npcs).map(npc => (
            <div key={npc.id} className="p-3 bg-slate-700 rounded border border-slate-600">
              <div className="flex justify-between items-center mb-1">
                <p className="font-semibold text-sm text-amber-300">{npc.name}</p>
                <p className="text-xs text-slate-400">{gameState.loyalty[npc.id]}/20</p>
              </div>
              <div className="w-full bg-slate-800 rounded h-2">
                <div className="bg-amber-500 h-full rounded" style={{ width: `${(gameState.loyalty[npc.id] / 20) * 100}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-3xl mx-auto mb-6">
        <h2 className="text-lg font-bold mb-3 flex items-center gap-2"><AlertCircle size={20} /> Shared Game Log (All Players)</h2>
        <div className="bg-slate-800 rounded p-4 border border-slate-700 text-xs max-h-48 overflow-y-auto space-y-1">
          {sharedActionLog.slice(-10).reverse().map((action, i) => (
            <p key={i} className="text-slate-300">{action}</p>
          ))}
        </div>
      </div>

      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => {
            setGameState(prev => ({ ...prev, turn: prev.turn + 1 }));
            simulateOtherPlayersAction();
          }}
          disabled={currentDialogueNpc !== null}
          className="w-full p-3 bg-green-700 hover:bg-green-600 disabled:bg-slate-600 font-semibold rounded transition"
        >
          End Turn (Turn {gameState.turn} → {gameState.turn + 1})
        </button>
        <p className="text-xs text-slate-400 text-center mt-2">📝 Other players will take actions - check the log below!</p>
      </div>
    </div>
  );
}
