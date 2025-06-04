export const languages = [
  { code: 'ar', name: 'Arabic' },
  { code: 'bg', name: 'Bulgarian' },
  { code: 'zh', name: 'Chinese' },
  { code: 'hr', name: 'Croatian' },
  { code: 'cs', name: 'Czech' },
  { code: 'da', name: 'Danish' },
  { code: 'nl', name: 'Dutch' },
  { code: 'en', name: 'English' },
  { code: 'fi', name: 'Finnish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'el', name: 'Greek' },
  { code: 'hi', name: 'Hindi' },
  { code: 'hu', name: 'Hungarian' },
  { code: 'id', name: 'Indonesian' },
  { code: 'it', name: 'Italian' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'ms', name: 'Malay' },
  { code: 'no', name: 'Norwegian' },
  { code: 'pl', name: 'Polish' },
  { code: 'pt-br', name: 'Portuguese (Brazil)' },
  { code: 'pt', name: 'Portuguese (Portugal)' },
  { code: 'ro', name: 'Romanian' },
  { code: 'ru', name: 'Russian' },
  { code: 'sk', name: 'Slovak' },
  { code: 'es', name: 'Spanish' },
  { code: 'sv', name: 'Swedish' },
  { code: 'ta', name: 'Tamil' },
  { code: 'tr', name: 'Turkish' },
  { code: 'uk', name: 'Ukrainian' },
  { code: 'vi', name: 'Vietnamese' }
];

export const llmOptions = [
  'gemini-1.0-pro',
  'gemini-1.5-flash',
  'gemini-1.5-pro',
  'gemini-2.0-flash-001',
  'gpt-3.5-turbo',
  'gpt-4-turbo',
  'gpt-4o',
  'gpt-4o-mini',
  'grok-beta',
];

export const modelOptions = [
  { 
    id: 'eleven_turbo_v2', 
    name: 'Eleven Turbo v2', 
    description: 'Fast, high quality (English)'
  },
  { 
    id: 'eleven_turbo_v2_5', 
    name: 'Eleven Turbo v2.5', 
    description: 'Fast, high quality (Multilingual)'
  },
  { 
    id: 'eleven_flash_v2', 
    name: 'Eleven Flash v2', 
    description: 'Fastest, medium quality (English)'
  },
  { 
    id: 'eleven_flash_v2_5', 
    name: 'Eleven Flash v2.5', 
    description: 'Fastest, medium quality (Multilingual)'
  }
];

export const getModelId = (modelType: string, language: string) => {
  // If modelType is already a full model ID, return it directly
  if (modelType.startsWith('eleven_')) {
    return modelType;
  }
  
  // Legacy support for old 'turbo'/'flash' format
  if (modelType === 'turbo') {
    return language === 'en' ? 'eleven_turbo_v2' : 'eleven_turbo_v2_5';
  }
  return language === 'en' ? 'eleven_flash_v2' : 'eleven_flash_v2_5';
};

export const getModelTypeFromId = (modelId: string) => {
  // Return the exact model ID if it's one of the supported ones
  if (['eleven_turbo_v2', 'eleven_turbo_v2_5', 'eleven_flash_v2', 'eleven_flash_v2_5'].includes(modelId)) {
    return modelId;
  }
  
  // Legacy support - return simplified type for backwards compatibility
  if (modelId.includes('turbo')) {
    return 'turbo';
  }
  return 'flash';
};

export const getLanguageName = (code: string) => {
  const language = languages.find(lang => lang.code === code);
  return language ? language.name : code;
};