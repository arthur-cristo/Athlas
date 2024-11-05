import PostForm from '@/components/forms/PostForm'
import Header from '@/components/Header'
import PostsFeed from '@/components/PostsFeed'
import React from 'react'

const Community = () => {
    return (
        <div className='bg-dark_gray-gradient text-white text-center min-h-screen md:pb-8'>
            <Header />
            <div className="bg-register-card-gradient md:w-[768px] w-screen mx-auto h-full p-2 rounded-md pb-8 md:pb-0">
                <PostForm />
                <PostsFeed />
            </div>
        </div>
    )
}

export default Community