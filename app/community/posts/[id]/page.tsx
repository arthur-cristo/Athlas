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

interface Params {
    id: string;
}

const PostDetailPage = ({ params }: { params: Params }) => {

    const id = params.id
    const [post, setPost] = useState<PostType>()
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

    return (
        <div className=" min-h-screen pb-10">
            <Header />
            <main className="pt-32 md:pt-0">
                {post && (
                    <>
                        <div className="m-8">
                            <Button className="mt-2 ml-3" onClick={() => router.back()}>
                                <ChevronLeft size={24} />
                                Back
                            </Button>
                        </div>
                        <PostDetail post={post} setFetch={setFetch} />
                        <CommentForm post={post} setFetch={setFetch} />
                        {post.id && <CommentsFeed comments={comments} setFetch={setFetch} />}
                    </>
                )}
            </main>
        </div>
    )
}

export default PostDetailPage