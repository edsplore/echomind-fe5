import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import { DashboardNavbar } from '../../components/DashboardNavbar';
import Agents from './Agents';
import CallHistory from './CallHistory';

const UserDashboard = () => {
  return (
    <div className="h-screen flex bg-gray-50 dark:bg-dark-300">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardNavbar />
        <main className="flex-1 overflow-auto">
          <div className="py-6 px-4 sm:px-6 lg:px-8">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard/agents" replace />} />
              <Route path="agents/*" element={<Agents />} />
              <Route path="calls" element={<CallHistory />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserDashboard;