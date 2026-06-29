import { z } from "zod";

export const userSchema = z.object({
  name: z.string().max(50).min(1),
  email: z.email(),
  password: z.string().min(6),
});

export const expensesSchema = z.object({
  name: z.string().max(75).min(1),
  category: z.string().max(155).min(1),
  amount: z.number().positive(),
});
