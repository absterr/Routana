import { toggleStarredResource } from '@/lib/goals/goals-api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Book,
  FileText,
  GraduationCap,
  Play,
  Star,
  Target
} from 'lucide-react';
import { useState } from "react";

interface Resource {
  id: string;
  type: "Video" | "Article" | "Course" | "Documentation" | "Interactive";
  title: string;
  url: string;
  category: "Free" | "Paid";
}

const resourceTypeIcons = {
  Video: Play,
  Article: FileText,
  Course: GraduationCap,
  Documentation: Book,
  Interactive: Target
};

const StarResourceBtn = ({ goalId, resource, isStarred }: {
  goalId: string;
  resource: Resource;
  isStarred: boolean;
}) => {
  const Icon = resourceTypeIcons[resource.type] ?? FileText;
  const [starred, setStarred] = useState(isStarred);
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: () => toggleStarredResource({
      goalId,
      title: resource.title,
      url: resource.url,
      starred
    }),
    // OPTIMISTIC UPDATE HANDLED VIA LOCAL STATE & onError ROLLBACK
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
