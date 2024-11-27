'use client'

import { StockType } from "@/types/Stock";
import { useState, useEffect } from "react";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import Stock from "./Stock";

const StocksFeed = () => {

    const [stocks, setStocks] = useState<StockType[]>([]);

    useEffect(() => {
        const url = 'https://apidojo-yahoo-finance-v1.p.rapidapi.com/stock/v2/get-recommendations?symbol=INTC';
        const options = {
            method: 'GET',
            headers: {
                'x-rapidapi-key': 'ffaf6ad2abmsh70a89661d9de965p17f77ejsnb6b30bdc783f',
                'x-rapidapi-host': 'apidojo-yahoo-finance-v1.p.rapidapi.com'
            }
        };
        const fetchOptions = async () => {
            try {
                const response = await fetch(url, options);
                const result = await response.json();
                setStocks(result.finance.result[0].quotes);
            } catch (error) {
                console.error('Error fetching stock data:', error);
            }
        }
        fetchOptions();
    }, [])

    return (
        <div className="flex flex-col text-left py-4 md:w-[420px]">
            {stocks.length > 0 && (
                <>
                    <h1 className="text-2xl font-medium">Trending Stocks</h1>
                    <p className="text-xl text-muted-foreground pr-5 mb-4 mt-2">Here are some rising stocks worth keeping an eye on.</p>
                    <ScrollArea className="md:h-[320px] pr-2">
                        {stocks.map((stock, index) => (<Stock key={index} stock={stock} />))}
                        <ScrollBar />
                    </ScrollArea>
                </>
            )}
        </div>
    )
}

export default StocksFeed