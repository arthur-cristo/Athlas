'use client'

import { useUser } from '@/app/UserContext';
import { handleLike, LikeType, PostCommentType } from '@/lib/actions/community.actions';
import { createClient } from '@/lib/supabase/client';
import { CommentType } from '@/types/Comment';
import { Heart } from 'lucide-react'
import { useEffect, useState } from 'react';

const LikeButton = (comment: CommentType) => {

    const [liked, setLiked] = useState(false);
    const [likes, setLikes] = useState(comment.likes);
    const user = useUser();
    const supabase = createClient();

    useEffect(() => {
        const fetchUser = async () => {
            if (user) {
                const { data: likesData } = await supabase
                    .from(`comments_likes`)
                    .select('user_id')
                    .eq(`comment_id`, comment.id)
                    .eq('user_id', user.id);
                setLiked(!!likesData?.length);
            }
        };
        fetchUser();
    }, [user, comment, supabase]);

    return (
        <div className="flex gap-2">
            {liked ? (
                <Heart size={24} fill="#dc2626" className="text-red-600 cursor-pointer" onClick={() => handleLike(
                    LikeType.UNLIKE,
                    PostCommentType.COMMENT,
                    user!.id,
                    likes,
                    setLikes,
                    setLiked,
                    comment
                )} />
            ) : (
                <Heart size={24} className="cursor-pointer" onClick={() => handleLike(
                    LikeType.LIKE,
                    PostCommentType.COMMENT,
                    user!.id,
                    likes,
                    setLikes,
                    setLiked,
                    comment
                )} />
            )}
            <span>{likes}</span>
        </div>
    );
};

export default LikeButton;
