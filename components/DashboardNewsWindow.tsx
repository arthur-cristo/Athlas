'use client'

import { useEffect, useState } from 'react'
import DashboardNews from './DashboardNews'


interface NewsType {
    title: string
    content: string
}

const DashboardNewsWindow = () => {

    const [news, setNews] = useState<NewsType[]>([])

    useEffect(() => {
        const fetchNews = async () => {
            const res = await fetch('/api/news')
            const data = await res.json()
            setNews(data.news)
        }
        fetchNews()
    }, [])

    return (
        <aside className='md:m-0 md:pt-0 mt-8 md:w-[30vw] p-8 md:fixed md:right-10'>
            <h2 className="my-2 font-bold text-3xl mb-8">Latest News</h2>
            <div className="mt-2 flex flex-col gap-6 md:max-h-[350px] max-h-[500px] overflow-y-auto bg-dark_gray rounded-md">
                {news.length > 0 ? (
                    news.map((n, index) => (
                        <DashboardNews key={index} {...n} />
                    )))
                    : (
                        <p className="text-gray-300 text-center">No news available</p>
                    )
                }
            </div>
        </aside>
    )
}

export default DashboardNewsWindow