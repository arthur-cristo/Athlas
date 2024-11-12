'use client'

import Header from "@/components/Header";
import PostDetail from "@/components/PostDetail";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft } from 'lucide-react'
import CommentForm from "@/components/forms/CommentForm";
import { PostType } from "@/types/Post";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { CommentType } from "@/types/Comment";
import CommentsFeed from "@/components/CommentsFeed";

interface Params {
    id: string;
}

const PostDetailPage = ({ params }: { params: Params }) => {

    const id = params.id
    const [post, setPost] = useState<PostType>()
    const [comments, setComments] = useState<CommentType[]>([])
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
        const fetchComments = async () => {
            const req = await fetch(`/api/posts/${id}/comments`)
            const commentsData = await req.json()
            console.log(commentsData)
            setComments(commentsData)
        }
        fetchComments()
        console.log(comments)
        fetchPosts()
    }, []);

    return (
        <div className="bg-very_dark_gray min-h-screen pb-10">
            <Header />
            {post && (
                <>
                    <Link href="/community" className="m-8">
                        <Button className="mt-4">
                            <ChevronLeft size={24} />
                            Back
                        </Button>
                    </Link>
                    <PostDetail {...post} />
                    <CommentForm post={post} setFetch={() => { }} />
                    {comments.length > 0 && <CommentsFeed comments={comments} />}
                </>
            )}
        </div>
    )
}

export default PostDetailPage