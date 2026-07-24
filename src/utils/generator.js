const vocabDefinitions = {
  // Nouns
  'pipeline': 'A set of automated processes that extract, transform, and load data.',
  'dag': 'Directed Acyclic Graph; a collection of tasks representing a data workflow.',
  'schema': 'The structure or blueprint defining how data is organized in a database.',
  'legacy': 'Old or outdated technology/systems still in use.',
  'data mart': 'A subset of a data warehouse focused on a specific business line.',
  'data warehouse': 'A central repository of integrated data from multiple sources.',
  'data lake': 'A centralized repository storing raw, unstructured data at scale.',
  'tech debt': 'The implied cost of future rework caused by choosing an easy solution now.',
  'okr': 'Objectives and Key Results; a goal-setting framework.',
  'kpi': 'Key Performance Indicator; a metric used to evaluate success.',
  
  // Adjectives
  'scalable': 'Able to handle growing amounts of work or data efficiently.',
  'flaky': 'Unreliable; working sometimes and failing at other times.',
  'resilient': 'Able to withstand or recover quickly from difficult conditions.',
  'fault-tolerant': 'Capable of continuing operation even if a component fails.',
  'ambiguous': 'Open to more than one interpretation; unclear.',
  'optimized': 'Made as effective, perfect, or useful as possible.',
  'brittle': 'Fragile code or infrastructure that breaks easily when changed.',
  
  // Conjunctions
  'because': 'For the reason that.',
  'since': 'For the reason that; because.',
  'due to the fact that': 'Because (formal).',
  'therefore': 'For that reason; consequently.',
  'as a result': 'Because of something that has happened.',
  'consequently': 'As a result.',
  'furthermore': 'In addition; besides.',
  'moreover': 'As a further matter; besides.',
  'additionally': 'As an extra factor or circumstance.',
  'however': 'Used to introduce a statement that contrasts with something just said.',
  'although': 'In spite of the fact that; even though.',
  'nevertheless': 'In spite of that; notwithstanding.',
  
  // Verbs
  'orchestrated': 'Coordinated the execution of multiple automated processes.',
  'deprecated': 'Marked a feature/system as obsolete and discouraged its use.',
  'audited': 'Conducted an official inspection or review of systems/code.',
  'migrated': 'Moved data or applications from one environment to another.',
  'partitioned': 'Divided a large database or table into smaller, manageable parts.',
  'refactored': 'Restructured existing computer code without changing its external behavior.'
};

const vocab = {
  timePast: ['Yesterday', 'Last week', 'This morning', 'During the last sprint', 'In Q3', 'At the standup'],
  timePresent: ['Today', 'Right now', 'Currently', 'This sprint', 'At the moment'],
  timeFuture: ['Tomorrow', 'Next week', 'Later today', 'In Q4', 'By end of day'],
  
  verbPast: ['fixed', 'built', 'tested', 'ran', 'checked', 'created', 'updated', 'loaded', 'extracted', 'cleaned', 'approved', 'reviewed', 'aligned', 'prioritized', 'resolved', 'designed', 'mentored', 'established', 'audited', 'scaled', 'migrated', 'deprecated', 'orchestrated', 'partitioned', 'refactored'],
  verbPresentProg: ['am fixing', 'am building', 'am testing', 'am running', 'am checking', 'am creating', 'am updating', 'am loading', 'am extracting', 'am cleaning', 'am approving', 'am reviewing', 'am aligning', 'am prioritizing', 'am resolving', 'am designing', 'am mentoring', 'am establishing', 'am auditing', 'am scaling', 'am migrating', 'am deprecating'],
  verbPresent: ['triggers', 'runs', 'loads', 'extracts', 'cleans', 'fails', 'scales', 'audits', 'approves', 'aligns'],
  verbFuture: ['will fix', 'will build', 'will test', 'will run', 'will check', 'will create', 'will update', 'will load', 'will extract', 'will clean', 'will approve', 'will review', 'will align', 'will prioritize', 'will resolve', 'will design', 'will audit', 'will scale', 'will migrate'],
  
  adjective: ['broken', 'slow', 'failing', 'critical', 'massive', 'missing', 'legacy', 'flaky', 'raw', 'clean', 'scalable', 'cost-effective', 'resilient', 'high-availability', 'fault-tolerant', 'blocked', 'ambiguous', 'outdated', 'optimized', 'brittle'],
  badAdjective: ['broked', 'slowing', 'faileds', 'criticals', 'massively', 'missed', 'legacies', 'scalabled', 'costing-effective', 'resilients'],
  
  noun: ['pipeline', 'table', 'database', 'server', 'log', 'error', 'schema', 'script', 'DAG', 'architecture diagram', 'budget', 'backlog', 'Sprint plan', 'capacity', 'escalation', 'OKR', 'KPI', 'tech debt', 'roadmap', 'cloud cost', 'data mart', 'data warehouse', 'data lake', 'cluster'],
  
  reason: ['the API key expired', 'a column was missing', 'the server is down', 'permissions are wrong', 'stakeholders have not signed off', 'we are waiting on budget approval', 'the team is at capacity', 'the requirements are ambiguous', 'there is a dependency on the DevOps team', 'the legacy code is too brittle', 'the CI/CD pipeline failed'],
  
  person: ['DevOps', 'my manager', 'the backend team', 'the VP of Engineering', 'the Product Manager', 'the stakeholders', 'the Data Science team', 'the client', 'the junior engineers'],
  
  conjunctionCause: ['because', 'since', 'due to the fact that'],
  conjunctionEffect: ['therefore', 'so', 'as a result', 'consequently'],
  conjunctionAdd: ['furthermore', 'moreover', 'additionally', 'also'],
  conjunctionContrast: ['however', 'although', 'nevertheless']
};

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const getIncorrect = (arr, correct, count = 3) => {
  const others = arr.filter(item => item !== correct);
  const shuffled = others.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Extracts meanings for any complex words found in the texts
const extractDefinitions = (textArray) => {
  const text = textArray.join(' ').toLowerCase();
  const defs = [];
  for (const [word, meaning] of Object.entries(vocabDefinitions)) {
    // Basic word boundary matching for safety
    const regex = new RegExp(`\\b${word}\\b`, 'i');
    if (regex.test(text)) {
      defs.push({ word, meaning });
    }
  }
  return defs;
};

export const generateDailyLoop = () => {
  return [
    generateSentenceBuilder(),
    generateStandupRush(),
    generatePipelineStoryteller(),
    generateClientReaction()
  ];
};

export const generateSingleRandomQuestion = (mode = 'mixed') => {
  let selectedGame;
  
  if (mode === 'sentence_builder') {
    selectedGame = generateSentenceBuilder;
  } else if (mode === 'standup_rush') {
    selectedGame = generateStandupRush;
  } else if (mode === 'pipeline_story') {
    selectedGame = generatePipelineStoryteller;
  } else if (mode === 'client_reaction') {
    selectedGame = generateClientReaction;
  } else if (mode === 'tenses') {
    selectedGame = generateTenseQuestion;
  } else if (mode === 'verbs') {
    selectedGame = generateVerbQuestion;
  } else if (mode === 'adjectives') {
    selectedGame = generateAdjectivesQuestion;
  } else if (mode === 'conjunctions') {
    selectedGame = generateConjunctionQuestion;
  } else {
    const games = [
      generateSentenceBuilder,
      generateStandupRush,
      generatePipelineStoryteller,
      generateClientReaction,
      generateTenseQuestion,
      generateVerbQuestion,
      generateAdjectivesQuestion,
      generateConjunctionQuestion
    ];
    selectedGame = pick(games);
  }
  
  return selectedGame();
};

function generateTenseQuestion() {
  const tenses = ['past', 'presentContinuous', 'future'];
  const tense = pick(tenses);
  
  let time, correctVerb, wrongVerbs;
  const noun = pick(vocab.noun);
  
  if (tense === 'past') {
    time = pick(vocab.timePast);
    correctVerb = pick(vocab.verbPast);
    wrongVerbs = [pick(vocab.verbPresentProg), pick(vocab.verbFuture), 'fix', 'fixing'];
  } else if (tense === 'presentContinuous') {
    time = pick(vocab.timePresent);
    correctVerb = pick(vocab.verbPresentProg);
    wrongVerbs = [pick(vocab.verbPast), pick(vocab.verbFuture), 'work', 'worked'];
  } else {
    time = pick(vocab.timeFuture);
    correctVerb = pick(vocab.verbFuture);
    wrongVerbs = [pick(vocab.verbPast), pick(vocab.verbPresentProg), 'fixed'];
  }
  
  const options = [correctVerb, ...wrongVerbs.slice(0, 3)].sort(() => 0.5 - Math.random());
  const sentence = `${time}, I _____ the ${noun}.`;
  
  return {
    gameType: 'fill_blank',
    title: 'Tenses',
    instruction: 'Select the correct verb tense for the sentence.',
    sentence,
    options,
    correctAnswer: correctVerb,
    explanation: `The time marker "${time}" requires the ${tense} tense.`,
    definitions: extractDefinitions([sentence, correctVerb])
  };
}

function generateVerbQuestion() {
  const noun = pick(vocab.noun);
  const correctVerb = pick(vocab.verbPast);
  const options = [correctVerb, pick(vocab.noun), pick(vocab.adjective), pick(vocab.timePast)].sort(() => 0.5 - Math.random());
  
  const sentence = `I successfully _____ the ${noun} to resolve the issue.`;
  return {
    gameType: 'fill_blank',
    title: 'Verbs (Action Words)',
    instruction: 'Identify the correct action verb to complete the thought.',
    sentence,
    options,
    correctAnswer: correctVerb,
    explanation: `A sentence needs an action verb to describe what you did. "${correctVerb}" is the correct verb here.`,
    definitions: extractDefinitions([sentence, correctVerb])
  };
}

function generateAdjectivesQuestion() {
  const noun = pick(vocab.noun);
  const correctAdj = pick(vocab.adjective);
  const wrongAdjs = getIncorrect([...vocab.adjective, ...vocab.badAdjective], correctAdj, 3);
  const options = [correctAdj, ...wrongAdjs].sort(() => 0.5 - Math.random());
  
  const sentence = `We noticed the ${noun} was very _____, so we addressed it.`;
  return {
    gameType: 'fill_blank',
    title: 'Adjectives',
    instruction: 'Select the correct adjective to describe the noun.',
    sentence,
    options,
    correctAnswer: correctAdj,
    explanation: `Adjectives describe nouns. "${correctAdj}" is the correct descriptive word here.`,
    definitions: extractDefinitions([sentence, correctAdj])
  };
}

function generateConjunctionQuestion() {
  const types = ['effect', 'contrast', 'add'];
  const type = pick(types);
  
  let sentence, correct, wrong;
  const adj = pick(vocab.adjective);
  const noun = pick(vocab.noun);
  
  if (type === 'effect') {
    sentence = `The ${noun} was ${adj}; _____, we had to act quickly.`;
    correct = pick(vocab.conjunctionEffect);
    wrong = [...vocab.conjunctionContrast, ...vocab.conjunctionAdd];
  } else if (type === 'contrast') {
    sentence = `The ${noun} was ${adj}; _____, we still processed it successfully.`;
    correct = pick(vocab.conjunctionContrast);
    wrong = [...vocab.conjunctionEffect, ...vocab.conjunctionAdd];
  } else {
    sentence = `We fixed the ${noun}. _____, we reduced cloud costs by 20%.`;
    correct = pick(vocab.conjunctionAdd);
    wrong = [...vocab.conjunctionContrast, ...vocab.conjunctionCause];
  }
  
  const options = [correct, ...getIncorrect(wrong, correct, 3)].sort(() => 0.5 - Math.random());
  
  return {
    gameType: 'fill_blank',
    title: 'Conjunctions',
    instruction: 'Choose the correct joiner to link these thoughts.',
    sentence,
    options,
    correctAnswer: correct,
    explanation: `Use "${correct}" here to show ${type} between the two ideas.`,
    definitions: extractDefinitions([sentence, correct])
  };
}

function generateSentenceBuilder() {
  const time = pick(vocab.timePast);
  const verb = pick(vocab.verbPast);
  const noun = pick(vocab.noun);
  
  const sentence = `${time}, I ${verb} the ${noun}.`;
  const rawWords = sentence.split(' ');
  let words = rawWords.map((w, i) => i === 0 ? w : w.toLowerCase());
  
  return {
    gameType: 'sentence_builder',
    title: 'Sentence Builder',
    instruction: 'Drag and drop words to assemble the correct sentence.',
    correctSentence: sentence,
    words,
    explanation: 'Basic structure: Time + Subject + Verb + Object.',
    definitions: extractDefinitions([sentence])
  };
}

function generateStandupRush() {
  const taskPast = `I ${pick(vocab.verbPast)} the ${pick(vocab.noun)}`;
  const taskPresent = `I ${pick(vocab.verbPresentProg)} the ${pick(vocab.noun)}`;
  const blocker = `I am blocked because ${pick(vocab.reason)}`;
  
  return {
    gameType: 'standup_rush',
    title: 'Standup Rush',
    instruction: 'You have 30 seconds! Read the prompts below and SPEAK your update out loud.',
    prompts: [
      { label: 'Yesterday:', hint: taskPast },
      { label: 'Today:', hint: taskPresent },
      { label: 'Blocker:', hint: blocker }
    ],
    explanation: 'A strong standup update is concise: Yesterday, Today, and Blockers.',
    definitions: extractDefinitions([taskPast, taskPresent, blocker])
  };
}

function generatePipelineStoryteller() {
  // Generate a dynamic story logic from millions of permutations
  const type = Math.random();
  let sentences = [];
  
  if (type < 0.33) {
    // ETL Story
    sentences = [
      `First, the cron job triggered the ${pick(vocab.noun)}.`,
      `Next, the script extracted data from the ${pick(vocab.noun)}.`,
      `After that, the data was ${pick(vocab.verbPast)} and cleaned.`,
      `Finally, we loaded it into the ${pick(vocab.noun)}.`
    ];
  } else if (type < 0.66) {
    // Incident Story
    sentences = [
      `Initially, the ${pick(vocab.noun)} failed in production.`,
      `${pick(vocab.conjunctionCause)}, the ${pick(vocab.person)} escalated the issue.`,
      `Then, we ${pick(vocab.verbPast)} the faulty component to restore stability.`,
      `Ultimately, we conducted an audit to prevent future outages.`
    ];
  } else {
    // Management/Lead Story
    sentences = [
      `First, we audited the ${pick(vocab.adjective)} architecture.`,
      `However, ${pick(vocab.reason)}.`,
      `${pick(vocab.conjunctionEffect)}, we prioritized the backlog to focus on high-ROI tasks.`,
      `Finally, I aligned with the ${pick(vocab.person)} on the new roadmap.`
    ];
  }
  
  return {
    gameType: 'pipeline_story',
    title: 'Storyteller (KT & Updates)',
    instruction: 'Select sentences in logical order using the transition words.',
    sentences,
    explanation: 'Sequential transition words help guide the listener through complex processes, whether you are an engineer or a manager.',
    definitions: extractDefinitions(sentences)
  };
}

function generateClientReaction() {
  // Generate dynamic client scenarios using randomized vocabulary
  const types = ['delay', 'request', 'issue'];
  const type = pick(types);
  
  let scenario, options;
  
  if (type === 'delay') {
    scenario = `Client asks: "Why is the ${pick(vocab.noun)} taking so long to load?"`;
    options = [
      { text: `It is slow because ${pick(vocab.reason)}.`, feedback: "Poor grammar and sounds too defensive.", isCorrect: false },
      { text: `We are fixing the ${pick(vocab.noun)} today.`, feedback: "Okay grammar, but incomplete explanation.", isCorrect: false },
      { text: `We identified a ${pick(vocab.adjective)} component, so we are refactoring it to drop latency by 50%.`, feedback: "Perfect! You identified the problem and provided a clear, impactful solution.", isCorrect: true }
    ];
  } else if (type === 'request') {
    scenario = `${pick(vocab.person)} says: "I need you to pull these new tickets into the current sprint."`;
    options = [
      { text: "No, we are busy.", feedback: "Grammatically correct, but terrible stakeholder management.", isCorrect: false },
      { text: `The team is currently at capacity; ${pick(vocab.conjunctionContrast)}, if we deprioritize the ${pick(vocab.noun)} task, we can accommodate these.`, feedback: "Excellent! You stated the constraint and offered a clear negotiation path.", isCorrect: true },
      { text: "We will try to do everything.", feedback: "Dangerous! Over-promising leads to burnout and missed deadlines.", isCorrect: false }
    ];
  } else {
    scenario = `VP asks: "Why did the ${pick(vocab.noun)} crash yesterday?"`;
    options = [
      { text: `We audited the cluster and found it was ${pick(vocab.adjective)}, ${pick(vocab.conjunctionEffect)} we applied a hotfix.`, feedback: "Great response! You showed initiative, found the root cause, and presented a clear action plan.", isCorrect: true },
      { text: "Because the data volume is too big now.", feedback: "Too simplistic and doesn't offer a solution or plan of action.", isCorrect: false },
      { text: `I don't know, maybe the ${pick(vocab.person)} did something.`, feedback: "Never deflect blame blindly in professional communication.", isCorrect: false }
    ];
  }
  
  return {
    gameType: 'client_reaction',
    title: 'Professional Scenarios (RPG)',
    instruction: 'Choose the most professional and grammatically correct response.',
    scenario: scenario,
    options: options.sort(() => 0.5 - Math.random()),
    explanation: 'When speaking to stakeholders, clients, or leadership, use clear grammar and always focus on solutions, trade-offs, or collaboration.',
    definitions: extractDefinitions([scenario, ...options.map(o => o.text)])
  };
}
