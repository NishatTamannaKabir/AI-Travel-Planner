import React from 'react';
import { Compass, Sparkles, User as UserIcon, LogOut, BookmarkCheck, MapPin, Info } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export type NavTab = 'landing' | 'planner' | 'results' | 'dashboard' | 'destinations' | 'about';

interface NavbarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  openAuthModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, openAuthModal }) => {
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    setActiveTab('landing');
  };

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return 'U';
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E4EAE7] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand Logo & Tagline */}
        <div
          onClick={() => setActiveTab('landing')}
          className="flex items-center gap-3.5 cursor-pointer group select-none"
        >
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#087A5A] to-[#0F9D72] flex items-center justify-center text-white shadow-md shadow-[#0F9D72]/20 group-hover:scale-105 transition-transform duration-200">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight text-[#172033]">
                AI Travel <span className="text-[#0F9D72]">Planner</span>
              </span>
            </div>
            <p className="text-xs text-[#667085] font-medium tracking-wide">
              AI-Powered Travel Intelligence
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1.5">
          <button
            onClick={() => setActiveTab('planner')}
            className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'planner'
                ? 'bg-[#DDF7EF] text-[#087A5A] font-bold shadow-xs'
                : 'text-[#667085] hover:text-[#172033] hover:bg-[#F7FAF9]'
            }`}
          >
            <Sparkles className="w-4 h-4 text-[#0F9D72]" />
            Plan Trip
          </button>

          <button
            onClick={() => setActiveTab('destinations')}
            className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'destinations'
                ? 'bg-[#DDF7EF] text-[#087A5A] font-bold shadow-xs'
                : 'text-[#667085] hover:text-[#172033] hover:bg-[#F7FAF9]'
            }`}
          >
            <MapPin className="w-4 h-4 text-[#0F9D72]" />
            Destinations
          </button>

          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'dashboard'
                ? 'bg-[#DDF7EF] text-[#087A5A] font-bold shadow-xs'
                : 'text-[#667085] hover:text-[#172033] hover:bg-[#F7FAF9]'
            }`}
          >
            <BookmarkCheck className="w-4 h-4 text-[#0F9D72]" />
            My Saved Trips
          </button>

          <button
            onClick={() => setActiveTab('about')}
            className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'about'
                ? 'bg-[#DDF7EF] text-[#087A5A] font-bold shadow-xs'
                : 'text-[#667085] hover:text-[#172033] hover:bg-[#F7FAF9]'
            }`}
          >
            <Info className="w-4 h-4 text-[#0F9D72]" />
            About
          </button>
        </nav>

        {/* User Account / Authentication Actions */}
        <div className="flex items-center gap-3">
          {isAuthenticated && user ? (
            <>
              <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#F7FAF9] border border-[#E4EAE7] hover:border-[#BAEEDB] transition-all">
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#087A5A] to-[#0F9D72] text-white flex items-center justify-center text-xs font-bold shadow-xs">
                  {getInitials(user.fullName)}
                </div>
                <span className="text-xs font-semibold text-[#172033] max-w-[150px] truncate">
                  {user.fullName || user.email}
                </span>
              </div>

              <button
                onClick={handleLogout}
                title="Sign Out"
                aria-label="Sign Out"
                className="p-2 text-[#667085] hover:text-[#DC4B4B] hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </>
          ) : (
            <button
              onClick={openAuthModal}
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#0F9D72] hover:bg-[#087A5A] shadow-xs flex items-center gap-1.5 transition-all hover:scale-[1.02] cursor-pointer"
            >
              <UserIcon className="w-4 h-4" />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
