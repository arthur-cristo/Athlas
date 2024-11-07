import { PostType } from "@/types/Post";
import { SetStateAction, Dispatch } from "react";
import { Button } from './ui/button';
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog"
import { X } from "lucide-react";

interface DeletePostDialogProps {
    post: PostType;
    deleteDialog: boolean;
    setDeleteDialog: Dispatch<SetStateAction<boolean>>;
}

const DeletePostDialog = ({ post, deleteDialog, setDeleteDialog }: DeletePostDialogProps) => {
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
                        onClick={() => {
                            const deletePost = async () => {
                                await fetch(`/api/posts/${post.id}`, {
                                    method: 'DELETE'
                                })
                            }
                            deletePost();
                            setDeleteDialog(false);
                        }}
                        className="px-16 py-6 bg-red-delete text-white hover:bg-red-delete"
                    >
                        Delete
                    </Button>
                </div>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default DeletePostDialog