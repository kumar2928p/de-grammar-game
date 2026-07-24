import { useState, useEffect, useRef } from 'react';
import { generateSingleRandomQuestion } from './utils/generator';
import Parrot from './components/Parrot';
import Butterflies from './components/Butterflies';
import { listenToSpeech, speakText } from './utils/speech';
import { chatWithAI } from './utils/ai_providers';

const NATURE_BACKGROUNDS = [
  'https://images.unsplash.com/photo-1432405972618-fc027058b8d9?q=80&w=2000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=2000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1476610182048-b716b8518aae?q=80&w=2000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1433086966358-54859d0ed716?q=80&w=2000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1501854140801-50d01698950b?q=80&w=2000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1542224566-6e85f2e6772f?q=80&w=2000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1518182170546-076616fd4aa8?q=80&w=2000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2000&auto=format&fit=crop'
];

const THEMES = {
  home: { main: '#58cc02', shadow: '#46a302', glow: 'rgba(88, 204, 2, 0.3)' },
  sentence_builder: { main: '#1cb0f6', shadow: '#1899d6', glow: 'rgba(28, 176, 246, 0.3)' },
  standup_rush: { main: '#ff4b4b', shadow: '#ea2b2b', glow: 'rgba(255, 75, 75, 0.3)' },
  pipeline_story: { main: '#b146c2', shadow: '#8a3399', glow: 'rgba(177, 70, 194, 0.3)' },
  client_reaction: { main: '#ff9600', shadow: '#cc7800', glow: 'rgba(255, 150, 0, 0.3)' },
  fill_blank: { main: '#2ce2a8', shadow: '#1eb887', glow: 'rgba(44, 226, 168, 0.3)' },
  ai_practice: { main: '#00d0ff', shadow: '#0099cc', glow: 'rgba(0, 208, 255, 0.3)' }
};

const AI_MODELS = {
  gemini: [
    { id: 'gemini-3.5-flash', name: 'Gemini 3.5 Flash' },
    { id: 'gemini-3.1-pro', name: 'Gemini 3.1 Pro' },
    { id: 'gemini-3.1-low', name: 'Gemini 3.1 Low' },
    { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash (Fast)' },
    { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro (Powerful)' },
    { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash' },
    { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro' },
    { id: 'gemini-pro', name: 'Gemini 1.0 Pro' }
  ],
  groq: [
    { id: 'llama3-8b-8192', name: 'Llama 3 8B (Free via Groq)' },
    { id: 'llama3-70b-8192', name: 'Llama 3 70B (Free via Groq)' },
    { id: 'mixtral-8x7b-32768', name: 'Mixtral 8x7b (Free via Groq)' }
  ],
  openai: [
    { id: 'chatgpt-4o-latest', name: 'ChatGPT 4o (Free)' },
    { id: 'gpt-4o-mini', name: 'GPT-4o Mini (Free)' },
    { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo (Free)' },
    { id: 'gpt-4', name: 'GPT-4 (Paid)' }
  ]
};

function App() {
  const [currentScreen, setCurrentScreen] = useState('home'); // 'home', 'game', 'ai_practice'
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [questionsCompleted, setQuestionsCompleted] = useState(0);
  const [gameMode, setGameMode] = useState('mixed');
  const [bgImage, setBgImage] = useState(NATURE_BACKGROUNDS[0]);
  const userName = 'Kumar';
  
  // Game State
  const [currentQuestion, setCurrentQuestion] = useState(null);
  
  // Mini-Game States
  const [jumbledAnswer, setJumbledAnswer] = useState([]);
  const [availableWords, setAvailableWords] = useState([]);
  const [sequenceOrder, setSequenceOrder] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  
  // Standup Rush specific state
  const [timeLeft, setTimeLeft] = useState(30);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [rushCompleted, setRushCompleted] = useState(false);

  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');

  // AI Practice State
  const [aiProvider, setAiProvider] = useState('gemini');
  const [aiModel, setAiModel] = useState('gemini-2.5-flash');
  const [keys, setKeys] = useState({ gemini: '', groq: '', openai: '' });
  
  const [conversation, setConversation] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const recognitionRef = useRef(null);
  const chatScrollRef = useRef(null);

  // Initial load
  useEffect(() => {
    const savedXp = localStorage.getItem('de_grammar_xp');
    const savedStreak = localStorage.getItem('de_grammar_streak');
    if (savedXp) setXp(parseInt(savedXp));
    if (savedStreak) setStreak(parseInt(savedStreak));
    
    // Load AI Settings
    const savedKeys = localStorage.getItem('ai_keys');
    if (savedKeys) setKeys(JSON.parse(savedKeys));
    const savedProvider = localStorage.getItem('ai_provider');
    if (savedProvider) setAiProvider(savedProvider);
    const savedModel = localStorage.getItem('ai_model');
    if (savedModel) setAiModel(savedModel);
    else if (!savedModel && savedProvider) {
      setAiModel(AI_MODELS[savedProvider][0].id);
    }
    
    // Pick random initial background
    changeBackground();

    // Set an interval to change the background every 10 minutes (600,000 ms)
    const interval = setInterval(() => {
      changeBackground();
    }, 600000);

    return () => clearInterval(interval);
  }, []);

  // Dynamic UI Theming
  useEffect(() => {
    let activeTheme = THEMES.home;
    if (currentScreen === 'game' && currentQuestion) {
      activeTheme = THEMES[currentQuestion.gameType] || THEMES.home;
    } else if (currentScreen === 'ai_practice') {
      activeTheme = THEMES.ai_practice;
    }
    
    document.documentElement.style.setProperty('--primary', activeTheme.main);
    document.documentElement.style.setProperty('--primary-shadow', activeTheme.shadow);
    document.documentElement.style.setProperty('--accent', activeTheme.main);
    
    // Add dynamic glow to panels
    const panels = document.querySelectorAll('.glass-panel');
    panels.forEach(p => {
      p.style.boxShadow = `0 8px 32px 0 ${activeTheme.glow}`;
    });
  }, [currentScreen, currentQuestion]);

  const changeBackground = () => {
    const randomBg = NATURE_BACKGROUNDS[Math.floor(Math.random() * NATURE_BACKGROUNDS.length)];
    setBgImage(randomBg);
  };

  const saveProgress = (newXp) => {
    setXp(newXp);
    localStorage.setItem('de_grammar_xp', newXp);
    const newStreak = streak === 0 ? 1 : streak;
    setStreak(newStreak);
    localStorage.setItem('de_grammar_streak', newStreak);
  };

  // --- AI SETTINGS LOGIC ---
  const updateSettings = (provider, model) => {
    setAiProvider(provider);
    setAiModel(model);
    localStorage.setItem('ai_provider', provider);
    localStorage.setItem('ai_model', model);
  };
  
  const updateKey = (provider, key) => {
    const newKeys = { ...keys, [provider]: key };
    setKeys(newKeys);
    localStorage.setItem('ai_keys', JSON.stringify(newKeys));
  };

  // --- AI PRACTICE LOGIC ---
  const startAIPractice = () => {
    if (!keys[aiProvider]) {
      alert(`Please enter your ${aiProvider.toUpperCase()} API Key in the settings below first!`);
      return;
    }
    const introMsg = "Hello Kumar! I'm your Engineering Manager. How are you doing today? Ready to practice your communication?";
    setConversation([{ role: 'ai', text: introMsg }]);
    setCurrentScreen('ai_practice');
    speakText(introMsg);
  };

  const stopAIPractice = () => {
    window.speechSynthesis.cancel();
    if (recognitionRef.current) recognitionRef.current.stop();
    setCurrentScreen('home');
  };

  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsListening(false);
    } else {
      window.speechSynthesis.cancel(); // Stop AI talking if we interrupt
      setIsListening(true);
      recognitionRef.current = listenToSpeech(
        (transcript) => {
           setIsListening(false);
           handleUserAudioInput(transcript);
        },
        (errorMsg) => {
           alert(errorMsg);
           setIsListening(false);
        },
        () => {
           setIsListening(false);
        }
      );
    }
  };

  const handleUserAudioInput = async (transcript) => {
    if (!transcript.trim()) return;
    
    const newConvo = [...conversation, { role: 'user', text: transcript }];
    setConversation(newConvo);
    setIsThinking(true);

    try {
      const aiReply = await chatWithAI(aiProvider, aiModel, newConvo, keys[aiProvider]);
      setConversation([...newConvo, { role: 'ai', text: aiReply }]);
      speakText(aiReply);
    } catch (error) {
      alert(`${aiProvider.toUpperCase()} Error: ` + error.message);
    } finally {
      setIsThinking(false);
    }
  };

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [conversation]);

  // --- MINIGAME LOGIC ---

  const startDailyWorkout = (mode = 'mixed') => {
    setGameMode(mode);
    const firstQuestion = generateSingleRandomQuestion(mode);
    setCurrentQuestion(firstQuestion);
    setQuestionsCompleted(0);
    setShowFeedback(false);
    initQuestion(firstQuestion);
    setCurrentScreen('game');
  };

  const initQuestion = (q) => {
    setAvailableWords([]);
    setJumbledAnswer([]);
    setSequenceOrder([]);
    setSelectedOption(null);
    setIsTimerRunning(false);
    setRushCompleted(false);
    
    if (q.gameType === 'sentence_builder') {
      const shuffled = [...q.words].sort(() => Math.random() - 0.5);
      setAvailableWords(shuffled);
    } else if (q.gameType === 'pipeline_story') {
      const shuffled = q.sentences.map((s, idx) => ({ text: s, id: idx })).sort(() => Math.random() - 0.5);
      setAvailableWords(shuffled);
    } else if (q.gameType === 'standup_rush') {
      setTimeLeft(30);
    }
  };

  // Timer effect for Standup Rush
  useEffect(() => {
    let timer;
    if (isTimerRunning && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (isTimerRunning && timeLeft === 0) {
      setIsTimerRunning(false);
      setRushCompleted(true);
      setShowFeedback(true);
      setIsCorrect(true);
      setFeedbackText('Time is up! Great practice.');
    }
    return () => clearTimeout(timer);
  }, [isTimerRunning, timeLeft]);

  const checkAnswer = () => {
    let correct = false;
    let feedback = '';
    
    if (currentQuestion.gameType === 'fill_blank') {
      correct = selectedOption === currentQuestion.correctAnswer;
      feedback = correct ? 'Correct!' : `The correct answer was: ${currentQuestion.correctAnswer}`;
    } else if (currentQuestion.gameType === 'sentence_builder') {
      correct = jumbledAnswer.join(' ').toLowerCase() === currentQuestion.correctSentence.toLowerCase();
      feedback = correct ? 'Perfect sentence structure!' : `Not quite. Correct sentence: ${currentQuestion.correctSentence}`;
    } else if (currentQuestion.gameType === 'pipeline_story') {
      correct = sequenceOrder.length === currentQuestion.sentences.length &&
        sequenceOrder.every((item, idx) => item.text === currentQuestion.sentences[idx]);
      feedback = correct ? 'Excellent logical flow!' : 'Incorrect sequence. Remember to use transition words.';
    } else if (currentQuestion.gameType === 'client_reaction') {
      const selected = currentQuestion.options.find(o => o.text === selectedOption);
      correct = selected.isCorrect;
      feedback = selected.feedback;
    }

    setIsCorrect(correct);
    setFeedbackText(feedback);
    setShowFeedback(true);
  };

  const nextQuestion = () => {
    if (isCorrect || currentQuestion.gameType === 'standup_rush') {
      saveProgress(xp + 15);
    }
    setQuestionsCompleted(prev => prev + 1);

    const nextQ = generateSingleRandomQuestion(gameMode);
    setCurrentQuestion(nextQ);
    setShowFeedback(false);
    initQuestion(nextQ);
  };
  
  const skipQuestion = () => {
    const nextQ = generateSingleRandomQuestion(gameMode);
    setCurrentQuestion(nextQ);
    setShowFeedback(false);
    initQuestion(nextQ);
  };

  const endWorkout = () => {
    setCurrentScreen('home');
    saveProgress(xp + (questionsCompleted * 5));
  };

  const handleJumbleWordClick = (word, index, fromArea) => {
    if (showFeedback) return;
    if (fromArea === 'available') {
      const newAvailable = [...availableWords];
      newAvailable.splice(index, 1);
      setAvailableWords(newAvailable);
      setJumbledAnswer([...jumbledAnswer, word]);
    } else {
      const newJumbled = [...jumbledAnswer];
      newJumbled.splice(index, 1);
      setJumbledAnswer(newJumbled);
      setAvailableWords([...availableWords, word]);
    }
  };

  const handleSequenceClick = (item, index, fromArea) => {
    if (showFeedback) return;
    if (fromArea === 'available') {
      const newAvailable = [...availableWords];
      newAvailable.splice(index, 1);
      setAvailableWords(newAvailable);
      setSequenceOrder([...sequenceOrder, item]);
    } else {
      const newSequence = [...sequenceOrder];
      newSequence.splice(index, 1);
      setSequenceOrder(newSequence);
      setAvailableWords([...availableWords, item]);
    }
  };

  const renderHome = () => {
    return (
      <div className="app-container" style={{flex: 1}}>
        <div className="top-bar">
          <div className="stat-item stat-streak">🔥 {streak}</div>
          <div className="stat-item stat-xp" style={{color: 'var(--primary)'}}>⚡ {xp} XP</div>
        </div>

        <div className="dashboard-content glass-panel" style={{textAlign: 'center', marginTop: '2rem'}}>
          <div style={{marginBottom: '1rem'}}>
            <Parrot isFlying={false} />
          </div>
          <h1 style={{marginBottom: '1rem', color: 'var(--text-main)'}}>Welcome back, {userName}!</h1>
          <p style={{color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '1.2rem'}}>
            Ready for your endless data engineering workout?
          </p>

          <div className="lesson-card" onClick={startAIPractice} style={{borderColor: THEMES.ai_practice.main, padding: '1.5rem', marginBottom: '1.5rem', background: 'linear-gradient(145deg, rgba(0, 208, 255, 0.1), rgba(0,0,0,0.6))'}}>
            <div className="lesson-icon" style={{fontSize: '3rem'}}>🎙️</div>
            <div className="lesson-title" style={{color: THEMES.ai_practice.main, fontSize: '1.5rem', transition: 'color 0.3s'}}>AI MANAGER 1-on-1</div>
            <div style={{color: 'var(--text-muted)', marginTop: '0.5rem'}}>
              Live spoken conversation practice with Gemini, Llama, or ChatGPT.
            </div>
          </div>

          <div className="lesson-card" onClick={() => startDailyWorkout('mixed')} style={{borderColor: 'var(--primary)', padding: '1.5rem', marginBottom: '1.5rem'}}>
            <div className="lesson-icon" style={{fontSize: '3rem'}}>♾️</div>
            <div className="lesson-title" style={{color: 'var(--primary)', fontSize: '1.5rem', transition: 'color 0.3s'}}>MIXED ENDLESS WORKOUT</div>
            <div style={{color: 'var(--text-muted)', marginTop: '0.5rem'}}>
              A random mix of all modules.
            </div>
          </div>

          <h3 style={{color: 'var(--text-muted)', marginBottom: '1rem', textAlign: 'left', width: '100%'}}>Grammar Foundation</h3>
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', width: '100%', marginBottom: '1.5rem'}}>
            <button className="duo-btn duo-btn-option" onClick={() => startDailyWorkout('tenses')} style={{marginBottom: 0}}>
              ⏳ Tenses
            </button>
            <button className="duo-btn duo-btn-option" onClick={() => startDailyWorkout('verbs')} style={{marginBottom: 0}}>
              🏃 Verbs
            </button>
            <button className="duo-btn duo-btn-option" onClick={() => startDailyWorkout('adjectives')} style={{marginBottom: 0}}>
              🎨 Adjectives
            </button>
            <button className="duo-btn duo-btn-option" onClick={() => startDailyWorkout('conjunctions')} style={{marginBottom: 0}}>
              🔗 Conjunctions
            </button>
          </div>

          <h3 style={{color: 'var(--text-muted)', marginBottom: '1rem', textAlign: 'left', width: '100%'}}>Advanced Scenarios</h3>
          <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%', marginBottom: '2rem'}}>
            <button className="duo-btn duo-btn-option" onClick={() => startDailyWorkout('sentence_builder')}>
              🏗️ Sentence Builder
            </button>
            <button className="duo-btn duo-btn-option" onClick={() => startDailyWorkout('standup_rush')}>
              ⏱️ Standup Rush
            </button>
            <button className="duo-btn duo-btn-option" onClick={() => startDailyWorkout('pipeline_story')}>
              📖 Pipeline Storyteller
            </button>
            <button className="duo-btn duo-btn-option" onClick={() => startDailyWorkout('client_reaction')}>
              🤝 Client Reaction (RPG)
            </button>
          </div>

          {/* AI Settings Section */}
          <div style={{borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.5rem', marginTop: '1.5rem'}}>
            <h3 style={{color: 'var(--text-main)', marginBottom: '1.5rem', textAlign: 'left'}}>⚙️ AI Model Settings</h3>
            
            <div style={{display: 'flex', flexDirection: 'column', gap: '1.5rem', textAlign: 'left'}}>
              <div>
                <label style={{display: 'block', color: 'var(--text-muted)', marginBottom: '0.5rem'}}>Select AI Provider</label>
                <select 
                  style={{width: '100%', padding: '0.8rem', borderRadius: '8px', background: 'rgba(0,0,0,0.5)', color: 'white', border: '1px solid var(--primary)', fontSize: '1.1rem'}}
                  value={aiProvider}
                  onChange={(e) => {
                    const newProvider = e.target.value;
                    updateSettings(newProvider, AI_MODELS[newProvider][0].id);
                  }}
                >
                  <option value="gemini">Google Gemini (Free)</option>
                  <option value="groq">Groq / Meta Llama (Free & Fastest)</option>
                  <option value="openai">OpenAI ChatGPT (Requires Paid Key)</option>
                </select>
              </div>

              <div>
                <label style={{display: 'block', color: 'var(--text-muted)', marginBottom: '0.5rem'}}>Select Model</label>
                <select 
                  style={{width: '100%', padding: '0.8rem', borderRadius: '8px', background: 'rgba(0,0,0,0.5)', color: 'white', border: '1px solid var(--primary)', fontSize: '1.1rem'}}
                  value={aiModel}
                  onChange={(e) => updateSettings(aiProvider, e.target.value)}
                >
                  {AI_MODELS[aiProvider].map(m => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: '0.5rem'}}>
                  <span>{aiProvider.toUpperCase()} API Key</span>
                  {keys[aiProvider] ? <span style={{color: 'var(--primary)', fontWeight: 'bold'}}>✅ Key Set</span> : <span style={{color: 'var(--error)'}}>❌ Key Missing</span>}
                </label>
                <input 
                  type="password"
                  placeholder={`Paste your ${aiProvider} API Key here...`}
                  style={{width: '100%', padding: '0.8rem', borderRadius: '8px', background: 'rgba(0,0,0,0.5)', color: 'white', border: '1px solid var(--primary)', fontSize: '1.1rem'}}
                  value={keys[aiProvider]}
                  onChange={(e) => updateKey(aiProvider, e.target.value)}
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    );
  };

  const renderFillBlank = () => {
    const parts = currentQuestion.sentence.split('_____');
    return (
      <div style={{display: 'flex', flexDirection: 'column'}}>
        <div className="glass-panel" style={{fontSize: '1.3rem', marginBottom: '2rem'}}>
          {parts[0]} <span style={{display: 'inline-block', width: '80px', borderBottom: '2px solid var(--text-main)'}}></span> {parts[1]}
        </div>
        {currentQuestion.options.map((opt, idx) => (
          <button 
            key={idx} 
            className={`duo-btn duo-btn-option ${selectedOption === opt ? 'selected' : ''}`}
            onClick={() => setSelectedOption(opt)}
            disabled={showFeedback}
          >
            {opt}
          </button>
        ))}
      </div>
    );
  };

  const renderSentenceBuilder = () => (
    <>
      <div className="jumble-area glass-panel" style={{marginBottom: '1.5rem'}}>
        {jumbledAnswer.map((word, idx) => (
          <button key={`ans-${idx}`} className="word-btn" onClick={() => handleJumbleWordClick(word, idx, 'answer')} disabled={showFeedback}>
            {word}
          </button>
        ))}
      </div>
      <div className="word-bank">
        {availableWords.map((word, idx) => (
          <button key={`avail-${idx}`} className="word-btn" onClick={() => handleJumbleWordClick(word, idx, 'available')} disabled={showFeedback}>
            {word}
          </button>
        ))}
      </div>
    </>
  );

  const renderStandupRush = () => (
    <div style={{textAlign: 'center'}}>
      <div style={{fontSize: '4rem', fontWeight: 'bold', color: timeLeft <= 10 ? 'var(--error)' : 'var(--primary)', marginBottom: '2rem', textShadow: '0 2px 4px rgba(0,0,0,0.5)', transition: 'color 0.3s'}}>
        00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
      </div>
      
      {!isTimerRunning && !rushCompleted ? (
        <button className="duo-btn duo-btn-primary" onClick={() => setIsTimerRunning(true)}>
          START RECORDING / SPEAKING
        </button>
      ) : (
        <div className="glass-panel" style={{textAlign: 'left'}}>
          <p style={{marginBottom: '1rem', fontStyle: 'italic', color: 'var(--text-muted)'}}>Speak this out loud:</p>
          {currentQuestion.prompts.map((p, idx) => (
            <div key={idx} style={{marginBottom: '1rem', fontSize: '1.2rem'}}>
              <strong style={{color: 'var(--accent)', transition: 'color 0.3s'}}>{p.label}</strong> {p.hint}
            </div>
          ))}
          {!rushCompleted && (
            <button className="duo-btn duo-btn-secondary" style={{marginTop: '2rem', backgroundColor: 'var(--text-muted)', borderColor: '#888'}} onClick={() => { setIsTimerRunning(false); setTimeLeft(0); }}>
              I'M DONE
            </button>
          )}
        </div>
      )}
    </div>
  );

  const renderPipelineStory = () => (
    <>
      <div className="glass-panel" style={{display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem', minHeight: '100px'}}>
        {sequenceOrder.length === 0 && <span style={{color: 'var(--text-muted)'}}>Click sentences below to build the sequence...</span>}
        {sequenceOrder.map((item, idx) => (
          <div key={`seq-${item.id}`} style={{backgroundColor: 'rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '8px', cursor: 'pointer', display: 'flex', gap: '1rem', alignItems: 'center'}} onClick={() => handleSequenceClick(item, idx, 'answer')} disabled={showFeedback}>
            <div style={{backgroundColor: 'var(--primary)', color: 'white', minWidth: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', transition: 'background-color 0.3s'}}>{idx + 1}</div>
            <div>{item.text}</div>
          </div>
        ))}
      </div>
      <div style={{display: 'flex', flexDirection: 'column', gap: '0.75rem'}}>
        {availableWords.map((item, idx) => (
          <div key={`avail-${item.id}`} style={{padding: '1rem', borderRadius: '8px', cursor: 'pointer', border: '1px dashed var(--primary)', backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(5px)', transition: 'border-color 0.3s'}} onClick={() => handleSequenceClick(item, idx, 'available')} disabled={showFeedback}>
            <div>{item.text}</div>
          </div>
        ))}
      </div>
    </>
  );

  const renderClientReaction = () => (
    <div style={{display: 'flex', flexDirection: 'column'}}>
      <div className="glass-panel" style={{borderLeft: '4px solid var(--accent)', marginBottom: '2rem', transition: 'border-color 0.3s'}}>
        <div style={{fontWeight: 'bold', color: 'var(--accent)', marginBottom: '0.5rem', transition: 'color 0.3s'}}>Client / Stakeholder:</div>
        <div style={{fontSize: '1.3rem'}}>{currentQuestion.scenario}</div>
      </div>
      {currentQuestion.options.map((opt, idx) => (
        <button 
          key={idx} 
          className={`duo-btn duo-btn-option ${selectedOption === opt.text ? 'selected' : ''}`}
          onClick={() => setSelectedOption(opt.text)}
          disabled={showFeedback}
        >
          {opt.text}
        </button>
      ))}
    </div>
  );

  const renderAIPractice = () => {
    return (
      <div className="app-container" style={{flex: 1, position: 'relative', display: 'flex', flexDirection: 'column', height: '100vh'}}>
        <div className="game-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <button className="duo-btn duo-btn-secondary" style={{width: 'auto', padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'var(--text-muted)', borderColor: '#888'}} onClick={stopAIPractice}>
            🏠 End Meeting
          </button>
          <div className="glass-panel" style={{padding: '0.5rem 1rem', color: 'var(--text-main)', fontWeight: 'bold', margin: '0 1rem'}}>
            {aiModel}
          </div>
        </div>

        <div className="glass-panel" ref={chatScrollRef} style={{flex: 1, overflowY: 'auto', marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem'}}>
          {conversation.map((msg, idx) => (
            <div key={idx} style={{
              alignSelf: msg.role === 'ai' ? 'flex-start' : 'flex-end',
              backgroundColor: msg.role === 'ai' ? 'rgba(0, 208, 255, 0.2)' : 'rgba(88, 204, 2, 0.2)',
              border: `1px solid ${msg.role === 'ai' ? 'rgba(0, 208, 255, 0.5)' : 'rgba(88, 204, 2, 0.5)'}`,
              padding: '1rem',
              borderRadius: '12px',
              maxWidth: '80%',
              fontSize: '1.1rem'
            }}>
              <strong>{msg.role === 'ai' ? '🗣️ Manager' : '🧑‍💻 You'}</strong>
              <div style={{marginTop: '0.5rem', lineHeight: '1.4'}}>{msg.text}</div>
            </div>
          ))}
          {isListening && (
            <div style={{alignSelf: 'flex-end', fontStyle: 'italic', color: 'var(--text-muted)'}}>Listening...</div>
          )}
          {isThinking && (
            <div style={{alignSelf: 'flex-start', fontStyle: 'italic', color: 'var(--text-muted)'}}>Manager is typing...</div>
          )}
        </div>

        <div style={{paddingBottom: '2rem', display: 'flex', justifyContent: 'center'}}>
          <button 
            className={`duo-btn ${isListening ? 'duo-btn-secondary' : 'duo-btn-primary'}`} 
            style={{
              width: '100px', height: '100px', borderRadius: '50%', 
              display: 'flex', justifyContent: 'center', alignItems: 'center',
              fontSize: '3rem', margin: '0',
              backgroundColor: isListening ? '#ff4b4b' : 'var(--primary)',
              boxShadow: isListening ? '0 0 20px #ff4b4b' : '0 8px 0 var(--primary-shadow)'
            }}
            onClick={toggleListening}
            disabled={isThinking}
          >
            {isListening ? '🛑' : '🎙️'}
          </button>
        </div>
      </div>
    );
  };

  const renderGame = () => {
    if (!currentQuestion) return null;
    
    const canCheck = 
      (currentQuestion.gameType === 'fill_blank' && selectedOption !== null) ||
      (currentQuestion.gameType === 'sentence_builder' && jumbledAnswer.length === currentQuestion.words.length) ||
      (currentQuestion.gameType === 'pipeline_story' && sequenceOrder.length === currentQuestion.sentences.length) ||
      (currentQuestion.gameType === 'client_reaction' && selectedOption !== null);

    const isParrotFlying = showFeedback && isCorrect;

    return (
      <div className="app-container" style={{flex: 1, paddingBottom: showFeedback ? '200px' : '0', position: 'relative'}}>
        {/* Force remount of Butterflies by providing a unique key based on questionsCompleted */}
        <Butterflies key={`butterfly-${questionsCompleted}`} active={showFeedback && isCorrect} />
        
        <div className="game-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <button className="duo-btn duo-btn-secondary" style={{width: 'auto', padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'var(--text-muted)', borderColor: '#888'}} onClick={endWorkout}>
            🏠 Home
          </button>
          
          <div className="glass-panel" style={{padding: '0.5rem 1rem', color: 'var(--text-main)', fontWeight: 'bold', margin: '0 1rem'}}>
            Completed: {questionsCompleted}
          </div>

          <button className="duo-btn duo-btn-option" style={{width: 'auto', padding: '0.5rem 1rem', marginBottom: 0, display: 'flex', alignItems: 'center', gap: '0.5rem'}} onClick={skipQuestion} disabled={showFeedback}>
            ⏭️ Skip
          </button>
        </div>

        <div className="glass-panel" style={{display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', borderLeft: '4px solid var(--primary)', transition: 'border-color 0.3s'}}>
          <div style={{width: '60px', height: '60px', flexShrink: 0}}>
            <Parrot isFlying={isParrotFlying} />
          </div>
          <div>
            <div style={{color: 'var(--primary)', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '0.9rem', transition: 'color 0.3s'}}>{currentQuestion.title}</div>
            <div className="question-text" style={{marginBottom: 0, textShadow: 'none'}}>{currentQuestion.instruction}</div>
          </div>
        </div>

        {currentQuestion.gameType === 'fill_blank' && renderFillBlank()}
        {currentQuestion.gameType === 'sentence_builder' && renderSentenceBuilder()}
        {currentQuestion.gameType === 'standup_rush' && renderStandupRush()}
        {currentQuestion.gameType === 'pipeline_story' && renderPipelineStory()}
        {currentQuestion.gameType === 'client_reaction' && renderClientReaction()}

        {!showFeedback && currentQuestion.gameType !== 'standup_rush' && (
          <div className="bottom-action">
            <button 
              className="duo-btn duo-btn-primary" 
              onClick={checkAnswer}
              disabled={!canCheck}
              style={{opacity: !canCheck ? 0.5 : 1}}
            >
              CHECK
            </button>
          </div>
        )}

        {showFeedback && (
          <div className={`feedback-footer ${isCorrect ? 'success' : 'error'}`}>
            <div className="feedback-msg">{isCorrect ? 'Great job!' : 'Not quite right.'}</div>
            <div className="feedback-explanation">
              <strong>{feedbackText}</strong><br/>
              {currentQuestion.explanation}
            </div>
            
            {currentQuestion.definitions && currentQuestion.definitions.length > 0 && (
              <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: '8px' }}>
                <strong style={{ color: 'var(--accent)' }}>📚 Vocabulary Definitions:</strong>
                <ul style={{ margin: '0.5rem 0 0 1.5rem', fontSize: '0.9rem', textAlign: 'left' }}>
                  {currentQuestion.definitions.map((def, idx) => (
                    <li key={idx} style={{ marginBottom: '0.25rem' }}>
                      <strong style={{ color: 'var(--primary)' }}>{def.word}</strong>: {def.meaning}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <button className="duo-btn" onClick={nextQuestion} style={{ marginTop: '1rem' }}>
              CONTINUE TO NEXT QUESTION
            </button>
          </div>
        )}
      </div>
    );
  };

  useEffect(() => {
    // We clean up body styles just in case
    document.body.style.backgroundImage = '';
  }, []);

  return (
    <>
      <div 
        style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url("${bgImage}")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: -100
        }}
      />
      {currentScreen === 'home' && renderHome()}
      {currentScreen === 'game' && renderGame()}
      {currentScreen === 'ai_practice' && renderAIPractice()}
    </>
  );
}

export default App;
