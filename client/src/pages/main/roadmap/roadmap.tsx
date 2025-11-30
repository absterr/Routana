import type { ELKNode } from '@/lib/ELK';
import { getRoadmapGraph } from '@/lib/goals/goals-api';
import { useQuery } from "@tanstack/react-query";
import SVG from './svg';

interface RoadmapDataProps {
  layout: ELKNode;
  width: number;
  height: number;
}

const RoadmapPage = () => {
  const { data: roadmapData, isLoading, error } = useQuery<RoadmapDataProps, Error>({
    queryKey: ['roadmapGraph'],
    queryFn: getRoadmapGraph,
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return <div
      className='flex items-center justify-center h-full w-full text-slate-400 animate-pulse'>
      Generating Roadmap...
    </div>;
  }
  if (error) {
    return <div
      className='flex items-center justify-center h-full w-full text-red-400'>
      Error loading roadmap
    </div>;
  }
  if (!roadmapData) return null;


  return <div>
    <SVG roadmapData={roadmapData}  />
  </div>

}

export default RoadmapPage
