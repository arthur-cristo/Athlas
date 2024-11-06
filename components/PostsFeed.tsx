'use client'

import { PostType } from "@/types/Post"
import { useEffect, useState } from "react"
import Post from "./Post"

const PostsFeed = () => {
    
    const [posts, setPosts] = useState<PostType[]>([])

    useEffect(() => {
        const fetchPosts = async () => {
            const req = await fetch('/api/posts')
            const postsData = await req.json()
            setPosts(postsData)
        }
        fetchPosts()
        const intervalId = setInterval(fetchPosts, 60000)
        return () => clearInterval(intervalId)
    }, [])

    return (
        <div className="p-4">
            {posts.length > 0 && (
                posts.map((post, index) => (
                    <div key={index} className="bg-dark-gray p-4 rounded-md my-4 text-left w-full">
                        <Post {...post} />
                    </div>
                ))
            )}
        </div>
    )
}

export default PostsFeed
