'use client'

import React from 'react'
import { Menu, X, Users, Target } from 'lucide-react'

interface HeaderProps {
  className?: string
}

const Header: React.FC<HeaderProps> = ({ className = '' }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)

  return (
    <header className={`w-full bg-white border-b border-cream-200 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center space-x-3">
            <div className="relative w-8 h-8 bg-gradient-to-br from-accent-500 to-accent-600 rounded-lg flex items-center justify-center shadow-sm">
              <Users className="w-4 h-4 text-white" />
              <Target className="absolute -top-1 -right-1 w-3 h-3 text-success-500 bg-white rounded-full p-0.5" />
            </div>
            <span className="font-heading text-xl font-bold text-primary-500 tracking-tight">
              Jobwall
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a
              href="#how-it-works"
              className="font-body text-primary-400 hover:text-primary-500 transition-all duration-200 relative group py-2"
            >
              How It Works
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent-500 transition-all duration-200 group-hover:w-full"></span>
            </a>
            <a
              href="#pricing"
              className="font-body text-primary-400 hover:text-primary-500 transition-all duration-200 relative group py-2"
            >
              Pricing
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent-500 transition-all duration-200 group-hover:w-full"></span>
            </a>
            <a
              href="#resources"
              className="font-body text-primary-400 hover:text-primary-500 transition-all duration-200 relative group py-2"
            >
              Resources
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent-500 transition-all duration-200 group-hover:w-full"></span>
            </a>
          </nav>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <a href="/login" className="font-body text-primary-400 hover:text-primary-500 transition-all duration-200 px-4 py-2 rounded-lg hover:bg-cream-50">
              Sign in
            </a>
            <a href="/start/account" className="font-body bg-accent-500 text-white px-6 py-2 rounded-lg hover:bg-accent-600 transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5">
              Get Started
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-primary-400 hover:text-primary-500 transition-colors duration-200"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 py-4">
            <nav className="flex flex-col space-y-4">
              <a
                href="#how-it-works"
                className="font-body text-primary-400 hover:text-primary-500 transition-colors duration-200"
              >
                How It Works
              </a>
              <a
                href="#pricing"
                className="font-body text-primary-400 hover:text-primary-500 transition-colors duration-200"
              >
                Pricing
              </a>
              <a
                href="#resources"
                className="font-body text-primary-400 hover:text-primary-500 transition-colors duration-200"
              >
                Resources
              </a>
              <div className="flex flex-col space-y-3 pt-4 border-t border-gray-100">
                <a href="/login" className="font-body text-primary-400 hover:text-primary-500 transition-all duration-200 text-left px-4 py-2 rounded-lg hover:bg-cream-50">
                  Sign in
                </a>
                <a href="/start/account" className="font-body bg-accent-500 text-white px-6 py-2 rounded-lg hover:bg-accent-600 transition-all duration-200 text-left shadow-sm">
                  Get Started
                </a>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header