'use client'

import PostForm from '@/components/forms/PostForm'
import Header from '@/components/Header'
import PostsFeed from '@/components/PostsFeed'
import { useState } from 'react'

const Community = () => {
    const [fetch, setFetch] = useState(false)
    return (
        <div className='bg-very_dark_gray text-white text-center min-h-screen md:pb-8'>
            <Header />
            <div className="bg-dark_gray md:w-[768px] w-screen mx-auto h-full p-2 rounded-md pb-8 md:pb-0">
                <PostForm setFetch={setFetch}/>
                <PostsFeed reFetch={fetch} setFetch={setFetch} />
            </div>
        </div>
    )
}

export default Community