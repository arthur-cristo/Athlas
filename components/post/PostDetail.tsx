'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import LikeButton from './LikeButton'
import { PostType } from '@/types/Post'
import { EllipsisVertical, MessageCircleMore, X } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem
} from '../ui/dropdown-menu';
import EditPostForm from '../forms/EditPostForm';
import DeletePostDialog from './DeletePostDialog';
import { useUser } from '@/app/UserContext'

const PostDetail = ({ post, userPfp }: { post: PostType, userPfp: string }) => {

    const [edit, setEdit] = useState(false);
    const [deleteDialog, setDeleteDialog] = useState(false)
    const user = useUser();

    return (
        <div className='bg-dark-gray p-4 rounded-md my-4 text-left mx-8 text-white'>
            <div className="flex justify-between">
                <div className='flex gap-2 items-center'>
                    <Image className="w-6 h-6 rounded-full" width={16} height={16} src={userPfp} alt={post.user_name} />
                    <Link href={`/community/users/${post.user_id}`}><h3>{post.user_name}</h3></Link>
                </div>
                <div className='flex items-center gap-2'>
                    <p className="text-gray-300">{new Date(post.updated_at).toLocaleString()}</p>
                    {user?.id === post.user_id &&
                        <DropdownMenu modal={false}>
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
            <h2 className="text-xl font-bold mt-2 text-wrap break-words">{post.title}</h2>
            <p className="text-wrap break-words">{post.content}</p>
            {post.posts_pictures.length > 0 && (
                <div className="flex gap-4 overflow-y-scroll my-4">
                    {post.posts_pictures.map((pic) => (
                        <Image
                            src={pic.image_url}
                            alt={post.title}
                            width={250}
                            height={100}
                            style={{ objectFit: 'cover' }}
                        />
                    ))}
                </div>

            )}
            <div className='flex gap-8 mt-4'>
                <LikeButton {...post} />
                <div className='flex gap-2'>
                    <MessageCircleMore size={24} />
                    <span>{post.comments}</span>
                </div>
            </div>
            <EditPostForm post={post} edit={edit} setEdit={setEdit} />
            <DeletePostDialog post={post} deleteDialog={deleteDialog} setDeleteDialog={setDeleteDialog} />
        </div>
    )
}

export default PostDetail