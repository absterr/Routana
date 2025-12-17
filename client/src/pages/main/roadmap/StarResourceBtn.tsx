import { toggleStarredResource } from '@/lib/app/app-api';
import { resourceTypeIcons } from '@/lib/app/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Star } from 'lucide-react';
import { useState } from "react";

interface Resource {
  id: string;
  type: "Video" | "Article" | "Course" | "Documentation" | "Interactive";
  title: string;
  url: string;
  category: "Free" | "Paid";
}

const StarResourceBtn = ({ goalId, resource, isStarred }: {
  goalId: string;
  resource: Resource;
  isStarred: boolean;
}) => {
  const Icon = resourceTypeIcons[resource.type];
  const [starred, setStarred] = useState(isStarred);
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: () => toggleStarredResource({
      goalId,
      type: resource.type,
      title: resource.title,
      url: resource.url,
      category: resource.category,
      starred
    }),
    onMutate: () => {
      const previousState = starred;
      setStarred(!starred);
      return { previousState };
    },
    onError: (_, __, context) => {
      if (context) setStarred(context.previousState);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['starred', goalId] });
      queryClient.invalidateQueries({ queryKey: ["dashboardGoals"] });
    }
  });

  return (
    <li key={resource.id}>
      <div className='flex justify-between gap-x-3'>
        <a
          href={resource.url}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center gap-3 p-2 bg-white rounded-lg border border-gray-200 hover:border-purple-300 transition-colors cursor-pointer"
        >
          <Icon className="w-4 h-4 text-purple-600" />
          <span className="text-sm text-gray-700 flex-1">
            {resource.title}
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
            fill={starred ? "currentColor" : "none"}
          />
        </button>
      </div>
    </li>
  );
}

export default StarResourceBtn;
