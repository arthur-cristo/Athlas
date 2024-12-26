'use client'

import React, { Dispatch, SetStateAction, useState } from 'react'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { set, z } from 'zod'
import { commentSchema } from '@/lib/validation'
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form"
import { Button } from '../ui/button'
import { useUser } from '@/app/UserContext'
import { PostType } from '@/types/Post'
import { Input } from '../ui/input'

interface CommentFormProps {
    post: PostType;
    comment_id?: string;
    setFetch: Dispatch<SetStateAction<boolean>>;
}

const CommentForm = ({ post, comment_id, setFetch }: CommentFormProps) => {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const user = useUser();

    const form = useForm<z.infer<typeof commentSchema>>({
        resolver: zodResolver(commentSchema),
        defaultValues: {
            content: ""
        },
    })

    async function onSubmit(values: z.infer<typeof commentSchema>) {

        setIsLoading(true);
        try {
            if (!user || !post.id) return;
            const formData = new FormData();
            formData.append('user_id', user.id);
            formData.append('post_id', post.id);
            if (comment_id) formData.append('comment_id', comment_id);
            formData.append('content', values.content);
            await fetch(`/api/posts/${post.id}/comments`, {
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
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='rounded-md flex items-center md:flex-row flex-col gap-4 bg-dark-gray mx-8'>
                <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                        <FormItem className="w-full">
                            <FormControl className='md:hidden flex'>
                                <Textarea
                                    placeholder='Escreva um comentário'
                                    {...field} maxLength={140}
                                    className="md:h-fit h-24 border-none bg-input placeholder:text-muted-foreground" />
                            </FormControl>
                            <FormControl className='hidden md:flex'>
                                <Input
                                    placeholder='Escreva um comentário'
                                    {...field}
                                    maxLength={140}
                                    className="py-6 rounded-full border-none bg-input placeholder:text-muted-foreground focus-visible:ring-0" />
                            </FormControl>
                            <FormDescription>
                            </FormDescription>
                        </FormItem>
                    )}
                />
                <Button type="submit" disabled={isLoading || !form.formState.isValid} className="md:w-fit w-full px-8 py-6 rounded-full text-xl font-medium border-2 border-primary">Comentar</Button>
            </form>
        </Form>
    )
}

export default CommentForm