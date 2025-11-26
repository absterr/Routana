import { Plus } from "lucide-react"
import { useState } from "react"
import GoalPreview from "./GoalPreview"

interface Goal {
  id: number
  title: string
  description?: string
  progress: number
  timeframe: string
}

const mockGoals: Goal[] = [
  {
    id: 1,
    title: "Become a full-stack developer",
    description: "Master frontend and backend technologies",
    progress: 45,
    timeframe: "3 months",
  },
  {
    id: 2,
    title: "Learn React deeply",
    description: "Master React hooks, context, and performance optimization",
    progress: 60,
    timeframe: "6 weeks",
  },
  {
    id: 3,
    title: "Build 5 portfolio projects",
    description: "Create real-world projects for your portfolio",
    progress: 20,
    timeframe: "4 months",
  },
]

const quickStats = [
  { label: "Active Goals", value: "3", color: "from-purple-600 to-purple-500" },
  { label: "Total Progress", value: "42%", color: "from-purple-500 to-purple-400" },
  { label: "Completed", value: "12", color: "from-purple-600 to-indigo-600" },
]

const DashboardPage = () => {
  const [expandedGoal, setExpandedGoal] = useState<number | null>(null);

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 pt-2 pb-6">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
        {quickStats.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-xl p-6 border border-gray-200 shadow-xs">
            <p className="text-sm text-gray-600 font-medium">{stat.label}</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
            <div className={`h-1 w-12 rounded-full bg-linear-to-r ${stat.color} mt-4`}></div>
          </div>
        ))}
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-900 pb-6">Active Goals</h2>
        <div className="flex flex-col gap-4">
          {mockGoals.map((goal) => (
            <GoalPreview key={goal.id} goal={goal} expandedGoal={expandedGoal} setExpandedGoal={setExpandedGoal} />
          ))}
        </div>
      </div>

      <div className="pt-12">
        <div className="bg-linear-to-r from-purple-50 to-purple-100 rounded-xl p-8 text-center border border-purple-200">
          <h3 className="text-xl font-bold text-gray-900">Ready to start a new learning journey?</h3>
          <p className="text-gray-600 pt-2">Create your first goal and begin tracking your progress today.</p>
          <div className="pt-4">
            <button className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 transition-colors inline-flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Create a Goal
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default DashboardPage;
