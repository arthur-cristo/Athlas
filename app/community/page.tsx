import PostForm from '@/components/forms/PostForm'
import Header from '@/components/Header'
import React from 'react'

const Community = () => {
    return (
        <div className='bg-dark_gray-gradient text-white text-center md:h-screen min-h-screen md:pb-2 pb-8'>
            <Header />
            <div className="bg-register-card-gradient md:w-[768px] w-screen mx-auto h-full p-2 rounded-md">
                <PostForm />
            </div>
        </div>
    )
}

export default Community