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
        <div className="bg-dark-gray p-4 rounded-md my-4 text-left w-full text-white">
            <div className="flex justify-between pb-2">
                <h3>{comment.user_name}</h3>
                <div className='flex items-center gap-2'>
                    <p className="text-gray-300">{new Date(comment.updated_at).toLocaleString()}</p>
                    {user?.id === comment.user_id &&
                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <EllipsisVertical size={20} className='text-gray-300' />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className='bg-very_dark_gray border-none'>
                                <DropdownMenuItem
                                    onClick={() => setEdit(true)}
                                    className='text-white focus:bg-light_gray'>
                                    Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    className='text-red-delete focus:bg-light_gray'
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