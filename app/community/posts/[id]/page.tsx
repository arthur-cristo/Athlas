import Header from "@/components/Header";
import PostDetail from "@/components/PostDetail";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft } from 'lucide-react'

interface Params {
    id: string;
}

const PostDetailPage = ({ params }: { params: Params }) => {

    const id = params.id
    console.log(id)
    
    return (
        <div className="bg-very_dark_gray min-h-screen">
            <Header />
            <Link href="/community" className="m-8">
                <Button>
                    <ChevronLeft size={24} />
                    Back
                </Button>
            </Link>
            <PostDetail id={id} />
        </div>
    )
}

export default PostDetailPage