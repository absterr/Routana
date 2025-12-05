import { z } from "zod";

const resourceSchema = z.object({
    id: z.string().describe("A unique UUID for the resource."),
    type: z.enum(["Video", "Article", "Course", "Documentation"]).describe("The type of the resource."),
    title: z.string().describe("The title of the resource."),
    url: z.url().describe("The web address of the resource. Must be a valid URL."),
    category: z.enum(["Free", "Paid"]).describe("The price category in which the resource falls under.")
});

const optionSchema = z.object({
    id: z.string().describe("A unique UUID for the sub-topic."),
    title: z.string().describe("The title of the sub-topic (e.g., 'React')."),
    type: z.enum(["Core", "Optional"]).describe("Whether the sub-topic is essential (core) or supplementary (optional)."),
    status: z.enum(["Pending", "Progress", "Completed", "Skipped"]).describe("State of topic/concept completion Initial state is pending."),
    about: z.string().describe("A detailed explanation of what the sub-topic covers."),
    resources: z.array(resourceSchema).describe("A list of links or materials for this sub-topic."),
    // NOTE: options array is intentionally omitted here to prevent infinite recursion
});

const topicSchema = z.object({
    id: z.string().describe("A unique UUID for the topic."),
    title: z.string().describe("The title of the topic (e.g., 'Javascript')."),
    type: z.enum(["Core", "Optional"]).describe("Whether the topic is essential (core) or supplementary (optional)."),
    status: z.enum(["Pending", "Progress", "Completed", "Skipped"]).describe("State of topic/concept completion Initial state is pending."),
    about: z.string().describe("A detailed explanation of what the topic covers."),
    resources: z.array(resourceSchema).describe("A list of recommended materials for this topic."),
    options: z.array(optionSchema).describe("Alternative or more specialized options, concepts, paths or tools").optional(),
});

const phaseSchema = z.object({
    id: z.string().describe("A unique UUID for the phase."),
    title: z.string().describe("The phase name (e.g., 'Foundations'). Don't include 'Phase x:' in the name ie., 'Phase 1: Foundations', just 'Foundations' is excellent."),
    about: z.string().describe("A brief summary of the goals for this phase."),
    status: z.enum(["Active", "Pending", "Completed"]).describe("State of phase completion Initial state is pending."),
    topics: z.array(topicSchema).describe("The collection of learning topics within this phase."),
});

const checkpointSchema = z.object({
    id: z.string().describe("A unique UUID for the checkpoint."),
    phaseId: z.string().describe("The ID of the phase this checkpoint completes."),
    "for": z.string().describe("The phase label for which the checkpoint is for (e.g., 'Foundations')."),
    about: z.string().describe("What the user should be able to do at this point."),
});

const extraSchema = z.object({
    id: z.string().describe("A unique UUID for the extra item."),
    title: z.string().describe("Title of the extra topic (e.g., 'Web Performance')."),
    status: z.enum(["pending", "progress", "completed", "skipped"]).describe("State of topic/concept completion Initial state is pending."),
    about: z.string().describe("A detailed explanation of the extra topic."),
    resources: z.array(resourceSchema).describe("Materials for the extra topic."),
    options: z.array(optionSchema).describe("Any alternative sub-paths for the extra topic (eg., 'Vitest' in this case)"),
});

const relatedFieldSchema = z.object({
    id: z.string().describe("A unique UUID for the related field."),
    title: z.string().describe("Title of the related field (e.g., 'Backend Development').")
});

const faqSchema = z.object({
    id: z.string().describe("A unique UUID for the FAQ item."),
    question: z.string().describe("The frequently asked question."),
    answer: z.string().describe("The clear and concise answer to the question.")
});


export const roadmapSchema = z.object({
    meta: z.object({
        title: z.string().describe("The title of the generated roadmap (e.g., 'Frontend Developer Roadmap')."),
        about: z.string().describe("A very brief description of the generated roadmap (e.g., 'A guide to becoming a modern frontend developer...)')."),
        userContext: z.object({
            experience: z.string().nullable().describe("The user's stated experience level."),
            notes: z.string().nullable().describe("Specific focus notes provided by the user.")
        })
    }),
    progress: z.string().describe("The current progress the user has made with the roadmap. Always set this to 0").default("0"),
    phases: z.array(phaseSchema).describe("The main, sequential learning steps."),
    checkpoints: z.array(checkpointSchema).describe("Milestones to measure progress."),
    extras: z.array(extraSchema).describe("Supplementary topics outside the core path."),
    relatedFields: z.array(relatedFieldSchema).describe("Other areas of development related to the main goal."),
    faqs: z.array(faqSchema).describe("A list of exactly ten most frequently asked questions and their answers relevant to this field.")
});
