import StocksFeed from "@/components/stock/StocksFeed"
import Header from "@/components/Header"

const Stocks = () => {

    return (
        <div className="bg-background text-foreground text-center min-h-screen">
            <Header />
            <div className="mx-8 py-4 flex justify-center items-center">
                <StocksFeed />
            </div>
        </div>
    )
}

export default Stocks