
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Sparkles,
  ChevronRight,
  Bell,
  Filter,
  BrainCircuit,
  Radio,
  ChevronDown,
  Check,
  Moon,
  Sun,
  Crown
} from 'lucide-react';
import Sidebar from './Components/Sidebar';
import IdeaCard from './Components/IdeaCard';
import AILab from './Components/AiLab';
import LiveAssistant from './Components/LiveAssistant';
import Chatbot from './Components/Chatbot';
import Profile from './Components/Profile';
import EditProfile from './Components/EditProfile';
import Signup from './Components/Signup';
import Login from './Components/Login';
import SubscriptionModal from './Components/SubscriptionModal';
import KnowledgeCursor from './Components/KnowledgeCursor';
import { MOCK_IDEAS, SEARCH_SUGGESTIONS } from './Data';
import { Category, IdeaItem, User, Popularity, SortOption } from './types';

type PageState = 'landing' | 'login' | 'signup' | 'dashboard' | 'profile' | 'edit-profile';

// Premium transition configuration - Fluid and Elegant
const pageTransition = {
  type: "tween",
  ease: [0.25, 0.1, 0.25, 1],
  duration: 0.4
};

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<PageState>('landing');
  const [activeCategory, setActiveCategory] = useState<Category>('Trending');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('views');
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isOrbExpanded, setIsOrbExpanded] = useState(false);

  // Timer & Subscription State
  const [sessionTime, setSessionTime] = useState(0);
  const [showPaywall, setShowPaywall] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<{ id: string, text: string, type: string }[]>([]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (currentUser?.subscriptionStatus === 'Free' && (activeCategory === 'AI Lab' || activeCategory === 'Live Assistant')) {
      interval = setInterval(() => {
        setSessionTime(prev => {
          if (prev >= 1800) { // 30 mins = 1800 seconds
            setShowPaywall(true);
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      setSessionTime(0);
      setShowPaywall(false);
    }

    return () => clearInterval(interval);
  }, [activeCategory, currentUser]);

  useEffect(() => {
    if (currentUser) {
      // Generate mock notifications based on interests
      const interestNotifs = (currentUser.interestedTopics || []).map(topic => ({
        id: `int-${topic}`,
        text: `New trending research in ${topic}`,
        type: 'interest'
      }));

      const generalNotifs = [
        { id: '1', text: 'Welcome to KhojVerse! Complete your profile.', type: 'system' }
      ];

      setNotifications([...generalNotifs, ...interestNotifs]);
    }
  }, [currentUser]);

  const handleUpgrade = () => {
    if (currentUser) {
      setCurrentUser({ ...currentUser, subscriptionStatus: 'Pro' });
      setShowPaywall(false);
    }
  };

  const popularityScore: Record<Popularity, number> = {
    [Popularity.High]: 3,
    [Popularity.Medium]: 2,
    [Popularity.Low]: 1
  };

  const filteredIdeas = MOCK_IDEAS.filter(idea => {
    const matchesCategory = (['Trending', 'AI Lab', 'Live Assistant'] as Category[]).includes(activeCategory) ? true : idea.category === activeCategory;
    const matchesSearch = idea.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      idea.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  }).sort((a, b) => {
    if (sortBy === 'views') return b.views - a.views;
    if (sortBy === 'popularity') return popularityScore[b.popularity] - popularityScore[a.popularity];
    if (sortBy === 'new') return b.id.localeCompare(a.id);
    if (sortBy === 'trending') return b.views * (popularityScore[b.popularity] / 2) - a.views * (popularityScore[a.popularity] / 2);
    return 0;
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentUser({
      name: 'Anisha',
      username: 'anisha_dev',
      email: 'anisha@khojverse.io',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80',
      coverImage: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
      bio: 'Computer Science student passionate about AI and Cyber Security. Building the future of ed-tech.',
      institution: 'Indian Institute of Technology, Bombay',
      course: 'B.Tech Computer Science',
      branch: 'CSE',
      semester: '6th Semester',
      cgpa: 9.2,
      skills: ['React', 'TypeScript', 'Python', 'Machine Learning', 'UI/UX Design'],
      level: 12,
      rank: 'Expert',
      streak: 45,
      followers: 1250,
      following: 89,
      socialLinks: {
        github: 'https://github.com/anisha',
        website: 'https://anisha.dev'
      },
      badges: [
        { id: '1', title: 'Top Contributor', icon: '🏆', date: '2025-10-15' },
        { id: '2', title: 'Code Master', icon: '⚡', date: '2025-11-20' },
        { id: '3', title: 'Bug Hunter', icon: '🐞', date: '2025-12-05' },
        { id: '4', title: 'Hackathon Winner', icon: '🚀', date: '2026-01-10' }
      ],
      projects: [
        {
          id: '1',
          title: 'AI Study Assistant',
          description: 'A personalized study companion that uses Gemini to generate quizzes and summaries from lecture notes.',
          tags: ['AI', 'React', 'Education'],
          image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
        },
        {
          id: '2',
          title: 'EcoTrack',
          description: 'Mobile application to track carbon footprint and suggest eco-friendly lifestyle changes.',
          tags: ['Mobile', 'Flutter', 'Green Tech'],
          image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
        }
      ],
      recentActivity: [
        { id: '1', type: 'project', content: 'published a new project "AI Study Assistant"', time: '2 hours ago' },
        { id: '2', type: 'achievement', content: 'earned the "Hackathon Winner" badge', time: '1 day ago' },
        { id: '3', type: 'post', content: 'shared a resource on React Patterns', time: '3 days ago' },
      ],
      subscriptionStatus: 'Pro',
      interestedTopics: ['Technology', 'AI'],
      credits: 500
    });
    setCurrentPage('dashboard');
  };

  const handleSearchSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
    setCurrentPage('dashboard');
    setActiveCategory('Trending');
  };

  const sortOptions: { value: SortOption, label: string }[] = [
    { value: 'views', label: 'Most Viewed' },
    { value: 'popularity', label: 'Popularity (Level)' },
    { value: 'trending', label: 'Trending Today' },
    { value: 'new', label: 'New Ideas' }
  ];

  const renderContent = () => {
    switch (currentPage) {
      case 'landing':
        return (
          <motion.div
            key="landing"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={pageTransition}
            className="flex flex-col items-center justify-center min-h-screen p-4 relative z-50 w-full"
          >
            {/* Theme Toggle */}
            <div className="absolute top-8 right-8">
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-3 rounded-full glass border border-white/20 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:scale-110 active:scale-90 transition-all shadow-xl"
              >
                {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
              </button>
            </div>

            {/* Title Section */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="text-center mb-16"
            >
              <div className="relative inline-block">
                <h1 className="text-6xl font-bold tracking-tighter text-gray-900 dark:text-white select-none relative z-10">
                  Khoj<span className="text-teal-500">Verse</span>
                </h1>
                <div className="absolute inset-0 blur-2xl bg-teal-400/20 dark:bg-teal-500/10 rounded-full scale-125 -z-10" />
              </div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-lg text-gray-500 dark:text-gray-400 font-light mt-3 tracking-[0.15em] uppercase"
              >
                Explore the Multiverse of Ideas
              </motion.p>
            </motion.div>

            <div className="relative flex flex-col items-center justify-center w-full max-w-2xl">
              {!isOrbExpanded ? (
                <motion.button
                  layoutId="orb"
                  onClick={() => setIsOrbExpanded(true)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-24 h-24 rounded-full bg-gradient-to-br from-teal-300 to-teal-600 dark:from-teal-400 dark:to-teal-700 flex items-center justify-center text-white shadow-[0_0_50px_rgba(20,184,166,0.5)] dark:shadow-[0_0_80px_rgba(20,184,166,0.3)] relative group overflow-hidden"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"
                  />
                  <Sparkles size={32} className="relative z-10 group-hover:rotate-12 transition-transform" />
                  <div className="absolute inset-0 rounded-full border-2 border-white/30 scale-110 animate-ping opacity-20" />
                </motion.button>
              ) : (
                <motion.div
                  layoutId="orb"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-full max-w-lg bg-white/20 dark:bg-black/20 backdrop-blur-2xl rounded-[32px] p-6 border border-white/60 dark:border-white/5 shadow-2xl relative overflow-hidden"
                >
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (searchQuery.trim()) {
                        setIsOrbExpanded(false);
                        setCurrentPage('login');
                      }
                    }}
                    className="relative group mb-6"
                  >
                    <div className="flex items-center glass rounded-xl px-5 py-3 border border-white/40 dark:border-white/5 group-focus-within:ring-2 ring-teal-500/50 transition-all">
                      <Search className="text-teal-500 mr-3" size={20} />
                      <input
                        autoFocus
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="What do you want to explore?"
                        className="bg-transparent border-none outline-none w-full text-lg text-gray-800 dark:text-white placeholder:text-gray-400 font-medium"
                      />
                    </div>
                  </form>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => {
                        setIsOrbExpanded(false);
                        setCurrentPage('login');
                      }}
                      className="flex-1 py-3.5 bg-teal-500 text-white rounded-xl font-bold text-base hover:bg-teal-600 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-teal-500/20"
                    >
                      Log In
                    </button>
                    <button
                      onClick={() => {
                        setIsOrbExpanded(false);
                        setCurrentPage('signup');
                      }}
                      className="flex-1 py-3.5 glass text-gray-700 dark:text-white rounded-xl font-bold text-base hover:bg-white/40 dark:hover:bg-white/10 hover:scale-[1.02] active:scale-95 transition-all border border-white/60 dark:border-white/10"
                    >
                      Sign Up
                    </button>
                  </div>

                  <button
                    onClick={() => setIsOrbExpanded(false)}
                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors"
                  >
                    <Check size={20} className="rotate-45" />
                    <span className="sr-only">Close</span>
                  </button>
                </motion.div>
              )}
            </div>


          </motion.div>
        );

      case 'login':
        return (
          <motion.div
            key="login"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={pageTransition}
            className="min-h-screen w-full flex items-center justify-center relative z-[100] bg-[#f7f9fb] dark:bg-[#0a0b1e]"
          >
            <Login
              onLogin={handleLogin}
              onSignupClick={() => setCurrentPage('signup')}
              onBackClick={() => {
                setCurrentPage('landing');
                setIsOrbExpanded(false);
              }}
            />
          </motion.div>
        );

      case 'signup':
        return (
          <motion.div
            key="signup"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={pageTransition}
            className="min-h-screen w-full flex items-center justify-center relative z-[100] bg-[#f7f9fb] dark:bg-[#0a0b1e]"
          >
            <Signup
              onSignup={(user) => {
                setCurrentUser(user);
                setCurrentPage('dashboard');
              }}
              onLoginClick={() => setCurrentPage('login')}
            />
          </motion.div>
        );

      case 'dashboard':
      case 'profile':
      case 'edit-profile':
        return (
          <motion.div
            key="app-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={pageTransition}
            className="flex flex-col min-h-screen w-full bg-[#f7f9fb] dark:bg-[#0a0b1e]"
          >
            {/* Header */}
            <header className="glass sticky top-0 z-[60] px-8 py-4 flex items-center justify-between border-b border-white/50 dark:border-white/5 backdrop-blur-md">
              <div
                className="flex items-center gap-2 cursor-pointer group"
                onClick={() => setCurrentPage('landing')}
              >
                <div className="w-10 h-10 rounded-xl bg-teal-500 flex items-center justify-center text-white shadow-lg shadow-teal-200 dark:shadow-teal-900/50 group-hover:rotate-12 transition-transform">
                  <Sparkles size={20} />
                </div>
                <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">KhojVerse</h1>
              </div>

              <Chatbot />

              <div className="flex-grow max-w-xl mx-12 hidden md:block">
                <div className="glass rounded-2xl px-5 py-2.5 flex items-center gap-3 border-none ring-1 ring-gray-100 dark:ring-white/10 focus-within:ring-2 ring-teal-200 dark:ring-teal-800 transition-all">
                  <Search className="text-gray-400" size={18} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search ideas, topics, researchers..."
                    className="bg-transparent border-none outline-none w-full text-sm text-gray-700 dark:text-gray-200"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4 lg:gap-6">
                <button
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className="p-2.5 rounded-xl glass border border-white/20 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:bg-white/40 dark:hover:bg-white/10 transition-all"
                >
                  {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                </button>
                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="text-gray-400 dark:text-gray-500 hover:text-teal-500 dark:hover:text-teal-400 relative transition-colors"
                  >
                    <Bell size={22} />
                    {notifications.length > 0 && (
                      <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-400 rounded-full border-2 border-white dark:border-slate-900"></span>
                    )}
                  </button>

                  <AnimatePresence>
                    {showNotifications && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full right-0 mt-4 w-80 glass rounded-2xl p-4 shadow-2xl border border-white/60 dark:border-white/10 z-[80]"
                      >
                        <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-100 dark:border-white/5">
                          <h4 className="font-semibold text-gray-800 dark:text-white">Notifications</h4>
                          <span className="text-xs text-teal-500 font-medium cursor-pointer">Mark all read</span>
                        </div>
                        <div className="space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar">
                          {notifications.map(n => (
                            <div key={n.id} className="flex gap-3 items-start p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                              <div className="w-2 h-2 mt-2 rounded-full bg-teal-500 shrink-0" />
                              <p className="text-sm text-gray-600 dark:text-gray-300 leading-tight">{n.text}</p>
                            </div>
                          ))}
                          {notifications.length === 0 && (
                            <p className="text-center text-sm text-gray-400 py-4">No new notifications</p>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="flex items-center gap-3 pl-6 border-l border-gray-200 dark:border-gray-800">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-bold text-gray-800 dark:text-white">{currentUser?.name || 'Explorer'}</p>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">{currentUser?.subscriptionStatus || 'Free'} Plan</p>
                  </div>
                  <div
                    className="w-10 h-10 rounded-full border-2 border-teal-200 dark:border-teal-800 p-0.5 relative cursor-pointer hover:border-teal-400 transition-colors"
                    onClick={() => setCurrentPage('profile')}
                  >
                    <img
                      src={currentUser?.avatar || 'https://picsum.photos/seed/anon/100/100'}
                      alt="avatar"
                      className="w-full h-full rounded-full object-cover"
                    />
                    {currentUser?.subscriptionStatus === 'Pro' && (
                      <div className="absolute -top-1.5 -right-1.5 bg-yellow-400 text-white p-0.5 rounded-full border-2 border-white dark:border-slate-900 shadow-md transform rotate-12">
                        <Crown size={10} fill="currentColor" strokeWidth={3} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </header>

            <SubscriptionModal
              isOpen={showPaywall}
              onClose={() => {
                setShowPaywall(false);
                setActiveCategory('Trending'); // Redirect away from restricted area
              }}
              onUpgrade={handleUpgrade}
            />

            <main className="flex flex-grow p-4 lg:p-8 gap-8 container mx-auto relative">
              {/* Sidebar */}
              <aside className="hidden lg:block w-64 shrink-0">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ ...pageTransition, delay: 0.1 }}
                  className="flex flex-col h-[calc(100vh-120px)] glass rounded-3xl p-4 sticky top-24 border border-white/50 dark:border-white/5"
                >
                  <Sidebar
                    activeCategory={activeCategory}
                    setActiveCategory={(cat: Category) => {
                      setActiveCategory(cat);
                      setIsSortOpen(false);
                      if (currentPage === 'profile' || currentPage === 'edit-profile') {
                        setCurrentPage('dashboard');
                      }
                    }}
                    onLogout={() => setCurrentPage('landing')}
                    credits={currentUser?.credits || 0}
                  />
                  <div className="mt-4 pt-4 border-t border-teal-50/50 dark:border-teal-900/30">
                    <button
                      onClick={() => setActiveCategory('AI Lab')}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 ${activeCategory === 'AI Lab' ? 'bg-teal-500 text-white shadow-lg shadow-teal-200 dark:shadow-teal-900/50' : 'text-gray-500 dark:text-gray-400 hover:bg-teal-50 dark:hover:bg-teal-900/20 hover:text-teal-600 dark:hover:text-teal-400'}`}
                    >
                      <BrainCircuit size={20} />
                      <span className="font-medium flex-grow text-left">AI Lab</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${activeCategory === 'AI Lab' ? 'bg-white/20 text-white' : 'bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400'}`}>
                        {currentUser?.credits || 0} pts
                      </span>
                    </button>
                    <button
                      onClick={() => setActiveCategory('Live Assistant')}
                      className={`w-full flex items-center gap-3 px-4 py-3 mt-2 rounded-2xl transition-all duration-300 ${activeCategory === 'Live Assistant' ? 'bg-teal-500 text-white shadow-lg shadow-teal-200 dark:shadow-teal-900/50' : 'text-gray-500 dark:text-gray-400 hover:bg-teal-50 dark:hover:bg-teal-900/20 hover:text-teal-600 dark:hover:text-teal-400'}`}
                    >
                      <Radio size={20} />
                      <span className="font-medium flex-grow text-left">Live Sync</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${activeCategory === 'Live Assistant' ? 'bg-white/20 text-white' : 'bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400'}`}>
                        {currentUser?.credits || 0} pts
                      </span>
                    </button>
                  </div>
                </motion.div>
              </aside>

              {/* Content area */}
              <div className="flex-grow space-y-8 min-w-0">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeCategory + (currentPage === 'profile' ? 'profile' : 'dashboard')}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, filter: "blur(4px)" }}
                    transition={{ ...pageTransition, duration: 0.3 }}
                    className="w-full"
                  >
                    {activeCategory === 'AI Lab' ? (
                      <AILab />
                    ) : activeCategory === 'Live Assistant' ? (
                      <LiveAssistant />
                    ) : currentPage === 'profile' && currentUser ? (
                      <Profile
                        user={currentUser}
                        isOwnProfile={true}
                        onEditProfile={() => setCurrentPage('edit-profile')}
                      />
                    ) : currentPage === 'edit-profile' && currentUser ? (
                      <EditProfile
                        user={currentUser}
                        onSave={(updatedUser) => {
                          setCurrentUser(updatedUser);
                          setCurrentPage('profile');
                        }}
                        onCancel={() => setCurrentPage('profile')}
                      />
                    ) : (
                      <div className="space-y-8">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ ...pageTransition, delay: 0.05 }}
                          >
                            <h2 className="text-3xl font-extrabold text-gray-800 dark:text-white flex items-center gap-3">
                              {activeCategory} {activeCategory === 'Trending' && <span className="px-3 py-1 bg-red-50 dark:bg-red-900/20 text-red-500 text-xs rounded-full border border-red-100 dark:border-red-900/30 animate-pulse font-bold tracking-tight">HOT</span>}
                            </h2>
                            <p className="text-gray-500 dark:text-gray-400 font-medium">Discovering the next big thing in {activeCategory.toLowerCase()}</p>
                          </motion.div>

                          <motion.div
                            className="relative"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ ...pageTransition, delay: 0.1 }}
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-sm text-gray-400 dark:text-gray-500 font-medium flex items-center gap-1">
                                <Filter size={16} /> Sort by:
                              </span>

                              <button
                                onClick={() => setIsSortOpen(!isSortOpen)}
                                className="glass border border-white/50 dark:border-white/5 rounded-2xl px-5 py-2.5 text-sm text-teal-600 dark:text-teal-400 font-semibold flex items-center gap-3 min-w-[180px] justify-between shadow-sm hover:shadow-md transition-all active:scale-95"
                              >
                                {sortOptions.find(o => o.value === sortBy)?.label}
                                <ChevronDown size={16} className={`transition-transform duration-500 ease-out ${isSortOpen ? 'rotate-180' : ''}`} />
                              </button>
                            </div>

                            <AnimatePresence>
                              {isSortOpen && (
                                <motion.div
                                  initial={{ opacity: 0, scale: 0.95 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  exit={{ opacity: 0, scale: 0.95 }}
                                  transition={{ ...pageTransition, duration: 0.2 }}
                                  className="absolute top-full right-0 mt-2 glass border border-white/60 dark:border-white/10 rounded-2xl p-2 z-[70] shadow-2xl min-w-[200px] overflow-hidden backdrop-blur-xl"
                                >
                                  {sortOptions.map((option) => (
                                    <button
                                      key={option.value}
                                      onClick={() => {
                                        setSortBy(option.value);
                                        setIsSortOpen(false);
                                      }}
                                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm transition-all ${sortBy === option.value
                                        ? 'bg-teal-500 text-white shadow-lg shadow-teal-100 dark:shadow-teal-900/40'
                                        : 'text-gray-600 dark:text-gray-300 hover:bg-teal-50 dark:hover:bg-teal-900/30 hover:text-teal-600 dark:hover:text-teal-400'
                                        }`}
                                    >
                                      {option.label}
                                      {sortBy === option.value && <Check size={14} />}
                                    </button>
                                  ))}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </motion.div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                          {filteredIdeas.length > 0 ? (
                            filteredIdeas.map((idea, index) => (
                              <motion.div
                                key={idea.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                  type: "spring",
                                  stiffness: 50,
                                  damping: 20,
                                  delay: index * 0.1
                                }}
                              >
                                <IdeaCard idea={idea} />
                              </motion.div>
                            ))
                          ) : (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="col-span-full py-20 text-center glass rounded-[40px] border border-white/40 dark:border-white/10"
                            >
                              <div className="flex justify-center mb-4">
                                <div className="w-16 h-16 rounded-full bg-teal-50 dark:bg-teal-900/20 flex items-center justify-center text-teal-500 opacity-50">
                                  <Search size={32} />
                                </div>
                              </div>
                              <p className="text-gray-400 dark:text-gray-500 font-medium">No ideas found matching your search.</p>
                              <button
                                onClick={() => setSearchQuery('')}
                                className="mt-4 text-teal-500 dark:text-teal-400 font-semibold hover:underline"
                              >
                                Clear Search
                              </button>
                            </motion.div>
                          )}
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </main>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`${isDarkMode ? 'dark' : ''} transition-colors duration-500`}>
      <div className="relative min-h-screen bg-[#f7f9fb] dark:bg-[#0a0b1e] selection:bg-teal-200 dark:selection:bg-teal-900 selection:text-teal-900 dark:selection:text-teal-100 transition-colors duration-500 overflow-x-hidden">

        {/* Flowing Bubble Background - Show on Landing and Auth pages */}
        {(currentPage === 'landing' || currentPage === 'login' || currentPage === 'signup') && (
          <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
            <KnowledgeCursor />
          </div>
        )}

        {/* Main Content Area - Direct rendering to avoid AnimatePresence hangs */}
        <div className="relative w-full min-h-screen" style={{ zIndex: 10, position: 'relative' }}>
          {currentPage === 'landing' && (
            <div className="flex flex-col items-center justify-center min-h-screen p-4 relative z-50 w-full">
              {/* Theme Toggle */}
              <div className="absolute top-8 right-8">
                <button
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className="p-3 rounded-full glass border border-white/20 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:scale-110 active:scale-90 transition-all shadow-xl"
                >
                  {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
                </button>
              </div>

              {/* Title Section */}
              <div className="text-center mb-16">
                <div className="relative inline-block">
                  <h1 className="text-6xl font-bold tracking-tighter text-gray-900 dark:text-white select-none relative z-10">
                    Khoj<span className="text-teal-500">Verse</span>
                  </h1>
                  <div className="absolute inset-0 blur-2xl bg-teal-400/20 dark:bg-teal-500/10 rounded-full scale-125 -z-10" />
                </div>
                <p className="text-lg text-gray-500 dark:text-gray-400 font-light mt-3 tracking-[0.15em] uppercase">
                  Explore the Multiverse of Ideas
                </p>
              </div>

              <div className="relative flex flex-col items-center justify-center w-full max-w-2xl">
                {!isOrbExpanded ? (
                  <button
                    onClick={() => setIsOrbExpanded(true)}
                    className="w-24 h-24 rounded-full bg-gradient-to-br from-teal-300 to-teal-600 dark:from-teal-400 dark:to-teal-700 flex items-center justify-center text-white shadow-[0_0_50px_rgba(20,184,166,0.5)] dark:shadow-[0_0_80px_rgba(20,184,166,0.3)] relative group overflow-hidden"
                  >
                    <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
                    <Sparkles size={32} className="relative z-10 group-hover:rotate-12 transition-transform" />
                    <div className="absolute inset-0 rounded-full border-2 border-white/30 scale-110 animate-ping opacity-20" />
                  </button>
                ) : (
                  <div className="w-full max-w-lg bg-white/20 dark:bg-black/20 backdrop-blur-2xl rounded-[32px] p-6 border border-white/60 dark:border-white/5 shadow-2xl relative overflow-hidden">
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (searchQuery.trim()) {
                          setIsOrbExpanded(false);
                          setCurrentPage('login');
                        }
                      }}
                      className="relative group mb-6"
                    >
                      <div className="flex items-center glass rounded-xl px-5 py-3 border border-white/40 dark:border-white/5 group-focus-within:ring-2 ring-teal-500/50 transition-all">
                        <Search className="text-teal-500 mr-3" size={20} />
                        <input
                          autoFocus
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="What do you want to explore?"
                          className="bg-transparent border-none outline-none w-full text-lg text-gray-800 dark:text-white placeholder:text-gray-400 font-medium"
                        />
                      </div>
                    </form>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={() => {
                          setIsOrbExpanded(false);
                          setCurrentPage('login');
                        }}
                        className="flex-1 py-3.5 bg-teal-500 text-white rounded-xl font-bold text-base hover:bg-teal-600 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-teal-500/20"
                      >
                        Log In
                      </button>
                      <button
                        onClick={() => {
                          setIsOrbExpanded(false);
                          setCurrentPage('signup');
                        }}
                        className="flex-1 py-3.5 glass text-gray-700 dark:text-white rounded-xl font-bold text-base hover:bg-white/40 dark:hover:bg-white/10 hover:scale-[1.02] active:scale-95 transition-all border border-white/60 dark:border-white/10"
                      >
                        Sign Up
                      </button>
                    </div>

                    <button
                      onClick={() => setIsOrbExpanded(false)}
                      className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors"
                    >
                      <Check size={20} className="rotate-45" />
                      <span className="sr-only">Close</span>
                    </button>
                  </div>
                )}
              </div>


            </div>
          )}

          {currentPage === 'login' && (
            <div className="min-h-screen w-full flex items-center justify-center" style={{ position: 'relative', zIndex: 100 }}>
              <Login
                onLogin={handleLogin}
                onSignupClick={() => setCurrentPage('signup')}
                onBackClick={() => {
                  setCurrentPage('landing');
                  setIsOrbExpanded(false);
                }}
              />
            </div>
          )}

          {currentPage === 'signup' && (
            <div className="min-h-screen w-full flex items-center justify-center" style={{ position: 'relative', zIndex: 100 }}>
              <Signup
                onSignup={(user) => {
                  setCurrentUser(user);
                  setCurrentPage('dashboard');
                }}
                onLoginClick={() => setCurrentPage('login')}
              />
            </div>
          )}

          {(currentPage === 'dashboard' || currentPage === 'profile' || currentPage === 'edit-profile') && (
            <div className="flex flex-col min-h-screen w-full bg-[#f7f9fb] dark:bg-[#0a0b1e]">
              {/* Header */}
              <header className="glass sticky top-0 z-[60] px-8 py-4 flex items-center justify-between border-b border-white/50 dark:border-white/5 backdrop-blur-md">
                <div
                  className="flex items-center gap-2 cursor-pointer group"
                  onClick={() => setCurrentPage('landing')}
                >
                  <div className="w-10 h-10 rounded-xl bg-teal-500 flex items-center justify-center text-white shadow-lg shadow-teal-200 dark:shadow-teal-900/50 group-hover:rotate-12 transition-transform">
                    <Sparkles size={20} />
                  </div>
                  <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">KhojVerse</h1>
                </div>

                <Chatbot />

                <div className="flex-grow max-w-xl mx-12 hidden md:block">
                  <div className="glass rounded-2xl px-5 py-2.5 flex items-center gap-3 border-none ring-1 ring-gray-100 dark:ring-white/10 focus-within:ring-2 ring-teal-200 dark:ring-teal-800 transition-all">
                    <Search className="text-gray-400" size={18} />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search ideas, topics, researchers..."
                      className="bg-transparent border-none outline-none w-full text-sm text-gray-700 dark:text-gray-200"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4 lg:gap-6">
                  <button
                    onClick={() => setIsDarkMode(!isDarkMode)}
                    className="p-2.5 rounded-xl glass border border-white/20 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:bg-white/40 dark:hover:bg-white/10 transition-all"
                  >
                    {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                  </button>
                  <div className="relative">
                    <button
                      onClick={() => setShowNotifications(!showNotifications)}
                      className="text-gray-400 dark:text-gray-500 hover:text-teal-500 dark:hover:text-teal-400 relative transition-colors"
                    >
                      <Bell size={22} />
                      {notifications.length > 0 && (
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-400 rounded-full border-2 border-white dark:border-slate-900"></span>
                      )}
                    </button>

                    <AnimatePresence>
                      {showNotifications && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute top-full right-0 mt-4 w-80 glass rounded-2xl p-4 shadow-2xl border border-white/60 dark:border-white/10 z-[80]"
                        >
                          <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-100 dark:border-white/5">
                            <h4 className="font-semibold text-gray-800 dark:text-white">Notifications</h4>
                            <span className="text-xs text-teal-500 font-medium cursor-pointer">Mark all read</span>
                          </div>
                          <div className="space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar">
                            {notifications.map(n => (
                              <div key={n.id} className="flex gap-3 items-start p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                <div className="w-2 h-2 mt-2 rounded-full bg-teal-500 shrink-0" />
                                <p className="text-sm text-gray-600 dark:text-gray-300 leading-tight">{n.text}</p>
                              </div>
                            ))}
                            {notifications.length === 0 && (
                              <p className="text-center text-sm text-gray-400 py-4">No new notifications</p>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="flex items-center gap-3 pl-6 border-l border-gray-200 dark:border-gray-800">
                    <div className="text-right hidden sm:block">
                      <p className="text-sm font-bold text-gray-800 dark:text-white">{currentUser?.name || 'Explorer'}</p>
                      <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">{currentUser?.subscriptionStatus || 'Free'} Plan</p>
                    </div>
                    <div
                      className="w-10 h-10 rounded-full border-2 border-teal-200 dark:border-teal-800 p-0.5 relative cursor-pointer hover:border-teal-400 transition-colors"
                      onClick={() => setCurrentPage('profile')}
                    >
                      <img
                        src={currentUser?.avatar || 'https://picsum.photos/seed/anon/100/100'}
                        alt="avatar"
                        className="w-full h-full rounded-full object-cover"
                      />
                      {currentUser?.subscriptionStatus === 'Pro' && (
                        <div className="absolute -top-1.5 -right-1.5 bg-yellow-400 text-white p-0.5 rounded-full border-2 border-white dark:border-slate-900 shadow-md transform rotate-12">
                          <Crown size={10} fill="currentColor" strokeWidth={3} />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </header>

              <SubscriptionModal
                isOpen={showPaywall}
                onClose={() => {
                  setShowPaywall(false);
                  setActiveCategory('Trending'); // Redirect away from restricted area
                }}
                onUpgrade={handleUpgrade}
              />

              <main className="flex flex-grow p-4 lg:p-8 gap-8 container mx-auto relative">
                {/* Sidebar */}
                <aside className="hidden lg:block w-64 shrink-0">
                  <div className="flex flex-col h-[calc(100vh-120px)] glass rounded-3xl p-4 sticky top-24 border border-white/50 dark:border-white/5">
                    <Sidebar
                      activeCategory={activeCategory}
                      setActiveCategory={(cat: Category) => {
                        setActiveCategory(cat);
                        setIsSortOpen(false);
                        if (currentPage === 'profile' || currentPage === 'edit-profile') {
                          setCurrentPage('dashboard');
                        }
                      }}
                      onLogout={() => setCurrentPage('landing')}
                      credits={currentUser?.credits || 0}
                    />
                    <div className="mt-4 pt-4 border-t border-teal-50/50 dark:border-teal-900/30">
                      <button
                        onClick={() => setActiveCategory('AI Lab')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 ${activeCategory === 'AI Lab' ? 'bg-teal-500 text-white shadow-lg shadow-teal-200 dark:shadow-teal-900/50' : 'text-gray-500 dark:text-gray-400 hover:bg-teal-50 dark:hover:bg-teal-900/20 hover:text-teal-600 dark:hover:text-teal-400'}`}
                      >
                        <BrainCircuit size={20} />
                        <span className="font-medium flex-grow text-left">AI Lab</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${activeCategory === 'AI Lab' ? 'bg-white/20 text-white' : 'bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400'}`}>
                          {currentUser?.credits || 0} pts
                        </span>
                      </button>
                      <button
                        onClick={() => setActiveCategory('Live Assistant')}
                        className={`w-full flex items-center gap-3 px-4 py-3 mt-2 rounded-2xl transition-all duration-300 ${activeCategory === 'Live Assistant' ? 'bg-teal-500 text-white shadow-lg shadow-teal-200 dark:shadow-teal-900/50' : 'text-gray-500 dark:text-gray-400 hover:bg-teal-50 dark:hover:bg-teal-900/20 hover:text-teal-600 dark:hover:text-teal-400'}`}
                      >
                        <Radio size={20} />
                        <span className="font-medium flex-grow text-left">Live Sync</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${activeCategory === 'Live Assistant' ? 'bg-white/20 text-white' : 'bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400'}`}>
                          {currentUser?.credits || 0} pts
                        </span>
                      </button>
                    </div>
                  </div>
                </aside>

                {/* Content area */}
                <div className="flex-grow space-y-8 min-w-0">
                  <div className="w-full">
                    {activeCategory === 'AI Lab' ? (
                      <AILab />
                    ) : activeCategory === 'Live Assistant' ? (
                      <LiveAssistant />
                    ) : currentPage === 'profile' && currentUser ? (
                      <Profile
                        user={currentUser}
                        isOwnProfile={true}
                        onEditProfile={() => setCurrentPage('edit-profile')}
                      />
                    ) : currentPage === 'edit-profile' && currentUser ? (
                      <EditProfile
                        user={currentUser}
                        onSave={(updatedUser) => {
                          setCurrentUser(updatedUser);
                          setCurrentPage('profile');
                        }}
                        onCancel={() => setCurrentPage('profile')}
                      />
                    ) : (
                      <div className="space-y-8">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div>
                            <h2 className="text-3xl font-extrabold text-gray-800 dark:text-white flex items-center gap-3">
                              {activeCategory} {activeCategory === 'Trending' && <span className="px-3 py-1 bg-red-50 dark:bg-red-900/20 text-red-500 text-xs rounded-full border border-red-100 dark:border-red-900/30 animate-pulse font-bold tracking-tight">HOT</span>}
                            </h2>
                            <p className="text-gray-500 dark:text-gray-400 font-medium">Discovering the next big thing in {activeCategory.toLowerCase()}</p>
                          </div>

                          <div className="relative">
                            <div className="flex items-center gap-3">
                              <span className="text-sm text-gray-400 dark:text-gray-500 font-medium flex items-center gap-1">
                                <Filter size={16} /> Sort by:
                              </span>

                              <button
                                onClick={() => setIsSortOpen(!isSortOpen)}
                                className="glass border border-white/50 dark:border-white/5 rounded-2xl px-5 py-2.5 text-sm text-teal-600 dark:text-teal-400 font-semibold flex items-center gap-3 min-w-[180px] justify-between shadow-sm hover:shadow-md transition-all active:scale-95"
                              >
                                {sortOptions.find(o => o.value === sortBy)?.label}
                                <ChevronDown size={16} className={`transition-transform duration-500 ease-out ${isSortOpen ? 'rotate-180' : ''}`} />
                              </button>
                            </div>

                            <AnimatePresence>
                              {isSortOpen && (
                                <motion.div
                                  initial={{ opacity: 0, scale: 0.95 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  exit={{ opacity: 0, scale: 0.95 }}
                                  transition={{ duration: 0.2 }}
                                  className="absolute top-full right-0 mt-2 glass border border-white/60 dark:border-white/10 rounded-2xl p-2 z-[70] shadow-2xl min-w-[200px] overflow-hidden backdrop-blur-xl"
                                >
                                  {sortOptions.map((option) => (
                                    <button
                                      key={option.value}
                                      onClick={() => {
                                        setSortBy(option.value);
                                        setIsSortOpen(false);
                                      }}
                                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm transition-all ${sortBy === option.value
                                        ? 'bg-teal-500 text-white shadow-lg shadow-teal-100 dark:shadow-teal-900/40'
                                        : 'text-gray-600 dark:text-gray-300 hover:bg-teal-50 dark:hover:bg-teal-900/30 hover:text-teal-600 dark:hover:text-teal-400'
                                        }`}
                                    >
                                      {option.label}
                                      {sortBy === option.value && <Check size={14} />}
                                    </button>
                                  ))}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                          {filteredIdeas.length > 0 ? (
                            filteredIdeas.map((idea, index) => (
                              <IdeaCard key={idea.id} idea={idea} />
                            ))
                          ) : (
                            <div className="col-span-full py-20 text-center glass rounded-[40px] border border-white/40 dark:border-white/10">
                              <div className="flex justify-center mb-4">
                                <div className="w-16 h-16 rounded-full bg-teal-50 dark:bg-teal-900/20 flex items-center justify-center text-teal-500 opacity-50">
                                  <Search size={32} />
                                </div>
                              </div>
                              <p className="text-gray-400 dark:text-gray-500 font-medium">No ideas found matching your search.</p>
                              <button
                                onClick={() => setSearchQuery('')}
                                className="mt-4 text-teal-500 dark:text-teal-400 font-semibold hover:underline"
                              >
                                Clear Search
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </main>
            </div>
          )}
        </div>
      </div>
    </div >
  );
};

export default App;
