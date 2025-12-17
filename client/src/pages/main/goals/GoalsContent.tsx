import columns from "@/components/CustomTable/Columns";
import GoalsTable from "@/components/CustomTable/GoalsTable";
import { Button } from "@/components/ui/button";
import { getAllGoals } from "@/lib/app/app-api";
import type { Goal } from "@/lib/app/types";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Plus, Rocket } from "lucide-react";
import { Link } from "react-router-dom";

const GoalsContent = () => {
  const { data: userGoals } = useSuspenseQuery<Goal[], Error>({
    queryKey: ['allGoals'],
    queryFn: getAllGoals,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  const hasNoGoals = userGoals.length === 0;

  return <>
    {
      hasNoGoals ?
        <div className="py-12 sm:py-16 space-y-4 px-4 flex flex-col items-center gap-1">
          <Rocket className="w-9 h-9" />
          <div className="text-center pb-2">
            <h3 className="text-xl sm:text-2xl font-bold text-balance">
              No goals yet
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground max-w-md mx-auto pt-2">
              Create your first learning goal to get started on your growth journey
            </p>
          </div>
          <Link to={hasNoGoals ? "/new-goal" : "/goals"}>
            <Button
              className="bg-purple-600 text-white font-semibold hover:bg-purple-700 rounded-lg transition-colors inline-flex items-center gap-2 hover:cursor-pointer"
            >
              <Plus className="w-5 h-5" />
              Create Your First Goal
            </Button>
          </Link>
        </div>
        : <GoalsTable data={userGoals} columns={columns} />
    }
  </>
};

export default GoalsContent;
