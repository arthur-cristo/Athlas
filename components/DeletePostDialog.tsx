import { PostType } from "@/types/Post";
import { SetStateAction, Dispatch, useState } from "react";
import { Button } from './ui/button';
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog"
import { X } from "lucide-react";
import { useRouter } from "next/navigation";

interface DeletePostDialogProps {
    post: PostType;
    deleteDialog: boolean;
    setDeleteDialog: Dispatch<SetStateAction<boolean>>;
    setFetch?: Dispatch<SetStateAction<boolean>>
}

const DeletePostDialog = ({ post, deleteDialog, setDeleteDialog, setFetch }: DeletePostDialogProps) => {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        try {

            const response = await fetch(`/api/posts/${post.id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                const body = await response.json();
                throw new Error(body.error);
            }

            setDeleteDialog(false);
            (setFetch ? setFetch(prev => !prev) : router.push('/community'));

        } catch (error) {
            console.error(error);
        } finally {
            setIsDeleting(false);
        }
    }

    return (
        <AlertDialog open={deleteDialog} onOpenChange={setDeleteDialog}>
            <AlertDialogContent className="bg-very_dark_gray border-none rounded-md text-white w-fit">
                <AlertDialogHeader>
                    <AlertDialogTitle>Confirm post deletion</AlertDialogTitle>
                    <X size={20} className='absolute top-3 right-3 cursor-pointer m-0' onClick={() => {
                        setDeleteDialog(false);
                    }} />
                    <AlertDialogDescription>
                        <p className="text-sm text-gray-400">Are you sure you want to delete this posts?<br />This action cannot be undone.</p>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div className='flex gap-4 mt-4'>
                    <Button
                        onClick={() => setDeleteDialog(false)}
                        className="bg-btn-dark_gray hover:bg-btn-dark_gray text-white py-6 px-16 "
                        variant={'secondary'}
                    >
                        Cancel
                    </Button>
                    <Button
                        disabled={isDeleting}
                        onClick={() => {
                            handleDelete();
                        }}
                        className="px-16 w-40 py-6 bg-red-delete text-white hover:bg-red-delete"
                    >
                        {isDeleting ? 'Deleting...' : 'Delete'}
                    </Button>
                </div>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default DeletePostDialog