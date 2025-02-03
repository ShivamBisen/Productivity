'use client';

import { useState } from 'react';

interface ReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (reminder: {
    title: string;
    note: string;
    dateTime: string;
  }) => void;
}

export default function ReminderModal({ isOpen, onClose, onSave }: ReminderModalProps) {
  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');
  const [dateTime, setDateTime] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ title, note, dateTime });
    setTitle('');
    setNote('');
    setDateTime('');
    onClose();
  };

  // Get current date and time in local ISO format for min datetime
  const now = new Date();
  const localDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-gray-900 relative text-gray-100 p-8 rounded-lg w-[600px] border border-gray-700 shadow-xl">
        <h2 className="text-2xl font-bold mb-6 text-gray-100">Set Reminder</h2>
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 transition-colors duration-200"
          aria-label="Close modal"
        >
          ✕
        </button>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-300">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 rounded bg-gray-800 border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors text-gray-100"
              placeholder="Enter reminder title..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-300">
              Date & Time
            </label>
            <input
              type="datetime-local"
              value={dateTime}
              onChange={(e) => setDateTime(e.target.value)}
              min={localDateTime}
              className="w-full p-2 rounded bg-gray-800 border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors text-gray-100"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-300">
              Note (optional)
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full p-2 rounded bg-gray-800 border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors text-gray-100 min-h-[100px] resize-y"
              placeholder="Add a note to your reminder..."
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors duration-200"
          >
            Set Reminder
          </button>
        </form>
      </div>
    </div>
  );
} 