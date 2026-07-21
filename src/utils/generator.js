const vocab = {
  timePast: ['Yesterday', 'Last week', 'This morning', 'During the last sprint', 'In Q3', 'At the standup'],
  timePresent: ['Today', 'Right now', 'Currently', 'This sprint', 'At the moment'],
  timeFuture: ['Tomorrow', 'Next week', 'Later today', 'In Q4', 'By end of day'],
  
  // Massive verb expansion covering DE, Lead, and Manager roles
  verbPast: ['fixed', 'built', 'tested', 'ran', 'checked', 'created', 'updated', 'loaded', 'extracted', 'cleaned', 'approved', 'reviewed', 'aligned', 'prioritized', 'resolved', 'designed', 'mentored', 'established', 'audited', 'scaled', 'migrated', 'deprecated', 'orchestrated', 'partitioned'],
  verbPresentProg: ['am fixing', 'am building', 'am testing', 'am running', 'am checking', 'am creating', 'am updating', 'am loading', 'am extracting', 'am cleaning', 'am approving', 'am reviewing', 'am aligning', 'am prioritizing', 'am resolving', 'am designing', 'am mentoring', 'am establishing', 'am auditing', 'am scaling', 'am migrating', 'am deprecating'],
  verbPresent: ['triggers', 'runs', 'loads', 'extracts', 'cleans', 'fails', 'scales', 'audits', 'approves', 'aligns'],
  verbFuture: ['will fix', 'will build', 'will test', 'will run', 'will check', 'will create', 'will update', 'will load', 'will extract', 'will clean', 'will approve', 'will review', 'will align', 'will prioritize', 'will resolve', 'will design', 'will audit', 'will scale', 'will migrate'],
  
  // Massive adjective expansion
  adjective: ['broken', 'slow', 'failing', 'critical', 'massive', 'missing', 'legacy', 'flaky', 'raw', 'clean', 'scalable', 'cost-effective', 'resilient', 'high-availability', 'fault-tolerant', 'blocked', 'ambiguous', 'outdated', 'optimized'],
  badAdjective: ['broked', 'slowing', 'faileds', 'criticals', 'massively', 'missed', 'legacies', 'scalabled', 'costing-effective', 'resilients'],
  
  // Massive noun expansion
  noun: ['pipeline', 'table', 'database', 'server', 'log', 'error', 'schema', 'script', 'DAG', 'architecture diagram', 'budget', 'backlog', 'Sprint plan', 'capacity', 'escalation', 'OKR', 'KPI', 'tech debt', 'roadmap', 'cloud cost', 'data mart', 'data warehouse', 'data lake', 'cluster'],
  
  // Massive reason/blocker expansion
  reason: ['the API key expired', 'a column was missing', 'the server is down', 'permissions are wrong', 'stakeholders have not signed off', 'we are waiting on budget approval', 'the team is at capacity', 'the requirements are ambiguous', 'there is a dependency on the DevOps team', 'the legacy code is too brittle', 'the CI/CD pipeline failed'],
  
  // Massive help/person expansion
  helpNeeded: ['admin access to unblock this', 'a code review on the PR', 'help debugging the query', 'budget approval', 'clarification on the requirements', 'more engineers for the sprint', 'a meeting with the client'],
  person: ['DevOps', 'my manager', 'the backend team', 'the VP of Engineering', 'the Product Manager', 'the stakeholders', 'the Data Science team', 'the client', 'the junior engineers'],
  
  conjunctionCause: ['because', 'since', 'as', 'due to the fact that'],
  conjunctionEffect: ['therefore', 'so', 'as a result', 'consequently'],
  conjunctionAdd: ['furthermore', 'moreover', 'additionally', 'and', 'also'],
  conjunctionContrast: ['however', 'although', 'but', 'nevertheless']
};

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const getIncorrect = (arr, correct, count = 3) => {
  const others = arr.filter(item => item !== correct);
  const shuffled = others.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
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

// GRAMMAR MODULES
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
  
  return {
    gameType: 'fill_blank',
    title: 'Tenses',
    instruction: 'Select the correct verb tense for the sentence.',
    sentence: `${time}, I _____ the ${noun}.`,
    options,
    correctAnswer: correctVerb,
    explanation: `The time marker "${time}" requires the ${tense} tense.`
  };
}

function generateVerbQuestion() {
  const noun = pick(vocab.noun);
  const correctVerb = pick(vocab.verbPast);
  const options = [correctVerb, pick(vocab.noun), pick(vocab.adjective), pick(vocab.timePast)].sort(() => 0.5 - Math.random());
  
  return {
    gameType: 'fill_blank',
    title: 'Verbs (Action Words)',
    instruction: 'Identify the correct action verb to complete the thought.',
    sentence: `I successfully _____ the ${noun} to resolve the issue.`,
    options,
    correctAnswer: correctVerb,
    explanation: `A sentence needs an action verb to describe what you did. "${correctVerb}" is the correct verb here.`
  };
}

function generateAdjectivesQuestion() {
  const noun = pick(vocab.noun);
  const correctAdj = pick(vocab.adjective);
  const wrongAdjs = getIncorrect([...vocab.adjective, ...vocab.badAdjective], correctAdj, 3);
  const options = [correctAdj, ...wrongAdjs].sort(() => 0.5 - Math.random());
  
  return {
    gameType: 'fill_blank',
    title: 'Adjectives',
    instruction: 'Select the correct adjective to describe the noun.',
    sentence: `We noticed the data was very _____, so we cleaned it.`,
    options,
    correctAnswer: correctAdj,
    explanation: `Adjectives describe nouns. "${correctAdj}" is the correct descriptive word here.`
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
    explanation: `Use "${correct}" here to show ${type} between the two ideas.`
  };
}

// MINI-GAME 1: Sentence Builder (Grammar & Spelling)
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
    explanation: 'Basic structure: Time + Subject + Verb + Object.'
  };
}

// MINI-GAME 2: Standup Rush (Timer based)
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
    explanation: 'A strong standup update is concise: Yesterday, Today, and Blockers.'
  };
}

// MINI-GAME 3: Pipeline Storyteller
function generatePipelineStoryteller() {
  // Massive expansion of stories: DE, Lead, Manager scenarios
  const stories = [
    // DE Scenario
    [
      "First, JSON lands in the S3 bucket.",
      "However, a schema mismatch occurred during parsing.",
      "So, a Lambda function refactored the payload.",
      "Finally, Snowflake successfully loaded the records."
    ],
    // DE Scenario 2
    [
      "First, the cron job triggers the ETL pipeline.",
      "Next, the script extracts data from the SQL database.",
      "After that, the data is transformed and cleaned.",
      "Finally, it is loaded into the reporting table."
    ],
    // Lead Engineer Scenario
    [
      "First, we audited the legacy monolith architecture.",
      "Next, we identified the bottlenecks causing high latency.",
      "As a result, we designed a scalable microservices schema.",
      "Finally, we migrated the workloads with zero downtime."
    ],
    // Data Manager Scenario
    [
      "First, we gathered requirements from the Product Manager.",
      "However, the budget constraints blocked our initial plan.",
      "Therefore, we prioritized the backlog to focus on high-ROI tasks.",
      "Finally, I aligned with the stakeholders on the new roadmap."
    ],
    // Incident Management Scenario
    [
      "Initially, the API endpoints started failing in production.",
      "Next, the DevOps team escalated the issue to our data engineers.",
      "Then, we rolled back the faulty deployment to restore stability.",
      "Ultimately, we conducted a post-mortem to prevent future outages."
    ]
  ];
  
  const sentences = pick(stories);
  
  return {
    gameType: 'pipeline_story',
    title: 'Storyteller (KT & Updates)',
    instruction: 'Select sentences in logical order using the transition words.',
    sentences,
    explanation: 'Sequential transition words (First, Next, Finally, However, Therefore) help guide the listener through complex processes, whether you are an engineer or a manager.'
  };
}

// MINI-GAME 4: Client Reaction (RPG)
function generateClientReaction() {
  // Massive expansion of scenarios for Engineers, Leads, and Managers
  const scenarios = [
    // Engineer Level
    {
      scenario: 'Client asks: "Why is the pipeline taking so long to load?"',
      options: [
        { text: "It is slow because DB error.", feedback: "Poor grammar and sounds too defensive.", isCorrect: false },
        { text: "We are fixing the query today.", feedback: "Okay grammar, but incomplete explanation.", isCorrect: false },
        { text: "We identified an unindexed query, so we are refactoring it to drop latency by 50%.", feedback: "Perfect! You identified the problem and provided a clear, impactful solution.", isCorrect: true }
      ]
    },
    // Manager/Lead Level
    {
      scenario: 'Stakeholder says: "We need this feature built by tomorrow instead of next week."',
      options: [
        { text: "We can't do it, too fast.", feedback: "Too blunt and unprofessional.", isCorrect: false },
        { text: "Option A is faster to build, but Option B will scale better long-term. Let's discuss trade-offs.", feedback: "Excellent! You calmly explained the trade-offs without saying a flat 'no'.", isCorrect: true },
        { text: "If you want it tomorrow then it will be broken.", feedback: "Grammatically okay, but highly unprofessional tone.", isCorrect: false }
      ]
    },
    // Lead Level - Architecture
    {
      scenario: 'VP of Engineering asks: "Why are our cloud costs doubling this month?"',
      options: [
        { text: "We audited the cluster and found idle nodes, so we are implementing auto-scaling today.", feedback: "Great response! You showed initiative, found the root cause, and presented a clear action plan.", isCorrect: true },
        { text: "Because the data volume is too big now.", feedback: "Too simplistic and doesn't offer a solution or plan of action.", isCorrect: false },
        { text: "I don't know, maybe the DevOps team did something.", feedback: "Never deflect blame blindly in professional communication.", isCorrect: false }
      ]
    },
    // Manager Level - Team Capacity
    {
      scenario: 'Product Manager says: "I need you to pull these three new tickets into the current sprint."',
      options: [
        { text: "No, we are busy.", feedback: "Grammatically correct, but terrible stakeholder management.", isCorrect: false },
        { text: "The team is currently at capacity; however, if we deprioritize the reporting task, we can accommodate these.", feedback: "Excellent! You stated the constraint and offered a clear negotiation path.", isCorrect: true },
        { text: "We will try to do everything.", feedback: "Dangerous! Over-promising leads to burnout and missed deadlines.", isCorrect: false }
      ]
    },
    // Cross-team communication
    {
      scenario: 'DevOps Lead says: "Your team’s heavy queries are crashing the production database."',
      options: [
        { text: "It's not our fault, the database is just weak.", feedback: "Unprofessional and creates team friction.", isCorrect: false },
        { text: "Our code is fine, please fix the database.", feedback: "Dismissive. It's better to collaborate.", isCorrect: false },
        { text: "Understood. We will pause the batch job immediately and optimize our query logic to reduce the load.", feedback: "Perfect. You acknowledged the severity, took immediate action, and proposed a long-term fix.", isCorrect: true }
      ]
    }
  ];
  
  const data = pick(scenarios);
  
  return {
    gameType: 'client_reaction',
    title: 'Professional Scenarios (RPG)',
    instruction: 'Choose the most professional and grammatically correct response.',
    scenario: data.scenario,
    options: data.options.sort(() => 0.5 - Math.random()),
    explanation: 'When speaking to stakeholders, clients, or leadership, use clear grammar and always focus on solutions, trade-offs, or collaboration.'
  };
}
