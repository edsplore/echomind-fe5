import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Volume2, ChevronDown } from 'lucide-react';
import { AudioPlayer } from './AudioPlayer';
import { cn } from '../lib/utils';

interface Voice {
  voice_id: string;
  name: string;
  preview_url: string;
}

interface VoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  voices: Voice[];
  selectedVoiceId: string;
  onVoiceChange: (voiceId: string) => void;
}

export const VoiceModal = ({
  isOpen,
  onClose,
  voices,
  selectedVoiceId,
  onVoiceChange,
}: VoiceModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 m-auto h-fit w-[400px] bg-white dark:bg-dark-200 rounded-xl shadow-xl z-50"
          >
            <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-dark-100">
              <div className="flex items-center space-x-2">
                <Volume2 className="w-6 h-6 text-primary dark:text-primary-400" />
                <h2 className="text-xl font-heading font-bold text-gray-900 dark:text-white">
                  Select Voice
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Voice Selection Dropdown */}
              <select
                value={selectedVoiceId}
                onChange={(e) => onVoiceChange(e.target.value)}
                className={cn(
                  "w-full rounded-lg border-2 bg-white dark:bg-dark-100 px-4 py-2.5 text-sm",
                  "focus:outline-none focus:ring-2 focus:ring-primary",
                  "text-gray-900 dark:text-gray-100",
                  selectedVoiceId
                    ? "border-primary"
                    : "border-gray-200 dark:border-dark-100"
                )}
              >
                <option value="">Choose a voice</option>
                {voices.map((voice) => (
                  <option key={voice.voice_id} value={voice.voice_id}>
                    {voice.name}
                  </option>
                ))}
              </select>

              {/* Voice Preview */}
              {selectedVoiceId && (
                voices.find((v) => v.voice_id === selectedVoiceId)?.preview_url && (
                  <AudioPlayer
                    audioUrl={voices.find((v) => v.voice_id === selectedVoiceId)!.preview_url}
                  />
                )
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};