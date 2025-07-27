# 🚀 PiP Todo Assistant - Progressive Web App

A modern, feature-rich todo application with Picture-in-Picture (PiP) mode, built with Next.js 15, TypeScript, and Tailwind CSS. This PWA combines productivity tools with cutting-edge web technologies to create a floating, always-accessible task management solution.

![PiP Todo Assistant](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)
![PWA](https://img.shields.io/badge/PWA-Ready-green?style=for-the-badge&logo=pwa)

## 📋 Table of Contents

- [Why I Created This](#-why-i-created-this)
- [Purpose & Features](#-purpose--features)
- [Tech Stack](#-tech-stack)
- [Local Setup](#-local-setup)
- [Key Features](#-key-features)
- [Performance Optimizations](#-performance-optimizations)

## 🎯 Why I Created This

I created the PiP Todo Assistant to solve a common productivity problem: **context switching**. Traditional todo apps require you to switch between applications, breaking your workflow. This app stays visible in Picture-in-Picture mode, allowing you to:

- **Stay Focused**: Keep your todo list visible while working on other tasks
- **Reduce Distractions**: No need to switch windows or tabs
- **Improve Productivity**: Quick access to tasks and notes without losing context
- **Modern UX**: Leverage cutting-edge web technologies for a native app experience

The project also serves as a **portfolio piece** demonstrating:
- Advanced React/Next.js patterns
- PWA implementation
- Modern CSS techniques
- State management best practices
- Real-world problem solving

## 🎯 Purpose & Features

### **Core Purpose**
The PiP Todo Assistant is designed to be your **floating productivity companion** - always accessible, never intrusive, and highly functional.

### **Key Features**

#### 🎨 **User Experience**
- **Picture-in-Picture Mode**: Floating window that stays on top
- **Dark/Light Theme**: Automatic theme switching with system preference
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Sticky Notes Design**: Beautiful, intuitive interface
- **Real-time Updates**: Instant synchronization across all instances

#### 📝 **Task Management**
- **Todo Lists**: Create, edit, delete, and complete tasks
- **Timer Integration**: Built-in countdown timers for tasks
- **Due Dates**: Set deadlines for tasks
- **Progress Tracking**: Visual progress indicators
- **Filtering**: Filter by completed/pending tasks

#### 📋 **Note Taking**
- **Rich Text Editor**: Full formatting capabilities (bold, italic, lists, alignment)
- **Title Support**: Organize notes with titles
- **Pin Functionality**: Pin important notes to the top
- **Search & Filter**: Find notes quickly
- **Color Coding**: Multiple sticky note colors

#### ⏰ **Timer System**
- **Task Timers**: Individual timers for each task
- **Hour Display**: Shows hours for durations > 59 minutes
- **Progress Bars**: Visual timer progress
- **Notifications**: Browser notifications when timers complete
- **Pause/Resume**: Full timer control

#### 🔗 **PWA Features**
- **Offline Support**: Works without internet connection
- **Installable**: Add to home screen like a native app
- **Cross-Platform**: Works on Windows, Mac, Linux, iOS, Android
- **State Synchronization**: Real-time sync across multiple windows
- **Background Sync**: Handles offline actions when connection returns

## 🛠 Tech Stack

### **Frontend Framework**
- **Next.js 15**: Latest version with App Router
- **React 18**: Latest React features and hooks
- **TypeScript 5.0**: Type safety and better developer experience

### **Styling & UI**
- **Tailwind CSS 4.0**: Utility-first CSS framework
- **Lucide React**: Beautiful, customizable icons
- **Custom CSS**: Advanced animations and effects
- **Glass Morphism**: Modern UI design patterns

### **State Management**
- **React Context API**: Global state management
- **useReducer**: Complex state logic
- **Local Storage**: Data persistence
- **Custom Hooks**: Reusable logic (usePiP, useTimer)

### **PWA Technologies**
- **Service Worker**: Offline functionality and caching
- **Web App Manifest**: App installation and metadata
- **Picture-in-Picture API**: Floating window functionality
- **Browser Notifications**: Timer completion alerts

### **Development Tools**
- **ESLint**: Code quality and consistency
- **TypeScript**: Static type checking
- **Hot Reload**: Fast development experience
- **Build Optimization**: Production-ready builds

## 🚀 Local Setup

### **Prerequisites**
- Node.js 18+ 
- npm or yarn
- Modern browser (Chrome, Firefox, Safari, Edge)

### **Installation Steps**

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd todo-app
   ```

2. **Install Dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open in Browser**
   ```
   http://localhost:3000
   ```

### **PWA Setup**

1. **Generate Icons** (Optional)
   - Open `create-icons.html` in your browser
   - Download the generated icons
   - Replace placeholder icons in `public/` folder

2. **Install as PWA**
   - Click the install prompt in your browser
   - Or use browser's "Add to Home Screen" option

### **Environment Variables**
```env
# No environment variables required for basic functionality
# Add your own API keys if extending functionality
```

## ✨ Key Features Deep Dive

### **Picture-in-Picture Mode**
```typescript
// Custom hook for PiP functionality
const usePiP = () => {
  const [isPiPActive, setIsPiPActive] = useState(false);
  
  const enterPiP = async () => {
    if ('documentPictureInPicture' in window) {
      // Modern PiP API
    } else {
      // Fallback to video PiP
    }
  };
};
```

### **Rich Text Editor**
```typescript
// Advanced text editor with cursor preservation
const RichTextEditor = ({ value, onChange }) => {
  const saveSelection = useCallback(() => {
    // Preserve cursor position during updates
  });
  
  const execCommand = useCallback((command) => {
    // Execute formatting commands with cursor preservation
  });
};
```

### **State Synchronization**
```typescript
// Cross-window state sync
const broadcastState = (newState) => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.controller.postMessage({
      type: 'SYNC_STATE',
      state: newState
    });
  }
};
```

## ⚡ Performance Optimizations

### **Code Splitting**
- Dynamic imports for heavy components
- Route-based code splitting with Next.js
- Lazy loading of non-critical features

### **State Management**
- useCallback for expensive functions
- useMemo for computed values
- Proper dependency arrays to prevent unnecessary re-renders

### **Caching Strategy**
- Service worker caching for static assets
- Local storage for user data
- Memory caching for frequently accessed data

### **Bundle Optimization**
- Tree shaking for unused code
- Minification and compression
- Optimized images and assets

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js Team**: For the amazing framework
- **Tailwind CSS**: For the utility-first CSS approach
- **Lucide**: For the beautiful icons
- **MDN Web Docs**: For comprehensive web API documentation

---

**Built using Next.js, TypeScript, and Tailwind CSS**

*This project demonstrates modern web development best practices and serves as a comprehensive portfolio piece showcasing advanced React patterns, PWA implementation, and real-world problem-solving skills.*
