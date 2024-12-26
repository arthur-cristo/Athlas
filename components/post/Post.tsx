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
        <div className="p-4 rounded-md my-4 text-left w-full">
            <div className="flex justify-between">
                <Link href={`/community/users/${post.profiles.email}`} className='flex gap-2 items-center'>
                    <Image className='rounded-full' src={post.profiles.profile_picture} width={24} height={24} alt={post.profiles.first_name + ' ' + post.profiles.last_name} />
                    <h3>{post.profiles.first_name + ' ' + post.profiles.last_name}</h3>
                </Link>
                <div className='flex items-center gap-2'>
                    <p className="text-muted-foreground">{new Date(post.updated_at).toLocaleDateString('pt-BR', { month: 'short', day: 'numeric' })}</p>
                    {user?.id === post.user_id &&
                        <DropdownMenu modal={false}>
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