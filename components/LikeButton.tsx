'use client'

import { createClient } from '@/lib/supabase/client';
import { PostType } from '@/types/Post';
import { User } from '@supabase/supabase-js';
import { Heart } from 'lucide-react'
import { useEffect, useState } from 'react';

const LikeButton = (post: PostType) => {

    const [user, setUser] = useState<User | null>(null);
    const [liked, setLiked] = useState(false);
    const [likes, setLikes] = useState(post.likes);

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user } } = await createClient().auth.getUser();
            setUser(user);

            if (user) {
                // Check if the user has already liked the post
                const { data: postLikes } = await createClient()
                    .from('posts_likes')
                    .select('user_id')
                    .eq('post_id', post.id)
                    .eq('user_id', user.id)
                    .single();
                setLiked(!!postLikes);
            }
        };

        fetchUser();
    }, [post.id]);

    const handleLike = async () => {
        console.log('post',post)
        console.log('postid',post.id)
        if (!user) return;

        const supabase = createClient();

        // Insert like in 'posts_likes' table
        const { error } = await supabase
            .from('posts_likes')
            .insert({
                post_id: post.id,
                user_id: user.id,
            });

        if (error) {
            console.error(error);
            return;
        }

        // Update like count in 'posts' table
        const { data: updatedPost, error: updateError } = await supabase
            .from('posts')
            .update({ likes: likes + 1 })
            .eq('id', post.id)
            .select('likes')
            .single();

        if (updateError) {
            console.error(updateError);
            return;
        }

        setLikes(updatedPost.likes);
        setLiked(true);
    };

    const handleUnlike = async () => {
        if (!user) return;

        const supabase = createClient();

        // Delete like from 'posts_likes' table
        const { error } = await supabase
            .from('posts_likes')
            .delete()
            .eq('post_id', post.id)
            .eq('user_id', user.id);

        if (error) {
            console.error(error);
            return;
        }

        // Update like count in 'posts' table
        const { data: updatedPost, error: updateError } = await supabase
            .from('posts')
            .update({ likes: likes - 1 })
            .eq('id', post.id)
            .select()
            .single();

        if (updateError) {
            console.error(updateError);
            return;
        }

        setLikes(updatedPost.likes);
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


export default LikeButton