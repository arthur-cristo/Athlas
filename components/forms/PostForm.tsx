'use client'

import React, { useState } from 'react'
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
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Button } from '../ui/button'
import { ChevronDown, Images } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const PostForm = () => {

    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const [writePost, setWritePost] = useState(true);
    
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
            const { data: { user } } = await createClient().auth.getUser();
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
        } catch (error: any) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className='rounded-md p-4 flex flex-col gap-2 py-8 bg-form-dark_gray'>
            <div className='flex justify-center gap-4 py-4'>
                <h2 className='capitalize font-semibold text-2xl'>Share your thoughts</h2>
                <ChevronDown className='h-8 w-8 cursor-pointer' onClick={() => setWritePost(!writePost)} />
            </div>
            {writePost && (
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem className="flex justify-start flex-col">
                                    <FormLabel className="text-gray text-left">Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder='What are you thinking?' {...field} maxLength={50} className="bg-input-dark_gray border-none placeholder:text-gray" />
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
                                    <FormLabel className="text-gray text-left">Content</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder='Write your thoughts here...' {...field} maxLength={280} className="md:h-20 h-32 bg-input-dark_gray border-none text-white placeholder:text-gray" />
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
                                render={({ field }) => (
                                    <FormItem className="flex justify-start flex-col">
                                        <FormControl>
                                            <>
                                                <Label htmlFor='images' className='cursor-pointer bg-input-dark_gray rounded-full p-4 px-6 hover:bg-dark-gray flex gap-4'>
                                                    <Images className="h-8 w-8 text-green-500 hover:text-green-400" />
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
                            <Button type="submit" disabled={isLoading} className="px-8 py-6 rounded-md text-xl font-medium">{isLoading ? 'Loading...' : 'Post'}</Button>
                            {error && (
                                <Label className="pt-4 text-red-500 font-bold text-mm text-center flex flex-col items-center justify-center capitalize">{error}</Label>
                            )}
                        </div>
                    </form>
                </Form>
            )}
        </div >
    )
}

export default PostForm