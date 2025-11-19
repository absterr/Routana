const ProgressTracker = ({ milestones }: { milestones: Array<{ completed: boolean }> }) => {
  const completedCount = milestones.filter(m => m.completed).length
  const progressPercentage = (completedCount / milestones.length) * 100

  return (
    <div className="space-y-4">
      <h4 className="text-base sm:text-lg font-bold text-foreground">Progress</h4>

      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs sm:text-sm text-muted-foreground">
            {completedCount} of {milestones.length} milestones completed
          </span>
          <span className="text-xs sm:text-sm font-semibold text-accent whitespace-nowrap">{Math.round(progressPercentage)}%</span>
        </div>

        <div className="w-full bg-muted rounded-full h-2 sm:h-3 overflow-hidden border border-border">
          <div
            className="bg-linear-to-r from-primary to-accent h-full transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 sm:pt-4">
        {milestones.map((milestone, i) => (
          <div
            key={i}
            className={`p-2 sm:p-3 rounded-lg text-center text-xs font-semibold border ${milestone.completed
              ? 'bg-accent/20 border-accent text-accent'
              : 'bg-muted border-border text-muted-foreground'
              }`}
          >
            Phase {i + 1}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressTracker
