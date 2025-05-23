"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, ChevronDown, User, Wallet, Copy, Check, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ConnectButton } from "@mysten/dapp-kit";
import { formatAddress } from "@mysten/sui.js/utils";
import { useWalletConnection } from "@/components/hooks/useWalletConnection";

export default function Navbar() {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const { 
    isConnected, 
    currentAccount, 
    disconnect, 
    isReady 
  } = useWalletConnection();

  const handleFungibleTokenClick = () => router.push("/generate");
  const handleNftCollectionClick = () => router.push("/nft/generate");
  const handleDashboardClick = () => router.push("/dashboard");

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
    if (typeof window !== 'undefined' && window.innerWidth >= 768) { // md breakpoint
      if (dropdownTimeoutRef.current) {
        clearTimeout(dropdownTimeoutRef.current);
      }
      setOpenDropdown(menuName);
    }
  };

  const handleMouseLeave = () => {
    if (typeof window !== 'undefined' && window.innerWidth >= 768) { // md breakpoint
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
    
    // Clean up event on unmount
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
    <nav className="sticky  top-0 z-50 w-full  bg-zinc-900 border-b border-zinc-800">
      <div className="container max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4 sm:gap-8"> 
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-md bg-teal-500 flex items-center justify-center text-white font-bold text-lg sm:text-xl">
              S
            </div>
            <span className="font-bold text-lg sm:text-xl text-white hidden xs:inline-block">Sui Token Creator</span>
          </Link>

          <div className={`relative max-w-md w-full hidden md:block ${isSearchFocused ? "ring-1 ring-teal-500" : ""}`}>
            <Input
              type="text"
              placeholder="Search for tokens or tools"
              className="pl-10 pr-4 py-2 w-full bg-zinc-800 border-zinc-700 text-zinc-300 placeholder:text-zinc-500 focus-visible:ring-teal-500"
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-500" size={18} />
          </div>
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
                  className="w-full px-3 py-2  text-left cursor-pointer text-zinc-300 hover:text-white hover:bg-zinc-700 transition-colors duration-150"
                  onClick={handleFungibleTokenClick}
                >
                  Fungible Token
                </button>
                <button
                  className="w-full px-3 py-2 text-left cursor-pointer text-zinc-300 hover:text-white hover:bg-zinc-700 transition-colors duration-150"
                  onClick={handleNftCollectionClick}
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
                <button className="w-full px-3 py-2 cursor-pointer text-left text-zinc-300 hover:text-white hover:bg-zinc-700 transition-colors duration-150">
                  Explorer
                </button>
                <button className="w-full px-3 py-2 cursor-pointer text-left text-zinc-300 hover:text-white hover:bg-zinc-700 transition-colors duration-150">
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
                <button className="w-full px-3 py-2 text-left cursor-pointer text-zinc-300 hover:text-white hover:bg-zinc-700 transition-colors duration-150">
                  Getting Started
                </button>
                <button className="w-full px-3 py-2 text-left cursor-pointer text-zinc-300 hover:text-white hover:bg-zinc-700 transition-colors duration-150">
                  API Reference
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
                  {/* Wallet address with copy feature */}
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
                      >
                        {copySuccess ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
                      </button>
                    </div>
                  </div>
                  
                  <button 
                    className="w-full px-3 py-2 text-left cursor-pointer text-zinc-300 hover:text-white hover:bg-zinc-700 transition-colors duration-150"
                    onClick={handleDashboardClick}
                  >
                    My Tokens
                  </button>
                  <button className="w-full px-3 py-2 text-left cursor-pointer text-zinc-300 hover:text-white hover:bg-zinc-700 transition-colors duration-150">
                    Transaction History
                  </button>
                  <div className="border-t border-zinc-700 mt-1"></div>
                  <button 
                    className="w-full px-3 py-2 text-left cursor-pointer text-zinc-300 hover:text-white hover:bg-zinc-700 transition-colors duration-150"
                    onClick={() => disconnect()}
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
            <Button className="bg-teal-500  hover:bg-teal-600 text-white border-0" disabled>
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
            <Input
              type="text"
              placeholder="Search"
              className="w-full bg-zinc-800 border-zinc-700 text-zinc-300 placeholder:text-zinc-500"
            />
          </div>

          {/* Mobile Nav Items */}
          <div className="border-b border-zinc-800 pb-2 mb-2">
            {/* Create Dropdown */}
            <div className="px-4 py-2">
              <button 
                className="flex items-center justify-between w-full text-left text-zinc-300"
                onClick={() => setOpenDropdown(openDropdown === 'mobile-create' ? null : 'mobile-create')}
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
                >
                  Fungible Token
                </button>
                <button 
                  className="pl-4 py-2 w-full text-left text-zinc-400 hover:text-white"
                  onClick={handleNftCollectionClick}
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
                <button className="pl-4 py-2 w-full text-left text-zinc-400 hover:text-white">
                  Explorer
                </button>
                <button className="pl-4 py-2 w-full text-left text-zinc-400 hover:text-white">
                  Gas Estimator
                </button>
              </div>
            </div>

            {/* Docs Dropdown */}
            <div className="px-4 py-2">
              <button 
                className="flex items-center justify-between w-full text-left text-zinc-300"
                onClick={() => setOpenDropdown(openDropdown === 'mobile-docs' ? null : 'mobile-docs')}
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
                <button className="pl-4 py-2 w-full text-left text-zinc-400 hover:text-white">
                  Getting Started
                </button>
                <button className="pl-4 py-2 w-full text-left text-zinc-400 hover:text-white">
                  API Reference
                </button>
              </div>
            </div>

            <button 
              className="px-4 py-2 w-full text-left text-zinc-300 hover:text-white flex items-center"
              onClick={handleDashboardClick}
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
                  >
                    {copySuccess ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
                  </button>
                </div>
                <div className="mt-2 pt-2 border-t border-zinc-700">
                  <button 
                    className="text-sm text-zinc-300 hover:text-white w-full text-left"
                    onClick={() => disconnect()}
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