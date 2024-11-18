export enum roleEnum {
    ADMIN = 'ADMIN',
    USER = 'USER',
}

export interface ProfileType {
    id?: string
    first_name: string
    last_name: string
    email: string
    phone_number: string
    role: roleEnum
    balance: number
    created_at: string
    updated_at: string
    bio: string
    profile_picture: string
    following: number
    followers: number
    profile_follows: { follower: string }[]
    random_key: string
}