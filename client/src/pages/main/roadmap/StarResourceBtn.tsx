import { toggleStarredResource } from '@/lib/app/app-api';
import { resourceTypeIcons, type ResourceWithId } from '@/lib/app/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Star } from 'lucide-react';
import { useState } from "react";

const StarResourceBtn = ({ goalId, roadmapResource, starred }: {
  goalId: string;
  roadmapResource: ResourceWithId;
  starred: boolean;
}) => {
  const Icon = resourceTypeIcons[roadmapResource.type];
  const [isStarred, setStarred] = useState(starred);
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: () => toggleStarredResource({
      goalId,
      type: roadmapResource.type,
      title: roadmapResource.title,
      url: roadmapResource.url,
      category: roadmapResource.category,
      isStarred
    }),
    onMutate: () => {
      const previousState = isStarred;
      setStarred(!isStarred);
      return { previousState };
    },
    onError: (_, __, context) => {
      if (context) setStarred(context.previousState);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['starredResources', goalId] });
      queryClient.invalidateQueries({ queryKey: ["dashboardGoals"] });
    }
  });

  return (
    <li key={roadmapResource.id}>
      <div className='flex justify-between gap-x-3'>
        <a
          href={roadmapResource.url}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center gap-3 p-2 bg-white rounded-lg border border-gray-200 hover:border-purple-300 transition-colors cursor-pointer"
        >
          <Icon className="w-4 h-4 text-purple-600" />
          <span className="text-sm text-gray-700 flex-1">
            {roadmapResource.title}
          </span>
          <span className="text-xs text-gray-400">→</span>
        </a>
        <button
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            mutate();
          }}
          className=" text-purple-500"
        >
          <Star
            className="w-5 h-5"
            fill={isStarred ? "currentColor" : "none"}
          />
        </button>
      </div>
    </li>
  );
}

export default StarResourceBtn;
