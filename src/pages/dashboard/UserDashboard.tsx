
import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Bot, 
  Phone, 
  History, 
  Database,
  ArrowRight,
  Activity,
  Users,
  Clock,
  MessageSquare,
  BarChart,
  TrendingUp,
  PhoneCall,
  Plus,
  Webhook
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
import { Link } from 'react-router-dom';

const userMenuItems = [
  { icon: Users, label: 'Agents', path: '/dashboard/agents' },
  { icon: Phone, label: 'Phone Numbers', path: '/dashboard/phones' },
  { icon: History, label: 'Call History', path: '/dashboard/calls' },
  { icon: Database, label: 'Knowledge Base', path: '/dashboard/knowledge' },
  { icon: Webhook, label: 'Tools', path: '/dashboard/tools' },
  { icon: Users, label: 'Batch Calling', path: '/dashboard/batch-calling' },
];

const UserDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-dark-300">
      <Sidebar menuItems={userMenuItems} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardNavbar />
        
        <main className="flex-1 overflow-auto p-6">
          <Routes>
            <Route index element={<Navigate to="/dashboard/agents" replace />} />
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

export default UserDashboard;
