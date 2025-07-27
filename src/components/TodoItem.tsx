'use client';

import React, { useState } from 'react';
import { Todo } from '@/types';
import { useApp } from '@/context/AppContext';
import { useTimer } from '@/hooks/useTimer';
import { 
  CheckCircle, 
  Circle, 
  Trash2, 
  Clock, 
  Play, 
  Pause, 
  Square,
  Edit3,
  Pin
} from 'lucide-react';

interface TodoItemProps {
  todo: Todo;
}

export function TodoItem({ todo }: TodoItemProps) {
  const { dispatch } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDescription, setEditDescription] = useState(todo.description || '');
  const [showTimer, setShowTimer] = useState(false);
  const [noteColor, setNoteColor] = useState<'yellow' | 'blue' | 'green' | 'pink' | 'purple'>('yellow');

  const {
    timeLeft,
    isRunning,
    startTimer,
    pauseTimer,
    resumeTimer,
    stopTimer,
    formatTime,
  } = useTimer(todo.timer ? todo.timer * 60 : 0);

  const handleToggle = () => {
    dispatch({ type: 'TOGGLE_TODO', payload: todo.id });
  };

  const handleDelete = () => {
    dispatch({ type: 'DELETE_TODO', payload: todo.id });
  };

  const handleSave = () => {
    dispatch({
      type: 'UPDATE_TODO',
      payload: {
        ...todo,
        title: editTitle,
        description: editDescription,
      },
    });
    setIsEditing(false);
  };

  const handleTimerToggle = () => {
    if (isRunning) {
      pauseTimer();
    } else if (timeLeft > 0) {
      resumeTimer();
    } else if (todo.timer) {
      startTimer(todo.timer);
    }
  };

  const handleTimerStop = () => {
    stopTimer();
  };

  const handleTimerReset = () => {
    if (todo.timer) {
      startTimer(todo.timer);
    }
  };

  const formatTimerDisplay = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getRandomColor = () => {
    const colors: Array<'yellow' | 'blue' | 'green' | 'pink' | 'purple'> = ['yellow', 'blue', 'green', 'pink', 'purple'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  if (isEditing) {
    return (
      <div className={`sticky-note sticky-note-${noteColor} p-6 mb-4 sticky-note-new`}>
        <div className="space-y-4">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="w-full px-3 py-2 bg-white/80 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus-ring"
            placeholder="What needs to be done?"
          />
          <textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            className="w-full px-3 py-2 bg-white/80 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus-ring"
            placeholder="Add details..."
            rows={3}
          />
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors interactive-button"
            >
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors interactive-button"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`sticky-note sticky-note-${noteColor} p-6 mb-4 ${todo.completed ? 'opacity-75' : ''} sticky-note-new`}>
      <div className="flex items-start gap-3">
        <button
          onClick={handleToggle}
          className="mt-1 text-gray-600 hover:text-green-600 transition-colors interactive-button"
        >
          {todo.completed ? (
            <CheckCircle className="w-6 h-6 text-green-600" />
          ) : (
            <Circle className="w-6 h-6" />
          )}
        </button>
        
        <div className="flex-1 min-w-0">
          <h3 className={`font-bold text-gray-900 text-lg mb-2 ${
            todo.completed ? 'line-through text-gray-500' : ''
          }`}>
            {todo.title}
          </h3>
          {todo.description && (
            <p className={`text-gray-700 mb-3 leading-relaxed ${
              todo.completed ? 'line-through' : ''
            }`}>
              {todo.description}
            </p>
          )}
          
          {todo.timer && (
            <div className="mt-3">
              <button
                onClick={() => setShowTimer(!showTimer)}
                className="flex items-center gap-2 text-sm text-blue-700 hover:text-blue-800 interactive-button"
              >
                <Clock className="w-4 h-4" />
                {todo.timer}min timer
              </button>
              
              {showTimer && (
                <div className="mt-3 p-3 bg-white/60 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="timer-display text-lg">
                      {formatTimerDisplay(timeLeft)}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={handleTimerToggle}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-full interactive-button"
                        title={isRunning ? 'Pause' : 'Start'}
                      >
                        {isRunning ? (
                          <Pause className="w-5 h-5" />
                        ) : (
                          <Play className="w-5 h-5" />
                        )}
                      </button>
                      <button
                        onClick={handleTimerStop}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-full interactive-button"
                        title="Stop"
                      >
                        <Square className="w-5 h-5" />
                      </button>
                      <button
                        onClick={handleTimerReset}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-full interactive-button"
                        title="Reset"
                      >
                        <Clock className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${todo.timer ? ((todo.timer * 60 - timeLeft) / (todo.timer * 60)) * 100 : 0}%` 
                      }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="flex flex-col gap-2">
          <button
            onClick={() => setIsEditing(true)}
            className="p-2 text-gray-600 hover:text-blue-600 transition-colors interactive-button"
            title="Edit"
          >
            <Edit3 className="w-5 h-5" />
          </button>
          <button
            onClick={handleDelete}
            className="p-2 text-gray-600 hover:text-red-600 transition-colors interactive-button"
            title="Delete"
          >
            <Trash2 className="w-5 h-5" />
          </button>
          <button
            onClick={() => setNoteColor(getRandomColor())}
            className="p-2 text-gray-600 hover:text-purple-600 transition-colors interactive-button"
            title="Change Color"
          >
            <Pin className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
} 