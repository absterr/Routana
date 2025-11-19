import { BookOpen, Play, FileText, Code, Star } from 'lucide-react'

interface ResourcesProps {
  resources: Array<{
    id: number
    title: string
    type: 'course' | 'video' | 'documentation' | 'project'
    duration: string
    level: string
    rating: number
  }>
}

const typeIcons = {
  course: BookOpen,
  video: Play,
  documentation: FileText,
  project: Code,
}

const typeLabels = {
  course: 'Course',
  video: 'Video',
  documentation: 'Docs',
  project: 'Project',
}

const Resources = ({ resources }: ResourcesProps) => {
  return (
    <div className="space-y-4">
      <h4 className="text-base sm:text-lg font-bold text-foreground">Recommended Resources</h4>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {resources.map((resource) => {
          const IconComponent = typeIcons[resource.type]
          return (
            <div
              key={resource.id}
              className="p-3 sm:p-4 rounded-lg bg-muted border border-border hover:border-accent transition-colors space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2 sm:gap-3 flex-1 min-w-0">
                  <div className="p-1.5 sm:p-2 rounded bg-accent/20 text-accent shrink-0">
                    <IconComponent className="w-4 sm:w-5 h-4 sm:h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="font-semibold text-foreground text-xs sm:text-sm truncate">{resource.title}</h5>
                    <p className="text-xs text-muted-foreground mt-1">
                      {typeLabels[resource.type]} • {resource.duration}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-border gap-2">
                <span className="text-xs px-2 py-1 rounded bg-primary/20 text-primary font-medium capitalize whitespace-nowrap">
                  {resource.level}
                </span>
                <div className="flex items-center gap-1 text-accent shrink-0">
                  <Star className="w-3 sm:w-4 h-3 sm:h-4 fill-accent" />
                  <span className="text-xs sm:text-sm font-semibold">{resource.rating}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Resources;
