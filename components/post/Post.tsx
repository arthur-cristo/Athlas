'use client'

import { PostType } from '@/types/Post'
import { EllipsisVertical, MessageCircleMore } from 'lucide-react';
import Image from 'next/image'
import Link from 'next/link';
import { Dispatch, SetStateAction, useState } from 'react';
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem
} from '../ui/dropdown-menu';
import EditPostForm from '../forms/EditPostForm';
import { useUser } from '@/app/UserContext';
import LikeButton from './LikeButton';
import DeletePostDialog from './DeletePostDialog';

const Post = ({ post, setFetch }: { post: PostType, setFetch: Dispatch<SetStateAction<boolean>> }) => {

    const [edit, setEdit] = useState(false);
    const [deleteDialog, setDeleteDialog] = useState(false)
    const user = useUser();

    return (
        <div className="bg-dark-gray p-4 rounded-md my-4 text-left w-full">
            <div className="flex justify-between">
                <Link href={`/community/users/${post.user_id}`}><h3>{post.user_name}</h3></Link>
                <div className='flex items-center gap-2'>
                    <p className="text-gray-300">{new Date(post.updated_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
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
            <Link href={'/community/posts/' + post.id}>
                <h2 className="text-xl font-bold mt-2 text-wrap break-words">{post.title}</h2>
                <p className="text-wrap break-words">{post.content}</p>
                {post.posts_pictures.length > 0 && (
                    <div className="flex gap-4 overflow-hidden my-4">
                        {post.posts_pictures.map((pic) => (
                            <Image
                                key={pic.image_url}
                                src={pic.image_url}
                                alt={post.title}
                                width={250}
                                height={100}
                                style={{ objectFit: 'cover' }}
                            />
                        ))}
                    </div>

                )}
            </Link>
            <div className='flex gap-8 mt-4'>
                <LikeButton {...post} />
                <div className='flex gap-2'>
                    <Link href={'/community/posts/' + post.id}>
                        <MessageCircleMore size={24} />
                    </Link>
                    <span>{post.comments}</span>
                </div>
            </div>
            <EditPostForm post={post} edit={edit} setEdit={setEdit} setFetch={setFetch} />
            <DeletePostDialog post={post} deleteDialog={deleteDialog} setDeleteDialog={setDeleteDialog} setFetch={setFetch} />
        </div >
    )
}

export default Post