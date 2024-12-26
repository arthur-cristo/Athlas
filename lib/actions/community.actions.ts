import { CommentType } from "@/types/Comment";
import { Dispatch, SetStateAction } from "react"
import { createClient } from "../supabase/client";
import { PostType } from "@/types/Post";

export enum FollowType {
    FOLLOW = 'follow',
    UNFOLLOW = 'unfollow'
}

export enum LikeType {
    LIKE = 'like',
    UNLIKE = 'unlike'
}

export enum PostCommentType {
    POST = 'post',
    COMMENT = 'comment'
}

export const handleFollow = async (type: FollowType, userId: string, profileId: string, setLoading?: Dispatch<SetStateAction<boolean>>, setFetch?: Dispatch<SetStateAction<boolean>>) => {
    if (setLoading) setLoading(true)
    try {

        const formData = new FormData();
        formData.append('follower_id', userId);

        const res = await fetch(`/api/users/${profileId}/follow`, {
            method: type === FollowType.FOLLOW ? 'POST' : 'DELETE',
            body: formData,
        })

        if (!res.ok) {
            throw new Error(`Failed to ${type} user`)
        }

        if (setFetch) setFetch(prev => !prev)

    } catch (error) {
        /* console.error(error) */
    } finally {
        if (setLoading) setLoading(false)
    }
}

export const handleLike = async (likeType: LikeType, postType: PostCommentType, userId: string, likes: number, setLikes: Dispatch<SetStateAction<number>>, setLiked: Dispatch<SetStateAction<boolean>>, post: CommentType | PostType) => {
    const supabase = createClient();
    let updatedItem = likes;
    try {
        if (postType === PostCommentType.POST && post as PostType) {
            if (likeType === LikeType.LIKE) {
                const { error } = await supabase
                    .from(`posts_likes`)
                    .insert({
                        post_id: post.id,
                        user_id: userId,
                    });

                if (error) return;

                const { data, error: updateError } = await supabase
                    .from(`posts`)
                    .update({ likes: likes + 1 })
                    .eq('id', post.id)
                    .select('likes')
                    .single();

                if (updateError) return;
                updatedItem = data.likes;

            } else if (likeType === LikeType.UNLIKE) {
                const { error } = await supabase
                    .from(`posts_likes`)
                    .delete()
                    .match({ post_id: post.id, user_id: userId });

                if (error) return;

                const { data, error: updateError } = await supabase
                    .from(`posts`)
                    .update({ likes: likes - 1 })
                    .eq('id', post.id)
                    .select('likes')
                    .single();

                if (updateError) return;
                updatedItem = data.likes;
            }
        } else if (postType === PostCommentType.COMMENT && post as CommentType) {
            if (likeType === LikeType.LIKE) {
                const { error } = await supabase
                    .from(`comments_likes`)
                    .insert({
                        comment_id: post.id,
                        user_id: userId,
                    });

                if (error) return;

                const { data, error: updateError } = await supabase
                    .from(`comments`)
                    .update({ likes: likes + 1 })
                    .eq('id', post.id)
                    .select('likes')
                    .single();

                if (updateError) return;
                updatedItem = data.likes;

            } else if (likeType === LikeType.UNLIKE) {

                const { error } = await supabase
                    .from(`comments_likes`)
                    .delete()
                    .match({ comment_id: post.id, user_id: userId });

                console.log(error)
                if (error) return;

                const { data, error: updateError } = await supabase
                    .from(`comments`)
                    .update({ likes: likes - 1 })
                    .eq('id', post.id)
                    .select('likes')
                    .single();
                console.log(data, updateError)
                if (updateError) return;
                updatedItem = data.likes;
            }
        }
    } catch (error) {
        /* console.error(error) */
    } finally {
        setLikes(updatedItem);
        setLiked(true);
    }
};