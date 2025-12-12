import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import DashboardContent from "./DashboardContent";

const DashboardSkeleton = () => (
  <div className="">
    <div className="pb-18">
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="grid grid-cols-1 sm:grid-cols-3 sm:gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="px-6 sm:p-6">
              <div className={cn("py-6.5 sm:py-2.5 border-gray-200", {
                "border-b sm:border-r sm:border-b-0": i !== 3
              })}>
                <div>
                  <Skeleton className="h-4 w-24" />
                </div>
                <div className="pt-3">
                  <Skeleton className="h-8 w-16" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-10 w-28" />
      </div>
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6">
          <div className="flex flex-col gap-6">
            <Skeleton className="h-5 w-1/2" />
            <Skeleton className="h-6 w-3/4" />
            <div className="pt-2">
              <Skeleton className="h-2 w-full rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const ErrorFallback = ({ resetErrorBoundary }: { resetErrorBoundary: () => void }) => (
  <div className="min-h-[50vh] flex flex-col items-center justify-center gap-4">
    <div className="text-red-600 font-semibold text-xl">Error loading dashboard</div>
    <Button
      className="rounded-lg shadow-none"
      onClick={resetErrorBoundary}
      variant="outline"
    >
      Try again
    </Button>
  </div>
);

export default function DashboardPage() {
  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 pt-2 pb-6 tracking-tight">Dashboard</h1>

      <QueryErrorResetBoundary>
        {({ reset }) => (
          <ErrorBoundary onReset={reset} FallbackComponent={ErrorFallback}>
            <Suspense fallback={<DashboardSkeleton />}>
              <DashboardContent />
            </Suspense>
          </ErrorBoundary>
        )}
      </QueryErrorResetBoundary>
    </section>
  );
}
