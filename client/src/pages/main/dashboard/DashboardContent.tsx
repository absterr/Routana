import { Button } from "@/components/ui/button"
import { getDashboardGoals } from "@/lib/goals/goals-api"
import type { DashboardGoal } from "@/lib/goals/types"
import { cn } from "@/lib/utils"
import { useSuspenseQuery } from "@tanstack/react-query"
import { ArrowLeft, Plus, Rocket } from "lucide-react"
import { Link } from "react-router-dom"
import GoalPreview from "./GoalPreview"

const DashboardContent = () => {
  const { data: dashboardGoals } = useSuspenseQuery<DashboardGoal[], Error>({
    queryKey: ['dashboardGoals'],
    queryFn: getDashboardGoals,
    refetchOnWindowFocus: false,
  });

  const activeGoals = dashboardGoals
    .filter((goal) => goal.status === "Active");
  const totalProgress = activeGoals.length > 0
    ? Math.round(activeGoals.reduce((sum, g) => sum + g.progress, 0) / activeGoals.length)
    : 0;
  const completed = dashboardGoals
    .filter((goal) => goal.status === "Completed").length;
  const hasNoGoals = dashboardGoals.length === 0;

  const quickStats = [
    { label: "Active Goals", value: activeGoals.length },
    { label: "Total Progress", value: `${totalProgress}%` },
    { label: "Completed", value: completed },
  ];

  return (
    <>
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
          {!hasNoGoals &&
            <Link
              to={"/goals"}
              className="underline text-gray-600 hover:text-purple-600 transition-colors duration-100"
            >
              View all goals
            </Link>
          }
        </div>
      </div>

      <div className="pb-16">
        <div className="w-full flex justify-between items-center pb-4">
          <h2 className="text-lg sm:text-2xl font-bold text-gray-900 tracking-tight">Active Goals</h2>
          {activeGoals.length !== 0 &&
            <Link to={"/new-goal"}>
              <Button
                size={"sm"}
                className="bg-purple-600 text-white text-xs sm:text-sm font-semibold hover:bg-purple-700 rounded-lg transition-colors inline-flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-5 h-5" />
                New Goal
              </Button>
            </Link>
          }
        </div>
        {activeGoals.length === 0 ? (
          <div className="py-12 sm:py-16 space-y-4 px-4 flex flex-col items-center gap-1">
            <Rocket className="w-9 h-9" />
            <div className="text-center pb-2">
              <h3 className="text-xl sm:text-2xl font-bold text-balance">
                {hasNoGoals ? "No goals yet" : "No active goals yet"}
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground max-w-md mx-auto pt-2">
                {hasNoGoals
                  ? "Create your first learning goal to get started on your growth journey"
                  : "Activate your goals or create a new goal to get started"
                }
              </p>
            </div>
            <Link to={hasNoGoals ? "/new-goal" : "/goals"}>
              <Button
                className="bg-purple-600 text-white font-semibold hover:bg-purple-700 rounded-lg transition-colors inline-flex items-center gap-2 hover:cursor-pointer"
              >
                {hasNoGoals
                  ? <>
                    <Plus className="w-5 h-5" />
                    Create Your First Goal
                  </>
                  : <>
                    <ArrowLeft className="w-5 h-5" />
                    View All Goals
                  </>
                }
              </Button>
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 transition-all duration-150">
            <div className="flex flex-col gap-4">
              {activeGoals.map((goal, i) => (
                <div key={goal.id} className="px-6">
                  <div className={cn("py-4 border-gray-200",
                    {"border-b": i !== activeGoals.length - 1}
                  )}>
                    <GoalPreview goal={goal} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
        }
      </div>
    </>
  );
}

export default DashboardContent;
