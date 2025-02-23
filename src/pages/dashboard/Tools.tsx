import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Webhook, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Tools = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-heading font-bold text-gray-900 dark:text-white">
            Tools
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center">
            Coming Soon
            <span className="inline-flex items-center px-2 py-0.5 ml-2 text-xs font-medium bg-primary/10 text-primary dark:text-primary-400 rounded">
              Beta
            </span>
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-dark-200 rounded-xl shadow-sm border border-gray-100 dark:border-dark-100 overflow-hidden">
        <div className="p-8 text-center">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 dark:from-primary/30 dark:to-primary/20 flex items-center justify-center mx-auto mb-4">
            <Webhook className="w-8 h-8 text-primary dark:text-primary-400" />
          </div>
          <h3 className="text-xl font-heading font-bold text-gray-900 dark:text-white mb-3">
            Tools Coming Soon
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-lg mx-auto">
            We're working on bringing you powerful tools and integrations. In the meantime, you can use tools directly in your agents.
          </p>
          <Link
            to="/dashboard/agents"
            className="inline-flex items-center text-primary hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300"
          >
            <span>Go to Agents</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Tools;