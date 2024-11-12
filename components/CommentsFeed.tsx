import { CommentType } from "@/types/Comment";
import Comment from "./Comment";

interface CommentFeedProps {
    comments: CommentType[];
}

const CommentsFeed = ({ comments }: CommentFeedProps) => {
    return (
        <div className="my-4 mx-8">
            {
                comments.map((comment) => (
                    <Comment key={comment.id} {...comment} />
                ))
            }
        </div>
    )
}

export default CommentsFeed