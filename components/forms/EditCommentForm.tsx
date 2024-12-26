import { Dispatch, SetStateAction, useState } from 'react';
import { AlertDialogContent, AlertDialogTitle, AlertDialogHeader, AlertDialog, AlertDialogDescription } from '../ui/alert-dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useForm } from 'react-hook-form';
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '../ui/form';
import { Textarea } from '../ui/textarea';
import { commentSchema, editPost } from '@/lib/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Label } from '../ui/label';
import { X } from 'lucide-react';
import { useUser } from '@/app/UserContext';
import { CommentType } from '@/types/Comment';

interface EditPostFormProps {
    comment: CommentType;
    edit: boolean;
    setEdit: Dispatch<SetStateAction<boolean>>;
    setFetch?: Dispatch<SetStateAction<boolean>>;
}

const EditPostForm = ({ comment, edit, setEdit, setFetch }: EditPostFormProps) => {

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const user = useUser();

    const form = useForm<z.infer<typeof commentSchema>>({
        resolver: zodResolver(commentSchema),
        defaultValues: {
            content: comment.content
        },
    })

    async function onSubmit(values: z.infer<typeof commentSchema>) {

        setIsLoading(true);
        setError('');
        try {

            if (!user) return;
            const formData = new FormData();
            formData.append('content', values.content);
            const res = await fetch(`/api/comments/${comment.id}`, {
                method: 'PATCH',
                body: formData
            });
            if (!res.ok) {
                const body = await res.json();
                throw new Error(body.error || 'Failed to edit comment')
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
        <div>

            <AlertDialog open={edit} onOpenChange={setEdit}>
                <AlertDialogContent aria-describedby='edit-comment-description' className="max-w-[90vw] w-fit  border-none rounded-md py-8  flex flex-col items-center justify-center">
                    <AlertDialogHeader>
                        <X size={20} className='absolute top-5 right-6 text-muted-foreground cursor-pointer m-0' onClick={handleCancel} />
                    </AlertDialogHeader>
                    <AlertDialogDescription id="edit-comment-description" className="hidden">Edit the comment content below.</AlertDialogDescription>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="content"
                                render={({ field }) => (
                                    <FormItem className="flex justify-start flex-col">
                                        <FormControl>
                                            <Textarea placeholder='Write your thoughts here...' {...field} maxLength={140} className="bg-input mt-2 h-20 md:h-20 w-full border-none placeholder:text-muted-foreground" />
                                        </FormControl>
                                        <FormDescription>
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className='flex gap-4 mt-4'>
                                <Button
                                    onClick={handleCancel}
                                    className="bg-muted border-muted-foreground/20 border-2 py-6 px-12 hover:bg-muted-foreground/20"
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
        </div>
    )
}

export default EditPostForm