import { PostType } from '@/types/Post'
import { EllipsisVertical, MessageCircleMore } from 'lucide-react';
import Image from 'next/image'
import Link from 'next/link';
import LikeButton from './LikeButton';
import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem
} from './ui/dropdown-menu';
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog"
import EditPostForm from './forms/EditPostForm';

const Post = (post: PostType) => {

    const [user, setUser] = useState<User | null>();
    const [edit, setEdit] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user } } = await createClient().auth.getUser();
            setUser(user);
        }
        fetchUser();
    }, [])


    return (
        <div>
            <div className="flex justify-between">
                <h3>{post.user_name}</h3>
                <div className='flex items-center gap-2'>
                    <p className="text-gray-300">{new Date(post.updated_at).toLocaleString()}</p>
                    {user?.id === post.user_id &&
                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <EllipsisVertical size={20} className='text-gray-300' />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className='bg-light-gray border-none'>
                                <DropdownMenuItem onClick={() => setEdit(true)}
                                    className='text-white'>Edit</DropdownMenuItem>
                                <DropdownMenuItem className='text-red-400'>Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                    }
                </div>
            </div>
            <Link href={'/community/posts/' + post.id}>
                <h2 className="text-xl font-bold mt-2">{post.title}</h2>
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
        </div>
    )
}

export default Post