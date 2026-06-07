// NPC Database - Define all NPCs with their dialogue gates and properties

export const npcs = {
  captain_voss: {
    id: 'captain_voss',
    name: 'Captain Voss',
    deck: 'upper',
    location: "Governor's Tower",
    description: 'Controls the ship. Pragmatic but under pressure.',
    initialLoyalty: 10,
    factionAlignment: 'establishment',
    dialogueGates: [
      { minLoyalty: 0, dialogueKey: 'captain_greeting' },
      { minLoyalty: 2, dialogueKey: 'captain_pressure' },
      { minLoyalty: 4, dialogueKey: 'captain_confession' },
    ],
    questChain: ['investigate_sabotage', 'restore_order', 'final_choice_captain'],
  },
  
  lucia_reeves: {
    id: 'lucia_reeves',
    name: 'Lucia Reeves',
    deck: 'upper',
    location: 'Merchant Quarter',
    description: 'Upper Deck elite. Fears change and chaos.',
    initialLoyalty: 15,
    factionAlignment: 'establishment',
    dialogueGates: [
      { minLoyalty: 0, dialogueKey: 'lucia_greeting' },
      { minLoyalty: 2, dialogueKey: 'lucia_concerns' },
      { minLoyalty: 4, dialogueKey: 'lucia_proposal' },
    ],
    questChain: ['secure_resources', 'protect_upper_deck'],
  },

  marcus_steel: {
    id: 'marcus_steel',
    name: 'Marcus Steel',
    deck: 'lower',
    location: 'Steel Works',
    description: 'Underground organizer. Passionate about equality.',
    initialLoyalty: 8,
    factionAlignment: 'revolution',
    dialogueGates: [
      { minLoyalty: 0, dialogueKey: 'marcus_greeting' },
      { minLoyalty: 2, dialogueKey: 'marcus_movement' },
      { minLoyalty: 4, dialogueKey: 'marcus_revolution' },
    ],
    questChain: ['gather_intelligence', 'rally_support', 'final_choice_marcus'],
  },

  tech_collective: {
    id: 'tech_collective',
    name: 'The Collective',
    deck: 'lower',
    location: 'Tech Market',
    description: 'Hackers & engineers. Goals unclear, power significant.',
    initialLoyalty: 12,
    factionAlignment: 'neutral',
    dialogueGates: [
      { minLoyalty: 0, dialogueKey: 'tech_first_contact' },
      { minLoyalty: 2, dialogueKey: 'tech_capabilities' },
      { minLoyalty: 4, dialogueKey: 'tech_revelation' },
    ],
    questChain: ['decrypt_files', 'gain_control', 'final_choice_tech'],
  },
};

// Helper function to get NPC by ID
export const getNpcById = (id) => npcs[id];

// Helper function to get available dialogue for an NPC given their loyalty
export const getAvailableDialogue = (npcId, npcLoyalty) => {
  const npc = npcs[npcId];
  if (!npc) return null;
  
  // Find the highest gate they've passed
  const availableGate = npc.dialogueGates
    .filter(gate => gate.minLoyalty <= npcLoyalty)
    .sort((a, b) => b.minLoyalty - a.minLoyalty)[0];
  
  return availableGate?.dialogueKey || null;
};s
