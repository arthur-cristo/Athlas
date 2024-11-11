'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'
import LikeButton from './LikeButton'
import { PostType } from '@/types/Post'
import { EllipsisVertical, MessageCircleMore, X } from 'lucide-react';
import Link from 'next/link';
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem
} from './ui/dropdown-menu';
import EditPostForm from './forms/EditPostForm';
import DeletePostDialog from './DeletePostDialog';
import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import { useUser } from '@/app/UserContext'

const PostDetail = ({ id }: { id: string | null }) => {

    const [post, setPost] = useState<PostType>()
    const [edit, setEdit] = useState(false);
    const [deleteDialog, setDeleteDialog] = useState(false)
    const router = useRouter();
    const user = useUser();

    useEffect(() => {

        const fetchPosts = async () => {
            const req = await fetch(`/api/posts/${id}`)
            const postsData = await req.json()
            if (req.status === 404) {
                router.push('/community')
                return
            }
            setPost(postsData)
        }
        fetchPosts()
    }, []);

    if (!post) {
        return (
            <div className='bg-dark-gray p-4 rounded-md my-4 text-left mx-8 text-white'>
                <p>Loading...</p>
            </div>
        )
    }

    return (
        <div className='bg-dark-gray p-4 rounded-md my-4 text-left mx-8 text-white'>
            <div className="flex justify-between">
                <h3>{post.user_name}</h3>
                <div className='flex items-center gap-2'>
                    <p className="text-gray-300">{new Date(post.updated_at).toLocaleString()}</p>
                    {user?.id === post.user_id &&
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
            <Link href={'/community/posts/' + post.id}>
                <h2 className="text-xl font-bold mt-2 text-wrap break-words">{post.title}</h2>
                <p className="text-wrap break-words">{post.content}</p>
                {post.posts_pictures.length > 0 && (
                    <div className="flex gap-4 overflow-hidden my-4">
                        {post.posts_pictures.map((pic, index) => (
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
            <EditPostForm post={post} edit={edit} setEdit={setEdit} />
            <DeletePostDialog post={post} deleteDialog={deleteDialog} setDeleteDialog={setDeleteDialog} />
        </div>
    )
}

export default PostDetail