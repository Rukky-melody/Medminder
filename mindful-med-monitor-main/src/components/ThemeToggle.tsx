// src/components/ThemeToggle.tsx
import React from 'react';
import { Button } from "@/components/ui/button"; // Assuming shadcn/ui Button
import { Moon, Sun } from 'lucide-react'; // Assuming lucide-react is installed
import { useTheme } from '@/utils/ThemeContext'; // Import your ThemeContext

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  // Added console.log to see the current theme state
  console.log("[ThemeToggle] Current theme:", theme);

  return (
    <Button
      variant="ghost" // Use a ghost variant for a subtle toggle
      size="icon"
      onClick={toggleTheme}
      className="focus-ring relative w-10 h-10 overflow-hidden" // Added overflow-hidden to contain icons, fixed width/height
      aria-label="Toggle theme" // Accessibility
    >
      {/* Sun icon for light mode, Moon icon for dark mode */}
      <Sun 
        className={`h-6 w-6 transition-all duration-300 ease-in-out 
          ${theme === 'light' ? 'rotate-0 scale-100 opacity-100' : 'rotate-90 scale-0 opacity-0 absolute'} 
          text-yellow-500`} 
      />
      <Moon 
        className={`h-6 w-6 transition-all duration-300 ease-in-out 
          ${theme === 'dark' ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0 absolute'} 
          text-blue-500`} 
      />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};

export default ThemeToggle;
