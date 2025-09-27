export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-6xl font-heading text-gray-900 mb-6">
            Recruitment Operations
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Real-time pipeline dashboard with drag-and-drop Kanban board,
            activity tracking, and smart reminders for UK recruitment consultants.
          </p>
          <div className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
            🚀 Fresh Start Complete
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-heading text-gray-900 mb-2">Pipeline Visibility</h3>
            <p className="text-gray-600">
              See every candidate, every role, every action needed—in one unified view.
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-heading text-gray-900 mb-2">Smart Reminders</h3>
            <p className="text-gray-600">
              Never lose a placement again with proactive alerts and follow-up tracking.
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-heading text-gray-900 mb-2">Performance Tracking</h3>
            <p className="text-gray-600">
              Real-time metrics against targets creating accountability and momentum.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}