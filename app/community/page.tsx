'use client'

import PostForm from '@/components/forms/PostForm'
import Header from '@/components/Header'
import PostsFeed from '@/components/post/PostsFeed'
import { useState } from 'react'

const Community = () => {
    const [fetch, setFetch] = useState(false)
    return (
        <div className='text-center min-h-screen md:pb-8'>
            <Header />
            <div className="md:w-[768px] w-screen mx-auto h-full p-2 rounded-md pb-8 md:pb-0 md:pt-0 pt-28">
                <PostForm setFetch={setFetch}/>
                <PostsFeed reFetch={fetch} setFetch={setFetch} />
            </div>
        </div>
    )
}

export default Community