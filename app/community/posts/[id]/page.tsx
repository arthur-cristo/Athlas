'use client'

import Header from "@/components/Header";
import PostDetail from "@/components/post/PostDetail";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft } from 'lucide-react'
import CommentForm from "@/components/forms/CommentForm";
import { PostType } from "@/types/Post";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { CommentType } from "@/types/Comment";
import CommentsFeed from "@/components/comment/CommentsFeed";
import { ProfileType } from "@/types/Profile";

interface Params {
    id: string;
}

const PostDetailPage = ({ params }: { params: Params }) => {

    const id = params.id
    const [post, setPost] = useState<PostType>()
    const [profile, setProfile] = useState<ProfileType | null>(null);
    const [comments, setComments] = useState<CommentType[]>([])
    const [reFetch, setFetch] = useState(false)
    const router = useRouter();

    useEffect(() => {
        const fetchPosts = async () => {
            const req = await fetch(`/api/posts/${id}`)
            const postsData = await req.json()
            if (req.status === 404) {
                router.push('/community')
                return
            }
            setPost(postsData)
        }
        fetchPosts()
        const fetchComments = async () => {
            const req = await fetch(`/api/posts/${id}/comments`)
            const commentsData = await req.json()
            setComments(commentsData)
        }
        fetchComments()
    }, [reFetch]);

    useEffect(() => {
        const fetchProfile = async () => {
            const res = await fetch(`/api/users?id=${post?.user_id}`)
            const data = await res.json()
            setProfile(data)
        }
        fetchProfile()
    }, [post?.user_id])

    return (
        <div className="bg-very_dark_gray min-h-screen pb-10">
            <Header />
            {post && profile?.profile_picture && (
                <>
                    <Link href="/community" className="m-8">
                        <Button className="mt-4">
                            <ChevronLeft size={24} />
                            Back
                        </Button>
                    </Link>
                    <PostDetail post={post} userPfp={profile.profile_picture} />
                    <CommentForm post={post} setFetch={setFetch} />
                    {post.id && <CommentsFeed comments={comments} setFetch={setFetch} />}
                </>
            )}
        </div>
    )
}

export default PostDetailPage