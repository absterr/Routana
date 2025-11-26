import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ArrowRight } from "lucide-react"

interface Goal {
  id: number
  title: string
  description?: string
  progress: number
  timeframe: string
}

const GoalPreview = ({ goal }: { goal: Goal }) => {
  const { id, title, description, progress, timeframe } = goal;
  return (
    <Collapsible key={id} className="p-5">
      <CollapsibleTrigger className="w-full group text-left">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-gray-900 text-pretty">{title}</h3>
            <p className="text-sm text-gray-600 mt-1">{description}</p>

            <div className="pt-4">
              <div className="flex items-center justify-between pb-2">
                <span className="text-xs font-semibold text-gray-600">Progress</span>
                <span className="text-xs font-semibold text-purple-600">{progress}%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-linear-to-r from-purple-600 to-purple-500 rounded-full"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>

            <p className="text-xs text-gray-500 pt-3">{timeframe} remaining</p>
          </div>
          <div className="shrink-0 text-purple-600">
            <ArrowRight
              className={`w-6 h-6 transition-transform duration-100 group-aria-expanded:rotate-90`}
            />
          </div>
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent
        className="pt-8 overflow-hidden">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-semibold text-gray-900 pb-3">Phases</h4>
            {/* Strikethrough if completed, highlight if in progress, greyed out if undone*/}
            <div className="flex flex-col gap-y-2">
              {[
                "Week 1-2: Fundamentals",
                "Week 3-4: Core Concepts",
                "Week 5-6: Projects",
                "Week 7-8: Advanced Topics",
              ].map((milestone, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div
                    className={`w-2 h-2 rounded-full ${idx < 2 ? "bg-purple-600" : "bg-gray-300"}`}
                  ></div>
                  <span className={`text-sm ${idx < 2 ? "text-gray-900 font-medium" : "text-gray-600"}`}>
                    {milestone}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900 pb-3">Starred resources</h4>
            <div className="flex flex-col gap-y-2">
              {["Interactive Courses", "Video Tutorials", "Documentation", "Practice Projects"].map(
                (resource, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-2 bg-white rounded-lg border border-gray-200 hover:border-purple-300 transition-colors cursor-pointer"
                  >
                    {/*An icon instead of this dot describing what type of resource is it */}
                    <div className="w-2 h-2 rounded-full bg-purple-600"></div>
                    <span className="text-sm text-gray-700 flex-1">{resource}</span>
                    <span className="text-xs text-gray-400">→</span>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default GoalPreview;
