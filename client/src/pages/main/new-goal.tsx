import { createNewGoal } from "@/lib/goals/goals-api"
import { newGoalSchema } from "@/lib/goals/goals-schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { ArrowRight } from "lucide-react"
import { useForm } from "react-hook-form"
import type { z } from "zod"

type Field = {
  name: keyof z.infer<typeof newGoalSchema>
  label: string
  placeholder?: string
  type: "text" | "textarea" | "select"
  options?: string[]
}

const fields: Field[] = [
  { name: "title", label: "Learning Goal", placeholder: "e.g., Become a Frontend Developer", type: "text" },
  {
    name: "description",
    label: "Tell us more (optional)",
    placeholder: "Share any relevant preference/experience...",
    type: "textarea",
  },
  {
    name: "timeframe",
    label: "Timeline",
    type: "select",
    options: ["1-month", "3-months", "6-months", "1-year", "Flexible"],
  },
]

const NewGoalPage = () => {
  const form = useForm<z.infer<typeof newGoalSchema>>({
    resolver: zodResolver(newGoalSchema),
    defaultValues: {
      title: "",
      description: "",
      timeframe: "Flexible",
    },
  })

  const { isPending, mutate } = useMutation({
    mutationFn: createNewGoal,
    onSuccess: () => console.log("Roadmap created"),
    onError: (err) => console.log("Couldn't create roadmap", err),
  })

  const onSubmit = (values: z.infer<typeof newGoalSchema>) => {
    mutate(values)
  }

  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-3xl">
        <header className="text-center pb-4">
          <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 text-balance pb-4">
            What do you want to learn?
          </h2>
          <p className="text-base md:text-lg text-gray-600 text-balance">
            Tell us your learning goal and we'll create a personalized roadmap just for you
          </p>
        </header>

        <div className="p-8 md:p-10">
          <form className="flex flex-col gap-y-6" onSubmit={form.handleSubmit(onSubmit)}>
            {fields.map((field) => (
              <div key={field.name} className="flex flex-col gap-y-2">
                <div className="flex justify-between pb-1">
                  <label className="text-sm font-semibold text-gray-900">{field.label}</label>
                  {form.formState.errors[field.name] && (
                    <p className="text-red-600 text-sm">{form.formState.errors[field.name]?.message as string}</p>
                  )}
                </div>

                {field.type === "text" && (
                  <input
                    type="text"
                    {...form.register(field.name)}
                    placeholder={field.placeholder}
                    className="w-full h-12 px-4 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 font-medium transition-colors text-base"
                    required
                  />
                )}

                {field.type === "textarea" && (
                  <textarea
                    {...form.register(field.name)}
                    placeholder={field.placeholder}
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 font-medium transition-colors resize-none text-base"
                  />
                )}

                {field.type === "select" && (
                  <select
                    {...form.register(field.name)}
                    className="w-full h-12 px-4 rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 font-medium transition-colors text-base"
                  >
                    {field.options?.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            ))}

            <div className="pt-3">
              <button
                type="submit"
                className="w-full h-12 rounded-lg bg-purple-600 text-white hover:bg-purple-700 disabled:bg-purple-400 hover:cursor-pointer font-semibold text-base transition-colors flex items-center justify-center gap-2"
                disabled={isPending}
              >
                  {isPending ? "Generating..." : "Generate Roadmap"}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-lg bg-white border border-gray-300 space-y-3">
            <div className="text-3xl font-semibold text-purple-600">🎯</div>
            <h3 className="font-semibold text-gray-900">Personalized Path</h3>
            <p className="text-sm text-gray-600">Get a structured roadmap tailored to your goal and experience level</p>
          </div>
          <div className="p-6 rounded-lg bg-white border border-gray-300 space-y-3">
            <div className="text-3xl font-semibold text-purple-600">📚</div>
            <h3 className="font-semibold text-gray-900">Curated Resources</h3>
            <p className="text-sm text-gray-600">Access hand-picked courses, tutorials, and tools for each milestone</p>
          </div>
          <div className="p-6 rounded-lg bg-white border border-gray-300 space-y-3">
            <div className="text-3xl font-semibold text-purple-600">📊</div>
            <h3 className="font-semibold text-gray-900">Progress Tracking</h3>
            <p className="text-sm text-gray-600">
              Monitor your growth and stay motivated with visual progress indicators
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default NewGoalPage
