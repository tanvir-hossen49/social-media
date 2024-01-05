import * as z from "zod";

export const SignUpValidation = z.object({
    name: z.string().min(2, {message: 'Too short'}),
    username: z.string().min(2, {message: 'Too short'}),
    email: z.string().email(),
    password: z.string().min(8, {message: 'Password must be 8 character'}).max(16, {message: 'Too long'}),
});

export const SignInValidation = z.object({
    email: z.string().email(),
    password: z.string().min(8, {message: 'Password must be 8 character'}).max(16, {message: 'Too long'}),
});