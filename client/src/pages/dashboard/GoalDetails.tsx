const GoalDetails = () => {
  return (
    <div className="border-t border-gray-200 p-6 bg-gray-50">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <h4 className="text-sm font-semibold text-gray-900 pb-3">Phases</h4>
          {/* Strikethrough if completed, highlight if in progress, greyed out if undone*/}
          <div className="flex flex-col gap-y-2">
            {[
              "Week 1-2: Fundamentals",
              "Week 3-4: Core Concepts",
              "Week 5-6: Projects",
              "Week 7-8: Advanced Topics",
            ].map((milestone, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div
                  className={`w-2 h-2 rounded-full ${idx < 2 ? "bg-purple-600" : "bg-gray-300"}`}
                ></div>
                <span className={`text-sm ${idx < 2 ? "text-gray-900 font-medium" : "text-gray-600"}`}>
                  {milestone}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-gray-900 pb-3">Starred resources</h4>
          <div className="flex flex-col gap-y-2">
            {["Interactive Courses", "Video Tutorials", "Documentation", "Practice Projects"].map(
              (resource, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-2 bg-white rounded-lg border border-gray-200 hover:border-purple-300 transition-colors cursor-pointer"
                >
                  {/*An icon instead of this dot describing what type of resource is it */}
                  <div className="w-2 h-2 rounded-full bg-purple-600"></div>
                  <span className="text-sm text-gray-700 flex-1">{resource}</span>
                  <span className="text-xs text-gray-400">→</span>
                </div>
              ),
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default GoalDetails;
