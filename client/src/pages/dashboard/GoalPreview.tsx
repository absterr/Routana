import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import Roadmap from './Roadmap';
import Resources from './Resources';
import ProgressTracker from './ProgressTracker';

const GoalPreview = ({ goal }: { goal: { id: number, title: string, description?: string, timeframe: string }} ) => {
  const [isExpanded, setIsExpanded] = useState(false)

  type Resources = {
    id: number,
    title: string,
    type: 'course' | 'video' | 'documentation' | 'project',
    duration: string,
    level: string,
    rating: number
  };

  const mockResources: Resources[]  = [
    {
      id: 1,
      title: 'Interactive Course Platform',
      type: 'course',
      duration: '40 hours',
      level: 'beginner',
      rating: 4.8,
    },
    {
      id: 2,
      title: 'Video Tutorial Series',
      type: 'video',
      duration: '20 hours',
      level: 'beginner',
      rating: 4.6,
    },
    {
      id: 3,
      title: 'Documentation & Guides',
      type: 'documentation',
      duration: 'self-paced',
      level: 'all',
      rating: 4.9,
    },
    {
      id: 4,
      title: 'Community Projects',
      type: 'project',
      duration: 'varies',
      level: 'intermediate',
      rating: 4.7,
    },
  ]

  const mockMilestones = [
    {
      id: 1,
      title: 'Fundamentals',
      description: 'Learn the basics and core concepts',
      duration: '4-6 weeks',
      completed: true,
    },
    {
      id: 2,
      title: 'Core Skills',
      description: 'Build practical skills with hands-on projects',
      duration: '8-10 weeks',
      completed: false,
    },
    {
      id: 3,
      title: 'Advanced Topics',
      description: 'Master advanced patterns and optimization',
      duration: '6-8 weeks',
      completed: false,
    },
    {
      id: 4,
      title: 'Portfolio Projects',
      description: 'Build real-world projects for your portfolio',
      duration: '4-6 weeks',
      completed: false,
    },
  ]


  return (
    <div className="border border-border rounded-lg bg-card overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 sm:p-6 flex items-center justify-between hover:bg-muted/50 transition-colors gap-2"
      >
        <div className="flex-1 text-left min-w-0">
          <h3 className="text-lg sm:text-2xl font-bold text-foreground truncate">{goal.title}</h3>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 truncate">{goal.timeframe} • {goal.description || 'No description'}</p>
        </div>
        <div className="shrink-0">
          {isExpanded ? (
            <ChevronUp className="w-5 sm:w-6 h-5 sm:h-6 text-accent" />
          ) : (
            <ChevronDown className="w-5 sm:w-6 h-5 sm:h-6 text-accent" />
          )}
        </div>
      </button>

      {isExpanded && (
        <div className="border-t border-border px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8 bg-muted/30">
          <ProgressTracker milestones={mockMilestones} />
          <Roadmap milestones={mockMilestones} />
          <Resources resources={mockResources} />
        </div>
      )}
    </div>
  )
}

export default GoalPreview;
