import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Webhook, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Tools = () => {
  const [showGhlFields, setShowGhlFields] = useState(false);
  const [showCalFields, setShowCalFields] = useState(false);

  const [ghlKey, setGhlKey] = useState('');
  const [ghlCalendarId, setGhlCalendarId] = useState('');

  const [calApiKey, setCalApiKey] = useState('');
  // Removed calCalendarId since we only need the API key for Cal.com

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-heading font-bold text-gray-900 dark:text-white">
            Tools
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center">
            Integrations & Tools
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
            We're working on bringing you powerful tools and integrations.
            In the meantime, you can use tools directly in your agents.
          </p>
          <Link
            to="/dashboard/agents"
            className="inline-flex items-center text-primary hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300 mb-4"
          >
            <span>Go to Agents</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>

          {/* Integration Buttons */}
          <div className="mt-8">
            <div className="flex flex-col sm:flex-row sm:justify-center gap-4">
              {/* GHL Button */}
              <button
                onClick={() => setShowGhlFields((prev) => !prev)}
                className="px-4 py-2 rounded-lg border border-primary text-primary hover:bg-primary/10 dark:hover:bg-primary/20 transition w-full sm:w-auto"
              >
                {showGhlFields ? 'Hide GHL Settings' : 'Connect to GHL'}
              </button>

              {/* Cal.com Button */}
              <button
                onClick={() => setShowCalFields((prev) => !prev)}
                className="px-4 py-2 rounded-lg border border-primary text-primary hover:bg-primary/10 dark:hover:bg-primary/20 transition w-full sm:w-auto"
              >
                {showCalFields ? 'Hide Cal.com Settings' : 'Connect to Cal.com'}
              </button>
            </div>

            {/* GHL Fields */}
            <AnimatePresence>
              {showGhlFields && (
                <motion.div
                  className="mt-6 space-y-4 max-w-md mx-auto text-left"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Private Integration Key
                    </label>
                    <input
                      type="text"
                      value={ghlKey}
                      onChange={(e) => setGhlKey(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-dark-100 bg-white dark:bg-dark-100 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:outline-none"
                      placeholder="Enter your GHL key"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Calendar ID
                    </label>
                    <input
                      type="text"
                      value={ghlCalendarId}
                      onChange={(e) => setGhlCalendarId(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-dark-100 bg-white dark:bg-dark-100 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:outline-none"
                      placeholder="Enter calendar ID"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Cal.com Fields (only API key needed) */}
            <AnimatePresence>
              {showCalFields && (
                <motion.div
                  className="mt-6 space-y-4 max-w-md mx-auto text-left"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      API Key
                    </label>
                    <input
                      type="text"
                      value={calApiKey}
                      onChange={(e) => setCalApiKey(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-dark-100 bg-white dark:bg-dark-100 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:outline-none"
                      placeholder="Enter your Cal.com API key"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tools;
