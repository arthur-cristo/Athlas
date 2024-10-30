import { Label } from './ui/label'
import Link from 'next/link'
import { LucideIcon } from 'lucide-react'

const DashboardOption = ({ label, Icon, link }: {
    label: string,
    Icon: LucideIcon,
    link: string
}) => {
    return (
        <Link href={link} className="flex flex-col justify-center items-center gap-2">
            <div className='w-16 h-16 bg-light-gray md:bg-primary rounded-full flex justify-center items-center'>
                <Icon className='w-7 h-7 ' />
            </div>
            <Label className="text-base font-medium">{label}</Label>
        </Link>
    )
}

export default DashboardOption