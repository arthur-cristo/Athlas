import Stock from "@/components/stock/Stock"
import StockDetail from "@/components/stock/StockDetail"


const page = ({ params }: { params: { symbol: string } }) => {
    return (
        <div>
            <StockDetail />
        </div>
    )
}

export default page