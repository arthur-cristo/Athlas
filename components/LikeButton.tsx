'use client'

import { useUser } from '@/app/UserContext';
import { createClient } from '@/lib/supabase/client';
import { CommentType } from '@/types/Comment';
import { PostType } from '@/types/Post';
import { Heart } from 'lucide-react'
import { useEffect, useState } from 'react';

interface LikeButtonProps {
    post?: PostType;
    comment?: CommentType;
}

const LikeButton = ({ post, comment }: LikeButtonProps) => {

    const type = post ? 'post' : 'comment';

    const [liked, setLiked] = useState(false);
    const [likes, setLikes] = useState(type === 'post' ? post!.likes : comment!.likes);
    const user = useUser();
    const supabase = createClient();

    useEffect(() => {
        const fetchUser = async () => {
            if (user) {
                const { data: likesData } = await supabase
                    .from(`${type}s_likes`)
                    .select('user_id')
                    .eq(`${type}_id`, post ? post.id : comment!.id)
                    .eq('user_id', user.id)
                    .single();
                setLiked(!!likesData);
            }
        };
        fetchUser();
    }, [user, post, comment, supabase, type]);

    const handleLike = async () => {
        if (!user) return;

        const { error } = await supabase
            .from(`${type}s_likes`)
            .insert({
                [`${type}_id`]: post ? post.id : comment!.id,
                user_id: user.id,
            });

        if (error) {
            console.error(error);
            return;
        }

        const { data: updatedItem, error: updateError } = await supabase
            .from(`${type}s`)
            .update({ likes: likes + 1 })
            .eq('id', post ? post.id : comment!.id)
            .select('likes')
            .single();

        if (updateError) {
            console.error(updateError);
            return;
        }

        setLikes(updatedItem.likes);
        setLiked(true);
    };

    const handleUnlike = async () => {
        if (!user) return;

        const { error } = await supabase
            .from(`${type}s_likes`)
            .delete()
            .eq(`${type}_id`, post ? post.id : comment!.id)
            .eq('user_id', user.id);

        if (error) {
            console.error(error);
            return;
        }

        const { data: updatedItem, error: updateError } = await supabase
            .from(`${type}s`)
            .update({ likes: likes - 1 })
            .eq('id', post ? post.id : comment!.id)
            .select('likes')
            .single();

        if (updateError) {
            console.error(updateError);
            return;
        }

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
