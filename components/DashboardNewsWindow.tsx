'use client'

import { useEffect, useState } from 'react'
import { ScrollArea, ScrollBar } from './ui/scroll-area'

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
        <aside className='md:m-0 md:mt-16 md:w-[30vw] p-8 md:fixed md:right-10'>
            <h2 className="my-2 font-bold text-3xl mb-6 max-h-[500px]">Latest News</h2>
            <ScrollArea className="md:h-[400px] pr-2 flex flex-col gap-6 bg-muted rounded-md">
                {news.length > 0 && (
                    news.map((n, index) => (
                        <div key={index} className='w-full h-full p-6 rounded-md flex flex-col gap-2 text-foreground'>
                            <h2 className="text-2xl font-bold text-muted-foreground-100 text-left">{n.title}</h2>
                            <p className="text-muted-foreground-200 text-left">{n.content}</p>
                        </div>
                    )))}
                <ScrollBar />
            </ScrollArea>
        </aside>
    )
}

export default DashboardNewsWindow