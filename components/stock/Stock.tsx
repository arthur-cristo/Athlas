import { dollarFormat } from '@/lib/utils'
import { StockType } from '@/types/Stock'
import Link from 'next/link'

const Stock = ({ stock }: { stock: StockType }) => {
    return (
        <Link href={`/stocks/${stock.symbol}`}>
            <div className="flex flex-col w-full border-y-2 border-gray my-2 py-4 text-white p-3 cursor-pointer">
                <div className="flex justify-between text-gray">
                    <h3>{stock.shortName}</h3>
                    <h3>{stock.symbol}</h3>
                </div>
                <div className="flex justify-between">
                    <p className="font-bold text-xl">$ {dollarFormat.format(stock.regularMarketPrice).slice(1)}</p>
                    {stock.regularMarketChange > 0 ? (
                        <p className="font-medium text-green-400">+{(Math.round(stock.regularMarketChange * 100) / 100).toFixed(2)}%</p>
                    ) : (
                        <p className="font-medium text-red-400">{(Math.round(stock.regularMarketChange * 100) / 100).toFixed(2)}%</p>
                    )}
                </div>
            </div>
        </Link>
    )
}

export default Stock