import StocksFeed from "@/components/StocksFeed"
import Header from "@/components/Header"

const Stocks = () => {

    return (
        <div className="bg-very_dark_gray text-white text-center min-h-screen">
            <Header />
            <div className="mx-8 py-4 flex justify-center items-center">
                <StocksFeed />
            </div>
        </div>
    )
}

export default Stocks