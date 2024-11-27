import Header from "@/components/Header"
import StockDetail from "@/components/stock/StockDetail"

const page = ({ params }: { params: { symbol: string } }) => {

    return (
        <div>
            <Header />
            <StockDetail symbol={params.symbol} />
        </div>
    )
}

export default page