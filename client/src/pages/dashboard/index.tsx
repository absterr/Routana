import { Plus } from "lucide-react";
import GoalPreview from "./GoalPreview";

const goals = [{
  id: 1,
  title: "Become a full-stack developer",
  description: undefined,
  timeframe: "3 months"
}]

const Dashboard = () => {
  return (
   <div className="max-w-4xl mx-auto pt-24">
     <div className="flex flex-col gap-y-6 sm:gap-y-8">
               <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                 <div>
                   <h2 className="text-2xl sm:text-3xl font-bold text-balance">Your Learning Goals</h2>
                   <p className="text-sm sm:text-base text-muted-foreground mt-1">{goals.length} active goal{goals.length !== 1 ? 's' : ''}</p>
                 </div>
                 <button
                   className="bg-linear-to-r from-primary to-accent hover:shadow-lg hover:shadow-primary/50 text-primary-foreground font-semibold flex items-center justify-center sm:justify-start gap-2 w-full sm:w-auto"
                 >
                   <Plus className="w-5 h-5" />
                   New Goal
                 </button>
               </div>

               {goals.length === 0 ? (
                 <div className="text-center py-12 sm:py-16 space-y-4 px-4">
                   <div className="text-4xl sm:text-5xl">🚀</div>
                   <h3 className="text-xl sm:text-2xl font-bold text-balance">No goals yet</h3>
                   <p className="text-sm sm:text-base text-muted-foreground max-w-md mx-auto">
                     Create your first learning goal to get started on your growth journey
                   </p>
                   <button
                     className="bg-linear-to-r from-primary to-accent hover:shadow-lg hover:shadow-primary/50 text-primary-foreground font-semibold mt-4 w-full sm:w-auto"
                   >
                     Create Your First Goal
                   </button>
                 </div>
               ) : (
                 <div className="grid gap-4 sm:gap-6">
                   {goals.map((goal) => (
                     <GoalPreview key={goal.id} goal={goal} />
                   ))}
                 </div>
               )}
             </div>
   </div>
  );
};

export default Dashboard
