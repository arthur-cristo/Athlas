'use client'

import React, { Dispatch, SetStateAction, useState } from 'react'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { postSchema } from '@/lib/validation'
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form"
import { Button } from '../ui/button'
import { Images } from 'lucide-react'
import { useUser } from '@/app/UserContext'

const PostForm = ({ setFetch }: { setFetch: Dispatch<SetStateAction<boolean>> }) => {

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const user = useUser();

    const form = useForm<z.infer<typeof postSchema>>({
        resolver: zodResolver(postSchema),
        defaultValues: {
            title: "",
            content: ""
        },
    })

    const fileRef = form.register("images");

    async function onSubmit(values: z.infer<typeof postSchema>) {

        setIsLoading(true);
        try {
            if (!user) return;
            const formData = new FormData();
            formData.append('user_id', user.id);
            formData.append('title', values.title);
            formData.append('content', values.content);
            if (values.images) {
                for (let i = 0; i < values.images.length; i++) {
                    formData.append('image', values.images[i]);
                }
            }
            await fetch('/api/posts', {
                method: 'POST',
                body: formData
            });
            form.reset();
            setFetch(prev => !prev);
        } catch (error: any) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className='rounded-md p-4 flex flex-col gap-2 py-2'>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem className="flex justify-start flex-col">
                                    {/* <FormLabel className="text-muted-foreground text-left">Title</FormLabel> */}
                                    <FormControl>
                                        <Input placeholder='What are you thinking?' {...field} maxLength={50} className="bg-input border-none placeholder:text-muted-foreground" />
                                    </FormControl>
                                    <FormDescription>
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="content"
                            render={({ field }) => (
                                <FormItem className="flex justify-start flex-col">
                                    {/* <FormLabel className="text-muted-foreground text-left">Content</FormLabel> */}
                                    <FormControl>
                                        <Textarea placeholder='Write your thoughts here...' {...field} maxLength={280} className="bg-input md:h-20 h-36 border-none placeholder:text-muted-foreground" />
                                    </FormControl>
                                    <FormDescription>
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className='flex justify-between items-center'>
                            <FormField
                                control={form.control}
                                name="images"
                                render={() => (
                                    <FormItem >
                                        <FormControl>
                                            <>
                                                <Label htmlFor='images' className='flex gap-2 items-center'>
                                                    <div className='p-2 rounded-full hover:bg-muted/80 cursor-pointer transition duration-300'>
                                                        <Images className="h-7 w-7 text-primary" />
                                                    </div>
                                                    <h3 className='text-xl'>{form.watch('images')?.length || 0}</h3>
                                                </Label>
                                                <Input
                                                    id='images'
                                                    type='file'
                                                    multiple
                                                    accept='image/*'
                                                    {...fileRef}
                                                    className="hidden-input"
                                                />

                                            </>
                                        </FormControl>
                                        <FormDescription>
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" disabled={isLoading} className="px-6 py-4 rounded-full text-xl font-medium">{isLoading ? 'Loading...' : 'Post'}</Button>
                            {error && (
                                <Label className="pt-4 text-destructive font-bold text-mm text-center flex flex-col items-center justify-center capitalize">{error}</Label>
                            )}
                        </div>
                    </form>
                </Form>
        </div >
    )
}

export default PostForm