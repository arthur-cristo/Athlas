import { CommentType } from "@/types/Comment";
import Comment from "./Comment";
import { Dispatch, SetStateAction, useState } from "react";

interface CommentFeedProps {
    comments: CommentType[];
    setFetch: Dispatch<SetStateAction<boolean>>
}

const CommentsFeed = ({ comments, setFetch }: CommentFeedProps) => {

    return (
        <div className="my-4 mx-8">
            {
                comments.map((comment) => (
                    <Comment key={comment.id} comment={comment} setFetch={setFetch} />
                ))
            }
        </div>
    )
}

export default CommentsFeed