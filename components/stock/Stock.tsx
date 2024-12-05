import { dollarFormat } from '@/lib/utils'
import { StockType } from '@/types/Stock'
import Link from 'next/link'

const Stock = ({ stock }: { stock: StockType }) => {

    const regularMarketChange = ((stock.regularMarketPrice - stock.regularMarketPreviousClose) / stock.regularMarketPreviousClose) * 100;

    return (
        <Link href={`/stocks/${stock.symbol}`}>
            <div className="flex flex-col w-full border-y-2 border-muted my-2 py-4 p-3 cursor-pointer">
                <div className="flex justify-between text-muted-foreground">
                    <h3>{stock.shortName}</h3>
                    <h3>{stock.symbol}</h3>
                </div>
                <div className="flex justify-between">
                    <p className="font-bold text-xl">$ {dollarFormat.format(stock.regularMarketPrice).slice(1)}</p>
                    {regularMarketChange > 0 ? (
                        <p className="font-medium text-green-400">+{regularMarketChange.toFixed(2)}%</p>
                    ) : (
                        <p className="font-medium text-destructive">{regularMarketChange.toFixed(2)}%</p>
                    )}
                </div>
            </div>
        </Link>
    )
}

export default Stock