// Dialogue Tree Database - All conversations and branching paths

export const dialogues = {
  // ========== CAPTAIN VOSS ==========
  captain_greeting: {
    npcId: 'captain_voss',
    text: 'Captain Voss regards you with a measured gaze from behind his desk. "I don\'t believe we\'ve met. What brings you to my office?"',
    choices: [
      {
        text: 'I\'m trying to understand what\'s happening on this ship',
        loyaltyChange: 1,
        reveals: 'You sense genuine concern beneath his authority',
        nextDialogue: null,
      },
      {
        text: 'I heard rumors of trouble in the lower decks',
        loyaltyChange: 0,
        reveals: 'His jaw tightens slightly',
        nextDialogue: null,
      },
      {
        text: 'I support whatever keeps this ship running',
        loyaltyChange: 2,
        reveals: 'He nods approvingly',
        nextDialogue: null,
      },
    ],
  },

  captain_pressure: {
    npcId: 'captain_voss',
    text: 'The captain looks exhausted. "Things are getting worse. Food shortages, unrest... I\'m doing everything I can to maintain order, but some people want chaos."',
    choices: [
      {
        text: 'Who specifically is causing trouble?',
        loyaltyChange: 1,
        reveals: 'He mentions Marcus Steel and whispers of organized rebellion',
        nextDialogue: null,
      },
      {
        text: 'Maybe the lower decks have legitimate grievances',
        loyaltyChange: -1,
        reveals: 'He looks at you coldly. "Stability first, grievances later."',
        nextDialogue: null,
      },
      {
        text: 'How can I help restore order?',
        loyaltyChange: 2,
        reveals: 'He leans forward. "There may be tasks..."',
        nextDialogue: null,
      },
    ],
  },

  captain_confession: {
    npcId: 'captain_voss',
    text: 'The captain pours himself a drink. "I need to tell you something. The food situation... it\'s worse than I\'ve admitted publicly. We\'re running out. And someone in my own staff might be sabotaging supplies."',
    choices: [
      {
        text: 'This is serious. We need to act fast',
        loyaltyChange: 2,
        reveals: 'He trusts you now. A final quest unlocks.',
        nextDialogue: null,
      },
      {
        text: 'The lower decks deserve to know the truth',
        loyaltyChange: -2,
        reveals: 'Betrayal. He will not forget this.',
        nextDialogue: null,
      },
    ],
  },

  // ========== LUCIA REEVES ==========
  lucia_greeting: {
    npcId: 'lucia_reeves',
    text: 'Lucia Reeves eyes you with interest in the merchant quarter. "I don\'t recognize you. New arrival?" She gestures to an expensive chair.',
    choices: [
      {
        text: 'I\'m learning how things work on this ship',
        loyaltyChange: 1,
        reveals: 'She smiles. "Smart. Knowledge is currency."',
        nextDialogue: null,
      },
      {
        text: 'I\'m concerned about the lower deck situation',
        loyaltyChange: 0,
        reveals: 'Her expression hardens slightly',
        nextDialogue: null,
      },
      {
        text: 'I\'m interested in business opportunities',
        loyaltyChange: 2,
        reveals: 'Her eyes light up. "Now we\'re talking."',
        nextDialogue: null,
      },
    ],
  },

  lucia_concerns: {
    npcId: 'lucia_reeves',
    text: '"The real problem isn\'t resources," she confides. "It\'s control. If the lower decks think they can challenge the natural order, everything collapses. I need people I can trust."',
    choices: [
      {
        text: 'What if there\'s a better way to organize society?',
        loyaltyChange: -1,
        reveals: 'She dismisses the idea. "Naive."',
        nextDialogue: null,
      },
      {
        text: 'I\'ll help you maintain stability',
        loyaltyChange: 2,
        reveals: 'She nods. "Good. I have tasks for you."',
        nextDialogue: null,
      },
    ],
  },

  lucia_proposal: {
    npcId: 'lucia_reeves',
    text: '"I have a proposition. There\'s someone in the lower decks—Marcus Steel—who\'s organizing trouble. If he were discredited or removed, things would stabilize. Are you willing to do what\'s necessary?"',
    choices: [
      {
        text: 'I need to think about this',
        loyaltyChange: 0,
        reveals: 'She respects caution. Door remains open.',
        nextDialogue: null,
      },
      {
        text: 'I\'ll do it',
        loyaltyChange: 2,
        reveals: 'A dangerous path. Final quest unlocks.',
        nextDialogue: null,
      },
    ],
  },

  // ========== MARCUS STEEL ==========
  marcus_greeting: {
    npcId: 'marcus_steel',
    text: 'A figure emerges from the shadows of the Steel Works. "You\'re new. Haven\'t seen you before. Most people avoid this place." He watches you carefully.',
    choices: [
      {
        text: 'I\'m trying to understand what\'s really happening',
        loyaltyChange: 1,
        reveals: 'He relaxes slightly. "At least you\'re honest."',
        nextDialogue: null,
      },
      {
        text: 'I work for the captain',
        loyaltyChange: -2,
        reveals: 'His expression darkens. "Then you\'ve chosen a side."',
        nextDialogue: null,
      },
      {
        text: 'I just want to survive',
        loyaltyChange: 1,
        reveals: 'He nods. "That\'s real. Most people pretend otherwise."',
        nextDialogue: null,
      },
    ],
  },

  marcus_movement: {
    npcId: 'marcus_steel',
    text: '"The upper decks hoard resources while we starve. The captain tells us it\'s scarcity, but I\'ve seen the numbers. It\'s greed. We\'re organizing, but we need people who understand what\'s at stake."',
    choices: [
      {
        text: 'How can I help?',
        loyaltyChange: 2,
        reveals: 'He begins to trust you. "There are things we need..."',
        nextDialogue: null,
      },
      {
        text: 'This sounds dangerous',
        loyaltyChange: -1,
        reveals: 'He nods grimly. "It is. But inaction is death."',
        nextDialogue: null,
      },
    ],
  },

  marcus_revolution: {
    npcId: 'marcus_steel',
    text: '"It\'s time. We\'re moving forward with or without broad support. The moment is now. Will you stand with us, or do we stand alone? Because we WILL move forward."',
    choices: [
      {
        text: 'I\'m with you',
        loyaltyChange: 2,
        reveals: 'Commitment. Final quest unlocks.',
        nextDialogue: null,
      },
      {
        text: 'I need to think',
        loyaltyChange: -1,
        reveals: 'He looks disappointed. "Time\'s running out."',
        nextDialogue: null,
      },
    ],
  },

  // ========== TECH COLLECTIVE ==========
  tech_first_contact: {
    npcId: 'tech_collective',
    text: 'A voice from the shadows: "You\'re asking questions. People who ask questions either become useful or become problems. Which are you?"',
    choices: [
      {
        text: 'I want to know the truth about this ship',
        loyaltyChange: 1,
        reveals: 'The figure steps forward slightly. "Interesting."',
        nextDialogue: null,
      },
      {
        text: 'I\'m just trying to make money',
        loyaltyChange: 0,
        reveals: 'A cold laugh. "Everyone is."',
        nextDialogue: null,
      },
      {
        text: 'I represent someone powerful',
        loyaltyChange: 1,
        reveals: 'They seem amused. "Power is information now."',
        nextDialogue: null,
      },
    ],
  },

  tech_capabilities: {
    npcId: 'tech_collective',
    text: '"We can see everything. Communications, resource logs, personal communications—all encrypted until we choose otherwise. The question is: what will you do with that knowledge?"',
    choices: [
      {
        text: 'Show me something important',
        loyaltyChange: 1,
        reveals: 'They hesitate, then share encrypted files about the captain\'s actions',
        nextDialogue: null,
      },
      {
        text: 'Who are you really working for?',
        loyaltyChange: 0,
        reveals: 'They smile. "Ourselves. Always ourselves."',
        nextDialogue: null,
      },
    ],
  },

  tech_revelation: {
    npcId: 'tech_collective',
    text: '"There\'s something everyone should know. The ship\'s systems are failing. The captain knows. The merchants know. They\'re all lying. We can expose it—or use it. Your choice matters to us."',
    choices: [
      {
        text: 'Expose the truth',
        loyaltyChange: 2,
        reveals: 'They nod. "A path for idealists. We\'ll help."',
        nextDialogue: null,
      },
      {
        text: 'Let\'s use it strategically',
        loyaltyChange: 1,
        reveals: 'They smile. "Pragmatic. We like that."',
        nextDialogue: null,
      },
    ],
  },
};
