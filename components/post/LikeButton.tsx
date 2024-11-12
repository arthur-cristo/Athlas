'use client'

import { useUser } from '@/app/UserContext';
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
                    .eq(`post_id`, post.id)
                    .eq('user_id', user.id)
                    .single();
                setLiked(!!likesData);
            }
        };
        fetchUser();
    }, [user, post, supabase]);

    const handleLike = async () => {
        if (!user) return;

        const { error } = await supabase
            .from(`posts_likes`)
            .insert({
                [`post_id`]: post.id,
                user_id: user.id,
            });

        if (error) {
            console.error(error);
            return;
        }

        const { data: updatedItem, error: updateError } = await supabase
            .from(`posts`)
            .update({ likes: likes + 1 })
            .eq('id', post.id)
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
            .from(`posts_likes`)
            .delete()
            .eq(`post_id`, post.id)
            .eq('user_id', user.id);

        if (error) {
            console.error(error);
            return;
        }

        const { data: updatedItem, error: updateError } = await supabase
            .from(`posts`)
            .update({ likes: likes - 1 })
            .eq('id', post.id)
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
