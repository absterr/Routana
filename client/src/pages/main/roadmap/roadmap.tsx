import LoadingSpinner from '@/components/LoadingSpinner';
import type { ELKNode } from '@/lib/ELK';
import { getRoadmapGraph } from '@/lib/goals/goals-api';
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import SVG from './SVG';

interface RoadmapData {
  layout: ELKNode;
  width: number;
  height: number;
}

const RoadmapPage = () => {
  const { id } = useParams();
  const { data: roadmapData, isLoading, error } = useQuery<RoadmapData, Error>({
    queryKey: ['roadmap', id],
    enabled: !!id,
    queryFn: () => getRoadmapGraph(id!),
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">
      <LoadingSpinner size={8} />
    </div>
  }
  if (error) {
    return <div
      className='min-h-screen flex items-center justify-center text-red-600 font-semibold text-2xl'>
      Error loading roadmap
    </div>;
  }

  if (!roadmapData) return null;

  return <section className='flex flex-col gap-y-2 items-center'>
    <div className='pt-8 w-full max-w-2xl'>
      <div className='bg-white rounded-xl border border-gray-200 flex flex-col gap-y-14 p-6'>
        <Link to={"/goals"}
          className='underline text-gray-500 hover:text-black transition-colors duration-150 flex items-center gap-x-1'>
            <ArrowLeft className='w-5 h-5 -mb-0.5'/>
            <span>View all goals</span>
        </Link>
        <header className='flex flex-col gap-y-2'>
          <h2 className='text-3xl font-bold'>DevOps Learning Roadmap</h2>
          <p className='text-gray-600'>Get familiar with tools like docker and Kubernetes</p>
        </header>
      </div>
    </div>
    <SVG roadmapData={roadmapData}  />
  </section>
}

export default RoadmapPage
