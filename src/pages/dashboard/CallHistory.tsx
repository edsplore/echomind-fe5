
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot,
  Clock,
  MessageSquare,
  X,
  Play,
  Pause,
  Download,
  CheckCircle2,
  XCircle,
  HelpCircle,
  BarChart,
  Filter,
  Search,
  Activity,
  User,
  ChevronDown,
  Volume2,
  Phone,
  Calendar,
  Plus,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { Loader, PageLoader } from "../../components/Loader";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Conversation {
  agent_id: string;
  agent_name: string;
  conversation_id: string;
  start_time_unix_secs: number;
  call_duration_secs: number;
  message_count: number;
  status: string;
  call_successful: string;
}

interface ConversationDetails {
  conversation: {
    agent_id: string;
    conversation_id: string;
    status: string;
    transcript: {
      role: string;
      message: string;
      time_in_call_secs: number;
    }[];
    metadata: {
      start_time_unix_secs: number;
      call_duration_secs: number;
    };
    analysis: {
      call_successful: string;
      transcript_summary: string;
    };
  };
  audio: string;
}

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const statusOptions = [
  { value: "", label: "All Status", icon: Filter },
  { value: "success", label: "Successful", icon: CheckCircle2 },
  { value: "failed", label: "Error", icon: XCircle },
  { value: "unknown", label: "Unknown", icon: HelpCircle },
];

const CallHistory = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<
    string | null
  >(null);
  const [conversationDetails, setConversationDetails] =
    useState<ConversationDetails | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const fetchConversations = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const response = await fetch(`${BACKEND_URL}/list-conversations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await user.getIdToken()}`,
        },
        body: JSON.stringify({
          user_id: user.uid,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch conversations");
      }

      const data = await response.json();
      setConversations(data.conversations);
    } catch (error) {
      console.error("Error fetching conversations:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchConversationDetails = async (conversationId: string) => {
    if (!user) return;

    try {
      setLoadingDetails(true);
      const response = await fetch(
        `${BACKEND_URL}/get-conversation/${conversationId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${await user.getIdToken()}`,
          },
          body: JSON.stringify({
            user_id: user.uid,
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch conversation details");
      }

      const data = await response.json();
      setConversationDetails(data);

      // Create audio element with time update handling
      if (data.audio) {
        const newAudio = new Audio(`data:audio/wav;base64,${data.audio}`);
        newAudio.addEventListener("loadedmetadata", () => {
          setDuration(newAudio.duration);
        });
        newAudio.addEventListener("timeupdate", () => {
          setCurrentTime(newAudio.currentTime);
        });
        newAudio.addEventListener("ended", () => {
          setIsPlaying(false);
          setCurrentTime(0);
        });
        setAudio(newAudio);
      }
    } catch (error) {
      console.error("Error fetching conversation details:", error);
    } finally {
      setLoadingDetails(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, [user]);

  useEffect(() => {
    if (selectedConversation) {
      fetchConversationDetails(selectedConversation);
    } else {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
        setAudio(null);
        setIsPlaying(false);
        setCurrentTime(0);
        setDuration(0);
      }
    }
  }, [selectedConversation]);

  const handlePlayAudio = () => {
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play();
      setIsPlaying(true);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audio) return;
    const time = Number(e.target.value);
    audio.currentTime = time;
    setCurrentTime(time);
  };

  const handleDownloadAudio = () => {
    if (!conversationDetails?.audio) return;

    const link = document.createElement("a");
    link.href = `data:audio/wav;base64,${conversationDetails.audio}`;
    link.download = `conversation-${selectedConversation}.wav`;
    link.click();
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400">
            Successful
          </span>
        );
      case "unknown":
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400">
            Unknown
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">
            Error
          </span>
        );
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const filteredConversations = conversations.filter((conversation) => {
    const matchesSearch = conversation.agent_name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesFilter =
      !filterStatus || conversation.call_successful === filterStatus;
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return <PageLoader />;
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-white dark:bg-dark-200 rounded-xl shadow-sm border border-gray-100 dark:border-dark-100 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-heading font-bold text-gray-900 dark:text-white">
              Call History
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              View and analyze your conversation history
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-gray-50 dark:bg-dark-100 px-4 py-2 rounded-lg">
              <BarChart className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {conversations.length} Total Calls
              </span>
            </div>
          </div>
        </div>

        {/* Filter Tags */}
        <div className="mt-6 flex items-center space-x-2 flex-wrap">
          <button className="flex items-center space-x-1 px-3 py-1.5 text-sm bg-gray-100 dark:bg-dark-100 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-dark-50 transition-colors">
            <Plus className="w-3 h-3" />
            <span>Date After</span>
          </button>
          <button className="flex items-center space-x-1 px-3 py-1.5 text-sm bg-gray-100 dark:bg-dark-100 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-dark-50 transition-colors">
            <Plus className="w-3 h-3" />
            <span>Date Before</span>
          </button>
          <button className="flex items-center space-x-1 px-3 py-1.5 text-sm bg-gray-100 dark:bg-dark-100 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-dark-50 transition-colors">
            <Plus className="w-3 h-3" />
            <span>Evaluation</span>
          </button>
          <button className="flex items-center space-x-1 px-3 py-1.5 text-sm bg-gray-100 dark:bg-dark-100 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-dark-50 transition-colors">
            <Plus className="w-3 h-3" />
            <span>Agent</span>
          </button>
        </div>

        {/* Search and Filter */}
        <div className="mt-4 flex items-center space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search conversations..."
              className="input input-with-icon pl-10"
            />
          </div>

          <div className="relative">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex items-center space-x-2 px-4 py-2.5 text-sm rounded-lg border transition-colors ${
                filterStatus
                  ? "border-primary bg-primary-50/50 text-primary dark:border-primary-400 dark:bg-primary-400/10 dark:text-primary-400"
                  : "border-gray-200 dark:border-dark-100 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-dark-50"
              }`}
            >
              <Filter className="w-4 h-4" />
              <span>
                {filterStatus
                  ? statusOptions.find((s) => s.value === filterStatus)?.label
                  : "Filter Status"}
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
                    {statusOptions.map((option) => {
                      const Icon = option.icon;
                      return (
                        <button
                          key={option.value}
                          onClick={() => {
                            setFilterStatus(option.value || null);
                            setIsFilterOpen(false);
                          }}
                          className={`w-full flex items-center space-x-2 px-4 py-2.5 text-sm transition-colors ${
                            filterStatus === option.value
                              ? "bg-primary-50/50 text-primary dark:bg-primary-400/10 dark:text-primary-400"
                              : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-100"
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          <span>{option.label}</span>
                        </button>
                      );
                    })}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-dark-200 rounded-xl shadow-sm border border-gray-100 dark:border-dark-100 overflow-hidden">
        {filteredConversations.length === 0 ? (
          <div className="p-8 text-center">
            <MessageSquare className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-heading font-medium text-gray-900 dark:text-white mb-2">
              No conversations found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {searchQuery || filterStatus
                ? "Try adjusting your search or filters"
                : "Start a conversation with one of your agents to see the history here"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-dark-100 border-b border-gray-200 dark:border-dark-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>Date</span>
                      <ChevronDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Agent
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Messages
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Evaluation result
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-dark-100">
                {filteredConversations.map((conversation) => (
                  <motion.tr
                    key={conversation.conversation_id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={() =>
                      setSelectedConversation(conversation.conversation_id)
                    }
                    className="hover:bg-gray-50 dark:hover:bg-dark-100 transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {formatDate(conversation.start_time_unix_secs)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {conversation.agent_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {formatDuration(conversation.call_duration_secs)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {conversation.message_count}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(conversation.call_successful)}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Conversation Details Sidebar */}
      <AnimatePresence>
        {selectedConversation && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm z-40"
              onClick={() => setSelectedConversation(null)}
            />

            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 w-[600px] h-full bg-white dark:bg-dark-200 shadow-2xl flex flex-col z-50 pb-24"
            >
              {/* Header */}
              <div className="flex-shrink-0 border-b border-gray-200 dark:border-dark-100">
                <div className="p-6 flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 dark:from-primary/30 dark:to-primary/20 flex items-center justify-center">
                      <MessageSquare className="w-5 h-5 text-primary dark:text-primary-400" />
                    </div>
                    <div>
                      <h2 className="text-xl font-heading font-bold text-gray-900 dark:text-white">
                        Conversation Details
                      </h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        View transcript and analytics
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedConversation(null)}
                    className="p-2 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-100 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Content - Scrollable Area */}
              <div className="flex-1 overflow-y-auto">
                {loadingDetails ? (
                  <div className="p-8 flex justify-center items-center">
                    <Loader />
                  </div>
                ) : conversationDetails ? (
                  <div className="p-6 space-y-6">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-4">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="p-4 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/5"
                      >
                        <div className="flex items-center space-x-2 mb-2">
                          <Clock className="w-4 h-4 text-primary dark:text-primary-400" />
                          <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                            Duration
                          </span>
                        </div>
                        <p className="text-2xl font-heading font-bold text-primary dark:text-primary-400">
                          {formatDuration(
                            conversationDetails.conversation.metadata
                              .call_duration_secs,
                          )}
                        </p>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="p-4 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/5"
                      >
                        <div className="flex items-center space-x-2 mb-2">
                          <Activity className="w-4 h-4 text-primary dark:text-primary-400" />
                          <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                            Messages
                          </span>
                        </div>
                        <p className="text-2xl font-heading font-bold text-primary dark:text-primary-400">
                          {conversationDetails.conversation.transcript.length}
                        </p>
                      </motion.div>
                    </div>

                    {/* Audio Controls */}
                    {conversationDetails.audio && (
                      <div className="bg-gray-50 dark:bg-dark-100 rounded-xl overflow-hidden">
                        <div className="p-4 border-b border-gray-200 dark:border-dark-100">
                          <div className="flex items-center space-x-2">
                            <Volume2 className="w-4 h-4 text-primary dark:text-primary-400" />
                            <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                              Call Recording
                            </h3>
                          </div>
                        </div>
                        <div className="p-4 space-y-4">
                          <div className="flex items-center space-x-4">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={handlePlayAudio}
                              className="w-12 h-12 rounded-full bg-white dark:bg-dark-200 shadow-lg flex items-center justify-center text-primary dark:text-primary-400 hover:text-primary-600 dark:hover:text-primary-300 transition-colors"
                            >
                              {isPlaying ? (
                                <Pause className="w-6 h-6" />
                              ) : (
                                <Play className="w-6 h-6" />
                              )}
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={handleDownloadAudio}
                              className="w-12 h-12 rounded-full bg-white dark:bg-dark-200 shadow-lg flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary-400 transition-colors"
                            >
                              <Download className="w-6 h-6" />
                            </motion.button>
                          </div>
                          <div className="space-y-2">
                            <input
                              type="range"
                              min="0"
                              max={duration}
                              value={currentTime}
                              onChange={handleSeek}
                              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-dark-200"
                            />
                            <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                              <span>{formatDuration(currentTime)}</span>
                              <span>{formatDuration(duration)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Summary */}
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <MessageSquare className="w-4 h-4 text-primary dark:text-primary-400" />
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                          Summary
                        </h3>
                      </div>
                      <div className="p-4 bg-gray-50 dark:bg-dark-100 rounded-xl border border-gray-200 dark:border-dark-100">
                        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                          {
                            conversationDetails.conversation.analysis
                              .transcript_summary
                          }
                        </p>
                      </div>
                    </div>

                    {/* Transcript */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <MessageSquare className="w-4 h-4 text-primary dark:text-primary-400" />
                          <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                            Transcript
                          </h3>
                        </div>
                      </div>

                      {/* Transcript Messages */}
                      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-4">
                        {conversationDetails.conversation.transcript.map(
                          (message, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.1 * index }}
                              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                            >
                              <div className="flex items-end space-x-2 max-w-[80%]">
                                {message.role !== "user" && (
                                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 dark:from-primary/30 dark:to-primary/20 flex items-center justify-center flex-shrink-0">
                                    <Phone className="w-4 h-4 text-primary dark:text-primary-400" />
                                  </div>
                                )}

                                <motion.div
                                  whileHover={{ scale: 1.02 }}
                                  className={`relative group rounded-2xl p-4 ${
                                    message.role === "user"
                                      ? "bg-gradient-to-br from-primary to-primary-600 text-white"
                                      : "bg-gray-100 dark:bg-dark-100 text-gray-900 dark:text-white"
                                  }`}
                                >
                                  {/* Message Header */}
                                  <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center space-x-2">
                                      <span className="text-xs font-bold opacity-80">
                                        {message.role === "user"
                                          ? "You"
                                          : "Agent"}
                                      </span>
                                    </div>
                                    <div className="flex items-center space-x-1 text-xs opacity-60">
                                      <Clock className="w-3 h-3" />
                                      <span>
                                        {formatDuration(
                                          message.time_in_call_secs,
                                        )}
                                      </span>
                                    </div>
                                  </div>

                                  {/* Message Content */}
                                  <p className="text-sm leading-relaxed font-medium">
                                    {message.message}
                                  </p>
                                </motion.div>

                                {message.role === "user" && (
                                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 dark:from-primary/30 dark:to-primary/20 flex items-center justify-center flex-shrink-0">
                                    <User className="w-4 h-4 text-primary dark:text-primary-400" />
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          ),
                        )}
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CallHistory;
