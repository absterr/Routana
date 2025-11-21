import { z } from "zod";

export const goalSchema = z.object({
  title: z.string().min(3, "Goal title is required").max(60, "Goal title length exceeded"),
  description: z.string().max(230, "Goal description length exceeded").optional(),
  timeframe: z.enum(["1-month", "3-months", "6-months", "1-year", "Flexible"])
});

const resourceSchema = z.object({
    id: z.string().describe("A unique UUID for the resource."),
    type: z.enum(["video", "article", "course", "documentation"]).describe("The type of the resource."),
    title: z.string().describe("The title of the resource."),
    url: z.url().describe("The web address of the resource. Must be a valid URL."),
    category: z.enum(["free", "paid"]).describe("The price category in which the resource falls under.")
});

const optionSchema = z.object({
    id: z.string().describe("A unique UUID for the sub-topic."),
    title: z.string().describe("The title of the sub-topic (e.g., 'React')."),
    type: z.enum(["core", "optional"]).describe("Whether the sub-topic is essential (core) or supplementary (optional)."),
    completed: z.boolean().describe("Initial state is false."),
    about: z.string().describe("A brief explanation of what the sub-topic covers."),
    resources: z.array(resourceSchema).describe("A list of links or materials for this sub-topic."),
    // Note: options array is intentionally omitted here to prevent infinite recursion
});

const topicSchema = z.object({
    id: z.string().describe("A unique UUID for the topic."),
    title: z.string().describe("The title of the topic (e.g., 'Javascript')."),
    type: z.enum(["core", "optional"]).describe("Whether the topic is essential (core) or supplementary (optional)."),
    completed: z.boolean().describe("Initial state is false."),
    about: z.string().describe("A brief explanation of what the topic covers."),
    resources: z.array(resourceSchema).describe("A list of recommended materials for this topic."),
    options: z.array(optionSchema).describe("Alternative or more specialized options, concepts, paths or tools.").optional(),
});

const phaseSchema = z.object({
    id: z.string().describe("A unique UUID for the phase."),
    title: z.string().describe("The phase name (e.g., 'Foundations')."),
    description: z.string().describe("A brief summary of the goals for this phase."),
    topics: z.array(topicSchema).describe("The collection of learning topics within this phase."),
});

const checkpointSchema = z.object({
    id: z.string().describe("A unique UUID for the checkpoint."),
    phaseId: z.string().describe("The ID of the phase this checkpoint completes."),
    "for": z.string().describe("The phase label for which the checkpoint is for (e.g., 'Foundations')."),
    description: z.string().describe("What the user should be able to do at this point."),
});

const extraSchema = z.object({
    id: z.string().describe("A unique UUID for the extra item."),
    title: z.string().describe("Title of the extra topic (e.g., 'Web Performance')."),
    completed: z.boolean().describe("Initial state is false."),
    about: z.string().describe("Explanation of the extra topic."),
    resources: z.array(resourceSchema).describe("Materials for the extra topic."),
    options: z.array(optionSchema).describe("Any alternative sub-paths for the extra topic (eg., 'Vitest' in this case)"),
});

const relatedFieldSchema = z.object({
    id: z.string().describe("A unique UUID for the related field."),
    title: z.string().describe("Title of the related field (e.g., 'Backend Development').")
});



// Combines all schemas into the single final structure for the roadmap JSON.
export const roadmapSchema = z.object({
    meta: z.object({
        title: z.string().describe("The title of the generated roadmap (e.g., 'Frontend Developer Roadmap')."),
        userContext: z.object({
            experience: z.string().nullable().describe("The user's stated experience level."),
            notes: z.string().nullable().describe("Specific focus notes provided by the user.")
        })
    }),

    phases: z.array(phaseSchema).describe("The main, sequential learning steps."),
    checkpoints: z.array(checkpointSchema).describe("Milestones to measure progress."),
    extras: z.array(extraSchema).describe("Supplementary topics outside the core path."),
    relatedFields: z.array(relatedFieldSchema).describe("Other areas of development related to the main goal.")
});
