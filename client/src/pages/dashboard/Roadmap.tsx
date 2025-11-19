interface RoadmapProps {
  milestones: Array<{
    id: number
    title: string
    description: string
    duration: string
    completed: boolean
  }>
}

const Roadmap = ({ milestones }: RoadmapProps) => {
  return (
    <div className="space-y-4 sm:space-y-6">
      <h4 className="text-base sm:text-lg font-bold text-foreground">Learning Roadmap</h4>

      <div className="space-y-3 sm:space-y-4">
        {milestones.map((milestone, index) => (
          <div key={milestone.id} className="flex gap-3 sm:gap-4">
            <div className="flex flex-col items-center shrink-0">
              <div
                className={`w-8 sm:w-10 h-8 sm:h-10 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm border-2 shrink-0 ${
                  milestone.completed
                    ? 'bg-accent text-accent-foreground border-accent'
                    : 'border-border bg-card text-muted-foreground'
                }`}
              >
                {milestone.completed ? '✓' : index + 1}
              </div>
              {index < milestones.length - 1 && (
                <div className={`w-0.5 h-12 sm:h-16 ${milestone.completed ? 'bg-accent' : 'bg-border'}`} />
              )}
            </div>
            <div className="pb-4 min-w-0">
              <h5 className="font-semibold text-foreground text-sm sm:text-base">{milestone.title}</h5>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">{milestone.description}</p>
              <p className="text-xs text-muted-foreground mt-2">Duration: {milestone.duration}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Roadmap;
