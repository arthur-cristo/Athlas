import { ChevronRight, LucideIcon } from 'lucide-react'
import Link from 'next/link'

const TransferOption = ({ title, description, Icon, link }: { title: string, description: string, Icon: LucideIcon, link: string }) => {
    return (
        <Link href={link}>
            <div className='flex gap-4 items-center justify-center'>
                <Icon className='h-10 w-10' />
                <div className='text-left w-48'>
                    <h3 className='font-medium text-xl'>{title}</h3>
                    <p className='text-md text-gray'>{description}</p>
                </div>
                <ChevronRight className='h-10 w-10 text-gray' />
            </div>
        </Link>
    )
}

export default TransferOption