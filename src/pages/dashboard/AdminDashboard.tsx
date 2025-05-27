
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Bot, 
  Phone, 
  History, 
  Database,
  Webhook,
  Users,
  Settings,
  Shield,
  UserCheck,
  Activity,
  BarChart,
  TrendingUp,
  PhoneCall,
  MessageSquare,
  Clock
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Sidebar from '../../components/Sidebar';
import { DashboardNavbar } from '../../components/DashboardNavbar';
import Agents from './Agents';
import PhoneNumbers from './PhoneNumbers';
import CallHistory from './CallHistory';
import KnowledgeBase from './KnowledgeBase';
import Tools from './Tools';
import ToolDetails from './ToolDetails';
import BatchCalling from './BatchCalling';
import UserManagement from './UserManagement';

const adminMenuItems = [
  { icon: Shield, label: 'Admin Panel', path: '/dashboard/admin' },
  { icon: UserCheck, label: 'User Management', path: '/dashboard/users' },
  { icon: Users, label: 'Agents', path: '/dashboard/agents' },
  { icon: Phone, label: 'Phone Numbers', path: '/dashboard/phones' },
  { icon: History, label: 'Call History', path: '/dashboard/calls' },
  { icon: Database, label: 'Knowledge Base', path: '/dashboard/knowledge' },
  { icon: Webhook, label: 'Tools', path: '/dashboard/tools' },
  { icon: Users, label: 'Batch Calling', path: '/dashboard/batch-calling' },
];

const AdminDashboard = () => {
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-dark-300">
      <Sidebar menuItems={adminMenuItems} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardNavbar />
        
        <main className="flex-1 overflow-auto p-6">
          <Routes>
            <Route index element={<Navigate to="/dashboard/admin" replace />} />
            <Route path="admin" element={<AdminOverview />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="agents" element={<Agents />} />
            <Route path="phones" element={<PhoneNumbers />} />
            <Route path="calls" element={<CallHistory />} />
            <Route path="knowledge" element={<KnowledgeBase />} />
            <Route path="tools" element={<Tools />} />
            <Route path="tools/:toolId" element={<ToolDetails />} />
            <Route path="batch-calling" element={<BatchCalling />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

const AdminOverview = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-heading font-bold text-gray-900 dark:text-white">
            Admin Dashboard
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            System overview and administration
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-dark-200 rounded-xl shadow-sm border border-gray-100 dark:border-dark-100 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Users</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">1,234</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-200 rounded-xl shadow-sm border border-gray-100 dark:border-dark-100 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500/20 to-green-600/20 flex items-center justify-center">
              <Activity className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Sessions</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">456</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-200 rounded-xl shadow-sm border border-gray-100 dark:border-dark-100 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/20 flex items-center justify-center">
              <PhoneCall className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Calls</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">12,345</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-200 rounded-xl shadow-sm border border-gray-100 dark:border-dark-100 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500/20 to-orange-600/20 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Success Rate</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">92%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-dark-200 rounded-xl shadow-sm border border-gray-100 dark:border-dark-100 p-6">
        <h3 className="text-lg font-heading font-bold text-gray-900 dark:text-white mb-4">
          System Status
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">API Status</span>
            <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400 rounded-full">
              Operational
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">Database</span>
            <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400 rounded-full">
              Healthy
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">Voice Services</span>
            <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-800/20 dark:text-yellow-400 rounded-full">
              Maintenance
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
