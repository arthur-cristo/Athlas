'use client'

import { PostType } from "@/types/Post"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import Post from "./Post"
import { useRouter } from "next/navigation"

interface PostFeedProps {
    reFetch: boolean;
    setFetch: Dispatch<SetStateAction<boolean>>;
    checkFollowing: boolean;
}

const PostsFeed = ({ reFetch, setFetch, checkFollowing }: PostFeedProps) => {

    const [posts, setPosts] = useState<PostType[]>([])
    const router = useRouter()

    useEffect(() => {
        const fetchPosts = async () => {
            setPosts([])
            const req = checkFollowing ? await fetch('/api/posts/following') : await fetch('/api/posts')
            const postsData = await req.json()
            setPosts(postsData)
        }
        router.refresh()
        fetchPosts()
    }, [reFetch])

    return (
        <div className="p-4">
            {posts.length > 0 && (
                posts.map((post) => (
                    <Post key={post.id} post={post} setFetch={setFetch} />
                ))
            )}
        </div>
    )
}

export default PostsFeed
