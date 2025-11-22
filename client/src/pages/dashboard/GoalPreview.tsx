import { ArrowRight } from "lucide-react";
import GoalDetails from "./GoalDetails";

interface Goal {
  id: number
  title: string
  description?: string
  progress: number
  timeframe: string
}

const GoalPreview = ({ goal, expandedGoal, setExpandedGoal }: {
  goal: Goal;
  expandedGoal: number | null;
  setExpandedGoal: React.Dispatch<React.SetStateAction<number | null>>
}) => {
  return <div
    className="bg-white rounded-xl border border-gray-200 shadow-xs hover:shadow-sm transition-all duration-150"
  >
    <button
      onClick={() => setExpandedGoal(expandedGoal === goal.id ? null : goal.id)}
      className="w-full p-6 text-left"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-gray-900 text-pretty">{goal.title}</h3>
          <p className="text-sm text-gray-600 mt-1">{goal.description}</p>

          <div className="pt-4">
            <div className="flex items-center justify-between pb-2">
              <span className="text-xs font-semibold text-gray-600">Progress</span>
              <span className="text-xs font-semibold text-purple-600">{goal.progress}%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-linear-to-r from-purple-600 to-purple-500 rounded-full transition-all duration-500"
                style={{ width: `${goal.progress}%` }}
              ></div>
            </div>
          </div>

          <p className="text-xs text-gray-500 pt-3">{goal.timeframe} remaining</p>
        </div>
        <div className="shrink-0 text-purple-600">
          <ArrowRight
            className={`w-6 h-6 transition-transform duration-300 ${expandedGoal === goal.id ? "rotate-90" : ""}`}
          />
        </div>
      </div>
    </button>

    {expandedGoal === goal.id && (
      <GoalDetails />
    )}
  </div>
}

export default GoalPreview;
