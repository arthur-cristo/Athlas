'use client'

import { PostType } from '@/types/Post'
import { ProfileType } from '@/types/Profile'
import { Link, MessageCircleMore } from 'lucide-react'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import LikeButton from './LikeButton'

const PostDetail = ({ id }: { id: string | null }) => {

    const [post, setPost] = useState<PostType>()
    const [userProfile, setUserProfile] = useState<ProfileType>()

    useEffect(() => {
        const fetchPosts = async () => {
            const req = await fetch(`/api/posts/${id}`)
            const postsData = await req.json()
            setPost(postsData)

            const response = await fetch(`/api/users/id/${postsData.user_id}`)
            const data = await response.json()
            setUserProfile(data)
            console.log('postsData', postsData)
            console.log('userProfile', userProfile)
        }

        fetchPosts()

    }, [])

    if (!post || !userProfile) {
        return (
            <div className='bg-dark-gray p-4 rounded-md my-4 text-left mx-8 text-white'>
                <p>Loading...</p>
            </div>
        )
    }

    return (
        <div className='bg-dark-gray p-4 rounded-md my-4 text-left mx-8 text-white'>
            <div className="flex justify-between">
                <h3>{userProfile?.first_name} {userProfile?.last_name}</h3>
                <p className="text-gray-300">{new Date(post.created_at).toLocaleString()}</p>
            </div>
            <h2 className="text-xl font-bold my-4">{post.title}</h2>
            <p>{post.content}</p>
            {post.posts_pictures.length > 0 && (
                <div className="flex gap-4 overflow-x-scroll my-4">
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
            <div className='flex gap-8 mt-6 mb-4'>
                <LikeButton {...post} />
                <div className='flex gap-2'>
                    <MessageCircleMore size={24} />
                    <span>{post.comments}</span>
                </div>

            </div>
        </div>
    )
}

export default PostDetail