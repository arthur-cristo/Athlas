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
import { z } from 'zod';
import { Label } from '../ui/label';
import { X } from 'lucide-react';
import { useUser } from '@/app/UserContext';

interface EditPostFormProps {
    post: PostType;
    edit: boolean;
    setEdit: Dispatch<SetStateAction<boolean>>;
    setFetch?: Dispatch<SetStateAction<boolean>>;
}

const EditPostForm = ({ post, edit, setEdit, setFetch }: EditPostFormProps) => {

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const user = useUser();

    const form = useForm<z.infer<typeof editPost>>({
        resolver: zodResolver(editPost),
        defaultValues: {
            title: post.title,
            content: post.content
        },
    })

    async function onSubmit(values: z.infer<typeof editPost>) {

        setIsLoading(true);
        setError('');
        try {

            if (!user) return;
            const formData = new FormData();
            formData.append('title', values.title);
            formData.append('content', values.content);
            const res = await fetch(`/api/posts/${post.id}`, {
                method: 'PATCH',
                body: formData
            });
            if (!res.ok) {
                const body = await res.json();
                throw new Error(body.error || 'Failed to edit post')
            }
            form.reset();
            if (setFetch) setFetch(prev => !prev);
            setEdit(false);
        } catch (error: any) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    }

    const handleCancel = (e: React.MouseEvent) => {
        e.preventDefault();
        setEdit(false);
    };

    return (
        <AlertDialog open={edit} onOpenChange={setEdit}>
            <AlertDialogContent aria-describedby='edit-post-description' className="max-w-[90vw] md:max-w-[50vw] border-none rounded-md p-4 flex flex-col items-center justify-center">
                <AlertDialogHeader>
                    <X size={20} className='absolute top-5 right-6 cursor-pointer m-0 text-muted-foreground' onClick={handleCancel} />
                </AlertDialogHeader>
                <AlertDialogDescription id="edit-post-description" className="hidden">Edit the post title and content below.</AlertDialogDescription>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem className="flex justify-start flex-col ">
                                    <FormControl>
                                        <Input placeholder='O que você está pensando?' {...field} maxLength={50} className="mt-6 bg-input border-none placeholder:text-muted-foreground" />
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
                                    <FormControl>
                                        <Textarea placeholder='Escreva seus pensamentos aqui...' {...field} maxLength={280} className="bg-input h-44 md:h-24 w-full border-none  placeholder:text-muted-foreground" />
                                    </FormControl>
                                    <FormDescription>
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className='flex md:justify-end md:gap-4 justify-between mt-4'>
                            <Button
                                onClick={handleCancel}
                                className="px-12 bg-muted border-muted-foreground/20 border-2 hover:bg-muted-foreground/20 py-6  "
                                variant={'secondary'}
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="px-12 py-6 rounded-md text-md font-medium border-2 border-primary">
                                Editar
                            </Button>
                        </div>
                        {error && (
                            <Label className="pt-4 text-destructive font-bold text-mm text-center flex flex-col items-center justify-center capitalize">{error}</Label>
                        )}
                    </form>
                </Form>
            </AlertDialogContent>
        </AlertDialog >
    )
}

export default EditPostForm