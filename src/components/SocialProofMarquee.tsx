'use client'

import React from 'react'

interface CompanyLogo {
  name: string
  width: number
  height: number
}

const SocialProofMarquee: React.FC = () => {
  // UK recruitment companies with their typical logo proportions
  const companies: CompanyLogo[] = [
    { name: 'Reed', width: 120, height: 40 },
    { name: 'Hays', width: 100, height: 40 },
    { name: 'Robert Half', width: 140, height: 40 },
    { name: 'Michael Page', width: 130, height: 40 },
    { name: 'Adecco', width: 110, height: 40 },
    { name: 'Randstad', width: 120, height: 40 },
    { name: 'Manpower', width: 130, height: 40 },
    { name: 'Kelly Services', width: 140, height: 40 },
    { name: 'Office Angels', width: 130, height: 40 },
    { name: 'Temp Cover', width: 120, height: 40 },
  ]

  // Duplicate for seamless loop
  const duplicatedCompanies = [...companies, ...companies]

  return (
    <section className="py-12 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <p className="font-body text-sm text-gray-500 uppercase tracking-wide">
            Trusted by leading UK recruitment agencies
          </p>
        </div>

        {/* Marquee Container */}
        <div className="relative overflow-hidden">
          {/* Gradient overlays for smooth fade effect */}
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent z-10"></div>
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent z-10"></div>

          {/* Scrolling container */}
          <div className="flex animate-marquee">
            {duplicatedCompanies.map((company, index) => (
              <div
                key={`${company.name}-${index}`}
                className="flex-shrink-0 mx-8 flex items-center justify-center"
                style={{ width: `${company.width}px`, height: `${company.height}px` }}
              >
                {/* SVG Logo Placeholder - In production, these would be actual logo SVGs */}
                <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center transition-all duration-300 hover:bg-gray-300 group">
                  <span className="font-body text-xs font-semibold text-gray-400 group-hover:text-gray-600 text-center px-2">
                    {company.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trust statistics */}
        <div className="text-center mt-8">
          <p className="font-body text-sm text-gray-600">
            <span className="font-semibold text-blue-600">2,500+</span> recruitment professionals trust Jobwall
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-marquee {
          animation: marquee 30s linear infinite;
        }

        .animate-marquee:hover {
          animation-play-state: paused;
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-marquee {
            animation: none;
          }
        }
      `}</style>
    </section>
  )
}

export default SocialProofMarquee