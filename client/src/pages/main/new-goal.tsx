import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createNewGoal } from "@/lib/goals/goals-api"
import { newGoalSchema } from "@/lib/goals/goals-schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { ArrowRight } from "lucide-react"
import { Controller, useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import type { z } from "zod"

type Entry = {
  name: keyof z.infer<typeof newGoalSchema>;
  label: string;
  placeholder?: string;
  type: "text" | "textarea" | "select";
  options?: string[];
}

const entries: Entry[] = [
  { name: "title", label: "Learning Goal", placeholder: "e.g., Become a Frontend Developer", type: "text" },
  {
    name: "description",
    label: "Tell us more (optional)",
    placeholder: "Share any relevant preference/experience...",
    type: "textarea",
  },
  {
    name: "timeframe",
    label: "Timeframe",
    type: "select",
    options: ["1-month", "3-months", "6-months", "1-year", "Flexible"],
  },
]

const NewGoalPage = () => {
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof newGoalSchema>>({
    resolver: zodResolver(newGoalSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  })

  const { isPending, mutate } = useMutation({
    mutationFn: createNewGoal,
    onSuccess: (data) => navigate(`/goals/${data.goalId}`),
    onError: (err) => toast.error("Couldn't create goal roadmap", {
      description: err.message
    }),
  })

  const onSubmit = (values: z.infer<typeof newGoalSchema>) => {
    mutate(values)
  }

  return (
    <section className="flex flex-col items-center px-4 pt-12 pb-24">
      <div className="w-full max-w-3xl">
        <header className="text-center pb-8 sm:pb-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-900 text-balance py-4 tracking-tight">
            What do you want to learn?
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 text-balance">
            Tell us your learning goal and we'll create a personalized roadmap just for you
          </p>
        </header>

        <div className="p-8 md:p-10 border border-gray-300 rounded-xl sm:border-0 sm:rounded-none">
          <form className="flex flex-col gap-y-6" onSubmit={form.handleSubmit(onSubmit)}>
            {entries.map((entry) => (
              <div key={entry.name} className="flex flex-col gap-y-2">
                <div className="flex justify-between pb-1">
                  <label className="text-sm font-semibold text-gray-900">{entry.label}</label>
                  {form.formState.errors[entry.name] && (
                    <p className="text-red-600 text-sm">{form.formState.errors[entry.name]?.message as string}</p>
                  )}
                </div>

                {entry.type === "text" && (
                  <input
                    type="text"
                    {...form.register(entry.name)}
                    placeholder={entry.placeholder}
                    className="w-full h-12 px-4 rounded-xl border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 font-medium transition-colors text-sm sm:text-base"
                    required
                  />
                )}

                {entry.type === "textarea" && (
                  <textarea
                    {...form.register(entry.name)}
                    placeholder={entry.placeholder}
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 font-medium transition-colors resize-none text-sm sm:text-base"
                  />
                )}


                {entry.type === "select" && (
                  <Controller
                    control={form.control}
                    name="timeframe"
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange} required>
                        <SelectTrigger className="w-full px-4 py-5 rounded-xl border border-gray-300 bg-white text-gray-900 focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 font-medium transition-colors text-sm sm:text-base">
                          <SelectValue placeholder="Select timeframe" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl p-0.5">
                          {entry.options?.map((opt) => (
                            <SelectItem key={opt} value={opt}>
                              {opt}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                )}
              </div>
            ))}

            <div className="pt-3">
              <Button
                type="submit"
                className="w-full h-12 rounded-xl bg-purple-600 text-white hover:bg-purple-700 disabled:bg-purple-400 hover:cursor-pointer font-semibold text-base transition-colors flex items-center justify-center gap-2"
                disabled={isPending}
              >
                {isPending ? "Generating..." : "Generate Roadmap"}
                {!isPending && <ArrowRight className="w-4 h-4 -mb-0.5" />}
              </Button>
            </div>
          </form>

          {isPending && <p className=" text-center text-sm text-gray-500 pt-4">
            Generating a roadmap takes a few minutes. Please wait...
          </p>}
        </div>
      </div>
    </section>
  );
}

export default NewGoalPage
