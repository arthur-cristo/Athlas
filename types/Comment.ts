import { ProfileType } from "./Profile";

export interface CommentType {
    id: string;
    user_id: string;
    post_id: string;
    content: string;
    created_at: string;
    updated_at: string;
    likes: number;
    profiles: ProfileType;
}