import { SetStateAction, Dispatch, useState } from "react";
import { Button } from '../ui/button';
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog"
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { CommentType } from "@/types/Comment";

interface DeleteDialogProps {
    comment: CommentType;
    deleteDialog: boolean;
    setDeleteDialog: Dispatch<SetStateAction<boolean>>;
    setFetch: Dispatch<SetStateAction<boolean>>;
}

const DeleteCommentDialog = ({ comment, deleteDialog, setDeleteDialog, setFetch }: DeleteDialogProps) => {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        try {

            const id = comment.id;

            const response = await fetch(`/api/comments/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                const body = await response.json();
                throw new Error(body.error);
            }

            setDeleteDialog(false);
            setFetch(prev => !prev);

        } catch (error) {
            /* TODO */
        } finally {
            setIsDeleting(false);
        }
    }

    return (
        <AlertDialog open={deleteDialog} onOpenChange={setDeleteDialog}>
            <AlertDialogContent className=" border-none rounded-md  w-fit">
                <AlertDialogHeader>
                    <AlertDialogTitle>Confirm deletion</AlertDialogTitle>
                    <X size={20} className='absolute top-3 right-4 cursor-pointer m-0' onClick={() => {
                        setDeleteDialog(false);
                    }} />
                    <AlertDialogDescription>
                        <p className="text-sm text-muted-foreground-400">Are you sure you want to delete this comment?<br />This action cannot be undone.</p>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div className='flex gap-4 mt-4'>
                    <Button
                        onClick={() => setDeleteDialog(false)}
                        className="bg-muted border-muted-foreground/20 border-2 py-6 px-16 hover:bg-muted-foreground/20"
                        variant={'secondary'}
                    >
                        Cancelar
                    </Button>
                    <Button
                        disabled={isDeleting}
                        onClick={() => {
                            handleDelete();
                        }}
                        className="px-16 w-40 py-6 bg-destructive hover:bg-destructive/80 border-destructive border-2"
                    >
                        {isDeleting ? 'Deleting...' : 'Delete'}
                    </Button>
                </div>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default DeleteCommentDialog;