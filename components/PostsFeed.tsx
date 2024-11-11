'use client'

import { PostType } from "@/types/Post"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import Post from "./Post"
import { set } from "zod";

interface PostFeedProps {
    reFetch: boolean;
    setFetch: Dispatch<SetStateAction<boolean>>
}

const PostsFeed = ({ reFetch, setFetch }: PostFeedProps) => {

    const [posts, setPosts] = useState<PostType[]>([])

    useEffect(() => {
        const fetchPosts = async () => {
            const req = await fetch('/api/posts')
            const postsData = await req.json()
            setPosts(postsData)
        }
        fetchPosts()
    }, [reFetch])

    return (
        <div className="p-4">
            {posts.length > 0 && (
                posts.map((post, index) => (
                    <div key={index} className="bg-dark-gray p-4 rounded-md my-4 text-left w-full">
                        <Post post={post} setFetch={setFetch} />
                    </div>
                ))
            )}
        </div>
    )
}

export default PostsFeed
