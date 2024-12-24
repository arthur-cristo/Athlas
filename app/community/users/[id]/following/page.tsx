'use client'

import { ProfileType } from "@/types/Profile";
import { useEffect, useState } from "react";
import Image from "next/image";

import { useUser } from "@/app/UserContext";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { FollowType, handleFollow } from "@/lib/actions/profile.actions";
import Link from "next/link";

const Following = ({ params }: { params: { id: string } }) => {

    const [profile, setProfile] = useState<ProfileType | null>(null);
    const [userProfile, setUserProfile] = useState<ProfileType | null>(null);
    const [reFetch, setFetch] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const user = useUser();
    const router = useRouter();

    useEffect(() => {
        const fetchProfile = async () => {
            const res = await fetch(`/api/users/search?id=${params.id}`);
            const data = await res.json();
            if (data.followers_list) {
                data.followers_list.sort((a: { follow_time: string | number | Date; }, b: { follow_time: string | number | Date; }) => new Date(b.follow_time).getTime() - new Date(a.follow_time).getTime());
            }
            setProfile(data);
        };
        fetchProfile();

        if (user) {
            const fetchUserProfile = async () => {
                const res = await fetch(`/api/users/search?id=${user.id}`);
                const data = await res.json();
                setUserProfile(data);
            };
            fetchUserProfile();
        }

    }, [params.id, user?.id, reFetch]);

    return (
        <div className="min-h-screen">
            
            {profile && user && (
                <div className="mx-8 flex flex-col items-center justify-center pt-32 md:pt-0">
                    <div className="flex justify-center flex-col items-center w-full my-8 text-center md:w-[768px] md:mt-12 mt-24" >
                        <div className="my-2 cursor-pointer absolute md:top-24 left-6 top-40">
                            <Button className="mt-2 ml-3" onClick={() => router.back()}>
                                <ChevronLeft size={24} />
                                Back
                            </Button>
                        </div>
                        <Link href={`/community/users/${profile.id}`} className="flex gap-4 justify-center mt-8">
                            <Image className="w-16 h-16 rounded-full" width={100} height={100} src={profile.profile_picture} alt={`${profile.first_name} ${profile.last_name}`} />
                            <div className="flex flex-col gap-2 text-left ">
                                <h1 className="text-3xl font-bold">{`${profile.first_name} ${profile.last_name}`}</h1>
                                <h2 className="text-muted-foreground text-sm">{profile.email}</h2>
                            </div>
                        </Link>
                        <div className="flex gap-4 mt-8 flex-col justify-center items-center w-full">
                            {profile.following_list.length > 0 && (
                                profile.following_list.map(({ following }) => (
                                    <div key={following.id} className="flex items-center justify-between w-full max-w-[480px] mt-4">
                                        <Link href={`/community/users/${following.id}`} className="flex gap-4 items-center">
                                            <Image
                                                className="w-12 h-12 rounded-full"
                                                width={50}
                                                height={50}
                                                src={following.profile_picture || "/default-avatar.jpg"}
                                                alt={`${following.first_name} ${following.last_name}`}
                                            />
                                            <div className="flex flex-col gap-2 text-left">
                                                <h1 className="text-lg font-bold">{`${following.first_name} ${following.last_name}`}</h1>
                                                <h2 className="text-muted-foreground text-sm">{following.email}</h2>
                                                <p className="">{following.bio}</p>
                                            </div>
                                        </Link>
                                        {user && user.id !== following.id && (
                                            <>
                                                {userProfile && userProfile.following_list.some(({ following: userFollowing }) => following.id === userFollowing.id) ? (
                                                    <Button className="bg-destructive hover:bg-destructive/80" onClick={() => handleFollow(FollowType.UNFOLLOW, user.id, following.id!, setLoading, setFetch)} disabled={isLoading}>
                                                        Unfollow
                                                    </Button>
                                                ) : (
                                                    <Button onClick={() => handleFollow(FollowType.FOLLOW, user.id, following.id!, setLoading, setFetch)} disabled={isLoading}>
                                                        Follow
                                                    </Button>
                                                )}
                                            </>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div >
    )
}

export default Following