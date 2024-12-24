import StocksFeed from "@/components/stock/StocksFeed"
import Header from "@/components/Header"

const Stocks = () => {

    return (
        <div className="  text-center min-h-screen">
            
            <div className="mx-8 py-4 flex justify-center items-center">
                <StocksFeed />
            </div>
        </div>
    )
}

export default Stocks