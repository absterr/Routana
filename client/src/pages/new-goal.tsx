import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight } from "lucide-react";
import { useForm } from "react-hook-form";
import { z, object, string } from "zod";

type Field = {
  name: keyof z.infer<typeof goalSchema>;
  label: string;
  placeholder?: string;
  type: "text" | "textarea" | "select";
  options?: string[];
};

const fields: Field[] = [
  { name: "title", label: "Learning Goal", placeholder: "e.g., Become a Frontend Developer", type: "text" },
  { name: "description", label: "Tell us more (optional)", placeholder: "Share any relevant experience...", type: "textarea" },
  {
    name: "timeframe",
    label: "Timeline",
    type: "select",
    options: ["1-week","2-weeks","1-month","3-months","6-months","1-year","Flexible"],
  },
];

const goalSchema = object({
  title: string().min(3, "Goal title is required").max(60, "Goal title length exceeded"),
  description: string().max(230, "Goal description length exceeded").optional(),
  timeframe: z.enum(["1-month", "3-months", "6-months", "1-year", "Flexible"])
});

const NewGoal = () => {
  const form = useForm<z.infer<typeof goalSchema>>({
    resolver: zodResolver(goalSchema),
    defaultValues: {
      title: "",
      description: "",
      timeframe: "Flexible"
    }
  });

 return (
     <section className="flex flex-col gap-y-8 sm:gap-y-12">
       <header className="text-center px-4">
         <h2 className="text-2xl sm:text-4xl font-bold text-balance pb-2 sm:pb-4">What do you want to learn?</h2>
         <p className="text-base sm:text-xl text-muted-foreground text-balance">
           Tell us your learning goal and we'll create a personalized roadmap powered by AI
         </p>
       </header>

       <div className="max-w-2xl mx-auto px-4 sm:px-0">
         <form className="flex flex-col gap-y-4 sm:gap-y-6">
           {fields.map((field) => (
               <div key={field.name} className="flex flex-col gap-y-1">
                 <div className="flex justify-between pb-2">
                   <label className="text-sm font-semibold text-foreground">{field.label}</label>
                   {form.formState.errors[field.name] && (
                     <p className="text-red-500 text-sm">
                       {form.formState.errors[field.name]?.message as string}
                     </p>
                   )}
                 </div>

                 {field.type === "text" && (
                   <input
                    type="text"
                     {...form.register(field.name)}
                     placeholder={field.placeholder}
                     className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent text-sm sm:text-base"
                     required
                   />
                 )}

                 {field.type === "textarea" && (
                   <textarea
                     {...form.register(field.name)}
                     placeholder={field.placeholder}
                     rows={4}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent resize-none text-sm sm:text-base"
                   />
                 )}

                 {field.type === "select" && (
                   <select {...form.register(field.name)}
               className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent text-sm sm:text-base"
                   >
                     {field.options?.map((opt) => (
                       <option key={opt} value={opt}>{opt}</option>
                     ))}
                   </select>
                 )}

               </div>
             ))}
           <div className="pt-2 sm:pt-4">
             <button
               type="submit"
               className="w-full bg-linear-to-r from-primary to-accent hover:shadow-lg hover:shadow-primary/50 text-primary-foreground font-semibold py-2.5 sm:py-3 rounded-lg flex items-center justify-center gap-2 text-sm sm:text-base"
             >
               Generate Roadmap
               <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5" />
             </button>
           </div>
         </form>

         <div className="pt-8 sm:pt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
           <div className="p-4 sm:p-6 rounded-lg bg-card border border-border space-y-3">
             <div className="text-2xl sm:text-3xl font-bold text-accent">🎯</div>
             <h3 className="font-semibold text-sm sm:text-base">Personalized Path</h3>
             <p className="text-xs sm:text-sm text-muted-foreground">Get a structured roadmap tailored to your goal and experience level</p>
           </div>
           <div className="p-4 sm:p-6 rounded-lg bg-card border border-border space-y-3">
             <div className="text-2xl sm:text-3xl font-bold text-accent">📚</div>
             <h3 className="font-semibold text-sm sm:text-base">Curated Resources</h3>
             <p className="text-xs sm:text-sm text-muted-foreground">Access hand-picked courses, tutorials, and tools for each milestone</p>
           </div>
           <div className="p-4 sm:p-6 rounded-lg bg-card border border-border space-y-3">
             <div className="text-2xl sm:text-3xl font-bold text-accent">📊</div>
             <h3 className="font-semibold text-sm sm:text-base">Progress Tracking</h3>
             <p className="text-xs sm:text-sm text-muted-foreground">Monitor your growth and stay motivated with visual progress indicators</p>
           </div>
         </div>
       </div>
     </section>

 )
}

export default NewGoal;
