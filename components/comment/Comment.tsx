'use client'

import { CommentType } from "@/types/Comment"
import Link from "next/link"
import LikeButton from "./LikeButton"
import { Dispatch, SetStateAction, useState } from "react"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "../ui/dropdown-menu"
import { EllipsisVertical } from "lucide-react"
import { useUser } from "@/app/UserContext"
import EditCommentForm from "../forms/EditCommentForm"
import DeletePostDialog from "../post/DeletePostDialog"
import Image from "next/image"

const Comment = ({ comment, setFetch }: { comment: CommentType, setFetch: Dispatch<SetStateAction<boolean>> }) => {

    const [edit, setEdit] = useState(false);
    const [deleteDialog, setDeleteDialog] = useState(false)
    const user = useUser();

    return (
        <div className="mt-8 rounded-md my-4 text-left w-full">
            <div className="flex justify-between pb-2">
                <Link href={`/community/users/${comment.user_id}`} className='flex gap-2 items-center'>
                    <Image className='rounded-full' src={comment.profiles.profile_picture} width={24} height={24} alt={comment.profiles.first_name + ' ' + comment.profiles.last_name} />
                    <h3>{comment.profiles.first_name + ' ' + comment.profiles.last_name}</h3>
                </Link>
                <div className='flex items-center gap-2'>
                    <p className="text-muted-foreground flex md:hidden">{new Date(comment.updated_at).toLocaleDateString('pt-BR', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                    <p className="text-muted-foreground hidden md:flex">{new Date(comment.updated_at).toLocaleDateString('pt-BR', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                    {user?.id === comment.user_id &&
                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <EllipsisVertical size={20} className='text-muted-foreground' />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className='border-none'>
                                <DropdownMenuItem
                                    onClick={() => setEdit(true)}
                                    className='focus:bg-muted-foreground focus:text-muted'>
                                    Editar
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    className='text-destructive focus:bg-destructive'
                                    onClick={() => setDeleteDialog(true)}>
                                    Apagar
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                    }
                </div>
            </div>
            <Link href={'/community/posts/' + comment.id}>
                <p className="text-wrap break-words">{comment.content}</p>
            </Link>
            <div className='flex gap-8 mt-4'>
                <LikeButton {...comment} />
            </div>
            <EditCommentForm comment={comment} edit={edit} setEdit={setEdit} setFetch={setFetch} />
            <DeletePostDialog comment={comment} deleteDialog={deleteDialog} setDeleteDialog={setDeleteDialog} setFetch={setFetch} />
        </div>
    )
}

export default Comment