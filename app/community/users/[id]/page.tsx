'use client'

import { ProfileType } from "@/types/Profile";
import { useEffect, useState } from "react";
import Image from "next/image";
import Header from "@/components/Header";
import { useUser } from "@/app/UserContext";
import { PostType } from "@/types/Post";
import Post from "@/components/post/Post";
import { Button } from "@/components/ui/button";

interface Params {
    id: string;
}

const User = ({ params }: { params: Params }) => {

    const [profile, setProfile] = useState<ProfileType | null>(null);
    const [posts, setPosts] = useState<PostType[]>([]);
    const [reFetch, setFetch] = useState(false);
    const user = useUser();

    useEffect(() => {

        const fetchProfile = async () => {
            const res = await fetch(`/api/users?id=${params.id}`)
            const data = await res.json()
            setProfile(data)

        }
        fetchProfile()

    }, [params.id])

    useEffect(() => {
        const fetchPosts = async () => {
            const res = await fetch(`/api/users/${params.id}/posts`)
            const data = await res.json()
            console.log(data)
            setPosts(data)
        }
        fetchPosts()
    }, [params.id, reFetch])


    return (
        <div className="bg-very_dark_gray min-h-screen text-white pb-8">
            <Header />
            {profile && (
                <div className="mt-4 mx-8 flex flex-col items-center">

                    {/* // User Card */}
                    <div className="w-full my-8 text-center md:w-[768px]" >
                        <div className="flex gap-4 justify-center">
                            <Image className="w-16 h-16 rounded-full" width={100} height={100} src={profile.profile_picture} alt={`${profile.first_name} ${profile.last_name}`} />
                            <div className="flex flex-col gap-2 text-left ">
                                <h1 className="text-2xl font-bold">{`${profile.first_name} ${profile.last_name}`}</h1>
                                <h2 className="text-gray">{profile.email}</h2>
                            </div>
                        </div>
                        <div className="flex gap-8 justify-center my-4">
                            <p className="text-gray"><span className="text-white font-bold">{profile.following}</span> Following</p>
                            <p className="text-gray"><span className="text-white font-bold">{profile.followers}</span> Followers</p>
                        </div>
                        <p className="px-4 text-wrap break-words">{profile.bio}</p>
                        {user?.id === profile.id ? (
                            <Button className="mt-4">
                                Edit Profile
                            </Button>
                        ) : (
                            <Button className="mt-4">
                                Follow
                            </Button>
                        )}
                    </div>

                    {/* // User posts */}
                    <div className="md:w-[768px]">
                        {posts.length > 0 && (
                            posts.map((post) => (
                                <Post key={post.id} post={post} setFetch={setFetch} />
                            ))
                        )}
                    </div>
                </div>
            )
            }
        </div >
    )
}

export default User