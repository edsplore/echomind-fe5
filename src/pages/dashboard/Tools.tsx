import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Webhook, ArrowRight, Save, Edit, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { db } from '../../lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useAuth } from '../../contexts/AuthContext';

const Tools = () => {
  const [showGhlFields, setShowGhlFields] = useState(false);
  const [showCalFields, setShowCalFields] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false); // Added state to track changes
  const { user } = useAuth();

  const [ghlKey, setGhlKey] = useState('');
  const [ghlCalendarId, setGhlCalendarId] = useState('');
  const [calApiKey, setCalApiKey] = useState('');

  // Store original values for cancel functionality
  const [originalGhlKey, setOriginalGhlKey] = useState('');
  const [originalGhlCalendarId, setOriginalGhlCalendarId] = useState('');
  const [originalCalApiKey, setOriginalCalApiKey] = useState('');

  useEffect(() => {
    fetchToolSettings();
  }, [user]);

  const fetchToolSettings = async () => {
    if (!user) return;

    try {
      const docRef = doc(db, 'users', user.uid, 'settings', 'tools');
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setGhlKey(data.ghlKey || '');
        setGhlCalendarId(data.ghlCalendarId || '');
        setCalApiKey(data.calApiKey || '');

        setOriginalGhlKey(data.ghlKey || '');
        setOriginalGhlCalendarId(data.ghlCalendarId || '');
        setOriginalCalApiKey(data.calApiKey || '');
      }
    } catch (error) {
      console.error('Error fetching tool settings:', error);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    setIsSaving(true);
    try {
      const docRef = doc(db, 'users', user.uid, 'settings', 'tools');
      await setDoc(docRef, {
        ghlKey,
        ghlCalendarId,
        calApiKey,
        updatedAt: new Date(),
      });

      setOriginalGhlKey(ghlKey);
      setOriginalGhlCalendarId(ghlCalendarId);
      setOriginalCalApiKey(calApiKey);
      setIsEditing(false);
      setHasChanges(false); // Reset changes flag after saving
    } catch (error) {
      console.error('Error saving tool settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setGhlKey(originalGhlKey);
    setGhlCalendarId(originalGhlCalendarId);
    setCalApiKey(originalCalApiKey);
    setIsEditing(false);
    setHasChanges(false); // Reset changes flag after canceling
  };

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

        {(originalGhlKey || originalCalApiKey) && (
          <div>
            {isEditing && hasChanges ? ( // Only show buttons if editing and changes exist
              <div className="flex gap-2">
                <button
                  onClick={handleCancel}
                  className="px-3 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 dark:border-dark-100 dark:text-gray-400 dark:hover:bg-dark-100 transition flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-3 py-2 rounded-lg border border-primary bg-primary text-white hover:bg-primary-600 transition flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {isSaving ? 'Saving...' : 'Save'}
                </button>
              </div>
            ) : (
              isEditing && ( // Show edit button if editing but no changes
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 dark:border-dark-100 dark:text-gray-400 dark:hover:bg-dark-100 transition flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              )
              
            ) || (
              <button
                onClick={() => setIsEditing(true)}
                className="px-3 py-2 rounded-lg border border-primary text-primary hover:bg-primary/10 transition flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Edit
              </button>
            )}
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-dark-200 rounded-xl shadow-sm border border-gray-100 dark:border-dark-100 overflow-hidden">
        <div className="p-8 text-center">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 dark:from-primary/30 dark:to-primary/20 flex items-center justify-center mx-auto mb-4">
            <Webhook className="w-8 h-8 text-primary dark:text-primary-400" />
          </div>
          <h3 className="text-xl font-heading font-bold text-gray-900 dark:text-white mb-3">
            Tools Configuration
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-lg mx-auto">
            Configure your integration settings below.
          </p>

          <div className="mt-8">
            <div className="flex flex-col sm:flex-row sm:justify-center gap-4">
              <button
                onClick={() => setShowGhlFields((prev) => !prev)}
                className="px-4 py-2 rounded-lg border border-primary text-primary hover:bg-primary/10 dark:hover:bg-primary/20 transition w-full sm:w-auto"
              >
                {showGhlFields ? 'Hide GHL Settings' : 'Connect to GHL'}
              </button>

              <button
                onClick={() => setShowCalFields((prev) => !prev)}
                className="px-4 py-2 rounded-lg border border-primary text-primary hover:bg-primary/10 dark:hover:bg-primary/20 transition w-full sm:w-auto"
              >
                {showCalFields ? 'Hide Cal.com Settings' : 'Connect to Cal.com'}
              </button>
            </div>

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
                      onChange={(e) => {
                        setGhlKey(e.target.value);
                        setHasChanges(true);
                      }}
                      disabled={!isEditing && originalGhlKey}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-dark-100 bg-white dark:bg-dark-100 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:outline-none disabled:bg-gray-100 dark:disabled:bg-dark-100"
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
                      onChange={(e) => {
                        setGhlCalendarId(e.target.value);
                        setHasChanges(true);
                      }}
                      disabled={!isEditing && originalGhlCalendarId}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-dark-100 bg-white dark:bg-dark-100 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:outline-none disabled:bg-gray-100 dark:disabled:bg-dark-100"
                      placeholder="Enter calendar ID"
                    />
                  </div>
                  {/* Buttons below input fields */}
                  <div className="flex gap-2 justify-end mt-4">
                    {isEditing && hasChanges ? (
                      <>
                        <button
                          onClick={handleCancel}
                          className="px-3 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 dark:border-dark-100 dark:text-gray-400 dark:hover:bg-dark-100 transition flex items-center gap-2"
                        >
                          <X className="w-4 h-4" />
                          Cancel
                        </button>
                        <button
                          onClick={handleSave}
                          disabled={isSaving}
                          className="px-3 py-2 rounded-lg border border-primary bg-primary text-white hover:bg-primary-600 transition flex items-center gap-2"
                        >
                          <Save className="w-4 h-4" />
                          {isSaving ? 'Saving...' : 'Save'}
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="px-3 py-2 rounded-lg border border-primary text-primary hover:bg-primary/10 transition flex items-center gap-2"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

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
                      onChange={(e) => {
                        setCalApiKey(e.target.value);
                        setHasChanges(true);
                      }}
                      disabled={!isEditing && originalCalApiKey}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-dark-100 bg-white dark:bg-dark-100 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:outline-none disabled:bg-gray-100 dark:disabled:bg-dark-100"
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