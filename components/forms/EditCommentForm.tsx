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
    const [success, setSuccess] = useState(false);
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
                console.error(body.error);
                throw new Error(body.error || 'Failed to edit comment')
            }
            form.reset();
            setSuccess(true);
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
                        <AlertDialogTitle className="text-center">Edit Comment</AlertDialogTitle>
                        <X size={20} className='absolute top-3 right-3 cursor-pointer m-0' onClick={handleCancel} />
                    </AlertDialogHeader>
                    <AlertDialogDescription id="edit-comment-description" className="hidden">Edit the comment content below.</AlertDialogDescription>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="content"
                                render={({ field }) => (
                                    <FormItem className="flex justify-start flex-col">
                                        <FormLabel className="text-muted-foreground text-left">Content</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder='Write your thoughts here...' {...field} maxLength={140} className="h-36 w-full border-none  placeholder:text-muted-foreground" />
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
                                    className="px-12 bg-btn-dark_gray hover:bg-btn-dark_gray  py-6  "
                                    variant={'secondary'}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="px-12 w-48 py-6 rounded-md text-md font-medium">
                                    {isLoading ? 'Loading...' : 'Edit'}
                                </Button>
                            </div>
                            {error && (
                                <Label className="pt-4 text-red-500 font-bold text-mm text-center flex flex-col items-center justify-center capitalize">{error}</Label>
                            )}
                        </form>
                    </Form>
                </AlertDialogContent>
            </AlertDialog >
            <AlertDialog open={success} onOpenChange={setSuccess}>
                <AlertDialogContent className=" border-none rounded-md w-4/5 ">
                    <AlertDialogHeader className='flex flex-row justify-center gap-4'>
                        <AlertDialogTitle className="text-center w-full">Comment Successfully Edited!</AlertDialogTitle>
                        <X size={20} className='absolute top-3 right-3 cursor-pointer m-0' onClick={() => {
                            setSuccess(false);
                            if (setFetch) setFetch(prev => !prev);
                        }} />
                    </AlertDialogHeader>
                    <AlertDialogDescription className="space-y-3 text-muted-foreground-200 text-center">
                        <p className="text-sm text-muted-foreground-400">Your comment was successfully edited.</p>
                    </AlertDialogDescription>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

export default EditPostForm