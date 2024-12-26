'use client'

import { useUser } from '@/app/UserContext';
import { handleLike, LikeType, PostCommentType } from '@/lib/actions/community.actions';
import { createClient } from '@/lib/supabase/client';
import { PostType } from '@/types/Post';
import { Heart } from 'lucide-react'
import { useEffect, useState } from 'react';

const LikeButton = (post: PostType) => {

    const [liked, setLiked] = useState(false);
    const [likes, setLikes] = useState(post.likes);
    const user = useUser();
    const supabase = createClient();

    useEffect(() => {
        const fetchUser = async () => {
            if (user) {
                const { data: likesData } = await supabase
                    .from(`posts_likes`)
                    .select('user_id')
                    .match({ post_id: post.id, user_id: user.id });
                setLiked(!!likesData?.length);
            }
        };
        fetchUser();
    }, [user, post, supabase]);

    return (
        <div className="flex gap-2">
            {liked ? (
                <Heart size={24} fill="#dc2626" className="text-red-600 cursor-pointer" onClick={() => handleLike(
                    LikeType.UNLIKE,
                    PostCommentType.POST,
                    user!.id,
                    likes,
                    setLikes,
                    setLiked,
                    post
                )} />
            ) : (
                <Heart size={24} className="cursor-pointer" onClick={() => handleLike(
                    LikeType.LIKE,
                    PostCommentType.POST,
                    user!.id,
                    likes,
                    setLikes,
                    setLiked,
                    post
                )} />
            )}
            <span>{likes}</span>
        </div>
    );
};

export default LikeButton;
