import React, { useState, useEffect } from 'react';
import { Users, AlertCircle, MapPin, LogOut } from 'lucide-react';

const defaultGameState = {
  turn: 1,
  deck: 'upper',
  alignment: 'neutral',
  resources: { influence: 15, wealth: 10, followers: 3 },
  unrest: { upper: 35, lower: 62 },
  loyalty: { captain: 10, merchants: 15, labor: 8, tech_guild: 12 },
  log: ['You wake in your quarters. The ship hums with tension.'],
};

export default function App() {
  const [gamePhase, setGamePhase] = useState('lobby');
  const [playerName, setPlayerName] = useState('');
  const [sessionCode, setSessionCode] = useState('');
  const [playerId, setPlayerId] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [players, setPlayers] = useState([]);
  const [gameState, setGameState] = useState(defaultGameState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const npcs = {
    captain: { name: 'Captain Voss', deck: 'upper', loyalty: gameState.loyalty.captain, desc: 'Controls the ship. Pragmatic.' },
    merchant_lord: { name: 'Lucia Reeves', deck: 'upper', loyalty: gameState.loyalty.merchants, desc: 'Upper Deck elite. Fears change.' },
    labor_lead: { name: 'Marcus Steel', deck: 'lower', loyalty: gameState.loyalty.labor, desc: 'Underground organizer. Revolutionary.' },
    tech_guild: { name: 'The Collective', deck: 'lower', loyalty: gameState.loyalty.tech_guild, desc: 'Hackers & engineers. Wild card.' },
  };

  const locations = {
    upper: [
      { name: 'Grand Plaza', control: 'Establishment', activity: 'High', security: 'Heavy' },
      { name: 'Merchant Quarter', control: 'Establishment', activity: 'Medium', security: 'Medium' },
      { name: 'Governor\'s Tower', control: 'Establishment', activity: 'Low', security: 'Extreme' },
    ],
    lower: [
      { name: 'Steel Works', control: 'Revolution', activity: 'High', security: 'Light' },
      { name: 'Tech Market', control: 'Contested', activity: 'Medium', security: 'Variable' },
      { name: 'The Undercity', control: 'Revolution', activity: 'Low', security: 'Unknown' },
    ],
  };

  const actions = [
    {
      title: 'Recruit Followers',
      cost: { influence: 3 },
      effect: () => ({
        resources: { ...gameState.resources, followers: gameState.resources.followers + 2, influence: gameState.resources.influence - 3 },
        log: [...gameState.log, `${playerName} gathers sympathizers. Word spreads.`],
        unrest: { ...gameState.unrest, [gameState.deck]: gameState.unrest[gameState.deck] + 5 }
      }),
      desc: 'Gain 2 followers. Raise local unrest.',
    },
    {
      title: 'Gather Intelligence',
      cost: { influence: 2 },
      effect: () => ({
        log: [...gameState.log, gameState.deck === 'upper' ? `${playerName} uncovers merchant secrets.` : `${playerName} contacts the tech collective.`],
        resources: gameState.resources,
        unrest: gameState.unrest,
      }),
      desc: 'Learn faction secrets.',
    },
    {
      title: 'Sabotage Operations',
      cost: { influence: 4, followers: 2 },
      effect: () => ({
        resources: { ...gameState.resources, influence: gameState.resources.influence - 4, followers: gameState.resources.followers - 2 },
        log: [...gameState.log, `${playerName} causes chaos in ${gameState.deck === 'upper' ? 'the Grand Plaza' : 'the Tech Market'}.`],
        unrest: { ...gameState.unrest, [gameState.deck]: gameState.unrest[gameState.deck] + 12 }
      }),
      desc: 'Major chaos. +12 unrest.',
    },
    {
      title: 'Sway an NPC',
      cost: { wealth: 3, influence: 2 },
      effect: () => {
        const npcKey = gameState.deck === 'upper' ? 'merchants' : 'labor';
        return {
          resources: { ...gameState.resources, wealth: gameState.resources.wealth - 3, influence: gameState.resources.influence - 2 },
          loyalty: { ...gameState.loyalty, [npcKey]: gameState.loyalty[npcKey] + 8 },
          log: [...gameState.log, `${playerName} gains favor with a key figure.`],
          unrest: gameState.unrest,
        };
      },
      desc: 'Increase faction loyalty.',
    },
    {
      title: 'Move Between Decks',
      cost: {},
      effect: () => ({
        deck: gameState.deck === 'upper' ? 'lower' : 'upper',
        log: [...gameState.log, `${playerName} moves to the ${gameState.deck === 'upper' ? 'Lower' : 'Upper'} Deck.`],
        resources: gameState.resources,
        unrest: gameState.unrest,
      }),
      desc: 'Travel to the other deck.',
    },
  ];

  const canAfford = (action) => {
    return Object.entries(action.cost).every(([res, amt]) => gameState.resources[res] >= amt);
  };

  const createGame = () => {
    if (!playerName.trim()) return;
    setLoading(true);

    setTimeout(() => {
      const code = Math.random().toString(36).substring(2, 8).toUpperCase();
      const newPlayerId = Math.random().toString(36).substring(2, 9);

      setSessionCode(code);
      setPlayerId(newPlayerId);
      setGameState(defaultGameState);
      setPlayers([{ id: newPlayerId, name: playerName, joinedAt: new Date().toISOString() }]);
      setGamePhase('game');
      setLoading(false);
    }, 500);
  };

  const joinGame = () => {
    if (!playerName.trim() || !joinCode.trim()) return;
    setLoading(true);

    setTimeout(() => {
      const newPlayerId = Math.random().toString(36).substring(2, 9);

      setSessionCode(joinCode);
      setPlayerId(newPlayerId);
      setPlayers(prev => [...prev, { id: newPlayerId, name: playerName, joinedAt: new Date().toISOString() }]);
      setGamePhase('game');
      setLoading(false);
    }, 500);
  };

  const executeAction = (action) => {
    if (!canAfford(action)) return;

    const result = action.effect();
    const newState = {
      ...gameState,
      ...result,
      turn: gameState.turn + 1,
      resources: result.resources || gameState.resources,
      unrest: result.unrest || gameState.unrest,
      loyalty: result.loyalty || gameState.loyalty,
      log: result.log || gameState.log,
    };

    setGameState(newState);
  };

  const leaveGame = () => {
    setGamePhase('lobby');
    setPlayerName('');
    setJoinCode('');
    setSessionCode('');
    setPlayers([]);
    setGameState(defaultGameState);
    setError('');
  };

  const getAlignmentColor = () => {
    const totalLoyalty = gameState.loyalty.merchants + gameState.loyalty.captain;
    const revLoyalty = gameState.loyalty.labor + gameState.loyalty.tech_guild;
    if (totalLoyalty > revLoyalty + 10) return 'bg-blue-900';
    if (revLoyalty > totalLoyalty + 10) return 'bg-red-900';
    return 'bg-purple-900';
  };

  if (gamePhase === 'lobby') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-black text-slate-100 p-4 flex items-center justify-center">
        <div className="max-w-md w-full">
          <h1 className="text-3xl font-bold text-amber-400 mb-2 text-center">THE CITY ON DECK</h1>
          <p className="text-sm text-slate-400 text-center mb-8">A strategy game of power and revolution</p>

          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 space-y-4">
            {error && (
              <div className="bg-red-900 border border-red-700 p-3 rounded text-sm text-red-200">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm mb-2">Your Name</label>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Enter your name"
                className="w-full bg-slate-700 border border-slate-600 rounded p-2 text-slate-100 placeholder-slate-500"
              />
            </div>

            <button
              onClick={createGame}
              disabled={!playerName.trim() || loading}
              className="w-full bg-amber-600 hover:bg-amber-500 disabled:bg-slate-600 disabled:cursor-not-allowed p-3 rounded font-semibold transition"
            >
              {loading ? 'Creating...' : 'Create New Game'}
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-slate-800 text-slate-400">or</span>
              </div>
            </div>

            <div>
              <label className="block text-sm mb-2">Join Code</label>
              <input
                type="text"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                placeholder="Enter 6-letter code"
                maxLength="6"
                className="w-full bg-slate-700 border border-slate-600 rounded p-2 text-slate-100 placeholder-slate-500 uppercase"
              />
            </div>

            <button
              onClick={joinGame}
              disabled={!playerName.trim() || joinCode.length !== 6 || loading}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-600 disabled:cursor-not-allowed p-3 rounded font-semibold transition"
            >
              {loading ? 'Joining...' : 'Join Game'}
            </button>

            <div className="bg-amber-900 p-3 rounded border border-amber-700">
              <p className="text-xs text-amber-200">📝 Note: This prototype works locally. Once deployed to Vercel with Firebase, multiplayer sync will be active!</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-black text-slate-100 p-4 pb-20">
      <div className="max-w-2xl mx-auto mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-2xl font-bold text-amber-400 mb-1">THE CITY ON DECK</h1>
            <p className="text-xs text-slate-400">Session: <span className="text-amber-300 font-mono">{sessionCode}</span></p>
          </div>
          <button
            onClick={leaveGame}
            className="p-2 hover:bg-slate-700 rounded transition flex items-center gap-1 text-sm"
          >
            <LogOut size={16} /> Leave
          </button>
        </div>

        <div className="bg-slate-700 p-3 rounded border border-slate-600 mb-4">
          <p className="text-xs text-slate-400 mb-2">Players ({players.length}):</p>
          <div className="flex flex-wrap gap-2">
            {players.map(p => (
              <div key={p.id} className="text-xs bg-slate-800 px-2 py-1 rounded text-cyan-300">
                {p.name} {p.id === playerId && ' (you)'}
              </div>
            ))}
          </div>
        </div>

        <p className="text-sm text-slate-400">Turn {gameState.turn} • {gameState.deck === 'upper' ? '🏛️ Upper Deck' : '⚙️ Lower Deck'}</p>
      </div>

      <div className={`max-w-2xl mx-auto mb-6 p-4 rounded-lg border border-slate-700 ${getAlignmentColor()}`}>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-xs text-slate-300 mb-1">Upper Deck Unrest</p>
            <div className="w-full bg-slate-800 rounded h-3">
              <div className="bg-blue-500 h-full rounded" style={{ width: `${gameState.unrest.upper}%` }}></div>
            </div>
            <p className="text-xs mt-1">{gameState.unrest.upper}%</p>
          </div>
          <div>
            <p className="text-xs text-slate-300 mb-1">Lower Deck Unrest</p>
            <div className="w-full bg-slate-800 rounded h-3">
              <div className="bg-red-500 h-full rounded" style={{ width: `${gameState.unrest.lower}%` }}></div>
            </div>
            <p className="text-xs mt-1">{gameState.unrest.lower}%</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center text-sm">
          <div><span className="text-amber-400">⚡</span> {gameState.resources.influence}</div>
          <div><span className="text-yellow-400">💰</span> {gameState.resources.wealth}</div>
          <div><span className="text-cyan-400">👥</span> {gameState.resources.followers}</div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto mb-6">
        <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
          <MapPin size={20} /> Locations
        </h2>
        <div className="space-y-2">
          {locations[gameState.deck].map((loc, i) => (
            <div key={i} className="p-3 bg-slate-700 rounded border border-slate-600 text-sm">
              <p className="font-semibold">{loc.name}</p>
              <p className="text-xs text-slate-400">Control: {loc.control} • Activity: {loc.activity}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-2xl mx-auto mb-6">
        <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
          <Users size={20} /> Key Figures
        </h2>
        <div className="space-y-2">
          {Object.entries(npcs).filter(([_, npc]) => npc.deck === gameState.deck).map(([key, npc]) => (
            <div key={key} className="p-3 bg-slate-700 rounded border border-amber-700 text-sm">
              <p className="font-semibold text-amber-300">{npc.name}</p>
              <p className="text-xs text-slate-400 mb-2">{npc.desc}</p>
              <div className="bg-slate-800 rounded h-2">
                <div className="bg-amber-500 h-full rounded" style={{ width: `${(npc.loyalty / 20) * 100}%` }}></div>
              </div>
              <p className="text-xs mt-1">Loyalty: {npc.loyalty}/20</p>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-2xl mx-auto mb-6">
        <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
          <AlertCircle size={20} /> Recent Events
        </h2>
        <div className="bg-slate-800 rounded p-4 border border-slate-700 max-h-32 overflow-y-auto text-sm">
          {gameState.log.slice(-4).reverse().map((entry, i) => (
            <p key={i} className="text-slate-300 mb-2 text-xs italic">
              {entry}
            </p>
          ))}
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        <h2 className="text-lg font-bold mb-3">Available Actions</h2>
        <div className="space-y-3">
          {actions.map((action, i) => {
            const affordable = canAfford(action);
            return (
              <button
                key={i}
                onClick={() => executeAction(action)}
                disabled={!affordable}
                className={`w-full p-4 rounded border text-left transition ${
                  affordable
                    ? 'bg-slate-700 border-slate-600 hover:border-amber-500 hover:bg-slate-600 cursor-pointer'
                    : 'bg-slate-800 border-slate-700 text-slate-500 cursor-not-allowed'
                }`}
              >
                <p className="font-semibold text-amber-300">{action.title}</p>
                <p className="text-xs text-slate-400 my-1">{action.desc}</p>
                {Object.keys(action.cost).length > 0 && (
                  <p className="text-xs text-slate-500">
                    Cost: {Object.entries(action.cost).map(([res, amt]) => `${amt} ${res}`).join(', ')}
                  </p>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}