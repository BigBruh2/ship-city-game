// World Events Database - Events that trigger based on conditions

export const worldEvents = [
  {
    id: 'first_tension',
    triggerTurn: 3,
    triggerCondition: () => true, // Always happens on turn 3
    event: {
      text: 'You hear alarms echo through the corridors. Something has happened in the cargo hold.',
      choices: [
        {
          text: 'Investigate immediately',
          reveals: 'You witness supply crates damaged. Sabotage or accident?',
          loyaltyImpact: { rebels: 1, establishment: -1 },
          unrestChange: { upper: 5, lower: 10 },
        },
        {
          text: 'Wait for official information',
          reveals: 'Captain addresses crew: "Equipment malfunction. Nothing to worry about."',
          loyaltyImpact: { establishment: 1 },
          unrestChange: { upper: 0, lower: 5 },
        },
        {
          text: 'Stay away from trouble',
          reveals: 'Rumors spread. You learn little, but draw no attention.',
          loyaltyImpact: {},
          unrestChange: { upper: 3, lower: 8 },
        },
      ],
    },
  },

  {
    id: 'food_shortage_revealed',
    triggerTurn: 10,
    triggerCondition: (gameState) => gameState.unrest.lower > 50,
    event: {
      text: 'News spreads like wildfire: food rations in the lower decks are being cut again. People are frightened.',
      choices: [
        {
          text: 'Demand answers from the captain',
          reveals: 'He admits supplies are critical. Very critical.',
          loyaltyImpact: { captain: 1 },
          unrestChange: { lower: 15 },
        },
        {
          text: 'Spread the word to Marcus',
          reveals: 'Marcus: "This is exactly what we\'ve been warning about."',
          loyaltyImpact: { marcus: 2 },
          unrestChange: { lower: 20 },
        },
        {
          text: 'Suggest rationing to the merchants',
          reveals: 'They resist fiercely. "The lower decks can manage."',
          loyaltyImpact: { lucia: 1 },
          unrestChange: { lower: 25 },
        },
      ],
    },
  },

  {
    id: 'spy_caught',
    triggerTurn: 15,
    triggerCondition: (gameState) => gameState.loyalty.captain > 3 && gameState.loyalty.marcus > 2,
    event: {
      text: 'A figure is dragged through the corridors by security. Whispers say they were caught relaying information between decks.',
      choices: [
        {
          text: 'This is how both sides operate. Learn from it.',
          reveals: 'You now understand the depth of the conflict.',
          loyaltyImpact: { tech: 1 },
          unrestChange: { upper: 5, lower: 10 },
        },
        {
          text: 'Demand the person be released',
          reveals: 'Captain refuses. You\'ve made an enemy.',
          loyaltyImpact: { captain: -2, marcus: 1 },
          unrestChange: { upper: 0, lower: 15 },
        },
        {
          text: 'Defend the captain\'s decision',
          reveals: 'The rebels view this as a betrayal of neutrality.',
          loyaltyImpact: { captain: 2, marcus: -2 },
          unrestChange: { upper: -5, lower: 20 },
        },
      ],
    },
  },

  {
    id: 'tech_revelation',
    triggerTurn: 20,
    triggerCondition: (gameState) => gameState.loyalty.tech > 2,
    event: {
      text: 'The Collective arranges a secret meeting. They reveal that the ship\'s systems are degrading. Life support, water recycling—all critical.',
      choices: [
        {
          text: 'Go public with this information',
          reveals: 'Chaos erupts. Both sides blame each other for the coverup.',
          loyaltyImpact: { tech: 2, captain: -2, lucia: -2 },
          unrestChange: { upper: 20, lower: 25 },
        },
        {
          text: 'Use this to leverage the captain',
          reveals: 'He panics and acts desperately to fix things.',
          loyaltyImpact: { captain: 0, tech: 1 },
          unrestChange: { upper: 10, lower: 15 },
        },
        {
          text: 'Tell Marcus—he can use this',
          reveals: '"They\'ve lied to us all along. Revolution is justified."',
          loyaltyImpact: { marcus: 2, tech: 1, captain: -1 },
          unrestChange: { upper: 15, lower: 30 },
        },
      ],
    },
  },

  {
    id: 'violence_erupts',
    triggerTurn: 30,
    triggerCondition: (gameState) => gameState.unrest.lower > 70 && gameState.unrest.upper > 50,
    event: {
      text: 'CRISIS: Security teams clash with rebels in the lower decks. Multiple injuries. The ship is fracturing.',
      choices: [
        {
          text: 'Demand an immediate ceasefire',
          reveals: 'Your voice carries weight. Brief calm. But for how long?',
          loyaltyImpact: {},
          unrestChange: { upper: -10, lower: -10 },
        },
        {
          text: 'Support the establishment crackdown',
          reveals: 'Order restored—through fear.',
          loyaltyImpact: { captain: 2, lucia: 2, marcus: -3 },
          unrestChange: { upper: -15, lower: 30 },
        },
        {
          text: 'Assist the rebels',
          reveals: 'You are now openly allied with the revolution.',
          loyaltyImpact: { marcus: 3, captain: -3, lucia: -3 },
          unrestChange: { upper: 25, lower: -20 },
        },
      ],
    },
  },

  {
    id: 'final_choice',
    triggerTurn: 40,
    triggerCondition: (gameState) => true, // Automatically triggers on turn 40
    event: {
      text: 'The moment has arrived. Multiple crises converge: the rebellion is ready to move, the system is failing, and the captain is losing control. What you do now will determine the future of the ship.',
      choices: [
        {
          text: 'Lead the revolution—end the hierarchy',
          reveals: 'You join Marcus. The uprising begins.',
          ending: 'revolution',
        },
        {
          text: 'Defend the established order—restore control',
          reveals: 'You work with the captain to suppress the rebellion.',
          ending: 'order',
        },
        {
          text: 'Broker peace—unite the ship',
          reveals: 'You bring all factions to the table. It\'s risky, but possible.',
          ending: 'peace',
        },
        {
          text: 'Expose everything—let chaos reign',
          reveals: 'You release all secrets. The system collapses.',
          ending: 'chaos',
        },
      ],
    },
  },
];

// Helper function to get triggered events for a turn
export const getTriggeredEvents = (turn, gameState) => {
  return worldEvents.filter(event => {
    const turnMatch = event.triggerTurn === turn;
    const conditionMatch = event.triggerCondition(gameState);
    return turnMatch && conditionMatch;
  });
};
