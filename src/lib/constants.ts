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
    id: 'turbo', 
    name: 'Eleven Turbo', 
    description: 'Fast, high quality'
  },
  { 
    id: 'flash', 
    name: 'Eleven Flash', 
    description: 'Fastest, medium quality'
  }
];

export const getModelId = (modelType: string, language: string) => {
  if (modelType === 'turbo') {
    return language === 'en' ? 'eleven_turbo_v2' : 'eleven_turbo_v2_5';
  }
  return language === 'en' ? 'eleven_flash_v2' : 'eleven_flash_v2_5';
};

export const getModelTypeFromId = (modelId: string) => {
  if (modelId.includes('turbo')) {
    return 'turbo';
  }
  return 'flash';
};

export const getLanguageName = (code: string) => {
  const language = languages.find(lang => lang.code === code);
  return language ? language.name : code;
};