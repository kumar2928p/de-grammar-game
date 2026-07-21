export const questions = [
  // Tenses & Verbs
  {
    id: 1,
    category: 'Tenses & Verbs',
    type: 'fill_blank',
    context: 'Standup: Reporting yesterday\'s work',
    sentence: 'Yesterday, I _____ the broken DAG in Airflow and tested the changes.',
    options: ['fix', 'fixed', 'have fixed', 'fixing'],
    correctAnswer: 'fixed',
    explanation: 'For a completed action in the past with a specific time (Yesterday), use the simple past tense (fixed).'
  },
  {
    id: 2,
    category: 'Tenses & Verbs',
    type: 'fill_blank',
    context: 'Standup: Reporting current work',
    sentence: 'Currently, I _____ on optimizing the Spark job to reduce execution time.',
    options: ['work', 'am working', 'have worked', 'was working'],
    correctAnswer: 'am working',
    explanation: 'For an action happening right now or around now (Currently), use the present continuous tense (am working).'
  },
  {
    id: 3,
    category: 'Tenses & Verbs',
    type: 'fill_blank',
    context: 'Standup: Reporting a blocker',
    sentence: 'I _____ by the missing IAM permissions on the new S3 bucket.',
    options: ['block', 'am blocked', 'have blocked', 'blocking'],
    correctAnswer: 'am blocked',
    explanation: 'Use the passive voice (am blocked) to describe your state of being unable to proceed.'
  },

  // Conjunctions & Connectors
  {
    id: 4,
    category: 'Conjunctions & Connectors',
    type: 'fill_blank',
    context: 'KT Session: Explaining cause and effect',
    sentence: 'The data volume increased significantly; _____, we had to scale up the EMR cluster.',
    options: ['however', 'therefore', 'because', 'although'],
    correctAnswer: 'therefore',
    explanation: '"Therefore" connects a cause (increased volume) to its effect/result (scaling up).'
  },
  {
    id: 5,
    category: 'Conjunctions & Connectors',
    type: 'fill_blank',
    context: 'KT Session: Adding information',
    sentence: 'The pipeline extracts data from the API. _____, it applies data quality checks before loading.',
    options: ['Furthermore', 'Despite this', 'Instead', 'But'],
    correctAnswer: 'Furthermore',
    explanation: '"Furthermore" (or additionally, also) is used to add more information or steps to a process.'
  },

  // Sentence Formation (Jumble)
  {
    id: 6,
    category: 'Sentence Formation',
    type: 'jumble',
    context: 'Standup: Explaining an issue',
    words: ['The', 'data', 'pipeline', 'failed', 'yesterday', 'evening.'],
    correctSentence: 'The data pipeline failed yesterday evening.',
    explanation: 'Subject (The data pipeline) + Verb (failed) + Time (yesterday evening).'
  },
  {
    id: 7,
    category: 'Sentence Formation',
    type: 'jumble',
    context: 'KT Session: Explaining purpose',
    words: ['This', 'script', 'is', 'responsible', 'for', 'cleaning', 'the', 'raw', 'data.'],
    correctSentence: 'This script is responsible for cleaning the raw data.',
    explanation: 'Subject (This script) + Verb (is) + Adjective phrase (responsible for) + Gerund phrase (cleaning the raw data).'
  },

  // Storytelling / Sequencing
  {
    id: 8,
    category: 'Storytelling',
    type: 'sequence',
    context: 'KT Session: Explaining the ETL process',
    sentences: [
      'First, the data is extracted from the operational database using a change data capture (CDC) tool.',
      'Next, the raw data is loaded into our data lake in S3.',
      'Then, a Spark job transforms the data and enforces schema validation.',
      'Finally, the curated data is loaded into Snowflake for reporting.'
    ],
    explanation: 'Use sequential transition words (First, Next, Then, Finally) to clearly explain a multi-step process.'
  },
  {
    id: 9,
    category: 'Storytelling',
    type: 'sequence',
    context: 'Standup: Explaining a debugging process',
    sentences: [
      'Initially, I noticed the pipeline was failing with a memory error.',
      'Because of this, I checked the CloudWatch logs to find the exact node that crashed.',
      'I discovered that one partition of data was heavily skewed.',
      'As a result, I updated the partitioning strategy, and the job is now running smoothly.'
    ],
    explanation: 'Use cause-and-effect transitions (Because of this, As a result) to tell a logical story about how you solved a problem.'
  }
];
