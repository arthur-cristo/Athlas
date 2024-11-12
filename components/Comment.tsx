import { CommentType } from "@/types/Comment"
import Link from "next/link"
import LikeButton from "./LikeButton"

const Comment = (comment: CommentType) => {
    return (
        <div className="bg-dark-gray p-4 rounded-md my-4 text-left w-full text-white">
            <div className="flex justify-between pb-2">
                <h3>{comment.user_name}</h3>
                <div className='flex items-center gap-2'>
                    <p className="text-gray-300">{new Date(comment!.created_at).toLocaleString()}</p>
                </div>
            </div>
            <Link href={'/community/posts/' + comment.id}>
                <p className="text-wrap break-words">{comment.content}</p>
            </Link>
            <div className='flex gap-8 mt-4'>
                <LikeButton comment={comment} />
            </div>
            {/* <EditPostForm post={post} edit={edit} setEdit={setEdit} setFetch={setFetch} />
                <DeletePostDialog post={post} deleteDialog={deleteDialog} setDeleteDialog={setDeleteDialog} setFetch={setFetch} /> */}
        </div>
    )
}

export default Comment