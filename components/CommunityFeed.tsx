'use client'

import { useState } from 'react'
import PostForm from './forms/PostForm'
import PostsFeed from './post/PostsFeed'

const CommunityFeed = () => {
    const [fetch, setFetch] = useState(false)
    const [checkFollowing, setCheckFollowing] = useState(false)
    return (
        <div className="md:w-[768px] mx-auto p-2 rounded-md pb-4 md:pb-0 md:pt-0 pt-20">
            <PostForm setFetch={setFetch} />
            <div className='flex justify-around items-center mt-4'>
                {checkFollowing ? (
                    <>
                        <h2 className="w-32 text-md text-muted-foreground cursor-pointer" onClick={() => {
                            setCheckFollowing(false)
                            setFetch(!fetch)
                        }}>Para Você</h2>
                        <h2 className="w-32 text-md font-bold">Seguindo</h2>
                    </>
                ) : (
                    <>
                        <h2 className="w-32 text-md font-bold">Para Você</h2>
                        <h2 className="w-32 text-md text-muted-foreground cursor-pointer" onClick={() => {
                            setCheckFollowing(true)
                            setFetch(!fetch)
                        }}>Seguindo</h2>
                    </>
                )}
            </div>
            <PostsFeed reFetch={fetch} setFetch={setFetch} checkFollowing={checkFollowing} />
        </div>
    )
}

export default CommunityFeed