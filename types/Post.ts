export interface PostType {
    id?: string
    title: string
    content: string
    user_id: string
    created_at: string
    likes: number
    comments: number
    posts_pictures: { image_url: string }[]
    posts_likes: { user_id: string }[]
}