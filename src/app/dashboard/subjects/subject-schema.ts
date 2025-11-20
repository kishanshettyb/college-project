import * as z from "zod";

export const SubjectSchema = z.object({
	sub_code: z.string().min(1, "Subject code is required"),
	branch: z.string().min(1, "Branch is required"),
	semister: z.string().min(1, "Semester is required")
});

export type SubjectSchemaType = z.infer<typeof SubjectSchema>;
