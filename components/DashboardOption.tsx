import { Label } from './ui/label'
import Link from 'next/link'
import { LucideIcon } from 'lucide-react'
import { Button } from './ui/button'

const DashboardOption = ({ label, Icon, link, disabled = false }: {
    label: string,
    Icon: LucideIcon,
    link: string,
    disabled?: boolean,
}) => {
    return (
        disabled ? (
            <div className="flex flex-col justify-center items-center gap-2">
                <Button disabled={disabled} className='w-16 h-16 bg-muted-foreground/10 dark:bg-muted md:bg-primary rounded-full flex justify-center items-center hover:bg-primary/80'>
                    <Icon className='w-7 h-7 md:text-white' />
                </Button>
                <Label className="text-base font-medium">{label}</Label>
            </div>
        ) : (
            <Link href={link} className="flex flex-col justify-center items-center gap-2">
                <Button disabled={disabled} className='w-16 h-16 bg-muted-foreground dark:bg-muted md:bg-primary rounded-full flex justify-center items-center hover:bg-primary/80'>
                    <Icon className='w-7 h-7 md:text-white' />
                </Button>
                <Label className="text-base font-medium">{label}</Label>
            </Link>
        )
    )
}

export default DashboardOption