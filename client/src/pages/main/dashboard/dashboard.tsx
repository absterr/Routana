import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Plus, Rocket } from "lucide-react"
import { Link } from "react-router-dom"
import GoalPreview from "./GoalPreview"

const mockGoals = [
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
];

const quickStats = [
  { label: "Active Goals", value: "3" },
  { label: "Total Progress", value: "42%" },
  { label: "Completed", value: "12" },
]

const DashboardPage = () => {
  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 pt-2 pb-6">Dashboard</h1>

      <div className="pb-12">
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="grid grid-cols-1 sm:grid-cols-3 sm:gap-4">
            {quickStats.map((stat, i) => (
              <div key={i} className="px-6 sm:p-6">
                <div className={cn("py-6 sm:py-2 border-gray-200", {
                  "border-b sm:border-r sm:border-b-0": i !== quickStats.length - 1
                })}>
                  <p className="text-sm text-gray-600 font-semibold">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 pt-2">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="py-4 px-1">
          <Link to={"/goals"} className="underline text-gray-600 hover:text-purple-600 transition-colors duration-100">View all goals</Link>
        </div>
      </div>

      <div>
        <div className="w-full flex justify-between items-center pb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Active Goals</h2>
          </div>
          {mockGoals.length !== 0 &&
            <Link to={"/new-goal"}>
              <Button className="bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 transition-colors inline-flex items-center gap-2">
                <Plus className="w-5 h-5" />
                New Goal
              </Button>
            </Link>
          }
        </div>
        {mockGoals.length === 0 ? (
          <div className="py-12 sm:py-16 space-y-4 px-4 flex flex-col items-center gap-1">
            <Rocket className="w-9 h-9" />
            <div className="text-center pb-2">
              <h3 className="text-xl sm:text-2xl font-bold text-balance">No goals yet</h3>
              <p className="text-sm sm:text-base text-muted-foreground max-w-md mx-auto pt-2">
                Create your first learning goal to get started on your growth journey
              </p>
            </div>
            <Link to={"/new-goal"}>
              <Button
                className="bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 transition-colors inline-flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Create Your First Goal
              </Button>
            </Link>
          </div>
        ) :
          <div className="bg-white rounded-xl border border-gray-200 transition-all duration-150">
            <div className="flex flex-col gap-4">
              {mockGoals.map((goal, i) => (
                <div key={goal.id} className="px-6">
                  <div className={cn("py-4 border-gray-200",
                    { "border-b": i !== mockGoals.length - 1 }
                  )}>
                    <GoalPreview goal={goal} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        }
      </div>
    </section>
  );
}

export default DashboardPage;
