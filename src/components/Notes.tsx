'use client';

import React, { useState, useMemo } from 'react';
import { Note } from '@/types';
import { useApp } from '@/context/AppContext';
import { Plus, Trash2, Save, X, Pin, Palette, Edit3, Search, Star } from 'lucide-react';
import { RichTextEditor } from './RichTextEditor';

export function Notes() {
  const { state, dispatch } = useApp();
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [noteColors, setNoteColors] = useState<Record<string, 'yellow' | 'blue' | 'green' | 'pink' | 'purple'>>({});

  const getRandomColor = () => {
    const colors: Array<'yellow' | 'blue' | 'green' | 'pink' | 'purple'> = ['yellow', 'blue', 'green', 'pink', 'purple'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const getNoteColor = (noteId: string) => {
    if (!noteColors[noteId]) {
      setNoteColors(prev => ({ ...prev, [noteId]: getRandomColor() }));
      return 'yellow';
    }
    return noteColors[noteId];
  };

  const changeNoteColor = (noteId: string) => {
    const newColor = getRandomColor();
    setNoteColors(prev => ({ ...prev, [noteId]: newColor }));
  };

  const togglePin = (noteId: string) => {
    const note = state.notes.find(n => n.id === noteId);
    if (note) {
      dispatch({
        type: 'UPDATE_NOTE',
        payload: {
          ...note,
          pinned: !note.pinned,
          updatedAt: new Date(),
        },
      });
    }
  };

  const handleAddNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: '',
      content: '',
      pinned: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    dispatch({ type: 'ADD_NOTE', payload: newNote });
    setEditingNote(newNote.id);
    setEditContent('');
    setEditTitle('');
  };

  const handleSaveNote = (noteId: string) => {
    if (!editContent.trim() && !editTitle.trim()) {
      dispatch({ type: 'DELETE_NOTE', payload: noteId });
    } else {
      const note = state.notes.find(n => n.id === noteId);
      if (note) {
        dispatch({
          type: 'UPDATE_NOTE',
          payload: {
            ...note,
            title: editTitle.trim(),
            content: editContent.trim(),
            updatedAt: new Date(),
          },
        });
      }
    }
    setEditingNote(null);
    setEditContent('');
    setEditTitle('');
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note.id);
    setEditContent(note.content);
    setEditTitle(note.title);
  };

  const handleDeleteNote = (noteId: string) => {
    dispatch({ type: 'DELETE_NOTE', payload: noteId });
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  // Filter and sort notes
  const filteredAndSortedNotes = useMemo(() => {
    let filtered = state.notes;
    
    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(note => 
        note.title.toLowerCase().includes(query) || 
        note.content.toLowerCase().includes(query)
      );
    }
    
    // Sort by pinned first, then by updated date
    return filtered.sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
  }, [state.notes, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Quick Notes</h2>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {state.notes.length} notes saved
          </p>
        </div>
        <button
          onClick={handleAddNote}
          className="p-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition-all interactive-button shadow-lg"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      {/* Search Filter */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search notes by title or content..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input block w-full pl-10 pr-3 py-2 rounded-lg leading-5 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none"
        />
      </div>

      {/* Notes Grid */}
      <div className="grid gap-4">
        {filteredAndSortedNotes.length === 0 ? (
          <div className="text-center py-12">
            <div className="sticky-note sticky-note-green p-8 mx-auto max-w-md">
              <div className="text-center">
                <Palette className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {searchQuery ? 'No notes found!' : 'No notes yet!'}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {searchQuery ? 'Try adjusting your search terms.' : 'Create your first sticky note to capture your thoughts!'}
                </p>
                {!searchQuery && (
                  <button
                    onClick={handleAddNote}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all interactive-button"
                  >
                    Add Your First Note
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          filteredAndSortedNotes.map(note => (
            <div key={note.id} className={`sticky-note sticky-note-${getNoteColor(note.id)} p-6 sticky-note-new relative ${note.pinned ? 'pinned ring-2 ring-amber-400 dark:ring-amber-300' : ''}`}>
              {note.pinned && (
                <div className="pin-indicator">
                  <Star className="w-3 h-3 text-white dark:text-gray-900" />
                </div>
              )}
              
              {editingNote === note.id ? (
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Note title..."
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent font-semibold text-lg"
                  />
                  <RichTextEditor
                    value={editContent}
                    onChange={setEditContent}
                    placeholder="Write your note..."
                    className="min-h-[200px]"
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleSaveNote(note.id)}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all interactive-button font-medium"
                    >
                      <Save className="w-4 h-4 inline mr-2" />
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditingNote(null);
                        setEditContent('');
                        setEditTitle('');
                      }}
                      className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-all interactive-button font-medium"
                    >
                      <X className="w-4 h-4 inline mr-2" />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {note.title && (
                        <h3 className="note-title text-lg mb-2">
                          {note.title}
                        </h3>
                      )}
                      <div 
                        className="text-gray-900 dark:text-white leading-relaxed text-lg prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: note.content }}
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                        {formatDate(note.updatedAt)}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2 ml-4">
                      <button
                        onClick={() => handleEditNote(note)}
                        className="p-2 text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors interactive-button"
                        title="Edit"
                      >
                        <Edit3 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => togglePin(note.id)}
                        className={`p-2 transition-colors interactive-button ${
                          note.pinned 
                            ? 'text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300' 
                            : 'text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400'
                        }`}
                        title={note.pinned ? 'Unpin' : 'Pin'}
                      >
                        <Pin className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => changeNoteColor(note.id)}
                        className="p-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors interactive-button"
                        title="Change Color"
                      >
                        <Palette className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteNote(note.id)}
                        className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors interactive-button"
                        title="Delete"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
} 