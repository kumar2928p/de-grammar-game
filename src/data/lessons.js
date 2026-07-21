export const lessons = [
  {
    id: 'week1',
    title: 'Week 1: Tenses & Sentences',
    description: 'Master the 4 essential tenses and single sentence formation.',
    icon: '1️⃣',
    tips: `
### The 4 Essential Tenses
You do **not** need to learn all 12 English tenses. In tech meetings, 95% of speech uses only 4 tenses:

1. **Simple Past:** What you finished yesterday
   - *"I **fixed** the pipeline."*
2. **Present Continuous:** What you are doing right now
   - *"I **am working** on the schema."*
3. **Simple Present:** General facts & routines
   - *"Airflow **triggers** the job at midnight."*
4. **Future (will / going to):** What you will do next
   - *"I **will deploy** the code today."*

### Core Vocabulary
- **Action Verbs:** Build, fix, test, run, check, create, update, load, extract, clean.
- **Status Words:** Done, pending, stuck, delayed, ready, failing, blocked.
- **Tool Nouns:** Pipeline, table, database, server, log, error, access, key.
    `
  },
  {
    id: 'week2',
    title: 'Week 2: Joining Thoughts',
    description: 'Stop choppy speech by linking thoughts using AND, BUT, and SO.',
    icon: '2️⃣',
    tips: `
### The 3 Basic Sentence Joiners
To turn short, broken sentences into smooth thoughts, learn just 3 words:

1. **AND (To add information):** 
   - *"I ran the script **and** checked the logs."*
2. **BUT (To introduce a problem):** 
   - *"I ran the script, **but** it threw an error."*
3. **SO (To show the solution/next step):** 
   - *"It threw an error, **so** I am refactoring it."*

### Connecting Sentences (Storytelling Basics)
**Practice Template:** 
[Task] + **BUT** + [Problem] + **SO** + [Action]
- *"I ran the ETL script, **but** it failed due to a missing column, **so** I updated the schema."*
    `
  },
  {
    id: 'week3',
    title: 'Week 3: Standup Mastery',
    description: 'Perfecting a structured, low-stress, 30-second standup update.',
    icon: '3️⃣',
    tips: `
### Sentence Structure Templates
You do not need to invent sentences from thin air. Memorize and fill in these 4 blank templates:

1. **Past Task:** "Yesterday, I [Past Verb] [Object]."
   - *"Yesterday, I created the staging table."*
2. **Current Task:** "Today, I am [Verb + ing] [Object]."
   - *"Today, I am testing the ingestion script."*
3. **Blocker / Problem:** "I am stuck because [Reason]."
   - *"I am stuck because the API key expired."*
4. **Help Needed:** "I need [Person / Tool] to [Action]."
   - *"I need admin access to unblock this."*

### The Ultimate Standup Template
> *"Hi everyone. Yesterday, I completed [Task]. Today, my main focus is [Task]. I am currently blocked by [Issue], so I need help from [Person/Team]. That’s all from my side."*
    `
  },
  {
    id: 'week4',
    title: 'Week 4: KT Sessions & Clients',
    description: 'Explaining technical steps logically and answering questions calmly.',
    icon: '4️⃣',
    tips: `
### Explaining Technical Concepts
When explaining a pipeline or architecture (e.g., *How does PySpark work?*), use sequential words to guide the listener:

1. **First**, raw data enters the landing zone.
2. **Next**, Lambda cleans the raw JSON.
3. **After that**, Glue writes Parquet files to S3.
4. **Finally**, Snowflake ingests the clean data.

### Final Golden Rules for Confidence
1. **Embrace the Pause:** When you don't know what word to say next, **stop and stay silent**. Never fill the silence with "ummm" or "aahh". A silent 1-second pause sounds confident and natural.
2. **Keep Sentences Short:** You do not need big, elegant English sentences. Short, 5-to-7-word sentences are much easier to control and understand in engineering meetings.
3. **Consistency Over Intensity:** 15 minutes of speaking out loud every single day is 10 times more effective than studying grammar books for 3 hours on Sunday.
    `
  }
];
