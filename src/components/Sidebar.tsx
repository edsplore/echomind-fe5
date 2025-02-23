import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Phone, History, Database, LogOut, ChevronLeft, ChevronRight, Webhook } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { cn } from '../lib/utils';
import { ThemeToggle } from './ThemeToggle';

const menuItems = [
  { icon: Users, label: 'Agents', path: '/dashboard/agents' },
  { icon: Phone, label: 'Phone Numbers', path: '/dashboard/phones' },
  { icon: History, label: 'Call History', path: '/dashboard/calls' },
  { icon: Database, label: 'Knowledge Base', path: '/dashboard/knowledge' },
  { icon: Webhook, label: 'Tools', path: '/dashboard/tools' },
];

const Sidebar = () => {
  const location = useLocation();
  const { logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <motion.div 
      layout
      className={cn(
        "bg-white dark:bg-dark-200 border-r border-gray-100 dark:border-dark-100 flex flex-col relative",
        isCollapsed ? "w-20" : "w-56"
      )}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-20 w-6 h-6 bg-white dark:bg-dark-200 border border-gray-100 dark:border-dark-100 rounded-full flex items-center justify-center text-gray-400 hover:text-primary dark:text-gray-500 dark:hover:text-primary-400 transition-colors shadow-sm"
      >
        {isCollapsed ? (
          <ChevronRight className="w-4 h-4" />
        ) : (
          <ChevronLeft className="w-4 h-4" />
        )}
      </button>

      {/* Logo Section */}
      <div className="flex items-center h-14 px-4 border-b border-gray-100 dark:border-dark-100">
        <Link to="/" className="flex items-center space-x-2 group">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 dark:from-primary/30 dark:to-primary/20 flex items-center justify-center group-hover:shadow-lg group-hover:shadow-primary/20 transition-all duration-300">
            <img src="/echomind-logo.png" alt="EchoMind" className="w-4 h-4" />
          </div>
          {!isCollapsed && (
            <motion.span 
              initial={false}
              animate={{ opacity: 1, width: "auto" }}
              className="font-heading text-sm font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent group-hover:from-primary group-hover:to-primary-600 transition-all duration-300"
            >
              EchoMind
            </motion.span>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'group flex items-center px-3 py-2 text-xs font-menu rounded-lg relative overflow-hidden transition-all duration-300',
                  isActive 
                    ? 'text-primary bg-primary-50/50 dark:bg-dark-100 dark:text-primary-400 font-bold'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-white dark:hover:bg-dark-100'
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-primary to-primary-400 dark:from-primary-400 dark:to-primary-600 rounded-r-full"
                    initial={false}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 30
                    }}
                  />
                )}
                <Icon className="w-4 h-4 flex-shrink-0" />
                {!isCollapsed && (
                  <motion.span 
                    initial={false}
                    animate={{ opacity: 1, width: "auto" }}
                    className="ml-3 tracking-wide"
                  >
                    {item.label}
                  </motion.span>
                )}
                {isCollapsed && (
                  <div className="absolute left-14 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
                    {item.label}
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="border-t border-gray-100 dark:border-dark-100 p-4 space-y-3">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <span className="text-[11px] font-menu font-medium text-gray-500 dark:text-gray-400">
              Theme
            </span>
          )}
          <ThemeToggle />
        </div>
        
        <motion.button
          onClick={logout}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={cn(
            "flex items-center px-3 py-2 text-xs font-menu rounded-lg text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20 transition-all duration-300",
            isCollapsed && "justify-center"
          )}
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {!isCollapsed && (
            <span className="ml-3 tracking-wide">Logout</span>
          )}
          {isCollapsed && (
            <div className="absolute left-14 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
              Logout
            </div>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default Sidebar;