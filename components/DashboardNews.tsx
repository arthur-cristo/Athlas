import React from 'react'

const DashboardNews = ({ title, content }: { title: string, content: string }) => {
    return (
        <div className='bg-light_gray w-full h-full p-6 rounded-md flex flex-col gap-2'>
            <h2 className="text-2xl font-bold text-muted-foreground-100 text-left">{title}</h2>
            <p className="text-muted-foreground-200 text-left">{content}</p>
        </div>
    )
}

export default DashboardNews