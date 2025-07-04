import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, LogOut, X, Mail } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import UserImpersonationDropdown from './UserImpersonationDropdown';

export const DashboardNavbar = () => {
  const { user, logout, getEffectiveUser, getEffectiveUserData, isImpersonating } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const effectiveUser = getEffectiveUser();
  const effectiveUserData = getEffectiveUserData();

  return (
    <>
      <div className="h-14 bg-white dark:bg-dark-200 border-b border-gray-100 dark:border-dark-100">
        <div className="h-full px-4 flex items-center justify-end space-x-4">
          {/* User Impersonation Dropdown */}
          <UserImpersonationDropdown />
          
          {/* User Menu */}
          <motion.button
            onClick={() => setIsProfileOpen(true)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center space-x-3 p-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-100 transition-all duration-300 group"
          >
            <div className="relative">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 dark:from-primary/30 dark:to-primary/20 flex items-center justify-center text-primary dark:text-primary-400">
                <User className="w-4 h-4" />
              </div>
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-primary-400 border-2 border-white dark:border-dark-200 rounded-full ring-4 ring-primary/20 animate-pulse" />
            </div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200 group-hover:text-primary dark:group-hover:text-primary-400 transition-colors">
              {effectiveUser?.email?.split('@')[0]}
            </span>
          </motion.button>
        </div>
      </div>

      {/* Profile Modal */}
      <AnimatePresence>
        {isProfileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsProfileOpen(false)}
              className="fixed inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm z-50"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed top-16 right-4 w-80 bg-white dark:bg-dark-200 rounded-xl shadow-xl z-50 overflow-hidden"
            >
              {/* Header */}
              <div className="relative p-4 border-b border-gray-100 dark:border-dark-100">
                <button
                  onClick={() => setIsProfileOpen(false)}
                  className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 dark:from-primary/30 dark:to-primary/20 flex items-center justify-center text-primary dark:text-primary-400">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                      {user?.email?.split('@')[0]}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center mt-0.5">
                      <Mail className="w-3 h-3 mr-1" />
                      {user?.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-2">
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center px-3 py-2 text-xs font-menu rounded-lg text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20 transition-all duration-300"
                >
                  <LogOut className="w-4 h-4 mr-3" />
                  <span>Logout</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};