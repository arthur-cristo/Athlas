import { Dispatch, SetStateAction } from "react"

export enum FollowType {
    FOLLOW = 'follow',
    UNFOLLOW = 'unfollow'
}

export const handleFollow = async (type: FollowType, userId: string, profileId: string, setLoading?: Dispatch<SetStateAction<boolean>>, setFetch?: Dispatch<SetStateAction<boolean>>) => {
    if (setLoading) setLoading(true)
    try {

        const formData = new FormData();
        formData.append('follower_id', userId);

        const res = await fetch(`/api/users/${profileId}/follow`, {
            method: type === FollowType.FOLLOW ? 'POST' : 'DELETE',
            body: formData,
        })

        if (!res.ok) {
            throw new Error(`Failed to ${type} user`)
        }

        if (setFetch) setFetch(prev => !prev)

    } catch (error) {
        console.error(error)
    } finally {
        if (setLoading) setLoading(false)
    }
}