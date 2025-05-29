
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Plus, 
  X, 
  Loader2, 
  Upload,
  FileText,
  AlertCircle,
  Search,
  Filter,
  ChevronDown,
  Clock,
  Play,
  Pause,
  CheckCircle2,
  XCircle,
  Calendar,
  Phone
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { cn } from '../../lib/utils';

interface Agent {
  agent_id: string;
  name: string;
}

interface BatchCallingJob {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  agent_id: string;
  agent_name: string;
  phone_number_id: string;
  phone_provider: string;
  total_calls_dispatched: number;
  total_calls_scheduled: number;
  created_at_unix: number;
  scheduled_time_unix?: number;
  last_updated_at_unix: number;
}

interface Recipient {
  phone_number: string;
}

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const BatchCalling = () => {
  const { user } = useAuth();
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [loadingAgents, setLoadingAgents] = useState(false);
  const [loadingPhoneNumbers, setLoadingPhoneNumbers] = useState(false);
  const [batchJobs, setBatchJobs] = useState<BatchCallingJob[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [phoneNumbers, setPhoneNumbers] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    agent_id: '',
    phone_number_id: '',
    scheduled_at: '',
    recipients: [] as Recipient[],
  });
  const [inputMethod, setInputMethod] = useState<'paste' | 'upload'>('paste');
  const [phoneNumbersText, setPhoneNumbersText] = useState('');
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [selectedPhoneColumn, setSelectedPhoneColumn] = useState<string>('');
  const [csvData, setCsvData] = useState<string[][]>([]);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'running' | 'completed' | 'failed'>('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const fetchAgents = async () => {
    if (!user) return;

    try {
      setLoadingAgents(true);
      const response = await fetch(`${BACKEND_URL}/agents/${user.uid}`, {
        headers: {
          Authorization: `Bearer ${await user.getIdToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch agents');
      }

      const data = await response.json();
      setAgents(data.agents);
    } catch (error) {
      console.error('Error fetching agents:', error);
    } finally {
      setLoadingAgents(false);
    }
  };

  const fetchPhoneNumbers = async () => {
    if (!user) return;

    try {
      setLoadingPhoneNumbers(true);
      const response = await fetch(`${BACKEND_URL}/phone-numbers/${user.uid}`, {
        headers: {
          Authorization: `Bearer ${await user.getIdToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch phone numbers');
      }

      const data = await response.json();
      setPhoneNumbers(data.filter((phone: any) => phone.assigned_agent));
    } catch (error) {
      console.error('Error fetching phone numbers:', error);
    } finally {
      setLoadingPhoneNumbers(false);
    }
  };

  const fetchBatchJobs = async () => {
    if (!user) return;

    try {
      setLoadingJobs(true);
      const response = await fetch('https://api.elevenlabs.io/v1/convai/batch-calling/workspace', {
        headers: {
          Authorization: `Bearer ${await user.getIdToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch batch calling jobs');
      }

      const data = await response.json();
      setBatchJobs(data.batch_calls || []);
    } catch (error) {
      console.error('Error fetching batch calling jobs:', error);
    } finally {
      setLoadingJobs(false);
    }
  };

  useEffect(() => {
    fetchBatchJobs();
    fetchAgents();
    fetchPhoneNumbers();
  }, [user]);

  const handleCreateBatchJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || formData.recipients.length === 0) return;

    try {
      setLoading(true);
      setError('');

      const requestBody = {
        user_id: user.uid,
        call_name: formData.name,
        agent_id: formData.agent_id,
        agent_phone_number_id: formData.phone_number_id,
        recipients: formData.recipients,
        scheduled_time_unix: formData.scheduled_at 
          ? Math.floor(new Date(formData.scheduled_at).getTime() / 1000)
          : null
      };

      const response = await fetch(`${BACKEND_URL}/batch-call`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${await user.getIdToken()}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error('Failed to create batch calling job');
      }

      setIsCreating(false);
      setFormData({
        name: '',
        agent_id: '',
        phone_number_id: '',
        scheduled_at: '',
        recipients: [],
      });
      setInputMethod('paste');
      setPhoneNumbersText('');
      setCsvFile(null);
      setCsvHeaders([]);
      setSelectedPhoneColumn('');
      setCsvData([]);

      await fetchBatchJobs();
    } catch (error) {
      console.error('Error creating batch calling job:', error);
      setError('Failed to create batch calling job. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'text/csv') {
      setCsvFile(file);
      setError('');

      // Parse CSV to extract headers and data
      const reader = new FileReader();
      reader.onload = (event) => {
        const csvText = event.target?.result as string;
        const lines = csvText.split('\n').filter(line => line.trim());

        if (lines.length > 0) {
          const headers = lines[0].split(',').map(header => header.trim().replace(/"/g, ''));
          setCsvHeaders(headers);

          const data = lines.slice(1).map(line => 
            line.split(',').map(cell => cell.trim().replace(/"/g, ''))
          );
          setCsvData(data);
        }
      };
      reader.readAsText(file);
    } else {
      setError('Please select a valid CSV file');
    }
  };

  const handleRemoveFile = () => {
    setCsvFile(null);
    setCsvHeaders([]);
    setCsvData([]);
    setSelectedPhoneColumn('');
    setFormData({ ...formData, recipients: [] });
    // Reset file input
    const fileInput = document.getElementById('csv_file') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handlePhoneColumnSelect = (columnName: string) => {
    setSelectedPhoneColumn(columnName);

    if (columnName && csvData.length > 0) {
      const columnIndex = csvHeaders.indexOf(columnName);
      if (columnIndex !== -1) {
        const recipients = csvData
          .map(row => row[columnIndex])
          .filter(phone => phone && phone.trim())
          .map(phone => ({ phone_number: phone.trim() }));

        setFormData({ ...formData, recipients });
      }
    }
  };

  const handlePhoneNumbersTextChange = (text: string) => {
    setPhoneNumbersText(text);

    // Parse phone numbers from text (split by newlines, commas, or spaces)
    const phoneNumbers = text
      .split(/[,\n\r\s]+/)
      .map(phone => phone.trim())
      .filter(phone => phone.length > 0)
      .map(phone => ({ phone_number: phone }));

    setFormData({ ...formData, recipients: phoneNumbers });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'running':
        return <Play className="w-4 h-4 text-blue-500" />;
      case 'completed':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-500/10 dark:text-yellow-400';
      case 'running':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-500/10 dark:text-blue-400';
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-500/10 dark:text-green-400';
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-500/10 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-500/10 dark:text-gray-400';
    }
  };

  const filteredJobs = batchJobs.filter((job) => {
    const matchesSearch = 
      job.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.agent_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || job.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-heading font-bold text-gray-900 dark:text-white">
            Batch Calling
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Create and manage batch calling campaigns
          </p>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="btn btn-primary"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Batch Campaign
        </button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white dark:bg-dark-200 rounded-xl shadow-sm border border-gray-100 dark:border-dark-100 p-4 mb-6">
        <div className="flex items-center space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search batch campaigns..."
              className="input input-with-icon pl-10"
            />
          </div>

          <div className="relative">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={cn(
                "flex items-center space-x-2 px-4 py-2.5 text-sm rounded-lg border transition-colors",
                filterStatus !== 'all'
                  ? 'border-primary bg-primary-50/50 text-primary dark:border-primary-400 dark:bg-primary-400/10 dark:text-primary-400'
                  : 'border-gray-200 dark:border-dark-100 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-dark-50'
              )}
            >
              <Filter className="w-4 h-4" />
              <span>
                {filterStatus === 'all' 
                  ? 'All Status' 
                  : filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1)}
              </span>
              <ChevronDown className="w-4 h-4" />
            </button>

            <AnimatePresence>
              {isFilterOpen && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-30"
                    onClick={() => setIsFilterOpen(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-48 bg-white dark:bg-dark-200 rounded-lg shadow-lg border border-gray-100 dark:border-dark-100 overflow-hidden z-40"
                  >
                    {['all', 'pending', 'running', 'completed', 'failed'].map((status) => (
                      <button
                        key={status}
                        onClick={() => {
                          setFilterStatus(status as any);
                          setIsFilterOpen(false);
                        }}
                        className={cn(
                          "w-full flex items-center space-x-2 px-4 py-2.5 text-sm transition-colors",
                          filterStatus === status
                            ? 'bg-primary-50/50 text-primary dark:bg-primary-400/10 dark:text-primary-400'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-100'
                        )}
                      >
                        {status !== 'all' && getStatusIcon(status)}
                        <span>{status === 'all' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}</span>
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Create Modal */}
      <AnimatePresence>
        {isCreating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white dark:bg-dark-200 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-auto"
            >
              <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-dark-100">
                <div className="flex items-center space-x-2">
                  <Users className="w-6 h-6 text-primary dark:text-primary-400" />
                  <h2 className="text-xl font-heading font-bold text-gray-900 dark:text-white">
                    Create Batch Campaign
                  </h2>
                </div>
                <button
                  onClick={() => setIsCreating(false)}
                  className="p-2 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6">
                <form onSubmit={handleCreateBatchJob} className="space-y-6">
                  {error && (
                    <div className="p-4 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-lg flex items-center space-x-2 text-red-600 dark:text-red-400">
                      <AlertCircle className="w-5 h-5 flex-shrink-0" />
                      <p className="text-sm">{error}</p>
                    </div>
                  )}

                  <div className="space-y-2">
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Campaign Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="Enter campaign name"
                      className="input"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="agent"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Agent
                    </label>
                    <select
                      id="agent"
                      value={formData.agent_id}
                      onChange={(e) =>
                        setFormData({ ...formData, agent_id: e.target.value })
                      }
                      className="input"
                      required
                    >
                      <option value="">Select an agent</option>
                      {agents.map((agent) => (
                        <option key={agent.agent_id} value={agent.agent_id}>
                          {agent.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="phone_number"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Phone Number
                    </label>
                    <select
                      id="phone_number"
                      value={formData.phone_number_id}
                      onChange={(e) =>
                        setFormData({ ...formData, phone_number_id: e.target.value })
                      }
                      className="input"
                      required
                    >
                      <option value="">Select a phone number</option>
                      {phoneNumbers.map((phone) => (
                        <option key={phone.phone_number_id} value={phone.phone_number_id}>
                          {phone.phone_number} - {phone.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Phone Numbers
                      </label>

                      {/* Input Method Selection */}
                      <div className="flex space-x-4 mb-4">
                        <label className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name="inputMethod"
                            value="paste"
                            checked={inputMethod === 'paste'}
                            onChange={(e) => {
                              setInputMethod('paste');
                              if (csvFile) {
                                handleRemoveFile();
                              }
                            }}
                            className="text-primary focus:ring-primary"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">Paste Numbers</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name="inputMethod"
                            value="upload"
                            checked={inputMethod === 'upload'}
                            onChange={(e) => {
                              setInputMethod('upload');
                              setPhoneNumbersText('');
                              setFormData({ ...formData, recipients: [] });
                            }}
                            className="text-primary focus:ring-primary"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">Upload CSV File</span>
                        </label>
                      </div>

                      {/* Paste Numbers Input */}
                      {inputMethod === 'paste' && (
                        <div className="space-y-2">
                          <textarea
                            value={phoneNumbersText}
                            onChange={(e) => handlePhoneNumbersTextChange(e.target.value)}
                            placeholder="Enter phone numbers (one per line or separated by commas)&#10;+1234567890&#10;+1987654321&#10;+1555123456"
                            className="input min-h-[120px] resize-y"
                            required={inputMethod === 'paste'}
                          />
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Enter phone numbers in E.164 format, separated by new lines, commas, or spaces
                          </p>
                        </div>
                      )}

                      {/* CSV File Upload */}
                      {inputMethod === 'upload' && (
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <div className="flex items-center space-x-4">
                              <input
                                type="file"
                                id="csv_file"
                                accept=".csv"
                                onChange={handleFileChange}
                                className="input"
                                required={inputMethod === 'upload'}
                              />
                              <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                                <FileText className="w-4 h-4" />
                                <span>CSV only</span>
                              </div>
                            </div>
                            {csvFile && (
                              <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-500/10 border border-green-100 dark:border-green-500/20 rounded-lg">
                                <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
                                  <FileText className="w-4 h-4" />
                                  <span className="text-sm font-medium">File selected: {csvFile.name}</span>
                                </div>
                                <button
                                  type="button"
                                  onClick={handleRemoveFile}
                                  className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            )}
                          </div>

                          {csvHeaders.length > 0 && (
                            <div className="space-y-2">
                              <label
                                htmlFor="phone_column"
                                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                              >
                                Select Phone Number Column
                              </label>
                              <select
                                id="phone_column"
                                value={selectedPhoneColumn}
                                onChange={(e) => handlePhoneColumnSelect(e.target.value)}
                                className="input"
                                required={csvHeaders.length > 0}
                              >
                                <option value="">Choose column containing phone numbers</option>
                                {csvHeaders.map((header) => (
                                  <option key={header} value={header}>
                                    {header}
                                  </option>
                                ))}
                              </select>
                              {selectedPhoneColumn && formData.recipients.length > 0 && (
                                <p className="text-sm text-green-600 dark:text-green-400">
                                  Found {formData.recipients.length} phone numbers
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Phone Numbers Preview */}
                      {formData.recipients.length > 0 && (
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Phone Numbers Preview ({formData.recipients.length} total)
                          </label>
                          <div className="max-h-32 overflow-y-auto p-3 bg-gray-50 dark:bg-dark-100 rounded-lg border">
                            <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                              {formData.recipients.slice(0, 10).map((recipient, index) => (
                                <div key={index} className="font-mono">{recipient.phone_number}</div>
                              ))}
                              {formData.recipients.length > 10 && (
                                <div className="text-gray-500 dark:text-gray-400 italic">
                                  ...and {formData.recipients.length - 10} more
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="scheduled_at"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Schedule (Optional)
                    </label>
                    <input
                      type="datetime-local"
                      id="scheduled_at"
                      value={formData.scheduled_at}
                      onChange={(e) =>
                        setFormData({ ...formData, scheduled_at: e.target.value })
                      }
                      className="input"
                    />
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Leave empty to start immediately
                    </p>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-dark-100">
                    <button
                      type="button"
                      onClick={() => setIsCreating(false)}
                      className="btn btn-secondary"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn btn-primary"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        'Create Campaign'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Batch Jobs List */}
      <div className="bg-white dark:bg-dark-200 rounded-xl shadow-sm border border-gray-100 dark:border-dark-100 overflow-hidden">
        {loadingJobs ? (
          <div className="p-8 flex justify-center items-center">
            <Loader2 className="w-6 h-6 animate-spin text-primary dark:text-primary-400" />
            <span className="ml-2 text-gray-600 dark:text-gray-400">Loading campaigns...</span>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="p-8 text-center">
            <Users className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
            <h3 className="text-lg font-heading font-medium text-gray-900 dark:text-white mb-2">
              {searchQuery || filterStatus !== 'all'
                ? 'No matching campaigns found'
                : 'No batch campaigns yet'}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              {searchQuery || filterStatus !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Create your first batch calling campaign to reach multiple contacts'}
            </p>
            {!searchQuery && filterStatus === 'all' && (
              <button
                onClick={() => setIsCreating(true)}
                className="btn btn-outline"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Campaign
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-dark-100">
            {filteredJobs.map((job) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 hover:bg-gray-50 dark:hover:bg-dark-100 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 dark:from-primary/30 dark:to-primary/20 flex items-center justify-center">
                        <Users className="w-6 h-6 text-primary dark:text-primary-400" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-heading font-medium text-gray-900 dark:text-white mb-1">
                        {job.name}
                      </h3>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                            Agent:
                          </span>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {job.agent_name}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Phone className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {job.phone_provider}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {new Date(job.created_at_unix * 1000).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className={cn(
                      "flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium",
                      getStatusColor(job.status)
                    )}>
                      {getStatusIcon(job.status)}
                      <span>{job.status.charAt(0).toUpperCase() + job.status.slice(1)}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {job.total_calls_dispatched}/{job.total_calls_scheduled} calls
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Dispatched: {job.total_calls_dispatched}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BatchCalling;
