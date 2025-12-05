import LoadingSpinner from '@/components/LoadingSpinner';
import { findEntry, type ELKNode } from '@/lib/ELK';
import { getRoadmapGraph, getStarredResource } from '@/lib/goals/goals-api';
import type { roadmapSchema } from '@/lib/goals/goals-schema';
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import type z from "zod";
import NodeDrawer from './NodeDrawer';
import SVG from './SVG';

interface RoadmapData {
  layout: ELKNode;
  width: number;
  height: number;
  roadmapJson: z.infer<typeof roadmapSchema>;
}

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

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">
      <LoadingSpinner size={8} />
    </div>
  }
  if (error) {
    return <div
      className='min-h-screen flex items-center justify-center text-red-600 font-semibold text-2xl'>
      Error loading roadmap: {error.message}
    </div>;
  }

  if (!roadmapData || !id) return null;

  if (!/^[0-9a-fA-F-]{36}$/.test(id)) {
    return <div
      className='min-h-screen flex items-center justify-center font-semibold text-2xl'>
      Page not found
    </div>;
  }

  const roadmapJson = roadmapData.roadmapJson;
  const roadmapTitle = roadmapJson.meta.title;
  const roadmapDescription = roadmapJson.meta.userContext.notes;
  const entry = findEntry(selectedNode, roadmapJson);
  const starredUrls = Array.from(starredResources?.map((r) => r.url) || []);

  return <section className='flex flex-col gap-y-2 items-center px-4 sm:px-6 lg:px-8 py-8'>
    <div className='w-full max-w-2xl'>
      <div className='bg-white rounded-xl border border-gray-200 flex flex-col gap-y-10 py-6 px-8'>
        <Link to={"/goals"}
          className='text-gray-500 hover:text-black hover:underline transition-all duration-150 flex items-center gap-x-1'>
          <ArrowLeft className='w-5 h-5 mt-0.5' />
          <span>View all goals</span>
        </Link>

        <div className='flex flex-col gap-y-3'>
          <h2 className='text-xl sm:text-2xl md:text-3xl font-bold'>{roadmapTitle}</h2>
          <p className='text-sm sm:text-base text-gray-600'>{roadmapDescription}</p>
        </div>

        <div>
          <div className="flex items-center justify-between pb-2">
            <span className="text-xs font-semibold text-gray-600">Progress</span>
            <span className="text-xs font-semibold text-purple-600">{ }%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-linear-to-r from-purple-600 to-purple-500 rounded-full"
              style={{ width: `${8}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>

    <SVG roadmapData={roadmapData}
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
  </section>
};

export default RoadmapPage
