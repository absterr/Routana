import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { type DashboardGoal, resourceTypeIcons } from "@/lib/app/types";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const GoalPreview = ({ goal }: { goal: DashboardGoal }) => {
  const { id, title, description, phases, progress, resources, timeframe } = goal;
  const sortedPhases = phases.sort((a, b) => a.orderIndex - b.orderIndex);

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

            <p className="text-xs text-gray-500 pt-3">{timeframe}</p>
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
            <div className="flex flex-col gap-y-2">
              {sortedPhases.map(({ title, status, orderIndex }) => (
                <div key={orderIndex} className="flex items-center gap-3">
                  <div
                    className={cn("w-2 h-2 rounded-full", {
                      "bg-purple-600": status === "Active",
                      "bg-gray-300": status === "Pending",
                      "bg-gray-800": status === "Completed",
                      "text-gray-600": status === "Skipped"
                    })}
                  ></div>
                  <span className={cn("text-sm", {
                    "text-gray-900 font-medium": status === "Active",
                    "text-gray-600": status === "Pending",
                    "text-gray-800 line-through": status === "Completed",
                    "text-gray-600 line-through": status === "Skipped"
                  }
                  )}>
                    {title}
                  </span>
                </div>
              ))}
            </div>
          </div>
          {resources.length > 0 &&
            <div>
              <h4 className="text-sm font-semibold text-gray-900 pb-3">Starred resources</h4>
              <div className="flex flex-col gap-y-2">
                {resources.map(
                  (resource, idx) => {
                    const Icon = resourceTypeIcons[resource.type];
                    return (
                      <a
                        key={idx}
                        href={resource.url}
                        className="flex items-center gap-3 p-2 bg-white rounded-lg border border-gray-200 hover:border-purple-300 transition-colors cursor-pointer"
                      >
                        <Icon className="w-4 h-4 text-purple-600" />
                        <span className="text-sm text-gray-700 flex-1 truncate">{resource.title}</span>
                        <span className="text-xs text-gray-400">→</span>
                      </a>
                    );
                  },
                )}
              </div>
            </div>
          }
        </div>
        <div className="pt-10">
          <Link to={`/goals/${id}`} className="text-sm">
            <Button variant={"outline"} className="shadow-none cursor-pointer rounded-lg">View roadmap</Button>
          </Link>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default GoalPreview;
