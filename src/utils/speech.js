// speech.js

// Initialize SpeechRecognition
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

export const listenToSpeech = (onResult, onError, onEnd) => {
  if (!SpeechRecognition) {
    onError('Speech recognition is not supported in this browser. Please use Google Chrome or Edge.');
    return null;
  }

  const recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = 'en-US';

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    onResult(transcript);
  };

  recognition.onerror = (event) => {
    console.error('Speech recognition error', event.error);
    onError(`Microphone error: ${event.error}`);
  };

  recognition.onend = () => {
    if (onEnd) onEnd();
  };

  try {
    recognition.start();
    return recognition;
  } catch (err) {
    onError('Could not start microphone. Is it already in use?');
    return null;
  }
};

export const speakText = (text, onEnd) => {
  if (!window.speechSynthesis) {
    console.warn('Text-to-speech not supported');
    if (onEnd) onEnd();
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';
  utterance.rate = 0.95; // Slightly slower for clearer pronunciation
  utterance.pitch = 1.0;

  // Try to find a good voice (preferably male/professional sounding for a manager, or Google US English)
  const voices = window.speechSynthesis.getVoices();
  const preferredVoice = voices.find(v => v.name.includes('Google US English')) || 
                         voices.find(v => v.lang === 'en-US');
  
  if (preferredVoice) {
    utterance.voice = preferredVoice;
  }

  if (onEnd) {
    utterance.onend = onEnd;
    utterance.onerror = onEnd;
  }

  window.speechSynthesis.speak(utterance);
};
