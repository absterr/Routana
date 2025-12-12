import LoadingSpinner from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import NotFound from "@/pages/not-found";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useParams } from "react-router-dom";
import RoadmapContent from "./RoadmapContent";

const RoadmapSkeleton = () => (
 <div className="min-h-[90vh] flex items-center justify-center">
   <LoadingSpinner size={8} />
 </div>
)

const ErrorFallback = ({ resetErrorBoundary }: { resetErrorBoundary: () => void }) => (
  <div className="min-h-[50vh] flex flex-col items-center justify-center gap-4">
    <div className="text-red-600 font-semibold text-xl">Error loading roadmap</div>
    <Button
      className="rounded-lg shadow-none"
      onClick={resetErrorBoundary}
      variant="outline"
    >
      Try again
    </Button>
  </div>
);

export default function RoadmapPage () {
  const { id } = useParams();

  if (!id || !/^[0-9a-fA-F-]{36}$/.test(id)) {
    return <NotFound />
  }

  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary onReset={reset} FallbackComponent={ErrorFallback}>
          <Suspense fallback={<RoadmapSkeleton />}>
            <RoadmapContent id={id} />
          </Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
};
