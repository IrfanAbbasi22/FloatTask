'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Todo, Note, TimerState } from '@/types';

interface AppState {
  todos: Todo[];
  notes: Note[];
  timer: TimerState;
  isPiPMode: boolean;
}

type AppAction =
  | { type: 'ADD_TODO'; payload: Todo }
  | { type: 'UPDATE_TODO'; payload: Todo }
  | { type: 'DELETE_TODO'; payload: string }
  | { type: 'TOGGLE_TODO'; payload: string }
  | { type: 'ADD_NOTE'; payload: Note }
  | { type: 'UPDATE_NOTE'; payload: Note }
  | { type: 'DELETE_NOTE'; payload: string }
  | { type: 'SET_TIMER'; payload: TimerState }
  | { type: 'UPDATE_TIMER'; payload: Partial<TimerState> }
  | { type: 'SET_PIP_MODE'; payload: boolean }
  | { type: 'SYNC_STATE'; payload: AppState };

const initialState: AppState = {
  todos: [],
  notes: [],
  timer: {
    isRunning: false,
    timeLeft: 0,
  },
  isPiPMode: false,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'ADD_TODO':
      return {
        ...state,
        todos: [...state.todos, action.payload],
      };
    case 'UPDATE_TODO':
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload.id ? action.payload : todo
        ),
      };
    case 'DELETE_TODO':
      return {
        ...state,
        todos: state.todos.filter(todo => todo.id !== action.payload),
      };
    case 'TOGGLE_TODO':
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload
            ? { ...todo, completed: !todo.completed }
            : todo
        ),
      };
    case 'ADD_NOTE':
      return {
        ...state,
        notes: [...state.notes, action.payload],
      };
    case 'UPDATE_NOTE':
      return {
        ...state,
        notes: state.notes.map(note =>
          note.id === action.payload.id ? action.payload : note
        ),
      };
    case 'DELETE_NOTE':
      return {
        ...state,
        notes: state.notes.filter(note => note.id !== action.payload),
      };
    case 'SET_TIMER':
      return {
        ...state,
        timer: action.payload,
      };
    case 'UPDATE_TIMER':
      return {
        ...state,
        timer: { ...state.timer, ...action.payload },
      };
    case 'SET_PIP_MODE':
      return {
        ...state,
        isPiPMode: action.payload,
      };
    case 'SYNC_STATE':
      return action.payload;
    default:
      return state;
  }
}

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Broadcast state changes to service worker for PWA sync
  const broadcastState = (newState: AppState) => {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'SYNC_STATE',
        state: newState
      });
    }
  };

  // Load data from localStorage on mount
  useEffect(() => {
    const savedTodos = localStorage.getItem('todos');
    const savedNotes = localStorage.getItem('notes');
    
    if (savedTodos) {
      const todos = JSON.parse(savedTodos).map((todo: any) => ({
        ...todo,
        createdAt: new Date(todo.createdAt),
        dueDate: todo.dueDate ? new Date(todo.dueDate) : undefined,
        timerStartTime: todo.timerStartTime ? new Date(todo.timerStartTime) : undefined,
      }));
      todos.forEach((todo: Todo) => {
        dispatch({ type: 'ADD_TODO', payload: todo });
      });
    }
    
    if (savedNotes) {
      const notes = JSON.parse(savedNotes).map((note: any) => ({
        ...note,
        // Handle backward compatibility for old notes without title and pinned
        title: note.title || '',
        pinned: note.pinned || false,
        createdAt: new Date(note.createdAt),
        updatedAt: new Date(note.updatedAt),
      }));
      notes.forEach((note: Note) => {
        dispatch({ type: 'ADD_NOTE', payload: note });
      });
    }
  }, []);

  // Listen for state updates from service worker
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'STATE_UPDATE') {
        dispatch({ type: 'SYNC_STATE', payload: event.data.data });
      }
    };

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', handleMessage);
    }

    return () => {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.removeEventListener('message', handleMessage);
      }
    };
  }, []);

  // Save data to localStorage and broadcast when state changes
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(state.todos));
    broadcastState(state);
  }, [state.todos]);

  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(state.notes));
    broadcastState(state);
  }, [state.notes]);

  useEffect(() => {
    broadcastState(state);
  }, [state.timer, state.isPiPMode]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
} 