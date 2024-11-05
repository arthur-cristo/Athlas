import { PostType } from '@/types/Post'
import Image from 'next/image'

interface PostProps {
    post: PostType;
    userProfiles: { [key: string]: { first_name: string; last_name: string } };
}

const Post = ({ post, userProfiles }: PostProps) => {
    return (
        <>
            <h3>
                {userProfiles[post.user_id]?.first_name} {userProfiles[post.user_id]?.last_name}
            </h3>
            <div className="flex justify-between">
                <h2 className="text-xl font-bold my-4">{post.title}</h2>
                <p className="text-gray-300">{new Date(post.created_at).toLocaleString()}</p>
            </div>
            <p>{post.content}</p>
            {post.posts_pictures && (
                <div className="flex gap-4 overflow-hidden py-4">
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
        </>
    )
}

export default Post