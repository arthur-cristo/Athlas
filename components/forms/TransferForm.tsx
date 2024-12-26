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
import { useRouter } from "next/navigation"

const TransferForm = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showError, setShowError] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [receiverData, setReceiverData] = useState<any | null>(null);
    const user = useUser();
    const supabase = createClient();
    const [balance, setBalance] = useState<number | null>(null);
    const router = useRouter();

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
                /* console.error('Failed to fetch balance:', error); */
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
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 text-left md:w-[480px] w-full">
                    <FormField
                        control={form.control}
                        name="amount"
                        render={({ field }) => (
                            <FormItem className="space-y-2">
                                <h1 className="text-3xl font-bold w-[60vw]">Quanto você quer enviar?</h1>
                                <p className="text-muted-foreground text-xl">Seu saldo: <span className="text-foreground font-medium">A$ {balance && (dollarFormat.format(balance).slice(1))}</span></p>
                                <div className="flex bg-input items-center border-none placeholder:text-muted-foreground rounded-md">
                                    <Label className='mx-2 text-muted-foreground'>A$</Label>
                                    <FormControl>
                                        <Input
                                            type='number'
                                            placeholder='0.00'
                                            {...field}
                                            className="border-none placeholder:text-muted-foreground"
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
                                <p className="text-muted-foreground text-md">Qual é o tipo da chave?</p>
                                <div className="flex bg-input items-center border-none placeholder:text-muted-foreground rounded-md">
                                    <KeyRound className="mx-2 h-6 w-6 text-muted-foreground" />
                                    <FormControl>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <SelectTrigger className="border-none">
                                                <SelectValue placeholder="Email" />
                                            </SelectTrigger>
                                            <SelectContent className="w-fit border-none shadow-md">
                                                <SelectItem value="email">Email</SelectItem>
                                                <SelectItem value="phoneNumber">Telefone</SelectItem>
                                                <SelectItem value="randomKey">Chave Aleatória</SelectItem>
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
                                    <div className="flex items-center border-none bg-input placeholder:text-muted-foreground rounded-md">
                                        <MailIcon className="mx-2 h-6 w-6 text-muted-foreground" />
                                        <FormControl>
                                            <Input type='email' placeholder='Email' {...field} className="border-none placeholder:text-muted-foreground" />
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
                                    <div className="flex items-center border-none bg-input placeholder:text-muted-foreground rounded-md">
                                        <Shuffle className="mx-2 h-6 w-6 text-muted-foreground" />
                                        <FormControl>
                                            <Input type='text' placeholder="Chave Aleatória" {...field} className="border-none placeholder:text-muted-foreground" />
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
                                    <FormControl>
                                        <PhoneInput
                                            defaultCountry="BR"
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
                    <Button type="submit" disabled={isLoading || !form.formState.isValid} className="w-full">Transferir</Button>
                </form>
            </Form>
            <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <AlertDialogContent className="bg-background border-none rounded-md w-4/5">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-center">Transação Bem-Sucedida!</AlertDialogTitle>
                        <X size={20} className='absolute top-5 right-6 cursor-pointer text-muted-foreground' onClick={() => {
                            setIsDialogOpen(false);
                            form.reset();
                        }} />
                    </AlertDialogHeader>
                    <AlertDialogDescription className="space-y-3 text-muted-foreground-200 text-center">
                        <p>Você transferiu <span className="text-primary">A$</span>{form.getValues("amount")} para {receiverData?.first_name} {receiverData?.last_name} ({receiverData?.email}).</p>
                        <p className="text-sm text-muted-foreground-400">Seu saldo pode levar alguns segundos para atualizar.</p>
                    </AlertDialogDescription>
                    <div className="flex justify-between gap-4">
                        <Button
                            variant={"secondary"}
                            onClick={() => {
                                setIsDialogOpen(false);
                                form.reset();
                                router.push('/transactions');
                            }}
                            className="w-full mt-2"
                        >
                            Voltar
                        </Button>
                        <Button
                            onClick={() => {
                                setIsDialogOpen(false);
                                form.reset();
                            }}
                            className="w-full mt-2"
                        >
                            Realizar outra transferência
                        </Button>
                    </div>
                </AlertDialogContent>
            </AlertDialog>
            <AlertDialog open={showError} onOpenChange={setShowError}>
                <AlertDialogContent className="border-none rounded-md w-4/5">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-center text-destructive">A transação não foi bem-sucedida.</AlertDialogTitle>
                        <X size={20} className='absolute top-5 right-6 cursor-pointer text-muted-foreground' onClick={() => {
                            setShowError(false);
                            form.reset();
                        }} />
                    </AlertDialogHeader>
                    <AlertDialogDescription className="space-y-3 text-muted-foreground-200 text-center">
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
                        Voltar
                    </Button>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}

export default TransferForm