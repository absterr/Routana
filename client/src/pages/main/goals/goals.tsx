import LoadingSpinner from "@/components/LoadingSpinner";
import { getAllGoals } from "@/lib/goals/goals-api";
import { useQuery } from "@tanstack/react-query";
import columns from "./Columns";
import GoalsTable from "./CustomTable/GoalsTable";

interface Goal {
  id: string;
  title: string;
  description: string | undefined;
  status: "Active" | "Pending" | "Completed";
}

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
    <section className="flex justify-center min-h-screen">
      <div className="">
        <div className="flex flex-1 flex-col gap-8 p-8">
          <div className="flex items-center justify-between gap-2">
            <header className="flex flex-col gap-1">
              <h1 className="text-3xl font-semibold tracking-tight">
                Goals
              </h1>
              <p className="text-muted-foreground">
                Here&apos;s a list of your goals.
              </p>
            </header>
          </div>
            <GoalsTable data={userGoals} columns={columns} />
        </div>
      </div>
    </section>
  );
}

export default GoalsPage;
