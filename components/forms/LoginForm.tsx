'use client'

import { signIn } from '@/lib/actions/auth.actions'
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
import { useState } from "react"
import { loginSchema } from "@/lib/validation"
import { MailIcon, EyeIcon, EyeClosedIcon } from "lucide-react"
import { Label } from "@radix-ui/react-label"
import { useRouter } from "next/navigation"

const LoginForm = () => {

    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: ""
        },
    })

    async function onSubmit(values: z.infer<typeof loginSchema>) {

        setIsLoading(true);

        try {
            await signIn(values);
            router.refresh();
        } catch (error: any) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="w-full">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel className="text-muted-foreground">Email</FormLabel>
                                <div className="bg-input flex items-center border-none  rounded-md">
                                    <MailIcon className="mx-2 h-6 w-6 text-muted-foreground" />
                                    <FormControl>
                                        <Input type='email' placeholder='Email' {...field} className="border-none placeholder:text-dark_gray" />
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
                        name="password"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel className="text-muted-foreground">Password</FormLabel>
                                <div className="bg-input flex items-center border-none placeholder:text-muted-foreground rounded-md">
                                    <FormControl>
                                        <Input type={showPassword ? 'true' : 'password'} placeholder='Password' {...field} className="border-none  placeholder:text-muted-foreground-400" />
                                    </FormControl>
                                    {showPassword ? (
                                        <EyeClosedIcon className="mx-2 h-6 w-6 text-muted-foreground cursor-pointer" onClick={() => setShowPassword(false)} />
                                    ) : (
                                        <EyeIcon className="mx-2 h-6 w-6 text-muted-foreground cursor-pointer" onClick={() => setShowPassword(true)} />
                                    )}
                                </div>
                                <FormDescription>
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" disabled={isLoading} className="w-full">{isLoading ? 'Loading...' : 'Sign In'}</Button>
                    {error && (
                        <Label className="pt-4 text-destructive font-bold text-mm text-center flex flex-col items-center justify-center capitalize">{error}</Label>
                    )}
                </form>
            </Form>
        </div >
    )
}

export default LoginForm