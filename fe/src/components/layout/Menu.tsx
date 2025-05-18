import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Database, Clock, User } from 'lucide-react';

interface MenuProps {
  closeMenu: () => void;
}

const Menu: React.FC<MenuProps> = ({ closeMenu }) => {
  return (
    <nav className="flex flex-col h-full p-4">
      <div className="py-6 text-center text-xl font-bold border-b border-gray-700 mb-8">
        Smart Home
      </div>
      
      <ul className="space-y-2 flex-1">
        <li>
          <NavLink 
            to="/" 
            className={({ isActive }) => 
              `flex items-center py-3 px-4 rounded-md transition-colors ${
                isActive ? 'bg-blue-700' : 'hover:bg-gray-700'
              }`
            }
            onClick={closeMenu}
          >
            <Home className="mr-3" size={20} />
            <span>Home</span>
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/sensor-data" 
            className={({ isActive }) => 
              `flex items-center py-3 px-4 rounded-md transition-colors ${
                isActive ? 'bg-blue-700' : 'hover:bg-gray-700'
              }`
            }
            onClick={closeMenu}
          >
            <Database className="mr-3" size={20} />
            <span>Dữ liệu cảm biến</span>
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/device-history" 
            className={({ isActive }) => 
              `flex items-center py-3 px-4 rounded-md transition-colors ${
                isActive ? 'bg-blue-700' : 'hover:bg-gray-700'
              }`
            }
            onClick={closeMenu}
          >
            <Clock className="mr-3" size={20} />
            <span>Lịch sử bật/tắt thiết bị</span>
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/profile" 
            className={({ isActive }) => 
              `flex items-center py-3 px-4 rounded-md transition-colors ${
                isActive ? 'bg-blue-700' : 'hover:bg-gray-700'
              }`
            }
            onClick={closeMenu}
          >
            <User className="mr-3" size={20} />
            <span>My Profile</span>
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Menu;