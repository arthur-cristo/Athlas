import { PostType } from '@/types/Post'
import { Heart, MessageCircleMore } from 'lucide-react';
import Image from 'next/image'
import Link from 'next/link';
import LikeButton from './LikeButton';

interface PostProps {
    post: PostType;
    userProfiles: { [key: string]: { first_name: string; last_name: string } };
}

const Post = ({ post, userProfiles }: PostProps) => {

    return (
        <>
            <div className="flex justify-between">
                <h3>{userProfiles[post.user_id]?.first_name} {userProfiles[post.user_id]?.last_name}</h3>
                <p className="text-gray-300">{new Date(post.created_at).toLocaleString()}</p>
            </div>
            <Link href={'/community/posts/' + post.id}>
                <h2 className="text-xl font-bold mt-4">{post.title}</h2>
                <p>{post.content}</p>
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
        </>
    )
}

export default Post