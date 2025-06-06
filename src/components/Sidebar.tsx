import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Users,
  Phone,
  History,
  Database,
  LogOut,
  Webhook,
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightOpen,
  Speech,
  PhoneCall,
  Box,
} from "lucide-react";
import { cn } from "../lib/utils";
import { ThemeToggle } from "./ThemeToggle";
import { useAuth } from "../contexts/AuthContext";

const adminMenuItems = [
  { icon: Box, label: "Dashboard", path: "/dashboard" },
  { icon: Speech, label: "Agents", path: "/dashboard/agents" },
  { icon: Phone, label: "Phone Numbers", path: "/dashboard/phones" },
  { icon: History, label: "Call History", path: "/dashboard/calls" },
  { icon: Database, label: "Knowledge Base", path: "/dashboard/knowledge" },
  { icon: Webhook, label: "Tools", path: "/dashboard/tools" },
  { icon: PhoneCall, label: "Batch Calling", path: "/dashboard/batch-calling" },
  { icon: Users, label: "User Management", path: "/dashboard/users" },
];

const userMenuItems = [
  { icon: Speech, label: "Agents", path: "/dashboard/agents" },
  { icon: Phone, label: "Phone Numbers", path: "/dashboard/phones" },
  { icon: History, label: "Call History", path: "/dashboard/calls" },
  { icon: Database, label: "Knowledge Base", path: "/dashboard/knowledge" },
  { icon: Webhook, label: "Tools", path: "/dashboard/tools" },
  { icon: PhoneCall, label: "Batch Calling", path: "/dashboard/batch-calling" },
];

const Sidebar = () => {
  const location = useLocation();
  const { logout, isAdmin } = useAuth();

  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const menuItems = isAdmin() ? adminMenuItems : userMenuItems;

  return (
    <motion.div
      layout
      className={cn(
        "relative h-screen",
        "bg-white dark:bg-dark-200 border-r border-gray-100 dark:border-dark-100 flex flex-col",
        isCollapsed ? "w-14" : "w-64", // Slimmer collapsed width
      )}
    >
      {/* HEADER / LOGO */}
      <div className="flex items-center h-14 px-4 border-b border-gray-100 dark:border-dark-100">
        <Link to="/" className="flex items-center space-x-2 group">
          <div className="w-7 h-7 rounded-md bg-lime-100 dark:bg-lime-700/20 flex items-center justify-center group-hover:shadow-lg transition-all duration-300">
            <img src="/XpressVoice-circle-logo.png" alt="Allied Global" className="w-4 h-4" />
          </div>

          {/* Hide text if collapsed */}
          {!isCollapsed && (
            <motion.span
              initial={false}
              animate={{ opacity: 1, width: "auto" }}
              className="font-heading text-sm font-bold text-gray-800 dark:text-gray-200
                         group-hover:text-lime-600 transition-colors duration-300 text-[15px]"
            >
              Allied Global
            </motion.span>
          )}
        </Link>
      </div>

      {/* NAVIGATION */}
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
                  "group flex items-center px-3 py-2 text-[14px] font-menu rounded-lg relative overflow-hidden transition-all duration-300",
                  isActive
                    ? "text-lime-600 bg-lime-50 dark:bg-dark-100 dark:text-lime-400 font-semibold"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-white dark:hover:bg-dark-100",
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-lime-500 dark:bg-lime-600 rounded-r-full"
                    initial={false}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 30,
                    }}
                  />
                )}
                <Icon className="w-4 h-4 flex-shrink-0" />

                {/* If expanded, show label */}
                {!isCollapsed && (
                  <motion.span
                    initial={false}
                    animate={{ opacity: 1, width: "auto" }}
                    className="ml-3 tracking-wide text-[14px]"
                  >
                    {item.label}
                  </motion.span>
                )}

                {/* Tooltip if collapsed */}
                {isCollapsed && (
                  <div
                    className="absolute left-12 px-2 py-1 bg-gray-900 text-white text-[14px] rounded
                               opacity-0 invisible group-hover:opacity-100 group-hover:visible
                               transition-all duration-200 whitespace-nowrap z-50"
                  >
                    {item.label}
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* FOOTER */}
      <div className="border-t border-gray-100 dark:border-dark-100 p-4 space-y-3">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <span className="text-[13px] font-menu font-medium text-gray-500 dark:text-gray-400">
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
            "relative group flex items-center px-3 py-2 text-xs font-menu rounded-lg",
            "relative group flex items-center px-3 py-2 text-[14px] font-menu rounded-lg",
            "text-red-600 hover:text-red-700 hover:bg-red-50",
            "dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20 transition-all duration-300",
            isCollapsed && "justify-center",
          )}
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {!isCollapsed && <span className="ml-3 tracking-wide">Logout</span>}
          {isCollapsed && (
            <div
              className="absolute left-12 px-2 py-1 bg-gray-900 text-white text-[14px] rounded
                         opacity-0 invisible group-hover:opacity-100 group-hover:visible
                         transition-all duration-200 whitespace-nowrap z-50"
            >
              Logout
            </div>
          )}
        </motion.button>
      </div>

      {/*
        Small rectangular toggle at the center right
        - Now even smaller (h-7 px-1.5)
        - Subtle border, single lime color accent
        - Arrow flips from left to right (0→180°)
      */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2">
        <motion.button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-lime-600 dark:text-lime-400 hover:text-lime-700 dark:hover:text-lime-300 transition-colors"
        >
          <motion.div
            animate={{ rotate: isCollapsed ? 180 : 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            {!isCollapsed ? (
              <PanelLeftClose className="w-6 h-5" />
            ) : (
              <PanelRightOpen className="w-6 h-5" />
            )}
          </motion.div>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default Sidebar;
