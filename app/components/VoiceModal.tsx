'use client';

import { useState, useRef, useEffect } from 'react';

// Add type definitions
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

type SpeechRecognition = any;

interface VoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTranscriptComplete: (transcript: string) => void;
}

export default function VoiceModal({ isOpen, onClose, onTranscriptComplete }: VoiceModalProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState('');
  const [language, setLanguage] = useState<"en" | "hi">("en");
  const lastTranscriptRef = useRef("");
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        const recognition = recognitionRef.current;
        
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = language === "en" ? "en-US" : "hi-IN";
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
          setIsListening(true);
          setError('');
        };

        recognition.onerror = (event: any) => {
          let errorMessage = 'Error occurred in recognition';
          switch (event.error) {
            case 'network':
              errorMessage = 'Please check your internet connection';
              break;
            case 'not-allowed':
              errorMessage = 'Microphone access denied';
              break;
            case 'no-speech':
              errorMessage = 'No speech detected';
              break;
            default:
              errorMessage = `Error: ${event.error}`;
          }
          setError(errorMessage);
          setIsListening(false);
          if (event.error === 'network') {
            setTimeout(() => {
              if (recognitionRef.current) {
                recognitionRef.current.start();
              }
            }, 1000);
          }
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognition.onresult = (event: any) => {
          const current = event.resultIndex;
          const transcriptText = event.results[current][0].transcript;
          
          if (transcriptText && transcriptText !== lastTranscriptRef.current) {
            lastTranscriptRef.current = transcriptText;
            setTranscript(prev => {
              const prefix = prev ? prev + " " : "";
              return prefix + transcriptText;
            });
          }
        };
      } else {
        setError('Speech recognition not supported in this browser');
      }
    }
  }, [language]);

  if (!isOpen) return null;

  const handleStartListening = async () => {
    try {
      if (recognitionRef.current) {
        recognitionRef.current.start();
      }
    } catch (err) {
      setError('Failed to start recording');
    }
  };

  const handleStopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const handleSave = () => {
    onTranscriptComplete(transcript);
    setTranscript('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-gray-900 relative text-gray-100 p-8 rounded-lg w-[500px] border border-gray-700 shadow-xl">
        <h2 className="text-2xl font-bold mb-6 text-gray-100">Voice to Text</h2>
        
        {/* Language Selector */}
        <div className="flex space-x-2 mb-6">
          <button
            onClick={() => setLanguage("en")}
            className={`flex-1 p-2 rounded-lg ${
              language === "en" 
                ? "bg-blue-600 text-white" 
                : "bg-gray-800 text-gray-300"
            }`}
          >
            English
          </button>
          <button
            onClick={() => setLanguage("hi")}
            className={`flex-1 p-2 rounded-lg ${
              language === "hi" 
                ? "bg-blue-600 text-white" 
                : "bg-gray-800 text-gray-300"
            }`}
          >
            हिंदी
          </button>
        </div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 transition-colors duration-200"
          aria-label="Close modal"
        >
          ✕
        </button>

        {error && <p className="text-red-400 mb-4 bg-red-900/50 p-2 rounded">{error}</p>}

        <div className="space-y-4">
          <div className="min-h-[150px] p-4 bg-gray-800 rounded-lg border border-gray-700">
            {transcript || (
              <span className="text-gray-500">
                {language === "en" 
                  ? "Start speaking or type your text here..." 
                  : "बोलना शुरू करें या यहां टाइप करें..."}
              </span>
            )}
          </div>

          <div className="flex justify-center space-x-4">
            {!isListening ? (
              <button
                onClick={handleStartListening}
                className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
              >
                <span>Start Recording</span>
                <span className="w-3 h-3 rounded-full bg-red-500"></span>
              </button>
            ) : (
              <button
                onClick={handleStopListening}
                className="bg-red-600 text-white px-6 py-2 rounded-full hover:bg-red-700 transition-colors duration-200 flex items-center space-x-2"
              >
                <span>Stop Recording</span>
                <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></span>
              </button>
            )}
          </div>

          {transcript && (
            <button
              onClick={handleSave}
              className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition-colors duration-200"
            >
              Save Text
            </button>
          )}
        </div>
      </div>
    </div>
  );
} 