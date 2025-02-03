'use client';

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  });
  const [error, setError] = useState('');
  const { login } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response =  await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/${isLogin ? 'login' : 'register'}`, formData);

      const data = response.data;

      if (response.status !== 201) {
        throw new Error(data.message || 'Something went wrong');
      }

      // Update auth context with the user data
      login(data.user, data.token);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to register');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-gray-900 relative text-gray-100 p-8 rounded-lg w-96 border border-gray-700 shadow-xl">
        <h2 className="text-2xl font-bold mb-6 text-gray-100">
          {isLogin ? 'Login' : 'Register'}
        </h2>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 transition-colors duration-200"
          aria-label="Close modal"
        >
          ✕
        </button>
        
        {error && <p className="text-red-400 mb-4 bg-red-900/50 p-2 rounded">{error}</p>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-300">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full p-2 rounded bg-gray-800 border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors text-gray-100"
                required
              />
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-300">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full p-2 rounded bg-gray-800 border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors text-gray-100"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-300">Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full p-2 rounded bg-gray-800 border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors text-gray-100"
              required
            />
          </div>
          
          {isLogin ? (
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors duration-200"
            >
              Login
            </button>
          ) : (
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors duration-200"
            >
              Register
            </button>
          )}
        </form>
        
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="w-full text-blue-400 mt-4 hover:text-blue-300 transition-colors duration-200"
        >
          {isLogin ? 'Need an account? Register' : 'Already have an account? Login'}
        </button>
        
        
      </div>
    </div>
  );
} 