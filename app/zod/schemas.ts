import z from "zod";

export const SignUpSchema = z.object({
  fullName: z.string().min(3, { message: "At least 4 characters required." }),
  email: z.string().email({ message: "Valid email required!" }),
  password: z.string().min(6, { message: "At least 6 characters required." }),
  avatarUrl: z.any().optional(),
});

export type SignUpField = z.infer<typeof SignUpSchema>;

export const SignInSchema = z.object({
  email: z.string().email({ message: "Valid email required!" }),
  password: z.string().min(6, { message: "At least 6 characters required." }),
});

export type SignInField = z.infer<typeof SignInSchema>;
