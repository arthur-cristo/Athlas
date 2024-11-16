import { transferOptions } from '@/lib/constants'
import TransferOption from './TransferOption'

const TransferOptions = () => {
    return (
        <div className='flex flex-col items-center gap-10 mt-10 mb-10'>
            {transferOptions.map((option, index) => (
                <TransferOption key={index} {...option} />
            ))}
        </div>
    )
}

export default TransferOptions