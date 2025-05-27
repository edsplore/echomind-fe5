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
import { useAuth } from '../contexts/AuthContext';
import Sidebar from '../components/Sidebar';
import { DashboardNavbar } from '../components/DashboardNavbar';
import Agents from './dashboard/Agents';
import PhoneNumbers from './dashboard/PhoneNumbers';
import CallHistory from './dashboard/CallHistory';
import KnowledgeBase from './dashboard/KnowledgeBase';
import Tools from './dashboard/Tools';
import ToolDetails from './dashboard/ToolDetails';
import BatchCalling from './dashboard/BatchCalling';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
    return (
        <div>
            <h1>Admin Dashboard</h1>
        </div>
    );
};

const UserDashboard = () => {
    return (
        <div>
            <h1>User Dashboard</h1>
        </div>
    );
};

const Dashboard = () => {
  const { isAdmin } = useAuth();

  return isAdmin ? <AdminDashboard /> : <UserDashboard />;
};

export default Dashboard;