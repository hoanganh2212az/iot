import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Menu from './Menu';
import { Menu as MenuIcon, X } from 'lucide-react';

const Layout: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-cyan-100 to-blue-200">
      {/* Mobile menu toggle */}
      <button 
        className="fixed z-50 p-2 m-2 text-white bg-gray-800 rounded-md md:hidden" 
        onClick={toggleMenu}
      >
        {isMenuOpen ? <X size={24} /> : <MenuIcon size={24} />}
      </button>
      
      {/* Menu sidebar - responsive */}
      <div className={`fixed md:relative z-40 h-full bg-gray-800 text-white transition-all duration-300 ease-in-out ${
        isMenuOpen ? 'w-64 left-0' : '-left-64 md:left-0 md:w-64'
      }`}>
        <Menu closeMenu={() => setIsMenuOpen(false)} />
      </div>
      
      {/* Main content */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;