"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, ChevronDown, User, Wallet, Copy, Check, Menu, X, Clock, TrendingUp, FileText, Coins, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ConnectButton } from "@mysten/dapp-kit";
import { formatAddress } from "@mysten/sui.js/utils";
import { useWalletConnection } from "@/components/hooks/useWalletConnection";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

// TypeScript interfaces
interface SearchItem {
  id: number;
  type: 'recent' | 'popular' | 'tool' | 'docs' | 'feature';
  title: string;
  category: string;
  path: string;
}

// Search Bar Component
const SearchBar = ({ className = "" }: { className?: string }) => {
  const [isSearchFocused, setIsSearchFocused] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredResults, setFilteredResults] = useState<SearchItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [recentSearches, setRecentSearches] = useState<SearchItem[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Search data
  const searchData: SearchItem[] = [
    { id: 1, type: 'popular', title: 'Create Token', category: 'Popular', path: '/generate' },
    { id: 2, type: 'popular', title: 'Create NFT Collection', category: 'Popular', path: '/nft/generate' },
    { id: 3, type: 'popular', title: 'Dashboard', category: 'Popular', path: '/dashboard' },
    { id: 4, type: 'popular', title: 'Gas Estimator', category: 'Popular', path: '/tools/gas-estimator' },
    { id: 5, type: 'tool', title: 'Token Creator', category: 'Tools', path: '/generate' },
    { id: 6, type: 'tool', title: 'NFT Generator', category: 'Tools', path: '/nft/generate' },
    { id: 7, type: 'tool', title: 'Explorer', category: 'Tools', path: '/tools/explorer' },
    { id: 8, type: 'tool', title: 'Dashboard', category: 'Tools', path: '/dashboard' },
    { id: 9, type: 'docs', title: 'Getting Started', category: 'Docs', path: '/docs/getting-started' },
    { id: 10, type: 'docs', title: 'FAQ', category: 'Docs', path: '/docs/faq' },
    { id: 11, type: 'docs', title: 'API Reference', category: 'Docs', path: '/docs/api' },
    { id: 12, type: 'feature', title: 'Mintable Tokens', category: 'Features', path: '/docs/features/mintable' },
    { id: 13, type: 'feature', title: 'Burnable Tokens', category: 'Features', path: '/docs/features/burnable' },
    { id: 14, type: 'feature', title: 'Pausable Tokens', category: 'Features', path: '/docs/features/pausable' },
  ];

  // Load recent searches from localStorage on component mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('sui-token-creator-recent-searches');
      if (stored) {
        const parsed: SearchItem[] = JSON.parse(stored);
        setRecentSearches(parsed.slice(0, 5)); // Limit to 5 recent items
      }
    } catch (error) {
      console.error('Error loading recent searches:', error);
    }
  }, []);

  // Save recent searches to localStorage
  const saveRecentSearch = (item: SearchItem) => {
    try {
      const newRecentItem: SearchItem = { ...item, type: 'recent' };
      const updatedRecents = [
        newRecentItem,
        ...recentSearches.filter(recent => recent.path !== item.path)
      ].slice(0, 5); // Keep only 5 most recent
      
      setRecentSearches(updatedRecents);
      localStorage.setItem('sui-token-creator-recent-searches', JSON.stringify(updatedRecents));
    } catch (error) {
      console.error('Error saving recent search:', error);
    }
  };

  // Filter results based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      // Show recent searches if available, otherwise show popular
      if (recentSearches.length > 0) {
        const combinedResults = [
          ...recentSearches.slice(0, 3),
          ...searchData.filter(item => item.type === 'popular').slice(0, 3)
        ];
        setFilteredResults(combinedResults);
      } else {
        // New user - show only popular items
        const popularResults = searchData.filter(item => 
          item.type === 'popular'
        ).slice(0, 6);
        setFilteredResults(popularResults);
      }
    } else {
      // Filter based on query
      const filtered = searchData.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 8);
      setFilteredResults(filtered);
    }
    setSelectedIndex(-1);
  }, [searchQuery, recentSearches]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isSearchFocused) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev < filteredResults.length - 1 ? prev + 1 : prev
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
          break;
        case 'Enter':
          e.preventDefault();
          if (selectedIndex >= 0 && filteredResults[selectedIndex]) {
            handleResultClick(filteredResults[selectedIndex]);
          }
          break;
        case 'Escape':
          setIsSearchFocused(false);
          setSearchQuery("");
          if (searchRef.current) {
            const input = searchRef.current.querySelector('input');
            input?.blur();
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isSearchFocused, selectedIndex, filteredResults]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleResultClick = (result: SearchItem) => {
    if (result.path) {
      // Save to recent searches only if it's not already a recent search
      if (result.type !== 'recent') {
        saveRecentSearch(result);
      }
      router.push(result.path);
    }
    setSearchQuery(result.title);
    setIsSearchFocused(false);
  };

  const clearSearch = () => {
    setSearchQuery("");
    if (searchRef.current) {
      const input = searchRef.current.querySelector('input');
      input?.focus();
    }
  };

  const getResultIcon = (result: SearchItem) => {
    switch (result.type) {
      case 'recent':
        return <Clock className="text-zinc-400" size={16} />;
      case 'popular':
        return <TrendingUp className="text-teal-400" size={16} />;
      case 'tool':
        return <Coins className="text-zinc-400" size={16} />;
      case 'docs':
        return <FileText className="text-zinc-400" size={16} />;
      case 'feature':
        return <Settings className="text-zinc-400" size={16} />;
      default:
        return <Search className="text-zinc-400" size={16} />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'tools':
        return 'text-teal-400 bg-teal-400/10';
      case 'docs':
        return 'text-blue-400 bg-blue-400/10';
      case 'features':
        return 'text-purple-400 bg-purple-400/10';
      case 'popular':
        return 'text-orange-400 bg-orange-400/10';
      case 'recent':
        return 'text-zinc-400 bg-zinc-400/10';
      default:
        return 'text-zinc-400 bg-zinc-400/10';
    }
  };

  const getDropdownTitle = () => {
    if (searchQuery) return 'Search Results';
    if (recentSearches.length > 0) return 'Recent & Popular';
    return 'Popular Searches';
  };

  return (
    <div className={`relative ${className}`} ref={searchRef}>
      <div className={`relative transition-all duration-200 ${
        isSearchFocused ? "ring-1 ring-teal-500" : ""
      }`}>
        <Input
          type="text"
          placeholder="Search for tokens, tools, docs..."
          className="pl-10 pr-10 py-2 w-full bg-zinc-800 border-zinc-700 text-zinc-300 placeholder:text-zinc-500 focus-visible:ring-teal-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsSearchFocused(true)}
        />
        
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-500" size={18} />
        
        {searchQuery && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
            type="button"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      <AnimatePresence>
        {isSearchFocused && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto"
          >
            {filteredResults.length > 0 ? (
              <>
                <div className="px-4 py-3 border-b border-zinc-700">
                  <p className="text-xs text-zinc-400 font-medium">
                    {getDropdownTitle()}
                  </p>
                </div>

                <div className="py-2">
                  {filteredResults.map((result, index) => (
                    <motion.button
                      key={result.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`w-full px-4 py-3 text-left hover:bg-zinc-700/50 transition-colors duration-150 flex items-center gap-3 ${
                        selectedIndex === index ? 'bg-zinc-700/50' : ''
                      }`}
                      onClick={() => handleResultClick(result)}
                      onMouseEnter={() => setSelectedIndex(index)}
                      type="button"
                    >
                      <div className="flex-shrink-0">
                        {getResultIcon(result)}
                      </div>
                      
                      <div className="flex-grow min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-zinc-200 font-medium truncate">
                            {result.title}
                          </span>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getCategoryColor(result.category)}`}>
                            {result.category}
                          </span>
                        </div>
                      </div>

                      {selectedIndex === index && (
                        <motion.div
                          initial={{ opacity: 0, x: -5 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex-shrink-0 text-teal-400"
                        >
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                            <path d="M6 3.5L10.5 8L6 12.5V3.5z"/>
                          </svg>
                        </motion.div>
                      )}
                    </motion.button>
                  ))}
                </div>

                <div className="px-4 py-3 border-t border-zinc-700 bg-zinc-800/50">
                  <p className="text-xs text-zinc-500">
                    Use ↑↓ to navigate, ⏎ to select, esc to close
                  </p>
                </div>
              </>
            ) : (
              <div className="px-4 py-6 text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-zinc-700 flex items-center justify-center">
                  <Search className="text-zinc-500" size={20} />
                </div>
                <p className="text-zinc-400 text-sm">No results found</p>
                <p className="text-zinc-500 text-xs mt-1">
                  Try searching for "token", "NFT", or "docs"
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function Navbar() {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const router = useRouter();
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const { 
    isConnected, 
    currentAccount, 
    disconnect, 
    isReady 
  } = useWalletConnection();

  const handleFungibleTokenClick = () => {
    router.push("/generate");
    setMobileMenuOpen(false);
  };
  
  const handleNftCollectionClick = () => {
    router.push("/nft/generate");
    setMobileMenuOpen(false);
  };
  
  const handleDashboardClick = () => {
    router.push("/dashboard");
    setMobileMenuOpen(false);
  };

  const handleExplorerClick = () => {
    router.push("/tools/explorer");
    setMobileMenuOpen(false);
  };

  const handleGasEstimatorClick = () => {
    router.push("/tools/gas-estimator");
    setMobileMenuOpen(false);
  };

  const handleGettingStartedClick = () => {
    router.push("/docs/getting-started");
    setMobileMenuOpen(false);
  };

  // Format the address for display
  const displayAddress = currentAccount ? formatAddress(currentAccount.address) : "";
  const fullAddress = currentAccount ? currentAccount.address : "";

  // Function to copy wallet address to clipboard
  const copyToClipboard = () => {
    if (fullAddress) {
      navigator.clipboard.writeText(fullAddress);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  // Handle hover for dropdown menus on desktop
  const handleMouseEnter = (menuName: string) => {
    if (typeof window !== 'undefined' && window.innerWidth >= 768) {
      if (dropdownTimeoutRef.current) {
        clearTimeout(dropdownTimeoutRef.current);
      }
      setOpenDropdown(menuName);
    }
  };

  const handleMouseLeave = () => {
    if (typeof window !== 'undefined' && window.innerWidth >= 768) {
      dropdownTimeoutRef.current = setTimeout(() => {
        setOpenDropdown(null);
      }, 300);
    }
  };

  // Close mobile menu when navigating
  useEffect(() => {
    const handleRouteChange = () => {
      setMobileMenuOpen(false);
    };
    
    return () => {
      setMobileMenuOpen(false);
    };
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (openDropdown && (!target || !target.closest('.dropdown-container'))) {
        setOpenDropdown(null);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openDropdown]);

  // Clean up the timeout on unmount
  useEffect(() => {
    return () => {
      if (dropdownTimeoutRef.current) {
        clearTimeout(dropdownTimeoutRef.current);
      }
    };
  }, []);

  return (
    <nav className="sticky top-0 z-50 w-full bg-zinc-900 border-b border-zinc-800">
      <div className="container max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4 sm:gap-8"> 
          <Link href="/" className="flex items-center gap-2">
            <div className="w-20 h-[26px] my-4 rounded-md flex items-center justify-center text-white font-bold text-lg sm:text-xl">
              <Image
                src="/logo.png"
                alt="Sui Token Wizard"
                width={100}
                height={50}
              />
            </div>
            <span className="font-bold text-lg sm:text-xl text-white hidden xs:inline-block">Sui Token Creator</span>
          </Link>

          {/* Updated Search Bar */}
          <SearchBar className="max-w-md w-full hidden md:block" />
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-2">
            {/* Create dropdown - Hover enabled */}
            <div 
              className="relative dropdown-container" 
              onMouseEnter={() => handleMouseEnter('create')}
              onMouseLeave={handleMouseLeave}
            >
              <Button 
                variant="ghost" 
                className="text-zinc-300 cursor-pointer hover:text-white hover:bg-zinc-800"
                onClick={() => setOpenDropdown(openDropdown === 'create' ? null : 'create')}
              >
                Create <ChevronDown size={16} className="ml-1" />
              </Button>
              
              <div 
                className={`absolute top-full left-0 mt-1 py-1 bg-zinc-800 border border-zinc-700 rounded-md w-40 shadow-lg transition-all duration-200 origin-top-left ${
                  openDropdown === 'create' ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
                }`}
              >
                <button
                  className="w-full px-3 py-2 text-left cursor-pointer text-zinc-300 hover:text-white hover:bg-zinc-700 transition-colors duration-150"
                  onClick={handleFungibleTokenClick}
                  type="button"
                >
                  Fungible Token
                </button>
                <button
                  className="w-full px-3 py-2 text-left cursor-pointer text-zinc-300 hover:text-white hover:bg-zinc-700 transition-colors duration-150"
                  onClick={handleNftCollectionClick}
                  type="button"
                >
                  NFT Collection
                </button>
              </div>
            </div>

            {/* Tools dropdown - Hover enabled */}
            <div 
              className="relative dropdown-container" 
              onMouseEnter={() => handleMouseEnter('tools')}
              onMouseLeave={handleMouseLeave}
            >
              <Button 
                variant="ghost" 
                className="text-zinc-300 cursor-pointer hover:text-white hover:bg-zinc-800"
                onClick={() => setOpenDropdown(openDropdown === 'tools' ? null : 'tools')}
              >
                Tools <ChevronDown size={16} className="ml-1" />
              </Button>
              
              <div 
                className={`absolute top-full left-0 mt-1 py-1 bg-zinc-800 border border-zinc-700 rounded-md w-40 shadow-lg transition-all duration-200 origin-top-left ${
                  openDropdown === 'tools' ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
                }`}
              >
                <button 
                  className="w-full px-3 py-2 cursor-pointer text-left text-zinc-300 hover:text-white hover:bg-zinc-700 transition-colors duration-150" 
                  onClick={handleExplorerClick}
                  type="button"
                >
                  Explorer
                </button>
                <button 
                  className="w-full px-3 py-2 cursor-pointer text-left text-zinc-300 hover:text-white hover:bg-zinc-700 transition-colors duration-150" 
                  onClick={handleGasEstimatorClick}
                  type="button"
                >
                  Gas Estimator
                </button>
              </div>
            </div>

            {/* Docs dropdown - Hover enabled */}
            <div 
              className="relative dropdown-container" 
              onMouseEnter={() => handleMouseEnter('docs')}
              onMouseLeave={handleMouseLeave}
            >
              <Button 
                variant="ghost" 
                className="text-zinc-300 cursor-pointer hover:text-white hover:bg-zinc-800"
                onClick={() => setOpenDropdown(openDropdown === 'docs' ? null : 'docs')}
              >
                Docs <ChevronDown size={16} className="ml-1" />
              </Button>
              
              <div 
                className={`absolute top-full left-0 mt-1 py-1 bg-zinc-800 border border-zinc-700 rounded-md w-40 shadow-lg transition-all duration-200 origin-top-left ${
                  openDropdown === 'docs' ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
                }`}
              >
                <button 
                  className="w-full px-3 py-2 text-left cursor-pointer text-zinc-300 hover:text-white hover:bg-zinc-700 transition-colors duration-150" 
                  onClick={handleGettingStartedClick}
                  type="button"
                >
                  Getting Started
                </button>
              </div>
            </div>

            <Button
              variant="ghost"
              className="text-zinc-300 cursor-pointer hover:text-white hover:bg-zinc-800"
              onClick={handleDashboardClick}
            >
              <User size={16} className="mr-2" /> Dashboard
            </Button>
          </div>

          {/* Wallet Connection Button with improved dropdown */}
          {isReady ? (
            isConnected ? (
              <div 
                className="relative dropdown-container" 
                onMouseEnter={() => handleMouseEnter('wallet')}
                onMouseLeave={handleMouseLeave}
              >
                <Button 
                  className="bg-zinc-800 cursor-pointer hover:bg-zinc-700 text-white border-0 flex items-center gap-2"
                  onClick={() => setOpenDropdown(openDropdown === 'wallet' ? null : 'wallet')}
                >
                  <Wallet size={16} />
                  <span className="hidden sm:inline-block">{displayAddress}</span>
                </Button>
                
                <div 
                  className={`absolute top-full right-0 mt-1 py-1 bg-zinc-800 border border-zinc-700 rounded-md w-60 shadow-lg transition-all duration-200 origin-top-right ${
                    openDropdown === 'wallet' ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
                  }`}
                >
                  <div className="px-3 py-2 border-b border-zinc-700">
                    <p className="text-xs text-zinc-400">Wallet Address</p>
                    <div className="flex items-center justify-between mt-1">
                      <div className="text-sm text-zinc-300 truncate max-w-40">
                        {fullAddress}
                      </div>
                      <button 
                        onClick={copyToClipboard} 
                        className="p-1 rounded cursor-pointer hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors duration-150"
                        title="Copy address"
                        type="button"
                      >
                        {copySuccess ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
                      </button>
                    </div>
                  </div>
                  
                  <button 
                    className="w-full px-3 py-2 text-left cursor-pointer text-zinc-300 hover:text-white hover:bg-zinc-700 transition-colors duration-150"
                    onClick={handleDashboardClick}
                    type="button"
                  >
                    My Tokens
                  </button>
                  <button 
                    className="w-full px-3 py-2 text-left cursor-pointer text-zinc-300 hover:text-white hover:bg-zinc-700 transition-colors duration-150"
                    type="button"
                  >
                    Transaction History
                  </button>
                  <div className="border-t border-zinc-700 mt-1"></div>
                  <button 
                    className="w-full px-3 py-2 text-left cursor-pointer text-zinc-300 hover:text-white hover:bg-zinc-700 transition-colors duration-150"
                    onClick={() => disconnect()}
                    type="button"
                  >
                    Disconnect
                  </button>
                </div>
              </div>
            ) : (
              <ConnectButton 
                connectText={typeof window !== 'undefined' && window.innerWidth < 640 ? "Connect" : "Connect Wallet"}
                className="bg-teal-500 cursor-pointer hover:bg-teal-600 text-white border-0"
              />
            )
          ) : (
            <Button className="bg-teal-500 hover:bg-teal-600 text-white border-0" disabled>
              Loading...
            </Button>
          )}
          
          {/* Mobile menu button */}
          <Button 
            variant="ghost"
            className="md:hidden text-zinc-300 hover:text-white hover:bg-zinc-800 ml-1"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${
          mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMobileMenuOpen(false)}
      ></div>

      {/* Mobile Menu */}
      <div 
        className={`fixed right-0 top-0 h-full w-64 bg-zinc-900 shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex justify-between items-center p-4 border-b border-zinc-800">
          <h2 className="text-white font-semibold">Menu</h2>
          <Button 
            variant="ghost" 
            className="text-zinc-300 hover:text-white p-1 h-auto"
            onClick={() => setMobileMenuOpen(false)}
          >
            <X size={20} />
          </Button>
        </div>

        <div className="py-4">
          {/* Mobile Search */}
          <div className="px-4 mb-4">
            <SearchBar className="w-full" />
          </div>

          {/* Mobile Nav Items */}
          <div className="border-b border-zinc-800 pb-2 mb-2">
            {/* Create Dropdown */}
            <div className="px-4 py-2">
              <button 
                className="flex items-center justify-between w-full text-left text-zinc-300"
                onClick={() => setOpenDropdown(openDropdown === 'mobile-create' ? null : 'mobile-create')}
                type="button"
              >
                <span>Create</span>
                <ChevronDown 
                  size={16} 
                  className={`transition-transform duration-200 ${openDropdown === 'mobile-create' ? 'rotate-180' : ''}`} 
                />
              </button>
              
              <div 
                className={`overflow-hidden transition-all duration-200 ${
                  openDropdown === 'mobile-create' ? 'max-h-20 mt-2' : 'max-h-0'
                }`}
              >
                <button 
                  className="pl-4 py-2 w-full text-left text-zinc-400 hover:text-white"
                  onClick={handleFungibleTokenClick}
                  type="button"
                >
                  Fungible Token
                </button>
                <button 
                  className="pl-4 py-2 w-full text-left text-zinc-400 hover:text-white"
                  onClick={handleNftCollectionClick}
                  type="button"
                >
                  NFT Collection
                </button>
              </div>
            </div>

            {/* Tools Dropdown */}
            <div className="px-4 py-2">
              <button 
                className="flex items-center justify-between w-full text-left text-zinc-300"
                onClick={() => setOpenDropdown(openDropdown === 'mobile-tools' ? null : 'mobile-tools')}
                type="button"
              >
                <span>Tools</span>
                <ChevronDown 
                  size={16} 
                  className={`transition-transform duration-200 ${openDropdown === 'mobile-tools' ? 'rotate-180' : ''}`} 
                />
              </button>
              
              <div 
                className={`overflow-hidden transition-all duration-200 ${
                  openDropdown === 'mobile-tools' ? 'max-h-20 mt-2' : 'max-h-0'
                }`}
              >
                <button 
                  className="pl-4 py-2 w-full text-left text-zinc-400 hover:text-white" 
                  onClick={handleExplorerClick}
                  type="button"
                >
                  Explorer
                </button>
                <button 
                  className="pl-4 py-2 w-full text-left text-zinc-400 hover:text-white" 
                  onClick={handleGasEstimatorClick}
                  type="button"
                >
                  Gas Estimator
                </button>
              </div>
            </div>

            {/* Docs Dropdown */}
            <div className="px-4 py-2">
              <button 
                className="flex items-center justify-between w-full text-left text-zinc-300"
                onClick={() => setOpenDropdown(openDropdown === 'mobile-docs' ? null : 'mobile-docs')}
                type="button"
              >
                <span>Docs</span>
                <ChevronDown 
                  size={16} 
                  className={`transition-transform duration-200 ${openDropdown === 'mobile-docs' ? 'rotate-180' : ''}`} 
                />
              </button>
              
              <div 
                className={`overflow-hidden transition-all duration-200 ${
                  openDropdown === 'mobile-docs' ? 'max-h-20 mt-2' : 'max-h-0'
                }`}
              >
                <button 
                  className="pl-4 py-2 w-full text-left text-zinc-400 hover:text-white" 
                  onClick={handleGettingStartedClick}
                  type="button"
                >
                  Getting Started
                </button>
              </div>
            </div>

            <button 
              className="px-4 py-2 w-full text-left text-zinc-300 hover:text-white flex items-center"
              onClick={handleDashboardClick}
              type="button"
            >
              <User size={16} className="mr-2" /> Dashboard
            </button>
          </div>

          {/* Mobile Wallet Section */}
          {isConnected && (
            <div className="px-4 py-2">
              <p className="text-xs text-zinc-400 mb-1">Connected Wallet</p>
              <div className="bg-zinc-800 rounded p-2">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-zinc-300 truncate max-w-36">
                    {fullAddress}
                  </div>
                  <button 
                    onClick={copyToClipboard} 
                    className="p-1 rounded hover:bg-zinc-700 text-zinc-300 hover:text-white"
                    type="button"
                  >
                    {copySuccess ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
                  </button>
                </div>
                <div className="mt-2 pt-2 border-t border-zinc-700">
                  <button 
                    className="text-sm text-zinc-300 hover:text-white w-full text-left"
                    onClick={() => disconnect()}
                    type="button"
                  >
                    Disconnect
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}