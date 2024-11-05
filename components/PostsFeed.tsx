'use client'

import { PostType } from "@/types/Post"
import { useEffect, useState } from "react"
import Post from "./Post"

const PostsFeed = () => {
    const [posts, setPosts] = useState<PostType[]>([])
    const [userProfiles, setUserProfiles] = useState<{ [key: string]: { first_name: string, last_name: string } }>({})

    useEffect(() => {
        const fetchPosts = async () => {
            const req = await fetch('/api/posts')
            const postsData = await req.json()
            setPosts(postsData)

            const userIds = Array.from(new Set(postsData.map((post: PostType) => post.user_id)))
            const profiles = await Promise.all(
                userIds.map(async (id) => {
                    const response = await fetch(`/api/users/id/${id}`)
                    const data = await response.json()
                    return { id, ...data }
                })
            )
            const profilesById = profiles.reduce((acc, profile) => {
                acc[profile.id] = profile
                return acc
            }, {} as { [key: string]: { first_name: string, last_name: string } })
            setUserProfiles(profilesById)
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
                        <Post post={post} userProfiles={userProfiles} />
                    </div>
                ))
            )}
        </div>
    )
}

export default PostsFeed
