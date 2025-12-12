import LoadingSpinner from '@/components/LoadingSpinner';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { findEntry, type ELKNode } from '@/lib/ELK';
import { getRoadmapGraph, getStarredResource } from '@/lib/goals/goals-api';
import type { RoadmapData } from '@/lib/goals/types';
import { cn } from '@/lib/utils';
import NotFound from '@/pages/not-found';
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Plus } from 'lucide-react';
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import NodeDrawer from './NodeDrawer';
import SVG from './SVG';

interface StarredResource {
  id: string;
  title: string;
  url: string;
}

const RoadmapPage = () => {
  const { id } = useParams();
  const [selectedNode, setSelectedNode] = useState<ELKNode | null>(null);
  const [isOpen, setOpen] = useState(false);
  const { data: roadmapData, isLoading, error } = useQuery<RoadmapData, Error>({
    queryKey: ['roadmap', id],
    enabled: !!id,
    queryFn: () => getRoadmapGraph(id!),
    refetchOnWindowFocus: false,
  });

  const { data: starredResources } = useQuery<StarredResource[]>({
    queryKey: ['starred', id],
    enabled: !!id,
    queryFn: () => getStarredResource(id!)
  });

  if (!id || !/^[0-9a-fA-F-]{36}$/.test(id)) {
    return <NotFound />
  }

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">
      <LoadingSpinner size={8} />
    </div>
  }

  if (!roadmapData) return null;

  if (error) {
    return <div
      className='min-h-screen flex items-center justify-center text-red-600 font-semibold text-2xl'>
      Error loading roadmap: {error.message}
    </div>;
  }



  const { roadmapJson, ...rest } = roadmapData;
  const roadmapTitle = roadmapJson.meta.title;
  const roadmapDescription = roadmapJson.meta.userContext.notes;
  const currentProgress = roadmapJson.progress;
  const entry = findEntry(selectedNode, roadmapJson);
  const starredUrls = Array.from(starredResources?.map((r) => r.url) || []);

  return <section className='flex flex-col gap-y-2 items-center py-8'>
    {/* px-4 sm:px-6 lg:px-8 */}
    <div className='w-full max-w-2xl px-4 sm:px-8'>
      <div className='bg-white rounded-xl border border-gray-200 flex flex-col gap-y-10 py-6 px-8'>
        <Link to={"/goals"}
          className='text-gray-500 hover:text-black hover:underline transition-all duration-150 flex items-center gap-x-1'>
          <ArrowLeft className='w-5 h-5 mt-0.5' />
          <span>View all goals</span>
        </Link>

        <div className='flex flex-col gap-y-3'>
          <h1 className='text-xl sm:text-2xl md:text-3xl font-bold tracking-tight'>{roadmapTitle}</h1>
          <p className='text-sm sm:text-base text-gray-600'>{roadmapDescription}</p>
        </div>

        <div>
          <div className="flex items-center justify-between pb-2">
            <span className="text-xs font-semibold text-gray-600">Progress</span>
            <span className="text-xs font-semibold text-purple-600">{currentProgress}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-linear-to-r from-purple-600 to-purple-500 rounded-full"
              style={{ width: `${currentProgress}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>

    <SVG roadmapData={rest}
      onNodeClick={(n) => {
        setSelectedNode(n);
        setOpen(true);
      }} />

    <NodeDrawer
      goalId={id}
      starredUrls={starredUrls}
      isOpen={isOpen}
      setOpen={setOpen}
      entry={entry}
    />

    <div className='bg-white w-full flex flex-col items-center gap-y-12 pt-16 pb-24 px-4 sm:px-8 border-t border-neutral-200'>
      <div className='w-full max-w-3xl flex flex-col gap-y-8'>
        <h2 className='text-center sm:text-left font-semibold text-xl sm:text-2xl tracking-tight'>
          Frequently asked questions
        </h2>

        <div className='flex flex-col gap-y-4'>
          {roadmapJson.faqs.map((faq) => (
            <Collapsible key={faq.id} className="bg-linear-to-br from-gray-50 to-gray-100 p-4 rounded-xl w-full border border-neutral-200">
              <CollapsibleTrigger className="w-full flex justify-between items-center group">
                <span className="font-semibold text-sm md:text-base">{faq.question}</span>
                <div className="pt-0.5 px-1">
                  <Plus className="w-5 group-aria-expanded:rotate-45 transition-transform duration-150" />
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent
                className={cn(
                  "pt-4 text-xs md:text-sm font-semibold text-neutral-600 overflow-hidden",
                  "transition-all duration-150 ease-in-out",
                  "data-[state=closed]:animate-collapsible-up",
                  "data-[state=open]:animate-collapsible-down"
                )}
              >
                {faq.answer}
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      </div>

      <p className='text-xs text-center'>Lock in, bruv. GGs.</p>
    </div>
  </section>
};

export default RoadmapPage
