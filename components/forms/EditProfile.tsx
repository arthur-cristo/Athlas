import { Dispatch, SetStateAction, useState, useRef } from 'react';
import { AlertDialogContent, AlertDialogTitle, AlertDialogHeader, AlertDialog, AlertDialogDescription } from '../ui/alert-dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useForm } from 'react-hook-form';
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '../ui/form';
import { editProfileSchema } from '@/lib/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Label } from '../ui/label';
import { Image, X } from 'lucide-react';
import { ProfileType } from '@/types/Profile';
import { Textarea } from '../ui/textarea';

interface EditProfileProps {
    profile: ProfileType;
    edit: boolean;
    setEdit: Dispatch<SetStateAction<boolean>>;
    setFetch: Dispatch<SetStateAction<boolean>>;
}

const EditProfileForm = ({ profile, edit, setEdit, setFetch }: EditProfileProps) => {

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const form = useForm<z.infer<typeof editProfileSchema>>({
        resolver: zodResolver(editProfileSchema),
        defaultValues: {
            bio: profile.bio,
        },
    })

    const fileRef = form.register("image");

    async function onSubmit(values: z.infer<typeof editProfileSchema>) {

        setIsLoading(true);
        setError('');
        try {
            const formData = new FormData();
            formData.append('bio', values.bio);
            if (values.image) {
                formData.append('image', values.image[0]);
            }
            const res = await fetch(`/api/users/${profile.id}`, {
                method: 'PUT',
                body: formData
            });

            const data = await res.json();
            if (data.error) throw new Error(data.error);
            form.reset();
            setEdit(false);
            setFetch(prev => !prev);
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
            <AlertDialogContent aria-describedby='edit-profile-description' className="max-w-[90vw] w-fit border-none rounded-md py-8 round flex flex-col items-center justify-center">
                <AlertDialogHeader>
                    <X size={20} className='absolute top-5 right-6 cursor-pointer text-muted-foreground' onClick={handleCancel} />
                </AlertDialogHeader>
                <AlertDialogDescription id="edit-profile-description" className="hidden">Edit the profile title and content below.</AlertDialogDescription>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="bio"
                            render={({ field }) => (
                                <FormItem className="flex justify-start flex-col ">
                                    <FormControl>
                                        <Textarea placeholder='Bio' {...field} maxLength={50} className="mt-2 bg-input w-full border-none placeholder:text-muted-foreground" />
                                    </FormControl>
                                    <FormDescription>
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="image"
                            render={() => (
                                <FormItem className="flex justify-start flex-col">
                                    <FormControl>
                                        <>
                                            <Label htmlFor='image' className='bg-input rounded-md text-primary hover:text-primary/80 text-md p-4 py-2 px-6 cursor-pointer flex gap-2 items-center justify-center'>
                                                <Image className="h-6 w-6" />
                                                {form.watch('image')?.[0]?.name || 'Upload New Profile Picture'}
                                            </Label>
                                            <Input
                                                id='image'
                                                type='file'
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
                        <div className='flex gap-4 mt-4'>
                            <Button
                                onClick={handleCancel}
                                className="px-12 py-6 bg-muted border-muted-foreground/20 border-2 hover:bg-muted-foreground/20"
                                variant={'secondary'}
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                disabled={isLoading || !form.formState.isValid}
                                className="px-12 py-6 rounded-md text-md font-medium border-2 border-primary">
                                Editar
                            </Button>
                        </div>
                    </form>
                </Form>
            </AlertDialogContent>
        </AlertDialog >
    )
}

export default EditProfileForm