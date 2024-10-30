'use client'

import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog"
import { signUp } from "@/lib/actions/auth.actions"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'
import { useState } from "react"
import { registerSchema } from "@/lib/validation"
import { MailIcon, EyeIcon, EyeClosedIcon } from "lucide-react"
import { Label } from "@radix-ui/react-label"
import { useRouter } from "next/navigation"

const RegisterForm = () => {

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [registeredEmail, setRegisteredEmail] = useState<string | null>(null)

    const router = useRouter()

    const form = useForm<z.infer<typeof registerSchema>>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            phoneNumber: "",
            password: "",
            confirmPassword: "",
        },
    })

    async function onSubmit(values: z.infer<typeof registerSchema>) {

        setIsLoading(true);

        try {

            await signUp(values);

            setError(null);
            setRegisteredEmail(values.email);
            setIsDialogOpen(true);
            form.reset();

        } catch (error: any) {
            setError(error.message);

        } finally {
            setIsLoading(false);
        }
    }

    const values = ['First Name', 'Last Name', 'Email', 'Phone Number', 'Password', 'Confirm Password']

    return (
        <div className="w-full">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel className="text-white">{values[0]}</FormLabel>
                                    <FormControl>
                                        <Input placeholder={values[0]} {...field} className="bg-light-gray border-none text-white placeholder:text-gray-400" />
                                    </FormControl>
                                    <FormDescription>
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="lastName"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel className="text-white">{values[1]}</FormLabel>
                                    <FormControl>
                                        <Input placeholder={values[1]} {...field} className="bg-light-gray border-none text-white placeholder:text-gray-400" />
                                    </FormControl>
                                    <FormDescription>
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="flex flex-col md:flex-row gap-4">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel className="text-white">{values[2]}</FormLabel>
                                    <div className="flex items-center bg-light-gray border-none text-white placeholder:text-gray-400 rounded-md">
                                        <MailIcon className="mx-2 h-6 w-6 text-gray-300" />
                                        <FormControl>
                                            <Input type='email' placeholder={values[2]} {...field} className="border-none placeholder:text-gray-400" />
                                        </FormControl>
                                    </div>
                                    <FormDescription>
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="phoneNumber"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel className="text-white">{values[3]}</FormLabel>
                                    <FormControl>
                                        <PhoneInput
                                            defaultCountry="US"
                                            placeholder='+1 (702) 123-4567'
                                            international
                                            value={field.value}
                                            onChange={field.onChange}
                                            className="input-phone"
                                        />
                                    </FormControl>
                                    <FormDescription>
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="flex flex-col md:flex-row gap-4">
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel className="text-white">{values[4]}</FormLabel>
                                    <div className="flex items-center bg-light-gray border-none text-white placeholder:text-gray-400 rounded-md">
                                        <FormControl>
                                            <Input type={showPassword ? 'true' : 'password'} placeholder={values[4]} {...field} className="bg-light-gray border-none text-white placeholder:text-gray-400" />
                                        </FormControl>
                                        {showPassword ? (
                                            <EyeClosedIcon className="mx-2 h-6 w-6 text-gray-300 cursor-pointer" onClick={() => setShowPassword(false)} />
                                        ) : (
                                            <EyeIcon className="mx-2 h-6 w-6 text-gray-300 cursor-pointer" onClick={() => setShowPassword(true)} />
                                        )}
                                    </div>
                                    <FormDescription>
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel className="text-white">{values[5]}</FormLabel>
                                    <div className="flex items-center bg-light-gray border-none text-white placeholder:text-gray-400 rounded-md">
                                        <FormControl>
                                            <Input type={showConfirmPassword ? 'true' : 'password'} placeholder={values[4]} {...field} className="bg-light-gray border-none text-white placeholder:text-gray-400" />
                                        </FormControl>
                                        {showConfirmPassword ? (
                                            <EyeClosedIcon className="mx-2 h-6 w-6 text-gray-300 cursor-pointer" onClick={() => setShowConfirmPassword(false)} />
                                        ) : (
                                            <EyeIcon className="mx-2 h-6 w-6 text-gray-300 cursor-pointer" onClick={() => setShowConfirmPassword(true)} />
                                        )}
                                    </div>
                                    <FormDescription>
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <Button type="submit" disabled={isLoading} className="w-full">{isLoading ? 'Loading...' : 'Sign Up'}</Button>
                    {error && (
                        <Label className="text-red-600 font-bold text-sm text-center flex flex-col items-center justify-center capitalize">{error}</Label>
                    )}
                </form>
            </Form>
            <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <AlertDialogContent className="bg-dark_gray-gradient border-none text-white">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Check your email</AlertDialogTitle>
                        <AlertDialogDescription className="space-y-3 text-gray-200">
                            <p>We've sent a confirmation email to:</p>
                            <p className="font-medium text-primary">{registeredEmail}</p>
                            <p>Please check your email and click the confirmation link to complete your registration.</p>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <Button
                        onClick={() => {
                            setIsDialogOpen(false);
                            router.push('/auth/login');
                        }}
                        className="w-full"
                    >
                        Go to Login
                    </Button>
                </AlertDialogContent>
            </AlertDialog>
        </div >
    )
}

export default RegisterForm