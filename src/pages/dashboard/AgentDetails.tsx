import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Bot,
  Check,
  X,
  AlertCircle,
  FileText,
  Link as LinkIcon,
  Database,
  CheckCircle2,
  Eye,
  Brain,
  Cpu,
  Atom,
  Lightbulb,
  MessageSquare,
  Volume2,
  Thermometer,
  Sparkles,
  Globe,
  Settings,
  Speech,
  Webhook,
  ChevronRight,
  Plus 
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import CallTesting from '../../components/CallTesting';
import { KnowledgeBaseSelect } from '../../components/KnowledgeBaseSelect';
import { VoiceModal } from '../../components/VoiceModal';
import { ModelSelect } from '../../components/ModelSelect';
import { ToolConfigModal } from '../../components/ToolConfigModal';
import { LanguageSelect } from '../../components/LanguageSelect';
import { Loader, PageLoader } from '../../components/Loader';
import {
  getModelId,
  getModelTypeFromId,
  getLanguageName,
  llmOptions,
} from '../../lib/constants';
import { cn } from '../../lib/utils';

interface AgentDetails {
  agent_id: string;
  name: string;
  conversation_config: {
    agent: {
      prompt: {
        prompt: string;
        llm: string;
        temperature: number;
        knowledge_base: {
          id: string;
          name: string;
          type: string;
        }[];
        tools: {
          type: string;
          name: string;
          description: string;
          api_schema: {
            url: string;
            method: string;
            path_params_schema?: {
              [key: string]: {
                type: string;
                description: string;
                dynamic_variable: string;
              };
            };
            query_params_schema?: {
              properties: {
                [key: string]: {
                  type: string;
                  description: string;
                  dynamic_variable: string;
                };
              };
              required?: string[];
            };
            request_body_schema?: {
              type: string;
              properties: {
                [key: string]: {
                  type: string;
                  description: string;
                  dynamic_variable: string;
                  properties?: {
                    [key: string]: {
                      type: string;
                      description: string;
                      dynamic_variable: string;
                    };
                  };
                  items?: {
                    type: string;
                    description: string;
                    dynamic_variable: string;
                  };
                };
              };
              required?: string[];
              description?: string;
            };
            request_headers?: {
              [key: string]: string;
            };
          };
        }[];
      };
      first_message: string;
      language: string;
    };
    tts: {
      voice_id: string;
      model_id: string;
    };
  };
}

interface Voice {
  voice_id: string;
  name: string;
  preview_url: string;
}

interface KnowledgeBaseDocument {
  id: string;
  name: string;
  type: 'file' | 'url';
  extracted_inner_html: string;
}

interface EditForm {
  name: string;
  prompt: string;
  llm: string;
  temperature: number;
  first_message: string;
  voice_id: string;
  language: string;
  modelType: string;
  knowledge_base: Array<{
    id: string;
    name: string;
    type: string;
  }>;
  tools: Array<{
    type: string;
    name: string;
    description: string;
    api_schema: {
      url: string;
      method: string;
      path_params_schema?: {
        [key: string]: {
          type: string;
          description: string;
          dynamic_variable: string;
        };
      };
      query_params_schema?: {
        properties: {
          [key: string]: {
            type: string;
            description: string;
            dynamic_variable: string;
          };
        };
        required?: string[];
      };
      request_body_schema?: {
        type: string;
        properties: {
          [key: string]: {
            type: string;
            description: string;
            dynamic_variable: string;
            properties?: {
              [key: string]: {
                type: string;
                description: string;
                dynamic_variable: string;
              };
            };
            items?: {
              type: string;
              description: string;
              dynamic_variable: string;
            };
          };
        };
        required?: string[];
        description?: string;
      };
      request_headers?: {
        [key: string]: string;
      };
    };
  }>;
}

const BACKEND_URL = 'https://11-labs-backend.replit.app';

const agentIcons = [
  { icon: Speech, color: 'primary' },
];

const getAgentIcon = (agentId: string) => {
  const index =
    Math.abs(
      agentId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    ) % agentIcons.length;
  return agentIcons[index];
};

const AgentDetails = () => {
  const { agentId } = useParams<{ agentId: string }>();
  const { user } = useAuth();
  const [agent, setAgent] = useState<AgentDetails | null>(null);
  const [voice, setVoice] = useState<Voice | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [voices, setVoices] = useState<Voice[]>([]);
  const [loadingVoices, setLoadingVoices] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [knowledgeBase, setKnowledgeBase] = useState<KnowledgeBaseDocument[]>(
    []
  );
  const [loadingKnowledgeBase, setLoadingKnowledgeBase] = useState(false);
  const [previewDocument, setPreviewDocument] =
    useState<KnowledgeBaseDocument | null>(null);

  // UI state
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [isCreatingTool, setIsCreatingTool] = useState(false);

  const [editForm, setEditForm] = useState<EditForm>({
    name: '',
    prompt: '',
    llm: '',
    temperature: 0.7,
    first_message: '',
    voice_id: '',
    language: 'en',
    modelType: 'turbo',
    knowledge_base: [],
  });

  const [editedForm, setEditedForm] = useState<EditForm>(editForm);

  // Fetch agent details
  const fetchAgentDetails = async () => {
    if (!user || !agentId) return;

    try {
      setLoading(true);
      const response = await fetch(
        `${BACKEND_URL}/agents/${user.uid}/${agentId}`,
        {
          headers: {
            Authorization: `Bearer ${await user.getIdToken()}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch agent details');
      }

      const agentData: AgentDetails = await response.json();
      setAgent(agentData);

      // Extract model type from model_id
      const modelType = getModelTypeFromId(
        agentData.conversation_config.tts.model_id
      );

      const initialForm = {
        name: agentData.name,
        prompt: agentData.conversation_config.agent.prompt.prompt,
        llm: agentData.conversation_config.agent.prompt.llm,
        temperature: agentData.conversation_config.agent.prompt.temperature,
        first_message: agentData.conversation_config.agent.first_message,
        voice_id: agentData.conversation_config.tts.voice_id,
        language: agentData.conversation_config.agent.language || 'en',
        modelType,
        knowledge_base: agentData.conversation_config.agent.prompt.knowledge_base || [],
        tools: agentData.conversation_config.agent.prompt.tools || [],
      };

      setEditForm(initialForm);
      setEditedForm(initialForm);

      // Fetch voice details
      const voiceResponse = await fetch(
        `${BACKEND_URL}/voices/get-voice/${agentData.conversation_config.tts.voice_id}`,
        {
          headers: {
            Authorization: `Bearer ${await user.getIdToken()}`,
          },
        }
      );

      if (voiceResponse.ok) {
        const voiceData: Voice = await voiceResponse.json();
        setVoice(voiceData);
      }

      // Fetch available voices
      setLoadingVoices(true);
      const voicesResponse = await fetch(`${BACKEND_URL}/voices/list-voices`, {
        headers: {
          Authorization: `Bearer ${await user.getIdToken()}`,
        },
      });

      if (voicesResponse.ok) {
        const data = await voicesResponse.json();
        if (data.voices && Array.isArray(data.voices)) {
          setVoices(data.voices);
        }
      }

      // Fetch knowledge base
      setLoadingKnowledgeBase(true);
      const kbResponse = await fetch(
        `${BACKEND_URL}/knowledge-base/${user.uid}`,
        {
          headers: {
            Authorization: `Bearer ${await user.getIdToken()}`,
          },
        }
      );

      if (kbResponse.ok) {
        const data = await kbResponse.json();
        setKnowledgeBase(data.documents || []);
      }
    } catch (error) {
      console.error('Error fetching agent details:', error);
      setError('Failed to load agent details. Please try again.');
    } finally {
      setLoading(false);
      setLoadingVoices(false);
      setLoadingKnowledgeBase(false);
    }
  };

  useEffect(() => {
    fetchAgentDetails();
  }, [user, agentId]);

  const handleSave = async () => {
    if (!user || !agentId) return;

    try {
      setSaving(true);
      setError('');

      const response = await fetch(
        `${BACKEND_URL}/agents/${user.uid}/${agentId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${await user.getIdToken()}`,
          },
          body: JSON.stringify({
            name: editedForm.name,
            conversation_config: {
              agent: {
                prompt: {
                  prompt: editedForm.prompt,
                  llm: editedForm.llm,
                  temperature: editedForm.temperature,
                  knowledge_base: editedForm.knowledge_base,
                  tools: editedForm.tools,
                },
                first_message: editedForm.first_message,
                language: editedForm.language,
              },
              tts: {
                voice_id: editedForm.voice_id,
                model_id: getModelId(editedForm.modelType, editedForm.language),
              },
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update agent');
      }

      await fetchAgentDetails();
      setHasChanges(false);
    } catch (error) {
      console.error('Error updating agent:', error);
      setError('Failed to update agent. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedForm(editForm);
    setHasChanges(false);
    // Reset voice display to original voice
    const originalVoice = voices.find((v) => v.voice_id === editForm.voice_id) || null;
    setVoice(originalVoice);
    setShowModelDropdown(false);
    setShowLanguageDropdown(false);
  };

  const handleChange = (
    field: keyof EditForm,
    value: string | number | any[]
  ) => {
    setEditedForm((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleCreateTool = () => {
    const newTool: Tool = {
      type: 'webhook',
      name: '',
      description: '',
      api_schema: {
        url: '',
        method: 'POST',
        request_body_schema: {
          type: 'object',
          properties: {},
          required: []
        }
      }
    };
    setSelectedTool(newTool);
    setIsCreatingTool(true);
  };

  const handleToolSave = (updatedTool: Tool) => {
    if (isCreatingTool) {
      setEditedForm(prev => ({
        ...prev,
        tools: [...(prev.tools || []), { ...updatedTool, method: 'POST' }]
      }));
      setIsCreatingTool(false);
    } else {
      const updatedTools = editedForm.tools.map(tool => 
        tool.name === selectedTool?.name ? { ...updatedTool, method: 'POST' } : tool
      );
      setEditedForm(prev => ({
        ...prev,
        tools: updatedTools
      }));
    }
    setSelectedTool(null);
    setHasChanges(true);
  };

  const handleVoiceChange = (voiceId: string) => {
    handleChange('voice_id', voiceId);
    const newVoice = voices.find((v) => v.voice_id === voiceId) || null;
    // Only update displayed voice when selecting in modal
    setVoice(newVoice);
  };

  const handleToolUpdate = (updatedTool: Tool) => {
    const updatedTools = editedForm.tools.map(tool => 
      tool.name === updatedTool.name ? updatedTool : tool
    );
    handleChange('tools', updatedTools);
  };

  if (loading) {
    return <PageLoader />;
  }

  if (!agent) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-2">
            Agent not found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The agent you're looking for doesn't exist or you don't have access
            to it.
          </p>
          <Link
            to="/dashboard/agents"
            className="inline-flex items-center text-primary hover:text-primary-600 dark:hover:text-primary-400"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Agents
          </Link>
        </div>
      </div>
    );
  }

  const { icon: Icon, color } = getAgentIcon(agent.agent_id);
  const colorClasses = {
    primary:
      'from-primary/20 to-primary/10 text-primary dark:from-primary/30 dark:to-primary/20',
    indigo: 'from-indigo-500/20 to-indigo-500/10 text-indigo-500',
    rose: 'from-rose-500/20 to-rose-500/10 text-rose-500',
    sky: 'from-sky-500/20 to-sky-500/10 text-sky-500',
    yellow: 'from-yellow-500/20 to-yellow-500/10 text-yellow-500',
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
      <div className="flex gap-8">
        <div className="flex-1">
          <div className="bg-white dark:bg-dark-200 rounded-xl shadow-sm border border-gray-100 dark:border-dark-100 overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-dark-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Link
                    to="/dashboard/agents"
                    className="p-2 text-gray-400 hover:text-primary dark:text-gray-500 dark:hover:text-primary-400 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-100 transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </Link>
                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <input
                        type="text"
                        value={editedForm.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        className="text-2xl font-heading font-bold text-gray-900 dark:text-white bg-transparent border-0 focus:ring-0 p-0 focus:border-0"
                      />
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Agent ID: {agent.agent_id}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-8">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-lg flex items-start space-x-3"
                >
                  <AlertCircle className="w-5 h-5 text-red-500 dark:text-red-400 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                      Error
                    </h3>
                    <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                      {error}
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-6">
                {/* Model Card */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setShowModelDropdown((prev) => !prev);
                  }}
                  className="p-4 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/5 relative cursor-pointer hover:from-primary/10 hover:to-primary/20 transition-all"
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <MessageSquare className="w-4 h-4 text-primary dark:text-primary-400" />
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                      Model
                    </h3>
                  </div>
                  {!showModelDropdown ? (
                    <p className="text-2xl font-heading font-bold text-primary dark:text-primary-400">
                      {editedForm.llm}
                    </p>
                  ) : (
                    <div className="mt-2" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={editedForm.llm}
                        onChange={(e) => handleChange('llm', e.target.value)}
                        className="rounded-lg border-2 border-primary bg-white dark:bg-dark-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary text-gray-900 dark:text-gray-100"
                      >
                        {llmOptions.map((model) => (
                          <option key={model} value={model}>
                            {model}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </button>

                {/* Voice Card */}
                <button
                  onClick={() => setShowVoiceModal(true)}
                  className="p-4 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/5 relative cursor-pointer hover:from-primary/10 hover:to-primary/20 transition-all"
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <Volume2 className="w-4 h-4 text-primary dark:text-primary-400" />
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                      Voice
                    </h3>
                  </div>
                  <p className="text-2xl font-heading font-bold text-primary dark:text-primary-400">
                    {voice?.name || 'Not Set'}
                  </p>
                </button>

                {/* Language Card */}
                <button
                  onClick={() => setShowLanguageDropdown((prev) => !prev)}
                  className="p-4 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/5 relative cursor-pointer hover:from-primary/10 hover:to-primary/20 transition-all"
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <Globe className="w-4 h-4 text-primary dark:text-primary-400" />
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                      Language
                    </h3>
                  </div>
                  {!showLanguageDropdown ? (
                    <p className="text-2xl font-heading font-bold text-primary dark:text-primary-400">
                      {getLanguageName(editedForm.language)}
                    </p>
                  ) : (
                    <div className="mt-2" onClick={(e) => e.stopPropagation()}>
                      <LanguageSelect
                        value={editedForm.language}
                        onChange={(value) => handleChange('language', value)}
                      />
                    </div>
                  )}
                </button>
              </div>

              {/* Voice Model Selection */}
              <div className="space-y-4 mt-6">
                <div className="flex items-center space-x-2">
                  <Settings className="w-4 h-4 text-primary dark:text-primary-400" />
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                    Voice Model
                  </h3>
                </div>
                <ModelSelect
                  modelType={editedForm.modelType}
                  onChange={(value) => handleChange('modelType', value)}
                />
              </div>

              {/* Temperature Slider */}
              <div className="space-y-4 mt-6">
                <div className="flex items-center space-x-2">
                  <Thermometer className="w-4 h-4 text-primary dark:text-primary-400" />
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                    Temperature ({editedForm.temperature})
                  </h3>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={editedForm.temperature}
                  onChange={(e) =>
                    handleChange('temperature', parseFloat(e.target.value))
                  }
                  className="w-full"
                />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Adjust creativity level: 0 for focused responses, 1 for more
                  creative outputs
                </p>
              </div>

              {/* First Message Section */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="w-5 h-5 text-primary dark:text-primary-400" />
                  <h3 className="text-lg font-heading font-medium text-gray-900 dark:text-white">
                    First Message
                  </h3>
                </div>
                <textarea
                  value={editedForm.first_message}
                  onChange={(e) =>
                    handleChange('first_message', e.target.value)
                  }
                  rows={2}
                  className="input"
                  placeholder="Enter the first message your agent will say..."
                />
              </div>

              {/* Prompt Section */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-primary dark:text-primary-400" />
                  <h3 className="text-lg font-heading font-medium text-gray-900 dark:text-white">
                    Prompt
                  </h3>
                </div>
                <textarea
                  value={editedForm.prompt}
                  onChange={(e) => handleChange('prompt', e.target.value)}
                  rows={6}
                  className="input"
                  placeholder="Enter the agent's behavior and instructions..."
                />
              </div>

              {/* Tools Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Webhook className="w-5 h-5 text-primary dark:text-primary-400" />
                    <h3 className="text-lg font-heading font-medium text-gray-900 dark:text-white">
                      Tools
                    </h3>
                  </div>
                  <button
                    onClick={handleCreateTool}
                    className="flex items-center space-x-2 px-3 py-1.5 text-sm font-lato font-semibold text-primary hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300 bg-primary-50/50 dark:bg-primary-400/10 rounded-lg transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Tool</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {editedForm.tools?.length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 dark:bg-dark-100 rounded-xl">
                      <Webhook className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        No tools configured
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Tools functionality coming soon
                      </p>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-200 dark:divide-dark-100">
                      {editedForm.tools.map((tool, index) => (
                        <div
                          key={index}
                          onClick={() => setSelectedTool(tool)}
                          className="py-4 first:pt-0 last:pb-0 hover:bg-gray-50 dark:hover:bg-dark-100 transition-colors rounded-lg cursor-pointer"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 dark:from-primary/30 dark:to-primary/20 flex items-center justify-center">
                                <Webhook className="w-5 h-5 text-primary dark:text-primary-400" />
                              </div>
                              <div>
                                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                                  {tool.name}
                                </h4>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                  {tool.description}
                                </p>
                              </div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Knowledge Base Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Database className="w-5 h-5 text-primary dark:text-primary-400" />
                    <h3 className="text-lg font-heading font-medium text-gray-900 dark:text-white">
                      Knowledge Base Documents
                    </h3>
                  </div>
                  <Link
                    to="/dashboard/knowledge"
                    className="text-sm text-primary hover:text-primary-600 dark:hover:text-primary-400"
                  >
                    Manage Documents
                  </Link>
                </div>

                {loadingKnowledgeBase ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader />
                  </div>
                ) : knowledgeBase.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 dark:bg-dark-100 rounded-xl">
                    <Database className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      No knowledge base documents found.
                    </p>
                    <Link
                      to="/dashboard/knowledge"
                      className="text-sm text-primary hover:text-primary-600 dark:hover:text-primary-400 mt-2 inline-block"
                    >
                      Add documents to knowledge base
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 rounded-lg">
                      <p className="text-sm text-blue-800 dark:text-blue-200">
                        Select documents to include in your agent's knowledge
                        base. The agent will use these documents to provide more
                        accurate and contextual responses.
                      </p>
                    </div>
                    <div className="pb-[300px]">
                      <KnowledgeBaseSelect
                        documents={knowledgeBase}
                        selectedDocuments={editedForm.knowledge_base.map(
                          (kb) => kb.id
                        )}
                        onSelectionChange={(selectedIds) => {
                          const selectedDocs = selectedIds.map((id) => {
                            const doc = knowledgeBase.find((kb) => kb.id === id);
                            return {
                              id: doc!.id,
                              name: doc!.name,
                              type: doc!.type,
                            };
                          });
                          handleChange('knowledge_base', selectedDocs);
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Call Testing Section */}
        <div className="w-96">
          {agent && <CallTesting agentId={agent.agent_id} />}
        </div>
      </div>

      {/* Voice Modal */}
      <VoiceModal
        isOpen={showVoiceModal}
        onClose={() => setShowVoiceModal(false)}
        voices={voices}
        selectedVoiceId={editedForm.voice_id}
        onVoiceChange={handleVoiceChange} />

      {/* Tool Configuration Modal */}
      {selectedTool && (
        <ToolConfigModal
          isOpen={!!selectedTool}
          onClose={() => {
            setSelectedTool(null);
            setIsCreatingTool(false);
          }}
          tool={selectedTool}
          onSave={handleToolSave} />
      )}

      {/* Sticky Save/Cancel Buttons */}
      <AnimatePresence>
        {hasChanges && !selectedTool && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed bottom-0 left-0 right-0 bg-white dark:bg-dark-200 border-t border-gray-200 dark:border-dark-100 shadow-lg z-50"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="py-4 flex justify-end space-x-4">
                <button onClick={handleCancel} className="btn btn-secondary">
                  <X className="w-4 h-4 mr-2" />
                  <span>Cancel</span>
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="btn btn-primary"
                >
                  {saving ? (
                    <>
                      <Loader />
                      <span className="ml-2">Saving...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AgentDetails;