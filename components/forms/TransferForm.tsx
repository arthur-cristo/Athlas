'use client'

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
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
        FormMessage,
} from "@/components/ui/form"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'
import { useEffect, useState } from "react"
import { transferSchema } from "@/lib/validation"
import { KeyRound, MailIcon, Shuffle, X } from "lucide-react"
import { Label } from "@/components/ui/label"
import { useUser } from "@/app/UserContext"
import { createClient } from "@/lib/supabase/client"
import { dollarFormat } from "@/lib/utils"

const TransferForm = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showError, setShowError] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [receiverData, setReceiverData] = useState<any | null>(null);
    const user = useUser();
    const supabase = createClient();
    const [balance, setBalance] = useState<number | null>(null);

    const form = useForm<z.infer<typeof transferSchema>>({
        resolver: zodResolver(transferSchema),
        defaultValues: {
            amount: 0.00,
            keyType: "email",
            email: "",
            phoneNumber: "",
            randomKey: ""
        },
    })


    useEffect(() => {

        const fetchBalance = async () => {
            try {
                if (!user) return;
                const { data, error } = await supabase
                    .from('profiles')
                    .select('balance')
                    .eq('id', user.id)
                    .single();

                if (error) throw error;

                setBalance(data.balance ?? 0);
            } catch (error) {
                console.error('Failed to fetch balance:', error);
            }
        };

        fetchBalance();
        const intervalId = setInterval(fetchBalance, 10000);

        return () => clearInterval(intervalId);
    }, [user]);

    const { watch, resetField } = form
    const keyType = watch("keyType")

    useEffect(() => {
        if (keyType === "email") {
            resetField("phoneNumber")
            resetField("randomKey")
        } else if (keyType === "phoneNumber") {
            resetField("email")
            resetField("randomKey")
        } else if (keyType === "randomKey") {
            resetField("email")
            resetField("phoneNumber")
        }
    }, [keyType, resetField])

    async function onSubmit(values: z.infer<typeof transferSchema>) {

        setIsLoading(true);
        
        try {
            let query = '/api/users/search?';
            const { keyType, randomKey, email, phoneNumber } = values

            if (keyType === 'email' && email) query += `email=${email}`;
            else if (keyType === 'phoneNumber' && phoneNumber) query += `phone_number=${phoneNumber}`;
            else if (keyType === 'randomKey' && randomKey) query += `random_key=${randomKey}`;
            else throw new Error('Invalid Key Type')

            const userResponse = await fetch(query);
            const userData = await userResponse.json();
            if (userData.error) throw userData.error;

            setReceiverData(userData);

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
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 text-left md:w-[768px] w-full">
                    <FormField
                        control={form.control}
                        name="amount"
                        render={({ field }) => (
                            <FormItem className="space-y-2">
                                <h1 className="text-3xl font-bold w-[60vw]">How much do you want to send?</h1>
                                <p className="text-gray text-xl">Your balance: <span className="text-white font-medium">$ {balance && (dollarFormat.format(balance).slice(1))}</span></p>
                                <div className="flex items-center bg-input-dark_gray border-none text-white placeholder:text-gray rounded-md">
                                    <Label className='mx-2 text-gray'>$</Label>
                                    <FormControl>
                                        <Input
                                            type='number'
                                            placeholder='0.00'
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
                    <FormField
                        control={form.control}
                        name="keyType"
                        render={({ field }) => (
                            <FormItem>
                                <p className="text-gray text-md">What is the type of the receiver's key?</p>
                                <div className="flex items-center bg-input-dark_gray border-none text-white placeholder:text-gray rounded-md">
                                    <KeyRound className="mx-2 h-6 w-6 text-gray" />
                                    <FormControl>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <SelectTrigger className="border-none">
                                                <SelectValue placeholder="Email" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-input-dark_gray w-fit text-white border-none">
                                                <SelectItem value="email">Email</SelectItem>
                                                <SelectItem value="phoneNumber">Phone Number</SelectItem>
                                                <SelectItem value="randomKey">Random Key</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                </div>
                                <FormDescription>
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )} />
                    {keyType === 'email' && (
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <p className="text-gray text-md">Receiver's Email</p>
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
                        />)}
                    {keyType === 'randomKey' && (
                        <FormField
                            control={form.control}
                            name="randomKey"
                            render={({ field }) => (
                                <FormItem>
                                    <p className="text-gray text-md">Receiver's Random Key</p>
                                    <div className="flex items-center bg-input-dark_gray border-none text-white placeholder:text-gray rounded-md">
                                        <Shuffle className="mx-2 h-6 w-6 text-gray" />
                                        <FormControl>
                                            <Input type='text' placeholder="Receiver's Random Key" {...field} className="border-none placeholder:text-gray" />
                                        </FormControl>
                                    </div>
                                    <FormDescription>
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />)}
                    {form.getValues('keyType') === 'phoneNumber' && (
                        <FormField
                            control={form.control}
                            name="phoneNumber"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <p className="text-gray text-md">Receiver's Phone Number</p>
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
                    )}
                    <Button type="submit" disabled={isLoading} className="w-full">{isLoading ? 'Loading...' : 'Transfer'}</Button>
                </form>
            </Form>
            <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <AlertDialogContent className="bg-very_dark_gray border-none rounded-md w-4/5 text-white">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-center">Transaction Successful!</AlertDialogTitle>
                        <X size={20} className='absolute top-3 right-3 cursor-pointer m-0' onClick={() => {
                            setIsDialogOpen(false);
                            form.reset();
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
                            form.reset();
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