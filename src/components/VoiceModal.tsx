import React, { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Search } from 'lucide-react';
import { cn } from '../lib/utils';

interface VoiceLabels {
  accent?: string;
  age?: string;
  gender?: string;
  description?: string;
  use_case?: string;
  [key: string]: string | undefined;
}

interface Voice {
  voice_id: string;
  name: string;
  preview_url: string;
  labels?: VoiceLabels;
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
  // Basic filters
  const [genderFilter, setGenderFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [accentFilter, setAccentFilter] = useState('');

  // Ref to keep track of the currently playing audio
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

  // Dynamically gather all unique accents from the data (normalized)
  const allAccents = useMemo(() => {
    const accentSet = new Set<string>();
    voices.forEach((v) => {
      const rawAccent = v.labels?.accent || '';
      const normalized = rawAccent.toLowerCase().replace(/^en-/, '');
      if (normalized) accentSet.add(normalized);
    });
    return Array.from(accentSet);
  }, [voices]);

  // Helper to play audio preview ensuring only one plays at a time
  const handlePlay = (url: string, e: React.MouseEvent) => {
    e.stopPropagation();
    // Pause and reset any currently playing audio
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current.currentTime = 0;
    }
    // Create and play new audio, then store it in the ref
    const audio = new Audio(url);
    currentAudioRef.current = audio;
    audio.play();
  };

  // Filter + search logic
  const filteredVoices = useMemo(() => {
    return voices.filter((v) => {
      // Normalize accent and gender
      const rawAccent = v.labels?.accent || '';
      const accent = rawAccent.toLowerCase().replace(/^en-/, '');
      const gender = v.labels?.gender?.toLowerCase() || '';

      if (genderFilter && gender !== genderFilter.toLowerCase()) return false;
      if (accentFilter && accent !== accentFilter.toLowerCase()) return false;

      if (searchTerm) {
        const st = searchTerm.toLowerCase();
        const nameMatch = v.name.toLowerCase().includes(st);
        const idMatch = v.voice_id.toLowerCase().includes(st);
        const accentMatch = accent.includes(st);
        const descMatch = (v.labels?.description || "").toLowerCase().includes(st);
        if (!nameMatch && !idMatch && !accentMatch && !descMatch) return false;
      }
      return true;
    });
  }, [voices, genderFilter, accentFilter, searchTerm]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-50 bg-black/20 dark:bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          {/* Flex container to center the modal */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Modal box */}
            <motion.div
              className="w-full max-w-2xl rounded-xl bg-white dark:bg-dark-200 shadow-xl"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-dark-100">
                <h2 className="text-lg font-heading font-bold text-gray-900 dark:text-white">
                  Select Voice
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              {/* Filters Row */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-200 dark:border-dark-100">
                {/* Gender Filter */}
                <div className="relative">
                  <select
                    value={genderFilter}
                    onChange={(e) => setGenderFilter(e.target.value)}
                    className="text-sm border border-gray-200 dark:border-dark-100 rounded-md px-3 py-1.5 bg-white dark:bg-dark-100 focus:outline-none"
                  >
                    <option value="">Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="non-binary">Non-binary</option>
                  </select>
                </div>
                {/* Dynamic Accent Filter */}
                <div className="relative">
                  <select
                    value={accentFilter}
                    onChange={(e) => setAccentFilter(e.target.value)}
                    className="text-sm border border-gray-200 dark:border-dark-100 rounded-md px-3 py-1.5 bg-white dark:bg-dark-100 focus:outline-none"
                  >
                    <option value="">Accent</option>
                    {allAccents.map((accent) => (
                      <option key={accent} value={accent}>
                        {accent.charAt(0).toUpperCase() + accent.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                {/* Search */}
                <div className="flex items-center ml-auto border border-gray-200 dark:border-dark-100 rounded-md px-2 py-1.5 bg-white dark:bg-dark-100">
                  <Search className="w-4 h-4 text-gray-400 mr-1" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search..."
                    className="text-sm focus:outline-none bg-transparent"
                  />
                </div>
              </div>
              {/* Scrollable table container */}
              <div className="overflow-auto px-4 max-h-80">
                <table className="w-full text-sm text-left mt-2 border-separate border-spacing-y-1">
                  <thead className="text-gray-700 dark:text-gray-300">
                    <tr>
                      <th className="py-2 w-8"></th>
                      <th className="py-2">Voice</th>
                      <th className="py-2">Trait</th>
                      <th className="py-2">Voice ID</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredVoices.map((voice) => {
                      const isSelected = voice.voice_id === selectedVoiceId;
                      const rawAccent = voice.labels?.accent || '';
                      const accentNormalized = rawAccent.toLowerCase().replace(/^en-/, '');
                      const age = voice.labels?.age || '';
                      const gender = voice.labels?.gender || '';
                      const descriptor = voice.labels?.description || '';
                      const traits = [accentNormalized, age, descriptor, gender].filter(Boolean);
                      return (
                        <tr
                          key={voice.voice_id}
                          onClick={() => onVoiceChange(voice.voice_id)}
                          className={cn(
                            'cursor-pointer hover:bg-gray-50 dark:hover:bg-dark-100',
                            isSelected && 'bg-primary/5 dark:bg-primary/10'
                          )}
                        >
                          <td className="py-2 w-8 align-middle text-center">
                            <button
                              onClick={(e) => handlePlay(voice.preview_url, e)}
                              className="text-gray-500 hover:text-primary dark:hover:text-primary-300"
                            >
                              <Play className="w-4 h-4" />
                            </button>
                          </td>
                          <td className="py-2 font-medium text-gray-900 dark:text-gray-100 align-middle">
                            {voice.name}
                          </td>
                          <td className="py-2 align-middle">
                            <div className="flex flex-wrap gap-1">
                              {traits.map((t) => (
                                <span
                                  key={t}
                                  className="inline-block px-2 py-0.5 text-xs rounded-full bg-gray-100 dark:bg-dark-100 text-gray-600 dark:text-gray-300"
                                >
                                  {t}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="py-2 align-middle text-gray-500 dark:text-gray-400">
                            {voice.voice_id}
                          </td>
                        </tr>
                      );
                    })}
                    {filteredVoices.length === 0 && (
                      <tr>
                        <td colSpan={4} className="py-4 text-center text-gray-500 dark:text-gray-400">
                          No voices found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              {/* Footer */}
              <div className="flex justify-end p-4 border-t border-gray-200 dark:border-dark-100">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-semibold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-dark-100 rounded hover:bg-gray-200 dark:hover:bg-dark-50"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
