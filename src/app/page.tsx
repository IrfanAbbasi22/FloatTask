'use client';

import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from '@/context/AppContext';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';
import { TodoList } from '@/components/TodoList';
import { Notes } from '@/components/Notes';
import { PiPControls } from '@/components/PiPControls';
import { Bell, Settings, Download, StickyNote, Sun, Moon } from 'lucide-react';

function TodoApp() {
  const { state } = useApp();
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<'todos' | 'notes'>('todos');
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  useEffect(() => {
    // Check if app can be installed
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setShowInstallPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    // This would be handled by the browser's install prompt
    setShowInstallPrompt(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm border-b border-amber-200 dark:border-gray-600">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 dark:from-blue-500 dark:to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <StickyNote className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">PiP Todo Assistant</h1>
                <p className="text-sm text-gray-600 dark:text-gray-300">Your floating sticky notes companion</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all interactive-button"
                title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              >
                {theme === 'light' ? (
                  <Moon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                ) : (
                  <Sun className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                )}
              </button>
              <PiPControls />
              {showInstallPrompt && (
                <button
                  onClick={handleInstall}
                  className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all interactive-button shadow-md"
                >
                  <Download className="w-4 h-4" />
                  Install App
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl shadow-lg border border-amber-200 dark:border-gray-600 p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                <Bell className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {state.todos.filter(t => !t.completed).length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Active Tasks</div>
              </div>
            </div>
          </div>
          <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl shadow-lg border border-amber-200 dark:border-gray-600 p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                <StickyNote className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {state.todos.filter(t => t.completed).length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Completed</div>
              </div>
            </div>
          </div>
          <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl shadow-lg border border-amber-200 dark:border-gray-600 p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                <StickyNote className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                  {state.notes.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Notes</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl shadow-lg border border-amber-200 dark:border-gray-600 mb-8">
          <div className="border-b border-amber-200 dark:border-gray-600">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('todos')}
                className={`px-8 py-4 text-sm font-medium transition-all interactive-button rounded-t-xl ${
                  activeTab === 'todos'
                    ? 'bg-amber-500 dark:bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-gray-700/50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4" />
                  Tasks
                </div>
              </button>
              <button
                onClick={() => setActiveTab('notes')}
                className={`px-8 py-4 text-sm font-medium transition-all interactive-button rounded-t-xl ${
                  activeTab === 'notes'
                    ? 'bg-amber-500 dark:bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-gray-700/50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <StickyNote className="w-4 h-4" />
                  Notes
                </div>
              </button>
            </nav>
          </div>
          
          <div className="p-8">
            {activeTab === 'todos' ? <TodoList /> : <Notes />}
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center py-8">
          <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl shadow-lg border border-amber-200 dark:border-gray-600 p-6">
            <p className="text-gray-700 dark:text-gray-300 font-medium">PiP Todo Assistant - Stay productive, stay floating! 🚀</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Use Picture-in-Picture mode to keep this app visible while working on other tasks.
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default function HomePage() {
  return (
    <ThemeProvider>
      <AppProvider>
        <TodoApp />
      </AppProvider>
    </ThemeProvider>
  );
}
