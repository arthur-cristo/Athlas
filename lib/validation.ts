import { z } from 'zod'

// Minimum 8 characters, at least one uppercase letter, one lowercase letter, one number and one special character
const passwordValidation = new RegExp(
    "^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"
);

export const registerSchema = z.object({
    firstName: z
        .string()
        .min(2, "First name must be at least 2 characters.")
        .max(50, "First name must be at most 50 characters."),
    lastName: z
        .string()
        .min(2, "Last name must be at least 2 characters.")
        .max(50, "Last name must be at most 50 characters."),
    email: z.string().email('Invalid email address.'),
    phoneNumber: z
        .string()
        .refine((phone) => /^\+\d{10,15}$/.test(phone), "Invalid phone number"),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters.")
        .max(50, "Password must be at most 50 characters."),

    confirmPassword: z
        .string()
        .min(1, "Please, confirm your password.")
        .max(50, "Password must be at most 50 characters."),
}).refine(({ password, confirmPassword }) => password === confirmPassword, {
    message: "Password doesn't match.",
    path: ["confirmPassword"]
});

export const loginSchema = z.object({
    email: z.string(),
    password: z.string(),
});