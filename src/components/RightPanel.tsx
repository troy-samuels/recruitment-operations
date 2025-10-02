'use client'

import React from 'react'
import {
  Clock,
  Calendar,
  MapPin,
  DollarSign,
  Phone,
  Mail,
  User,
  Building,
  Briefcase,
  TrendingUp,
  Star
} from 'lucide-react'

interface RightPanelProps {
  collapsed?: boolean
}

const RightPanel: React.FC<RightPanelProps> = ({ collapsed = false }) => {
  if (collapsed) {
    return (
      <div className="h-full flex flex-col bg-white">
        {/* Collapsed State - Essential Icons */}
        <div className="p-3 space-y-4">
          {/* Activity Indicator */}
          <div className="flex justify-center">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center" title="Recent Activity">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            </div>
          </div>

          {/* Tasks Indicator */}
          <div className="flex justify-center">
            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center" title="Urgent Tasks">
              <Clock className="w-4 h-4 text-red-600" />
            </div>
          </div>

          {/* Stats Indicator */}
          <div className="flex justify-center">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center" title="Performance Stats">
              <TrendingUp className="w-4 h-4 text-blue-600" />
            </div>
          </div>

          {/* Hot Roles Indicator */}
          <div className="flex justify-center">
            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center" title="Hot Roles">
              <Briefcase className="w-4 h-4 text-orange-600" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Recent Activity */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-body text-sm font-semibold text-gray-900 mb-3">Recent Activity</h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
            <div>
              <p className="text-sm text-gray-900">
                <span className="font-medium">Sarah Chen</span> moved to Interview stage
              </p>
              <p className="text-xs text-gray-500">2 minutes ago</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
            <div>
              <p className="text-sm text-gray-900">
                New candidate <span className="font-medium">Mike Johnson</span> added
              </p>
              <p className="text-xs text-gray-500">15 minutes ago</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
            <div>
              <p className="text-sm text-gray-900">
                Interview scheduled with <span className="font-medium">Emma Wilson</span>
              </p>
              <p className="text-xs text-gray-500">1 hour ago</p>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Tasks */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-body text-sm font-semibold text-gray-900 mb-3">Upcoming Tasks</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-2 bg-red-50 rounded-lg">
            <Clock className="w-4 h-4 text-red-600" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-900">Follow up with Sarah Chen</p>
              <p className="text-xs text-red-600">Due in 30 minutes</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2 bg-orange-50 rounded-lg">
            <Calendar className="w-4 h-4 text-orange-600" />
            <div className="flex-1">
              <p className="text-sm font-medium text-orange-900">Interview with Emma Wilson</p>
              <p className="text-xs text-orange-600">Today at 3:00 PM</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2 bg-blue-50 rounded-lg">
            <Phone className="w-4 h-4 text-blue-600" />
            <div className="flex-1">
              <p className="text-sm font-medium text-blue-900">Call Mike Johnson</p>
              <p className="text-xs text-blue-600">Tomorrow at 10:00 AM</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-body text-sm font-semibold text-gray-900 mb-3">Quick Stats</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-green-50 rounded-lg">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-xs text-green-600 font-medium">This Week</span>
            </div>
            <div className="text-lg font-bold text-green-900">2</div>
            <div className="text-xs text-green-700">Placements</div>
          </div>

          <div className="p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-blue-600" />
              <span className="text-xs text-blue-600 font-medium">Active</span>
            </div>
            <div className="text-lg font-bold text-blue-900">12</div>
            <div className="text-xs text-blue-700">Candidates</div>
          </div>

          <div className="p-3 bg-purple-50 rounded-lg">
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-purple-600" />
              <span className="text-xs text-purple-600 font-medium">Open</span>
            </div>
            <div className="text-lg font-bold text-purple-900">5</div>
            <div className="text-xs text-purple-700">Roles</div>
          </div>

          <div className="p-3 bg-yellow-50 rounded-lg">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-600" />
              <span className="text-xs text-yellow-600 font-medium">Rating</span>
            </div>
            <div className="text-lg font-bold text-yellow-900">4.9</div>
            <div className="text-xs text-yellow-700">Client Score</div>
          </div>
        </div>
      </div>

      {/* Hot Roles */}
      <div className="p-4">
        <h3 className="font-body text-sm font-semibold text-gray-900 mb-3">Hot Roles</h3>
        <div className="space-y-3">
          <div className="p-3 border border-red-200 bg-red-50 rounded-lg">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-medium text-sm text-gray-900">Senior React Developer</h4>
                <p className="text-xs text-gray-600 flex items-center gap-1 mt-1">
                  <Building className="w-3 h-3" />
                  TechFlow Ltd
                </p>
                <p className="text-xs text-gray-600 flex items-center gap-1">
                  <DollarSign className="w-3 h-3" />
                  £60k-75k
                </p>
              </div>
              <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full font-medium">
                URGENT
              </span>
            </div>
          </div>

          <div className="p-3 border border-orange-200 bg-orange-50 rounded-lg">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-medium text-sm text-gray-900">Product Manager</h4>
                <p className="text-xs text-gray-600 flex items-center gap-1 mt-1">
                  <Building className="w-3 h-3" />
                  InnovateCo
                </p>
                <p className="text-xs text-gray-600 flex items-center gap-1">
                  <DollarSign className="w-3 h-3" />
                  £70k-85k
                </p>
              </div>
              <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full font-medium">
                HIGH
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RightPanel