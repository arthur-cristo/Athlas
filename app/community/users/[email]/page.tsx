'use client'

import { ProfileType } from "@/types/Profile";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useUser } from "@/app/UserContext";
import { PostType } from "@/types/Post";
import Post from "@/components/post/Post";
import { Button } from "@/components/ui/button";
import EditProfileForm from "@/components/forms/EditProfile";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { handleFollow, FollowType } from "@/lib/actions/community.actions";
import { useRouter } from "next/navigation";

const User = ({ params }: { params: { email: string } }) => {

    const [profile, setProfile] = useState<ProfileType | null>(null);
    const [posts, setPosts] = useState<PostType[]>([]);
    const [reFetch, setFetch] = useState(false);
    const [loading, setLoading] = useState(false);
    const [editProfile, setEditProfile] = useState(false);
    const user = useUser();
    const router = useRouter();

    useEffect(() => {
        const fetchProfile = async () => {
            const res = await fetch(`/api/users/search?email=${params.email}`);
            const data = await res.json();
            setProfile(data);
        }
        fetchProfile();
    }, [params.email, reFetch]);

    useEffect(() => {
        const fetchPosts = async () => {
            if (!profile) return;
            const res = await fetch(`/api/users/${profile.id}/posts`);
            const data = await res.json();
            setPosts(data);
        }
        fetchPosts();
    }, [profile?.id, reFetch]);

    return (
        <div className="">
            {profile && (
                <div className="mt-28 mx-8 flex flex-col md:mt-8 justify-center items-center">
                    <Button onClick={() => router.back()} className="w-fit absolute top-28 left-8">
                        <ChevronLeft size={24} />
                        Voltar
                    </Button>
                    {/* // User Card */}
                    <div className="w-full my-8 text-center md:w-[768px] mt-16" >
                        <div className="flex gap-4 justify-center">
                            <Image className="w-16 h-16 rounded-full" width={100} height={100} src={profile.profile_picture} alt={`${profile.first_name} ${profile.last_name}`} />
                            <div className="flex flex-col gap-2 text-left ">
                                <h1 className="text-3xl font-bold">{`${profile.first_name} ${profile.last_name}`}</h1>
                                <h2 className="text-muted-foreground text-sm">{profile.email}</h2>
                            </div>
                        </div>
                        <div className="flex gap-8 justify-center my-4">
                            <Link href={`${params.email}/following`}>
                                <p className="text-muted-foreground hover:underline cursor-pointer decoration-foreground"><span className="text-foreground font-bold">{profile.following}</span> Seguindo</p>
                            </Link>
                            <Link href={`${params.email}/followers`}>
                                <p className="text-muted-foreground hover:underline cursor-pointer decoration-foreground"><span className="text-foreground font-bold">{profile.followers}</span> Seguidores</p>
                            </Link>
                        </div>
                        <p className="px-4 text-wrap break-words">{profile.bio}</p>

                        {user && (user.id === profile.id ? (
                            <Button className="mt-4" onClick={() => { setEditProfile(true) }}>
                                Editar Perfil
                            </Button>
                        ) : (
                            <>
                                {profile.followers_list.some(({ follower }) => follower.id === user.id) ? (
                                    <Button className="mt-4 bg-destructive hover:bg-destructive/80" onClick={() => handleFollow(FollowType.UNFOLLOW, user.id, profile.id!, setLoading, setFetch)} disabled={loading}>
                                        Deixar de Seguir
                                    </Button>
                                ) : (
                                    <Button className="mt-4" onClick={() => handleFollow(FollowType.FOLLOW, user.id, profile.id!, setLoading, setFetch)} disabled={loading}>
                                        Seguir
                                    </Button>
                                )}
                            </>
                        ))
                        }
                    </div>

                    {/* // User posts */}
                    <div className="md:w-[768px] w-full">
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