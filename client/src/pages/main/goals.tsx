import LoadingSpinner from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { getAllGoals } from "@/lib/goals/goals-api";
import type { Goal } from "@/lib/goals/types";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import columns from "@/components/CustomTable/Columns";
import GoalsTable from "@/components/CustomTable/GoalsTable";

const GoalsPage = () => {
  const { data: userGoals, isLoading, error } = useQuery<Goal[], Error>({
    queryKey: ['allGoals'],
    queryFn: getAllGoals,
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">
      <LoadingSpinner size={7} />
    </div>;
  }

  if (error) {
    return <div
      className='min-h-screen flex items-center justify-center text-red-600 font-semibold text-2xl'>
      Error loading dashboard
    </div>;
  }

  if (!userGoals) return null;

  return (
    <section className="max-w-5xl mx-auto">
      <div className="flex flex-col gap-8 py-12 px-4 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
              Goals
            </h1>
            <p className="text-muted-foreground">
              Here&apos;s a list of your goals.
            </p>
          </div>
          <div className="md:hidden">
            <Link to={"/new-goal"}>
              <Button
                size="icon-sm"
                className="bg-purple-600 text-white font-semibold rounded-full hover:bg-purple-700 transition-colors">
                <Plus />
              </Button>
            </Link>
          </div>
        </header>
        <GoalsTable data={userGoals} columns={columns} />
      </div>
    </section>
  );
}

export default GoalsPage;
