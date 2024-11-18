'use client'

import { useUser } from '@/app/UserContext';
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
                    .eq('user_id', user.id)
                    .single();
                setLiked(!!likesData);
            }
        };
        fetchUser();
    }, [user, comment, supabase]);

    const handleLike = async () => {
        if (!user) return;

        const { error } = await supabase
            .from(`comments_likes`)
            .insert({
                comment_id: comment.id,
                user_id: user.id,
            });

        if (error) return;

        const { data: updatedItem, error: updateError } = await supabase
            .from(`comments`)
            .update({ likes: likes + 1 })
            .eq('id', comment.id)
            .select('likes')
            .single();

        if (updateError) return;

        setLikes(updatedItem.likes);
        setLiked(true);
    };

    const handleUnlike = async () => {
        if (!user) return;

        const { error } = await supabase
            .from(`comments_likes`)
            .delete()
            .eq(`comment_id`, comment.id)
            .eq('user_id', user.id);

        if (error) return;

        const { data: updatedItem, error: updateError } = await supabase
            .from(`comments`)
            .update({ likes: likes - 1 })
            .eq('id', comment.id)
            .select('likes')
            .single();

        if (updateError) return;

        setLikes(updatedItem.likes);
        setLiked(false);
    };

    return (
        <div className="flex gap-2">
            {liked ? (
                <Heart size={24} fill="#dc2626" className="text-red-600 cursor-pointer" onClick={handleUnlike} />
            ) : (
                <Heart size={24} className="cursor-pointer" onClick={handleLike} />
            )}
            <span>{likes}</span>
        </div>
    );
};

export default LikeButton;
