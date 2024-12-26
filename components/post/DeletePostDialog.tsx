import { PostType } from "@/types/Post";
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
    post?: PostType;
    comment?: CommentType;
    deleteDialog: boolean;
    setDeleteDialog: Dispatch<SetStateAction<boolean>>;
    setFetch?: Dispatch<SetStateAction<boolean>>;
}

const DeletePostDialog = ({ post, comment, deleteDialog, setDeleteDialog, setFetch }: DeleteDialogProps) => {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            const id = post ? post.id : comment?.id;
            const type = post ? 'posts' : 'comments';

            const response = await fetch(`/api/${type}/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                const body = await response.json();
                throw new Error(body.error);
            }

            setDeleteDialog(false);
            (setFetch ? setFetch(prev => !prev) : router.push('/community'));

        } catch (error) {
            /* console.error(error); */
        } finally {
            setIsDeleting(false);
        }
    }

    return (
        <AlertDialog open={deleteDialog} onOpenChange={setDeleteDialog}>
            <AlertDialogContent className="border-none rounded-md round w-fit">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-center">Tem certeza?</AlertDialogTitle>
                    <X size={20} className='absolute top-5 right-6 cursor-pointer text-muted-foreground' onClick={() => {
                        setDeleteDialog(false);
                    }} />
                    <AlertDialogDescription>
                        <p className="text-sm w-full text-muted-foreground text-center">Você realmente quer apagar este {post ? 'post' : 'comentário'}?<br />Essa ação não pode ser desfeita.</p>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div className='flex gap-4 mt-4'>
                    <Button
                        onClick={() => setDeleteDialog(false)}
                        className="bg-muted border-muted-foreground/20 border-2 py-6 px-12 hover:bg-muted-foreground/20"
                        variant={'secondary'}
                    >
                        Cancelar
                    </Button>
                    <Button
                        disabled={isDeleting}
                        onClick={() => {
                            handleDelete();
                        }}
                        className="px-12 py-6 bg-destructive hover:bg-destructive/80 border-destructive border-2"
                    >
                        Apagar
                    </Button>
                </div>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default DeletePostDialog;