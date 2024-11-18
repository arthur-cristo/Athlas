import { z } from 'zod'

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
        .min(8, "Password must be at least 8 characters")
        .max(50, "Password must be at most 50 characters")
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/,
            "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"),
    confirmPassword: z
        .string()
        .min(1, "Please, confirm your password.")
        .max(50, "Password must be at most 50 characters."),
}).refine(({ password, confirmPassword }) => password === confirmPassword, {
    message: "Password doesn't match.",
    path: ["confirmPassword"]
});

export const loginSchema = z.object({
    email: z.string().email('Invalid email address.'),
    password: z.string(),
});

export const transferSchema = z.object({
    keyType: z.enum(["email", "phoneNumber", "randomKey"]),
    email: z.string().email('Invalid email address.').optional().or(z.literal('')),
    phoneNumber: z
        .string()
        .refine((phone: string) => {
            if (phone) return /^\+\d{10,15}$/.test(phone);
        }, { message: "Invalid phone number" }).optional().or(z.literal('')),
    randomKey: z.string().optional().or(z.literal('')),
    amount: z.coerce.number().gte(0.01, "Amount must be at least $0.01."),
}).refine((data) => {
    const { keyType, email, phoneNumber, randomKey } = data;

    if (keyType === "email") {
        return !!email; // Ensure email is provided if keyType is email
    }
    if (keyType === "phoneNumber") {
        return !!phoneNumber; // Ensure phoneNumber is provided if keyType is phoneNumber
    }
    if (keyType === "randomKey") {
        return !!randomKey; // Ensure randomKey is provided if keyType is randomKey
    }
    return false; // Fail validation if none match (should not happen in practice)
}, {
    message: "The selected key type requires a valid value.",
    path: ["keyType"], // Error associated with the keyType field
});;

export const postSchema = z.object({
    title: z.string().min(2, "Title must be at least 2 characters.").max(50, "Title must be at most 50 characters."),
    content: z.string().min(2, "Content must be at least 2 characters.").max(280, "Content must be at most 280 characters."),
    images: z.unknown().transform(value => {
        return value as FileList
    }).refine((images) => images.length <= 5, "Please, upload at most 5 images."),
});

export const editPost = z.object({
    title: z.string().min(2, "Title must be at least 2 characters.").max(50, "Title must be at most 50 characters."),
    content: z.string().min(2, "Content must be at least 2 characters.").max(280, "Content must be at most 280 characters."),
});

export const commentSchema = z.object({
    content: z.string().min(2, "Content must be at least 2 characters.").max(280, "Content must be at most 140 characters."),
});

export const editProfileSchema = z.object({
    bio: z.string().min(2, "Bio must be at least 2 characters.").max(50, "Bio must be at most 50 characters."),
    image: z.unknown().transform(value => {
        return value as FileList
    }).refine((image) => image.length <= 1, "Please, upload at most one image."),
});