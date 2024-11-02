import {z} from 'zod'

export const userNameValidation = 
z.string()
.min(3, "Username must be atlest 3 character")
.max(20, "Username must be no more than 20 character")
.regex(/^[a-zA-Z0-9]+$/, "Username must not contain special character")

export const signUpSchema = z.object({
    username: userNameValidation,
    email: z.string().email({message: 'Invalid email address'}),
    password: z.string()
    .min(6, {message: 'Password must be at least 6 characters'})
    .max(20, {message: "Password must be not more then 20 characters"})
})