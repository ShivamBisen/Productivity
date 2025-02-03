'use client';

import { useState } from "react";
import VoiceModal from "./VoiceModal";
import NoteModal from "./NoteModal";
import ReminderModal from "./ReminderModal";

export default function Controlers() {
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);

  const handleTranscriptComplete = (transcript: string) => {
    // Handle the transcript text here
    console.log('Transcript:', transcript);
    // You can save this to your notes or do whatever you want with the text
  };

  const handleNoteSave = (note: { title: string; content: string }) => {
    console.log('Note:', note);
    // Here you can handle saving the note to your backend/database
  };

  const handleReminderSave = (reminder: { title: string; note: string; dateTime: string }) => {
    console.log('Reminder:', reminder);
    // Here you can handle saving the reminder and setting up notifications
  };

  return (
    <div className="flex items-center justify-center space-x-4">
      <div>
        <button 
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200"
          onClick={() => setIsVoiceModalOpen(true)}
        >
          Voice
        </button>
      </div>
      <div>
        <button 
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200"
          onClick={() => setIsNoteModalOpen(true)}
        >
          Note
        </button>
      </div>
      <div>
        <button 
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200"
          onClick={() => setIsReminderModalOpen(true)}
        >
          Reminder
        </button>
      </div>

      <VoiceModal 
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        onTranscriptComplete={handleTranscriptComplete}
      />

      <NoteModal 
        isOpen={isNoteModalOpen}
        onClose={() => setIsNoteModalOpen(false)}
        onSave={handleNoteSave}
      />

      <ReminderModal 
        isOpen={isReminderModalOpen}
        onClose={() => setIsReminderModalOpen(false)}
        onSave={handleReminderSave}
      />
    </div>
  );
}
