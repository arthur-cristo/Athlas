'use client'

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { supabase } from "@/lib/supabase/client"
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

const RegisterForm = () => {

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false)

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
            const { data, error } = await supabase.auth.signUp({
                email: values.email,
                password: values.password,
                phone: values.phoneNumber,
                options: {
                    data: {
                        first_name: values.firstName,
                        last_name: values.lastName,
                    },
                },
            })
            if (error) throw new Error(error.message)
            setError(null);
        } catch (error: any) {
            setError(error.message);
            console.error(error.message);
            setIsLoading(false);
            return
        }
        setIsLoading(false);
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
                        <Label className="text-red-600 font-bold text-sm text-center flex flex-col items-center justify-center">Sorry, an error has occurred :&#40;<br />Please, try again later.<p className="capitalize">Error: {error}</p></Label>
                    )}
                </form>
            </Form>
            <AlertDialog >
                    <AlertDialogTrigger>Open</AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete your account
                                and remove your data from our servers.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction>Continue</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
        </div >
    )
}

export default RegisterForm