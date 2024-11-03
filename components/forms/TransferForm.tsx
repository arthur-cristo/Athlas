'use client'

import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog"
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
import { transferSchema } from "@/lib/validation"
import { MailIcon } from "lucide-react"
import { Label } from "@radix-ui/react-label"
import { createClient } from "@/lib/supabase/client"

const TransferForm = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [receiverData, setReceiverData] = useState<any | null>(null);

    const form = useForm<z.infer<typeof transferSchema>>({
        resolver: zodResolver(transferSchema),
        defaultValues: {
            email: "",
            amount: 0
        },
    })

    async function onSubmit(values: z.infer<typeof transferSchema>) {

        setIsLoading(true);

        try {
            const { data: { user }, } = await createClient().auth.getUser();
            const userResponse = await fetch(`/api/users/email/${values.email}`);
            const userData = await userResponse.json();
            if (userData.error) throw userData.error;

            setReceiverData(userData);

            const response = await fetch('/api/transactions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    sender_id: user?.id,
                    receiver_id: userData.id,
                    amount: values.amount
                })
            });
            const data = await response.json();
            if (data.error) throw data.error;

            setError(null);
            setIsDialogOpen(true);

        } catch (error: string | any) {
            console.error(error);
            setError(error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-white">Receiver Email</FormLabel>
                                <div className="flex items-center bg-light-gray border-none text-white placeholder:text-gray-400 rounded-md">
                                    <MailIcon className="mx-2 h-6 w-6 text-gray-300" />
                                    <FormControl>
                                        <Input type='email' placeholder='Receiver Email' {...field} className="border-none placeholder:text-gray-400" />
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
                        name="amount"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-white">Amount</FormLabel>
                                <div className="flex items-center bg-light-gray border-none text-white placeholder:text-gray-400 rounded-md">
                                    <Label className='mx-2 text-gray-300'>$</Label>
                                    <FormControl>
                                        <Input
                                            type='number'
                                            placeholder='$100.00'
                                            {...field}
                                            className="border-none placeholder:text-gray-400"
                                            onChange={(e) => {

                                                const value = e.target.value.replace(/\D/g, '');

                                                const formattedValue = (Number(value) / 100).toFixed(2);

                                                field.onChange(formattedValue);
                                            }} />
                                    </FormControl>
                                </div>
                                <FormDescription>
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" disabled={isLoading} className="w-full">{isLoading ? 'Loading...' : 'Transfer'}</Button>
                    {
                        error && (
                            <Label className="pt-4 text-red-600 font-bold text-mm text-center flex flex-col items-center justify-center capitalize">{error}</Label>
                        )
                    }
                </form>
            </Form>
            <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <AlertDialogContent className="bg-dark_gray-gradient border-none rounded-md w-4/5 text-white">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Transaction Successful!</AlertDialogTitle>
                        <AlertDialogDescription className="space-y-3 text-gray-200">
                            <p>You have transferred ${form.getValues("amount")} to {receiverData?.first_name} {receiverData?.last_name} ({receiverData?.email}).</p>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <Button
                        onClick={() => {
                            setIsDialogOpen(false);
                            form.reset();
                        }}
                        className="w-full"
                    >
                        Go Back
                    </Button>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}

export default TransferForm