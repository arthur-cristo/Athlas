import { Label } from './ui/label'
import Link from 'next/link'
import { LucideIcon } from 'lucide-react'

const DashboardOption = ({ label, Icon, link }: {
    label: string,
    Icon?: LucideIcon,
    link: string
}) => {
    return (
        <Link href={link} className="flex justify-center items-center bg-light-gray w-full rounded-full px-2 py-4 gap-6">
            <Label className="font-medium text-3xl">{label}</Label>
            {Icon && (
                <Icon className='w-8 h-8' />
            )}
        </Link>
    )
}

export default DashboardOption