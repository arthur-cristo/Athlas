import Header from "@/components/Header"
import StockDetail from "@/components/stock/StockDetail"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"

const page = ({ params }: { params: { symbol: string } }) => {

    return (
        <>
            <Header />
            <div className="mt-8">
                <Link href="/stocks" className="ml-8">
                    <Button>
                        <ChevronLeft size={24} />
                        Back
                    </Button>
                </Link>
                <StockDetail symbol={params.symbol} />
            </div>
        </>
    )
}

export default page