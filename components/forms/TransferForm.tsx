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
import { MailIcon, X } from "lucide-react"
import { Label } from "@/components/ui/label"
import { useUser } from "@/app/UserContext"

const TransferForm = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showError, setShowError] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [receiverData, setReceiverData] = useState<any | null>(null);
    const user = useUser();

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

            const userResponse = await fetch(`/api/users/search?email=${values.email}`);
            const userData = await userResponse.json();
            if (userData.error) throw userData.error;
            console.log(userData.id)
            setReceiverData(userData);
            console.log({
                sender_id: user!.id,
                receiver_id: userData.id,
                amount: values.amount
            })
            const response = await fetch('/api/transactions', {
                method: 'POST',
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

        } catch (error: any) {
            setError(error);
            setShowError(true);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-3">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-gray">Receiver Email</FormLabel>
                                <div className="flex items-center bg-input-dark_gray border-none text-white placeholder:text-gray rounded-md">
                                    <MailIcon className="mx-2 h-6 w-6 text-gray" />
                                    <FormControl>
                                        <Input type='email' placeholder='Receiver Email' {...field} className="border-none placeholder:text-gray" />
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
                                <FormLabel className="text-gray">Amount</FormLabel>
                                <div className="flex items-center bg-input-dark_gray border-none text-white placeholder:text-gray rounded-md">
                                    <Label className='mx-2 text-gray'>$</Label>
                                    <FormControl>
                                        <Input
                                            type='number'
                                            placeholder='$100.00'
                                            {...field}
                                            className="border-none placeholder:text-gray"
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
                </form>
            </Form>
            <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <AlertDialogContent className="bg-very_dark_gray border-none rounded-md w-4/5 text-white">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-center">Transaction Successful!</AlertDialogTitle>
                        <X size={20} className='absolute top-3 right-3 cursor-pointer m-0' onClick={() => {
                            setIsDialogOpen(false);
                        }} />
                    </AlertDialogHeader>
                    <AlertDialogDescription className="space-y-3 text-gray-200 text-center">
                        <p>You have transferred <span className="text-green-400">${form.getValues("amount")}</span> to {receiverData?.first_name} {receiverData?.last_name} (<span className="text-green-400">{receiverData?.email}</span>).</p>
                        <p className="text-sm text-gray-400">Your balance may take a few seconds to update.</p>
                    </AlertDialogDescription>
                    <Button
                        onClick={() => {
                            setIsDialogOpen(false);
                            form.reset();
                        }}
                        className="w-full mt-2"
                    >
                        Go Back
                    </Button>
                </AlertDialogContent>
            </AlertDialog>
            <AlertDialog open={showError} onOpenChange={setShowError}>
                <AlertDialogContent className="bg-very_dark_gray border-none rounded-md w-4/5 text-white">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-center text-red-500">Transaction wasn't Successful.</AlertDialogTitle>
                        <X size={20} className='absolute top-3 right-3 cursor-pointer m-0' onClick={() => {
                            setShowError(false);
                        }} />
                    </AlertDialogHeader>
                    <AlertDialogDescription className="space-y-3 text-gray-200 text-center">
                        <p>{error}</p>
                    </AlertDialogDescription>
                    <Button
                        variant={"ghost"}
                        onClick={() => {
                            setShowError(false);
                            form.reset();
                        }}
                        className="mt-2 border-solid border-white bg-dark-gray hover:border-2 border-opacity-10 hover:bg-transparent"
                    >
                        Go Back
                    </Button>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}

export default TransferForm