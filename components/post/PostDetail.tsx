'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
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
import { ScrollArea, ScrollBar } from '../ui/scroll-area'

const PostDetail = ({ post, setFetch }: { post: PostType, setFetch: Dispatch<SetStateAction<boolean>> }) => {

    const [edit, setEdit] = useState(false);
    const [deleteDialog, setDeleteDialog] = useState(false)
    const user = useUser();

    return (
        <div className='p-4 rounded-md mb-4 text-left mx-8 '>
            <div className="flex justify-between">
                <div className='flex gap-2 items-center'>
                    <Link href={`/community/users/${post.profiles.email}`} className='flex gap-2 items-center'>
                        <Image className='rounded-full' src={post.profiles.profile_picture} width={32} height={32} alt={post.profiles.first_name + ' ' + post.profiles.last_name} />
                        <h3 className='text-lg'>{post.profiles.first_name + ' ' + post.profiles.last_name}</h3>
                    </Link>
                </div>
                <div className='flex items-center gap-2'>
                    <p className="text-muted-foreground flex md:hidden">{new Date(post.updated_at).toLocaleDateString('pt-BR', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                    <p className="text-muted-foreground hidden md:flex">{new Date(post.updated_at).toLocaleDateString('pt-BR', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                    {user?.id === post.user_id &&
                        <DropdownMenu modal={false}>
                            <DropdownMenuTrigger>
                                <EllipsisVertical size={20} className='text-muted-foreground' />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className=' border-none'>
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
            <h2 className="text-xl font-bold mt-2 text-wrap break-words">{post.title}</h2>
            <p className="text-wrap break-words">{post.content}</p>
            {post.posts_pictures.length > 0 && (
                <ScrollArea className='flex flex-row'>
                    <div className="flex gap-4 my-4">
                        {post.posts_pictures.map((pic) => (
                            <Image
                                src={pic.image_url}
                                alt={post.title}
                                width={500}
                                height={250}
                                style={{ objectFit: 'cover' }}
                            />
                        ))}
                    </div>
                    <ScrollBar orientation='horizontal' />
                </ScrollArea>

            )}
            <div className='flex gap-8 mt-4'>
                <LikeButton {...post} />
                <div className='flex gap-2'>
                    <MessageCircleMore size={24} />
                    <span>{post.comments}</span>
                </div>
            </div>
            <EditPostForm post={post} edit={edit} setEdit={setEdit} setFetch={setFetch} />
            <DeletePostDialog post={post} deleteDialog={deleteDialog} setDeleteDialog={setDeleteDialog} />
        </div>
    )
}

export default PostDetail