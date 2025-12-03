import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sun, Moon, Instagram, Linkedin, Menu, X } from 'lucide-react';
import {RubberDuckIcon} from "./Icons/RubberDuckIcon.tsx";
import IconWrapper from "./IconWrapper.tsx";
import {RubberDuckLogo} from "./Icons/RubberDuckLogo.tsx";

interface NavigationProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  navBackgroundColor: string;
}

// Desktop social media links component
const DesktopSocialLinks = () => (
  <div className="flex items-center gap-4">
    <a
      href="https://www.instagram.com/rubberduck.no/"
      target="_blank"
      rel="noopener noreferrer"
      className="p-2 rounded-full hover:bg-yellow-400 dark:hover:bg-gray-700 transition-colors"
      aria-label="Instagram"
    >
      <Instagram className="w-5 h-5 text-custom-dark dark:text-white" />
    </a>
    <a
      href="https://www.linkedin.com/company/rubberduck-dev/"
      target="_blank"
      rel="noopener noreferrer"
      className="p-2 rounded-full hover:bg-yellow-400 dark:hover:bg-gray-700 transition-colors"
      aria-label="LinkedIn"
    >
      <Linkedin className="w-5 h-5 text-custom-dark dark:text-white" />
    </a>
  </div>
);

// Mobile social media links component
const MobileSocialLinks = () => (
  <div className="border-t border-gray-100 dark:border-zinc-800 mt-2 pt-2 px-4 pb-4">
    <div className="flex flex-col gap-2">
      <a
        href="https://www.instagram.com/rubberduck.no/"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-yellow-400/50 dark:hover:bg-zinc-800 transition-colors text-custom-dark/80 dark:text-white/80"
      >
        <Instagram className="w-5 h-5" />
        <span>Instagram</span>
      </a>
      <a
        href="https://www.linkedin.com/company/rubberduck-dev/"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-yellow-400/50 dark:hover:bg-zinc-800 transition-colors text-custom-dark/80 dark:text-white/80"
      >
        <Linkedin className="w-5 h-5" />
        <span>LinkedIn</span>
      </a>
    </div>
  </div>
);

export function Navigation({ darkMode, setDarkMode, navBackgroundColor }: NavigationProps) {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleDarkModeToggle = () => {
    setDarkMode(!darkMode);
  };

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

  const getMobileLinkClasses = (path: string) => {
    const baseClasses = "block w-full px-4 py-3 transition-colors";
    const textClasses = isActive(path)
      ? "bg-yellow-400 dark:bg-zinc-700 text-custom-dark dark:text-white font-medium"
      : "text-custom-dark/80 dark:text-white/80 hover:bg-yellow-400/50 dark:hover:bg-zinc-800";

    return `${baseClasses} ${textClasses}`;
  };

  return (
    <nav
      className="fixed w-full backdrop-blur-sm z-50 transition-colors duration-300"
      style={{ backgroundColor: navBackgroundColor }}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-8">
            <Link
              to="/"
              className="flex items-center gap-3 group min-w-0"
            >
                <IconWrapper className={`shrink-0 h-[clamp(32px,4.5vw,48px)] transition-colors ${
                    darkMode ? 'text-yellow-400' : '[filter:brightness(0)]'
                }`}>
                    <RubberDuckIcon />
                </IconWrapper>
              <span className={`text-2xl font-bold min-w-0 ${getLinkClasses('/')}`}>
                  <IconWrapper className={`shrink-0 min-w-0 h-auto w-[clamp(150px,30vw,200px)]  transition-colors ${
                      darkMode ? 'text-white' : '[filter:brightness(0)]'
                  }`}>
                      <RubberDuckLogo />
                  </IconWrapper>
              </span>
            </Link>
            <div className="hidden md:flex items-center gap-6">
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
                Her er vi
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
            {/* Desktop social media links */}
            <div className="hidden md:block">
              <DesktopSocialLinks />
            </div>

            <button
              onClick={handleDarkModeToggle}
              className="p-2 rounded-full hover:bg-yellow-400 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <Sun className="w-5 h-5 text-white" />
              ) : (
                <Moon className="w-5 h-5 text-custom-dark" />
              )}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-full hover:bg-yellow-400 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-custom-dark dark:text-white" />
              ) : (
                <Menu className="w-5 h-5 text-custom-dark dark:text-white" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 bg-white dark:bg-zinc-900 rounded-lg shadow-lg overflow-hidden">
            <Link
              to="/jobs"
              className={getMobileLinkClasses('/jobs')}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Jobb hos oss
            </Link>
            <Link
              to="/impact"
              className={getMobileLinkClasses('/impact')}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Her er vi
            </Link>
            <Link
              to="/handbook"
              className={getMobileLinkClasses('/handbook')}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Håndbok
            </Link>

            {/* Mobile social media links */}
            <MobileSocialLinks />
          </div>
        )}
      </div>
    </nav>
  );
}
