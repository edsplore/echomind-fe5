import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  Zap,
  Brain,
  Shield,
  Sparkles,
  CheckCircle,
  Target,
  Clock,
  Settings,
  ChevronRight,
  Menu,
  X,
  Bot,
  MessageSquare,
  Headphones,
  BarChart
} from 'lucide-react';

const features = [
  {
    icon: Zap,
    title: 'Lightning-Fast Performance',
    description: 'Experience near-instant responses with our optimized AI engine',
    color: 'primary'
  },
  {
    icon: Brain,
    title: 'Advanced AI',
    description: 'State-of-the-art LLMs for human-like conversations',
    color: 'indigo'
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    description: 'Bank-grade encryption and compliance built-in',
    color: 'rose'
  }
];

// Updated wire paths for hexagonal layout
const wiresPaths = [
  "M500 250 L500 100", // Top
  "M500 400 L150 200", // Top Left
  "M500 400 L850 200", // Top Right
  "M500 400 L150 600", // Bottom Left
  "M500 400 L850 600", // Bottom Right
  "M500 400 L500 700"  // Bottom
];

const CursorGlow = () => {
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <motion.div
      animate={{
        x: cursorPos.x - 50,
        y: cursorPos.y - 50,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="fixed pointer-events-none z-[9999] w-24 h-24 rounded-full bg-primary opacity-30 blur-2xl"
    />
  );
};

const LandingPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { scrollY } = useScroll();
  const backgroundColor = useTransform(
    scrollY,
    [0, 100],
    ['rgba(24, 24, 27, 0)', 'rgba(24, 24, 27, 0.8)']
  );
  const borderOpacity = useTransform(scrollY, [0, 100], [0, 1]);

  return (
    <div className="min-h-screen bg-dark-300 text-white overflow-hidden relative">
      <CursorGlow />

      {/* Navbar */}
      <motion.nav
        className="fixed top-0 w-full z-50 backdrop-blur-sm"
        style={{
          backgroundColor,
          borderBottom: `1px solid rgba(255, 255, 255, ${borderOpacity.get() * 0.1})`
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center group-hover:shadow-lg group-hover:shadow-primary/20 transition-all duration-300">
                  <img src="/echomind-logo.png" alt="EchoMind" className="w-6 h-6" />
                </div>
                {/* Halo Effect */}
                <div className="absolute -inset-1 rounded-xl bg-primary/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <span className="text-xl font-lato font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent group-hover:from-primary group-hover:to-primary-400 transition-all duration-300">
                EchoMind
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/login" className="font-lato font-bold text-gray-300 hover:text-primary transition-colors">
                Login
              </Link>
              <Link
                to="/signup"
                className="font-lato font-bold px-4 py-2 rounded-lg bg-primary hover:bg-primary-600 text-white transition-all transform hover:scale-105 hover:shadow-lg hover:shadow-primary/20"
              >
                Get Started
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 text-gray-400 hover:text-white transition-colors"
            >
              {isOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{
            height: isOpen ? 'auto' : 0,
            opacity: isOpen ? 1 : 0,
          }}
          className="md:hidden overflow-hidden bg-dark-200/80 backdrop-blur-sm border-t border-white/10"
        >
          <div className="px-4 py-2 space-y-1">
            <Link
              to="/login"
              className="block w-full px-4 py-2 text-center font-lato font-bold text-gray-300 hover:text-primary transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="block w-full px-4 py-2 text-center font-lato font-bold text-white bg-primary hover:bg-primary-600 rounded-lg transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Get Started
            </Link>
          </div>
        </motion.div>
      </motion.nav>

      {/* HERO SECTION */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 -z-10">
          {/* Gradient orbs */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/30 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-pulse delay-1000" />
          
          {/* Animated lines */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
            <line
              x1="0"
              y1="0"
              x2="100"
              y2="100"
              stroke="rgba(132, 204, 22, 0.1)"
              strokeWidth="0.1"
              className="animate-[dash_3s_ease-in-out_infinite]"
            >
              <animate
                attributeName="stroke-dasharray"
                values="0,1000;1000,0"
                dur="4s"
                repeatCount="indefinite"
              />
            </line>
            <line
              x1="100"
              y1="0"
              x2="0"
              y2="100"
              stroke="rgba(132, 204, 22, 0.1)"
              strokeWidth="0.1"
              className="animate-[dash_3s_ease-in-out_infinite]"
            >
              <animate
                attributeName="stroke-dasharray"
                values="0,1000;1000,0"
                dur="4s"
                repeatCount="indefinite"
              />
            </line>
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 text-center relative">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center px-6 py-2 rounded-full bg-gradient-to-r from-primary/20 to-primary/5 border border-primary/20 mb-8 relative group"
          >
            <div className="absolute inset-0 rounded-full bg-primary/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <Sparkles className="w-5 h-5 text-primary mr-2 animate-pulse" />
            <span className="text-primary text-sm font-bold font-lato relative z-10">
              Revolutionize Customer Interaction
            </span>
          </motion.div>

          {/* Main Heading */}
          <div className="relative">
            <motion.h1 
              className="text-6xl md:text-8xl font-noto-sans font-bold tracking-tight relative z-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span className="block mb-4">Next-Gen</span>
              <span className="relative inline-block">
                <span className="absolute -inset-1 bg-primary/20 blur-2xl rounded-full" />
                <span className="relative text-primary">Voice AI</span>
              </span>
              <span className="block mt-4">for Your Business</span>
            </motion.h1>

            {/* Decorative elements */}
            <div className="absolute -top-8 -left-8 w-16 h-16 bg-primary/10 rounded-full blur-2xl animate-pulse" />
            <div className="absolute -bottom-8 -right-8 w-16 h-16 bg-primary/10 rounded-full blur-2xl animate-pulse delay-700" />
          </div>
          
          {/* Subheading with animated typing effect */}
          <motion.div
            className="mt-8 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <p className="text-2xl text-gray-400 max-w-3xl mx-auto font-lato leading-relaxed">
              Build advanced voice agents that interact naturally and deliver
              <span className="relative mx-2 inline-flex">
                <span className="absolute inset-0 bg-primary/10 blur rounded-lg" />
                <span className="relative text-primary font-bold">lightning-fast</span>
              </span>
              responses—deploy in minutes, scale infinitely.
            </p>
          </motion.div>

          {/* CTA Button */}
          <motion.div
            className="flex justify-center items-center gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Link
              to="/signup"
              className="group relative px-8 py-4 rounded-xl bg-gradient-to-r from-primary to-primary-600 text-white font-bold text-lg transition-all duration-300 overflow-hidden hover:shadow-2xl hover:shadow-primary/20 hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative flex items-center">
                <span>Get Started Free</span>
                <ChevronRight className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Stats */}
            <div className="hidden md:flex items-center gap-8 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-gray-400">10k+ Users</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse delay-300" />
                <span className="text-gray-400">99.9% Uptime</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse delay-700" />
                <span className="text-gray-400">24/7 Support</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* FEATURES SECTION */}
      <section className="py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
              <Sparkles className="w-4 h-4 text-primary mr-2" />
              <span className="text-primary text-sm font-semibold font-lato">Powerful Features</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold font-noto-sans mb-6">
              Why Choose{' '}
              <span className="bg-gradient-to-r from-primary to-primary-400 bg-clip-text text-transparent">
                EchoMind
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto font-lato">
              Experience the future of customer interaction with our cutting-edge AI solutions
            </p>
          </motion.div>
          
          <div className="relative aspect-[4/3] w-full">
            <svg
              className="absolute inset-0 w-full h-full -z-10"
              viewBox="0 0 1000 800"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                {wiresPaths.map((path, i) => (
                  <path key={i} id={`path${i}`} d={path} />
                ))}
                <circle id="dot" r="4" fill="#84cc16" filter="url(#glow)">
                  <animate
                    attributeName="opacity"
                    values="0.8;0.4;0.8"
                    dur="2s"
                    repeatCount="indefinite"
                  />
                </circle>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {wiresPaths.map((path, i) => (
                <path
                  key={i}
                  d={path}
                  stroke="rgba(132, 204, 22, 0.2)"
                  strokeWidth="1"
                />
              ))}

              {[0, 1, 2].map((set) => (
                wiresPaths.map((path, i) => (
                  <use href="#dot" key={`dot${set}-${i}`}>
                    <animateMotion
                      dur="3s"
                      begin={`${set}s`}
                      repeatCount="indefinite"
                      path={path}
                    />
                  </use>
                ))
              ))}
            </svg>

            {/* Center Logo */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="relative w-96 h-96">
                {/* Glowing Halo */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
                </div>

                {/* Logo Container */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-64 h-64 p-4">
                    <img 
                      src="/echomind-logo.png" 
                      alt="EchoMind" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
                  </div>
                </div>
              </div>
            </div>

            {/* Feature Boxes in Circular Layout - Positioned closer to center */}
            {/* Top */}
            <div className="absolute left-1/2 top-[8%] -translate-x-1/2 w-72">
              <FeatureBox
                icon={<Bot className="w-12 h-12 text-primary" />}
                text="Advanced Voice Recognition & Natural Language Processing"
              />
            </div>

            {/* Top Left */}
            <div className="absolute left-[8%] top-[25%] w-72">
              <FeatureBox
                icon={<MessageSquare className="w-12 h-12 text-primary" />}
                text="Multi-Channel Communication Support"
              />
            </div>

            {/* Top Right */}
            <div className="absolute right-[8%] top-[25%] w-72">
              <FeatureBox
                icon={<Headphones className="w-12 h-12 text-primary" />}
                text="24/7 Automated Customer Support"
              />
            </div>

            {/* Bottom Left */}
            <div className="absolute left-[8%] bottom-[25%] w-72">
              <FeatureBox
                icon={<BarChart className="w-12 h-12 text-primary" />}
                text="Real-Time Analytics & Insights"
              />
            </div>

            {/* Bottom Right */}
            <div className="absolute right-[8%] bottom-[25%] w-72">
              <FeatureBox
                icon={<Target className="w-12 h-12 text-primary" />}
                text="Personalized Customer Experience"
              />
            </div>

            {/* Bottom */}
            <div className="absolute left-1/2 bottom-[8%] -translate-x-1/2 w-72">
              <FeatureBox
                icon={<Clock className="w-12 h-12 text-primary" />}
                text="Seamless Integration & Quick Setup"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h2 className="text-4xl font-noto-sans font-bold mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto font-lato">
              Join thousands of businesses using EchoMind to transform their customer interactions
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block"
            >
              <Link
                to="/signup"
                className="group relative px-8 py-4 rounded-xl bg-primary hover:bg-primary-600 text-white font-semibold transition-all duration-300 overflow-hidden inline-flex items-center"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative flex items-center">
                  <span>Start Free Trial</span>
                  <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

const FeatureBox = ({ icon, text }: { icon: React.ReactNode; text: string }) => (
  <div className="flex flex-col items-center gap-5 group transform hover:scale-105 transition-all duration-300">
    <div className="bg-primary/10 p-8 rounded-3xl group-hover:bg-primary/20 transition-colors duration-300 shadow-lg shadow-primary/5">
      {icon}
    </div>
    <p className="text-base font-medium text-center font-lato group-hover:text-primary transition-colors duration-300">
      {text}
    </p>
  </div>
);

export default LandingPage;