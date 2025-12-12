import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Link } from "react-router-dom";
import GoalsContent from "./GoalsContent";

const GoalsTableSkeleton = () => (
  <div className="flex flex-col gap-4">
    <div className="flex items-center justify-between gap-8">
      <div className="flex flex-1 items-center gap-4">
        <Skeleton className="h-8 w-[180px] lg:w-[250px]" />
        <Skeleton className="hidden md:block h-8 w-[90px] border-dashed" />
        <Skeleton className="hidden md:block h-8 w-20" />
      </div>
      <Skeleton className="hidden md:block h-8 w-[70px]" />
    </div>

    <div className="rounded-md border border-gray-200 overflow-hidden">
      <div className="h-10 bg-gray-50/50 border-b border-gray-200" />
      {[...Array(4)].map((_, i) => (
        <div key={i} className="flex items-center p-4 gap-4 border-b border-gray-100 last:border-0">
          <Skeleton className="h-4 w-4" />
          <div className="space-y-1">
            <Skeleton className="h-4 w-[200px]" />
          </div>
          <Skeleton className="h-4 flex-1 hidden sm:block" />
          <Skeleton className="h-4 w-[100px]" />
          <Skeleton className="h-8 w-8 rounded-md" />
        </div>
      ))}
    </div>

    <div className="flex items-center justify-end gap-2 py-2">
      <Skeleton className="h-8 w-[100px]" />
      <div className="flex gap-1">
        <Skeleton className="h-8 w-8" />
        <Skeleton className="h-8 w-8" />
      </div>
    </div>
  </div>
);

const ErrorFallback = ({ resetErrorBoundary }: { resetErrorBoundary: () => void }) => (
  <div className="min-h-[50vh] flex flex-col items-center justify-center gap-4">
    <div className="text-red-600 font-semibold text-xl">Error fetching content</div>
    <Button
      className="rounded-lg shadow-none"
      onClick={resetErrorBoundary}
      variant="outline"
    >
      Try again
    </Button>
  </div>
);

export default function GoalsPage() {
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

        <QueryErrorResetBoundary>
          {({ reset }) => (
            <ErrorBoundary onReset={reset} FallbackComponent={ErrorFallback}>
              <Suspense fallback={<GoalsTableSkeleton />}>
                <GoalsContent />
              </Suspense>
            </ErrorBoundary>
          )}
        </QueryErrorResetBoundary>
      </div>
    </section>
  );
}
