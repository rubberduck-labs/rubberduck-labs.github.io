import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sun, Moon, Instagram, Linkedin } from 'lucide-react';

interface NavigationProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

export function Navigation({ darkMode, setDarkMode }: NavigationProps) {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const getLinkClasses = (path: string) => {
    const baseClasses = "relative py-1 transition-colors";
    const textClasses = isActive(path)
      ? "text-custom-dark dark:text-white font-medium"
      : "text-custom-dark/80 dark:text-white/80 hover:text-custom-dark dark:hover:text-white";

    return `${baseClasses} ${textClasses}`;
  };

  return (
    <nav className="fixed w-full bg-custom-yellow/90 dark:bg-custom-dark/90 backdrop-blur-sm z-50 transition-colors duration-300">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-8">
          <Link 
            to="/" 
            className={`text-2xl font-bold ${getLinkClasses('/')}`}
          >
            Rubberduck
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link 
              to="/team" 
              className={getLinkClasses('/team')}
            >
              Team
            </Link>
            <Link 
              to="/jobs" 
              className={getLinkClasses('/jobs')}
            >
              Jobb hos oss
            </Link>
            <Link 
              to="/impact" 
              className={getLinkClasses('/impact')}
            >
              Vår påvirkning
            </Link>
            <Link 
              to="/handbook" 
              className={getLinkClasses('/handbook')}
            >
              Håndbok
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full hover:bg-yellow-400 dark:hover:bg-gray-700 transition-colors"
            aria-label="Instagram"
          >
            <Instagram className="w-5 h-5 text-custom-dark dark:text-white" />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full hover:bg-yellow-400 dark:hover:bg-gray-700 transition-colors"
            aria-label="LinkedIn"
          >
            <Linkedin className="w-5 h-5 text-custom-dark dark:text-white" />
          </a>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full hover:bg-yellow-400 dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle dark mode"
          >
            {darkMode ? (
              <Sun className="w-5 h-5 text-white" />
            ) : (
              <Moon className="w-5 h-5 text-custom-dark" />
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}