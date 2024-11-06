

import { Dispatch, SetStateAction, useState } from 'react';
import { AlertDialogContent, AlertDialogTitle, AlertDialogHeader, AlertDialog, AlertDialogDescription } from '../ui/alert-dialog';
import { Button } from '../ui/button';
import { PostType } from '@/types/Post';
import { Input } from '../ui/input';
import { useForm } from 'react-hook-form';
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '../ui/form';
import { Textarea } from '../ui/textarea';
import { editPost } from '@/lib/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { createClient } from '@/lib/supabase/client';
import { z } from 'zod';
import { Label } from '../ui/label';
import { X } from 'lucide-react';

interface EditPostFormProps {
    post: PostType;
    edit: boolean;
    setEdit: Dispatch<SetStateAction<boolean>>;
}

const EditPostForm = ({ post, edit, setEdit }: EditPostFormProps) => {

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const form = useForm<z.infer<typeof editPost>>({
        resolver: zodResolver(editPost),
        defaultValues: {
            title: post.title,
            content: post.content
        },
    })

    async function onSubmit(values: z.infer<typeof editPost>) {

        setIsLoading(true);
        console.log(values);
        try {
            const { data: { user } } = await createClient().auth.getUser();
            if (!user) return;
            const formData = new FormData();
            formData.append('title', values.title);
            formData.append('content', values.content);
            console.log(formData);
            await fetch(`/api/posts/${post.id}`, {
                method: 'PATCH',
                body: formData
            });
            form.reset();
            setSuccess(true);
        } catch (error: any) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <AlertDialog open={edit} onOpenChange={setEdit}>
            <AlertDialogContent className="bg-dark_gray-gradient border-none rounded-md w-4/5 text-white">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-center">Edit Post</AlertDialogTitle>
                </AlertDialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem className="flex justify-start flex-col">
                                    <FormLabel className="text-white text-left">Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder='What are you thinking?' {...field} className="bg-light-gray border-none placeholder:text-gray-400" />
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
                                    <FormLabel className="text-white text-left">Content</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder='Write your thoughts here...' {...field} className="bg-light-gray border-none text-white placeholder:text-gray-400" />
                                    </FormControl>
                                    <FormDescription>
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={isLoading} className="w-full px-8 py-4 rounded-full text-xl font-medium">{isLoading ? 'Loading...' : 'Edit'}</Button>
                        {error && (
                            <Label className="pt-4 text-red-500 font-bold text-mm text-center flex flex-col items-center justify-center capitalize">{error}</Label>
                        )}
                    </form>
                </Form>
                <AlertDialog open={success} onOpenChange={setSuccess}>
                    <AlertDialogContent className="bg-dark_gray-gradient border-none rounded-md w-4/5 text-white">
                        <AlertDialogHeader className='flex flex-row justify-center gap-4'>
                            <AlertDialogTitle className="text-center w-full">Post Successfully Edited!</AlertDialogTitle>
                            <X size={20} className='absolute top-3 right-3 cursor-pointer m-0' onClick={() => {
                                setSuccess(false);
                                setEdit(false);
                            }} />
                        </AlertDialogHeader>
                        <AlertDialogDescription className="space-y-3 text-gray-200 text-center">
                            <p className="text-sm text-gray-400">Your post was successfully edited.</p>
                        </AlertDialogDescription>
                    </AlertDialogContent>
                </AlertDialog>
            </AlertDialogContent>
        </AlertDialog >
    )
}

export default EditPostForm