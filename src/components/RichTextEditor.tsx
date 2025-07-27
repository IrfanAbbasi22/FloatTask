'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { 
  Bold, 
  Italic, 
  Underline, 
  Strikethrough, 
  List, 
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function RichTextEditor({ value, onChange, placeholder, className }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [currentAlignment, setCurrentAlignment] = useState<'left' | 'center' | 'right'>('left');
  const [isUpdating, setIsUpdating] = useState(false);

  // Save cursor position
  const saveSelection = useCallback(() => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0 && editorRef.current) {
      const range = selection.getRangeAt(0);
      if (editorRef.current.contains(range.commonAncestorContainer)) {
        return range.cloneRange();
      }
    }
    return null;
  }, []);

  // Restore cursor position
  const restoreSelection = useCallback((range: Range | null) => {
    if (range && editorRef.current) {
      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
  }, []);

  // Update content without triggering cursor jump
  const updateContent = useCallback(() => {
    if (editorRef.current && !isUpdating) {
      setIsUpdating(true);
      const savedRange = saveSelection();
      const newContent = editorRef.current.innerHTML;
      
      if (newContent !== value) {
        onChange(newContent);
      }
      
      setTimeout(() => {
        restoreSelection(savedRange);
        setIsUpdating(false);
      }, 0);
    }
  }, [value, onChange, saveSelection, restoreSelection, isUpdating]);

  // Initialize editor content
  useEffect(() => {
    if (editorRef.current && !isUpdating) {
      const savedRange = saveSelection();
      if (editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = value;
        
        // Ensure proper text direction
        editorRef.current.setAttribute('dir', 'ltr');
        editorRef.current.style.direction = 'ltr';
        editorRef.current.style.textAlign = 'left';
        
        // Fix any existing RTL content
        const elements = editorRef.current.querySelectorAll('*');
        elements.forEach(el => {
          if (el instanceof HTMLElement) {
            el.style.direction = 'ltr';
            el.setAttribute('dir', 'ltr');
          }
        });
      }
      
      setTimeout(() => {
        restoreSelection(savedRange);
      }, 0);
    }
  }, [value, saveSelection, restoreSelection, isUpdating]);

  // Update toolbar state
  const updateToolbarState = useCallback(() => {
    if (editorRef.current) {
      setIsBold(document.queryCommandState('bold'));
      setIsItalic(document.queryCommandState('italic'));
      setIsUnderline(document.queryCommandState('underline'));
      setIsStrikethrough(document.queryCommandState('strikeThrough'));
      
      // Check current alignment
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const container = range.commonAncestorContainer;
        const element = container.nodeType === Node.TEXT_NODE ? container.parentElement : container as Element;
        
        if (element) {
          const textAlign = window.getComputedStyle(element).textAlign;
          if (textAlign === 'center') {
            setCurrentAlignment('center');
          } else if (textAlign === 'right') {
            setCurrentAlignment('right');
          } else {
            setCurrentAlignment('left');
          }
        }
      }
    }
  }, []);

  // Execute command with cursor preservation
  const execCommand = useCallback((command: string, value?: string) => {
    const savedRange = saveSelection();
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    updateToolbarState();
    updateContent();
    setTimeout(() => {
      restoreSelection(savedRange);
    }, 0);
  }, [saveSelection, restoreSelection, updateToolbarState, updateContent]);

  // Handle alignment specifically
  const handleAlignment = useCallback((alignment: 'left' | 'center' | 'right') => {
    const savedRange = saveSelection();
    const command = `justify${alignment.charAt(0).toUpperCase() + alignment.slice(1)}` as 'justifyLeft' | 'justifyCenter' | 'justifyRight';
    document.execCommand(command, false);
    setCurrentAlignment(alignment);
    editorRef.current?.focus();
    updateContent();
    setTimeout(() => {
      restoreSelection(savedRange);
    }, 0);
  }, [saveSelection, restoreSelection, updateContent]);

  // Handle list commands
  const handleList = useCallback((type: 'ul' | 'ol') => {
    const savedRange = saveSelection();
    const command = type === 'ul' ? 'insertUnorderedList' : 'insertOrderedList';
    
    // Check if we're already in a list
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const container = range.commonAncestorContainer;
      const listItem = container.nodeType === Node.TEXT_NODE ? container.parentElement : container as Element;
      
      if (listItem && (listItem.tagName === 'LI' || listItem.closest('li'))) {
        // If we're in a list, toggle it off
        document.execCommand('outdent', false);
      } else {
        // If we're not in a list, create one
        document.execCommand(command, false);
      }
    } else {
      document.execCommand(command, false);
    }
    
    editorRef.current?.focus();
    updateToolbarState();
    updateContent();
    setTimeout(() => {
      restoreSelection(savedRange);
    }, 0);
  }, [saveSelection, restoreSelection, updateToolbarState, updateContent]);

  // Handle input events
  const handleInput = useCallback(() => {
    if (!isUpdating) {
      updateContent();
    }
  }, [updateContent, isUpdating]);

  // Handle keyboard events
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.shiftKey) {
      e.preventDefault();
      execCommand('insertLineBreak');
    }
  }, [execCommand]);

  // Handle paste events
  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    const savedRange = saveSelection();
    document.execCommand('insertText', false, text);
    
    setTimeout(() => {
      if (editorRef.current) {
        editorRef.current.setAttribute('dir', 'ltr');
        editorRef.current.style.direction = 'ltr';
        editorRef.current.style.textAlign = 'left';
      }
      restoreSelection(savedRange);
    }, 0);
  }, [saveSelection, restoreSelection]);

  // Handle mouse and keyboard events for toolbar updates
  const handleSelectionChange = useCallback(() => {
    updateToolbarState();
  }, [updateToolbarState]);

  return (
    <div className={`rich-text-editor ${className || ''}`}>
      <div className="editor-toolbar">
        <button
          type="button"
          className={`editor-button ${isBold ? 'active' : ''}`}
          onClick={() => execCommand('bold')}
          title="Bold (Ctrl+B)"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          type="button"
          className={`editor-button ${isItalic ? 'active' : ''}`}
          onClick={() => execCommand('italic')}
          title="Italic (Ctrl+I)"
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          type="button"
          className={`editor-button ${isUnderline ? 'active' : ''}`}
          onClick={() => execCommand('underline')}
          title="Underline (Ctrl+U)"
        >
          <Underline className="w-4 h-4" />
        </button>
        <button
          type="button"
          className={`editor-button ${isStrikethrough ? 'active' : ''}`}
          onClick={() => execCommand('strikeThrough')}
          title="Strikethrough"
        >
          <Strikethrough className="w-4 h-4" />
        </button>
        
        <div className="w-px h-6 bg-gray-300 mx-2"></div>
        
        <button
          type="button"
          className="editor-button"
          onClick={() => handleList('ul')}
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </button>
        <button
          type="button"
          className="editor-button"
          onClick={() => handleList('ol')}
          title="Numbered List"
        >
          <ListOrdered className="w-4 h-4" />
        </button>
        
        <div className="w-px h-6 bg-gray-300 mx-2"></div>
        
        <button
          type="button"
          className={`editor-button ${currentAlignment === 'left' ? 'active' : ''}`}
          onClick={() => handleAlignment('left')}
          title="Align Left"
        >
          <AlignLeft className="w-4 h-4" />
        </button>
        <button
          type="button"
          className={`editor-button ${currentAlignment === 'center' ? 'active' : ''}`}
          onClick={() => handleAlignment('center')}
          title="Align Center"
        >
          <AlignCenter className="w-4 h-4" />
        </button>
        <button
          type="button"
          className={`editor-button ${currentAlignment === 'right' ? 'active' : ''}`}
          onClick={() => handleAlignment('right')}
          title="Align Right"
        >
          <AlignRight className="w-4 h-4" />
        </button>
      </div>
      
      <div
        ref={editorRef}
        className="editor-content"
        contentEditable
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        onKeyUp={handleSelectionChange}
        onMouseUp={handleSelectionChange}
        onPaste={handlePaste}
        onBlur={updateToolbarState}
        onFocus={updateToolbarState}
        data-placeholder={placeholder}
        suppressContentEditableWarning
        dir="ltr"
        style={{ direction: 'ltr', textAlign: 'left' }}
      />
    </div>
  );
} 