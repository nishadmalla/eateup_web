import { z } from "zod";

// --- SIGN UP SCHEMA ---
export const signupSchema = z.object({
    fullName: z.string().min(1, { message: "Full name is required" }),
    username: z.string().min(3, { message: "Username must be at least 3 characters" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z.string().min(1, { message: "Please confirm your password" }),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"], // Attaches the error specifically to the confirm field
});


// --- LOGIN SCHEMA ---
// (Included this so your LoginPage.tsx works perfectly too!)
export const loginSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(1, { message: "Password is required" }),
});