'use client';

import React, { useState } from 'react';
import { Todo } from '@/types';
import { useApp } from '@/context/AppContext';
import { TodoItem } from './TodoItem';
import { Plus, Filter, Palette } from 'lucide-react';

export function TodoList() {
  const { state, dispatch } = useApp();
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [newTodoDescription, setNewTodoDescription] = useState('');
  const [newTodoTimer, setNewTodoTimer] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  const filteredTodos = state.todos.filter(todo => {
    switch (filter) {
      case 'active':
        return !todo.completed;
      case 'completed':
        return todo.completed;
      default:
        return true;
    }
  });

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoTitle.trim()) return;

    const newTodo: Todo = {
      id: Date.now().toString(),
      title: newTodoTitle.trim(),
      description: newTodoDescription.trim() || undefined,
      completed: false,
      createdAt: new Date(),
      timer: newTodoTimer ? parseInt(newTodoTimer) : undefined,
    };

    dispatch({ type: 'ADD_TODO', payload: newTodo });
    setNewTodoTitle('');
    setNewTodoDescription('');
    setNewTodoTimer('');
    setShowAddForm(false);
  };

  const completedCount = state.todos.filter(todo => todo.completed).length;
  const activeCount = state.todos.length - completedCount;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">My Tasks</h2>
          <p className="text-sm text-gray-600">
            {activeCount} active, {completedCount} completed
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-all interactive-button shadow-lg"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      {/* Filter */}
      <div className="flex gap-3">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-full transition-all interactive-button ${
            filter === 'all'
              ? 'bg-blue-500 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All ({state.todos.length})
        </button>
        <button
          onClick={() => setFilter('active')}
          className={`px-4 py-2 rounded-full transition-all interactive-button ${
            filter === 'active'
              ? 'bg-green-500 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Active ({activeCount})
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`px-4 py-2 rounded-full transition-all interactive-button ${
            filter === 'completed'
              ? 'bg-purple-500 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Completed ({completedCount})
        </button>
      </div>

      {/* Add Todo Form */}
      {showAddForm && (
        <div className="sticky-note sticky-note-yellow p-6 sticky-note-new">
          <form onSubmit={handleAddTodo} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                What needs to be done?
              </label>
              <input
                type="text"
                value={newTodoTitle}
                onChange={(e) => setNewTodoTitle(e.target.value)}
                className="w-full px-4 py-3 bg-white/80 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus-ring text-lg"
                placeholder="Enter your task..."
                autoFocus
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Details (optional)
              </label>
              <textarea
                value={newTodoDescription}
                onChange={(e) => setNewTodoDescription(e.target.value)}
                className="w-full px-4 py-3 bg-white/80 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus-ring"
                placeholder="Add more details about your task..."
                rows={3}
              />
            </div>
            
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Timer (optional)
                </label>
                <input
                  type="number"
                  value={newTodoTimer}
                  onChange={(e) => setNewTodoTimer(e.target.value)}
                  className="w-full px-4 py-3 bg-white/80 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus-ring"
                  placeholder="Minutes (e.g., 25, 60, 120)"
                  min="1"
                  max="480"
                />
              </div>
              
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all interactive-button font-medium"
                >
                  Add Task
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-all interactive-button font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Todo List */}
      <div className="space-y-4">
        {filteredTodos.length === 0 ? (
          <div className="text-center py-12">
            <div className="sticky-note sticky-note-blue p-8 mx-auto max-w-md">
              <div className="text-center">
                <Palette className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {filter === 'all' ? 'No tasks yet!' : `No ${filter} tasks`}
                </h3>
                <p className="text-gray-600">
                  {filter === 'all' 
                    ? 'Create your first sticky note task to get started!' 
                    : `All tasks are ${filter === 'active' ? 'completed' : 'active'}!`
                  }
                </p>
                {filter === 'all' && (
                  <button
                    onClick={() => setShowAddForm(true)}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all interactive-button"
                  >
                    Add Your First Task
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredTodos.map(todo => (
              <TodoItem key={todo.id} todo={todo} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 