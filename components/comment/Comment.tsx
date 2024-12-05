'use client'

import { CommentType } from "@/types/Comment"
import Link from "next/link"
import LikeButton from "./LikeButton"
import DeleteCommentDialog from "./DeleteCommentDialog"
import { Dispatch, SetStateAction, useState } from "react"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "../ui/dropdown-menu"
import { EllipsisVertical } from "lucide-react"
import { useUser } from "@/app/UserContext"
import EditCommentForm from "../forms/EditCommentForm"

const Comment = ({ comment, setFetch }: { comment: CommentType, setFetch: Dispatch<SetStateAction<boolean>> }) => {

    const [edit, setEdit] = useState(false);
    const [deleteDialog, setDeleteDialog] = useState(false)
    const user = useUser();

    return (
        <div className="p-4 rounded-md my-4 text-left w-full round">
            <div className="flex justify-between pb-2">
                <Link href={`/community/users/${comment.user_id}`}><h3>{comment.user_name}</h3></Link>
                <div className='flex items-center gap-2'>
                    <p className="text-muted-foreground">{new Date(comment.updated_at).toLocaleString()}</p>
                    {user?.id === comment.user_id &&
                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <EllipsisVertical size={20} className='text-muted-foreground' />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className='border-none'>
                            <DropdownMenuItem
                                    onClick={() => setEdit(true)}
                                    className='focus:bg-muted-foreground focus:text-muted'>
                                    Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    className='text-destructive focus:bg-destructive'
                                    onClick={() => setDeleteDialog(true)}>
                                    Delete
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
            <DeleteCommentDialog comment={comment} deleteDialog={deleteDialog} setDeleteDialog={setDeleteDialog} setFetch={setFetch} />
        </div>
    )
}

export default Comment