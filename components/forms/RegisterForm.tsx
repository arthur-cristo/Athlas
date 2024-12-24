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

    const values = ['Nome', 'Sobrenome', 'Email', 'Telefone', 'Senha', 'Confirme sua Senha']

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
                                    <FormControl>
                                        <Input placeholder={values[0]} {...field} className="bg-input border-none placeholder:font-bold placeholder:text-muted-foreground" />
                                    </FormControl>
                                    <FormDescription>
                                    </FormDescription>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="lastName"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormControl>
                                        <Input placeholder={values[1]} {...field} className="bg-input placeholder:font-bold border-none  placeholder:text-muted-foreground" />
                                    </FormControl>
                                    <FormDescription>
                                    </FormDescription>
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
                                    <div className="bg-input flex items-center border-none  placeholder:text-muted-foreground rounded-md">
                                        <MailIcon className="mx-2 h-6 w-6 text-muted-foreground-300" />
                                        <FormControl>
                                            <Input type='email' placeholder={values[2]} {...field} className="border-none placeholder:font-bold placeholder:text-muted-foreground" />
                                        </FormControl>
                                    </div>
                                    <FormDescription>
                                    </FormDescription>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="phoneNumber"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormControl>
                                        <PhoneInput
                                            defaultCountry="BR"
                                            placeholder='Phone Number'
                                            international
                                            value={field.value}
                                            onChange={field.onChange}
                                            className="input-phone"
                                        />
                                    </FormControl>
                                    <FormDescription>
                                    </FormDescription>
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
                                    <div className="bg-input flex items-center border-none  placeholder:text-muted-foreground rounded-md">
                                        <FormControl>
                                            <Input type={showPassword ? 'true' : 'password'} placeholder={values[4]} {...field} className="bg-input placeholder:font-bold border-none  placeholder:text-muted-foreground" />
                                        </FormControl>
                                        {showPassword ? (
                                            <EyeClosedIcon className="mx-2 h-6 w-6 text-muted-foreground-300 cursor-pointer" onClick={() => setShowPassword(false)} />
                                        ) : (
                                            <EyeIcon className="mx-2 h-6 w-6 text-muted-foreground-300 cursor-pointer" onClick={() => setShowPassword(true)} />
                                        )}
                                    </div>
                                    <FormDescription>
                                    </FormDescription>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <div className="bg-input flex items-center border-none  placeholder:text-muted-foreground rounded-md">
                                        <FormControl>
                                            <Input type={showConfirmPassword ? 'true' : 'password'} placeholder={values[5]} {...field} className="bg-input placeholder:font-bold border-none  placeholder:text-muted-foreground" />
                                        </FormControl>
                                        {showConfirmPassword ? (
                                            <EyeClosedIcon className="mx-2 h-6 w-6 text-muted-foreground-300 cursor-pointer" onClick={() => setShowConfirmPassword(false)} />
                                        ) : (
                                            <EyeIcon className="mx-2 h-6 w-6 text-muted-foreground-300 cursor-pointer" onClick={() => setShowConfirmPassword(true)} />
                                        )}
                                    </div>
                                    <FormDescription>
                                    </FormDescription>
                                </FormItem>
                            )}
                        />
                    </div>
                    <Button type="submit" disabled={isLoading || !form.formState.isValid} className="w-full">Cadastre-se</Button>
                    {error && (
                        <Label className="text-destructive font-bold text-sm text-center flex flex-col items-center justify-center capitalize">{error}</Label>
                    )}
                </form>
            </Form>
            <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Cheque seu Email</AlertDialogTitle>
                        <AlertDialogDescription className="space-y-3 text-muted-foreground">
                            <p>Enviamos um email para:</p>
                            <p className="font-medium text-primary">{registeredEmail}</p>
                            <p>Por favor, verifique seu e-mail e clique no link de confirmação para concluir seu cadastro.</p>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <Button
                        onClick={() => {
                            setIsDialogOpen(false);
                            router.push('/auth/login');
                        }}
                        className="w-full"
                    >
                        Fazer Login
                    </Button>
                </AlertDialogContent>
            </AlertDialog>
        </div >
    )
}

export default RegisterForm