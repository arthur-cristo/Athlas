'use client'

import { ProfileType } from "@/types/Profile";
import { useEffect, useState } from "react";
import Image from "next/image";
import Header from "@/components/Header";
import { useUser } from "@/app/UserContext";
import { PostType } from "@/types/Post";
import Post from "@/components/post/Post";
import { Button } from "@/components/ui/button";
import EditProfileForm from "@/components/forms/EditProfile";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { handleFollow, FollowType } from "@/lib/actions/profile.actions";
import { useRouter } from "next/navigation";

const User = ({ params }: { params: { id: string } }) => {

    const [profile, setProfile] = useState<ProfileType | null>(null);
    const [posts, setPosts] = useState<PostType[]>([]);
    const [reFetch, setFetch] = useState(false);
    const [loading, setLoading] = useState(false);
    const [editProfile, setEditProfile] = useState(false);
    const user = useUser();
    const router = useRouter();

    useEffect(() => {

        const fetchProfile = async () => {
            const res = await fetch(`/api/users/search?id=${params.id}`);
            const data = await res.json();
            setProfile(data);
        }
        fetchProfile();

        const fetchPosts = async () => {
            const res = await fetch(`/api/users/${params.id}/posts`);
            const data = await res.json();
            setPosts(data);
        }
        fetchPosts();

    }, [params.id, reFetch]);

    return (
        <div className="min-h-screen pb-8">
            <Header />
            {profile && (
                <div className="mt-4 mx-8 flex flex-col items-center pt-32 md:pt-0">

                    <div className="my-2 ml-6 cursor-pointer absolute md:top-24 left-0 top-40">
                        <Button onClick={() => router.back()}>
                            <ChevronLeft size={24} />
                            Back
                        </Button>
                    </div>
                    {/* // User Card */}
                    <div className="w-full my-8 text-center md:w-[768px] md:mt-12 mt-24" >
                        <div className="flex gap-4 justify-center">
                            <Image className="w-16 h-16 rounded-full" width={100} height={100} src={profile.profile_picture} alt={`${profile.first_name} ${profile.last_name}`} />
                            <div className="flex flex-col gap-2 text-left ">
                                <h1 className="text-3xl font-bold">{`${profile.first_name} ${profile.last_name}`}</h1>
                                <h2 className="text-muted-foreground text-sm">{profile.email}</h2>
                            </div>
                        </div>
                        <div className="flex gap-8 justify-center my-4">
                            <Link href={`${params.id}/following`}>
                                <p className="text-muted-foreground hover:underline cursor-pointer decoration-foreground"><span className="text-foreground font-bold">{profile.following}</span> Following</p>
                            </Link>
                            <Link href={`${params.id}/followers`}>
                                <p className="text-muted-foreground hover:underline cursor-pointer decoration-foreground"><span className="text-foreground font-bold">{profile.followers}</span> Followers</p>
                            </Link>
                        </div>
                        <p className="px-4 text-wrap break-words">{profile.bio}</p>

                        {user && (user.id === profile.id ? (
                            <Button className="mt-4" onClick={() => { setEditProfile(true) }}>
                                Edit Profile
                            </Button>
                        ) : (
                            <>
                                {profile.followers_list.some(({ follower }) => follower.id === user.id) ? (
                                    <Button className="mt-4 bg-destructive hover:bg-destructive/80" onClick={() => handleFollow(FollowType.UNFOLLOW, user.id, profile.id!, setLoading, setFetch)} disabled={loading}>
                                        Unfollow
                                    </Button>
                                ) : (
                                    <Button className="mt-4" onClick={() => handleFollow(FollowType.FOLLOW, user.id, profile.id!, setLoading, setFetch)} disabled={loading}>
                                        Follow
                                    </Button>
                                )}
                            </>
                        ))
                        }
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
            {profile && (<EditProfileForm profile={profile} edit={editProfile} setEdit={setEditProfile} setFetch={setFetch} />)}
        </div >
    )
}

export default User