'use client'

import React from 'react'
import {
  Mail,
  Phone,
  MapPin,
  Twitter,
  Linkedin,
  Youtube,
  Shield,
  Globe,
  Clock,
  ArrowRight
} from 'lucide-react'

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-primary-500 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="mb-6">
              <h3 className="font-heading text-2xl font-bold text-white mb-2">
                RecruitOps
              </h3>
              <p className="font-body text-cream-200 leading-relaxed">
                Preventing lost placements through superior pipeline visibility.
                Built specifically for UK recruitment consultants and agencies.
              </p>
            </div>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-accent-400 flex-shrink-0" />
                <span className="font-body text-sm text-gray-300">hello@recruitops.co.uk</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span className="font-body text-sm text-gray-300">+44 20 3814 1234</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span className="font-body text-sm text-gray-300">London, United Kingdom</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-4 mt-6">
              <a
                href="#"
                className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors"
                aria-label="Follow us on Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors"
                aria-label="Connect on LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors"
                aria-label="Watch on YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="font-body text-lg font-semibold text-white mb-4">Product</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="font-body text-gray-400 hover:text-white transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#" className="font-body text-gray-400 hover:text-white transition-colors">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="font-body text-gray-400 hover:text-white transition-colors">
                  Pipeline Management
                </a>
              </li>
              <li>
                <a href="#" className="font-body text-gray-400 hover:text-white transition-colors">
                  Analytics & Reporting
                </a>
              </li>
              <li>
                <a href="#" className="font-body text-gray-400 hover:text-white transition-colors">
                  Integrations
                </a>
              </li>
              <li>
                <a href="#" className="font-body text-gray-400 hover:text-white transition-colors">
                  Mobile App
                </a>
              </li>
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h4 className="font-body text-lg font-semibold text-white mb-4">Resources</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="font-body text-gray-400 hover:text-white transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="font-body text-gray-400 hover:text-white transition-colors">
                  Video Tutorials
                </a>
              </li>
              <li>
                <a href="#" className="font-body text-gray-400 hover:text-white transition-colors">
                  API Documentation
                </a>
              </li>
              <li>
                <a href="#" className="font-body text-gray-400 hover:text-white transition-colors">
                  Case Studies
                </a>
              </li>
              <li>
                <a href="#" className="font-body text-gray-400 hover:text-white transition-colors">
                  Industry Reports
                </a>
              </li>
              <li>
                <a href="#" className="font-body text-gray-400 hover:text-white transition-colors">
                  Recruitment Blog
                </a>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-body text-lg font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="font-body text-gray-400 hover:text-white transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="font-body text-gray-400 hover:text-white transition-colors">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="font-body text-gray-400 hover:text-white transition-colors">
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="font-body text-gray-400 hover:text-white transition-colors">
                  Press Kit
                </a>
              </li>
              <li>
                <a href="#" className="font-body text-gray-400 hover:text-white transition-colors">
                  Partners
                </a>
              </li>
              <li>
                <a href="#" className="font-body text-gray-400 hover:text-white transition-colors">
                  Affiliate Program
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="border-t border-gray-800 pt-8 mb-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h4 className="font-body text-xl font-semibold text-white mb-2">
                Stay Updated
              </h4>
              <p className="font-body text-gray-400">
                Get weekly insights on UK recruitment trends and pipeline optimization tips.
              </p>
            </div>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-body font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2">
                Subscribe
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="border-t border-gray-800 pt-8 mb-8">
          <div className="grid md:grid-cols-4 gap-6 text-center">
            <div className="flex flex-col items-center">
              <Shield className="w-8 h-8 text-green-400 mb-2" />
              <span className="font-body text-sm text-gray-400">GDPR Compliant</span>
            </div>
            <div className="flex flex-col items-center">
              <Globe className="w-8 h-8 text-blue-400 mb-2" />
              <span className="font-body text-sm text-gray-400">UK Data Centers</span>
            </div>
            <div className="flex flex-col items-center">
              <Clock className="w-8 h-8 text-purple-400 mb-2" />
              <span className="font-body text-sm text-gray-400">99.9% Uptime</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 bg-gray-700 rounded flex items-center justify-center mb-2">
                <span className="text-xs font-bold text-white">SSL</span>
              </div>
              <span className="font-body text-sm text-gray-400">Bank-Grade Security</span>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-wrap gap-6 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
              <a href="#" className="hover:text-white transition-colors">Data Processing</a>
              <a href="#" className="hover:text-white transition-colors">Accessibility</a>
            </div>
            <p className="font-body text-sm text-gray-400">
              © {currentYear} RecruitOps Ltd. All rights reserved.
            </p>
          </div>
        </div>
      </div>

      {/* Final CTA Strip */}
      <div className="bg-blue-600 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <p className="font-body text-white font-semibold">
                Ready to stop losing placements?
              </p>
              <p className="font-body text-blue-100 text-sm">
                Join 2,500+ UK recruitment professionals using RecruitOps
              </p>
            </div>
            <a href="/onboarding" className="bg-white text-blue-600 px-6 py-3 rounded-lg font-body font-semibold hover:bg-gray-100 transition-colors whitespace-nowrap">
              Start Free Trial
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer