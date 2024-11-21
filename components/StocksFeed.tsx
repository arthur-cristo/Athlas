'use client'

import { dollarFormat } from "@/lib/utils";
import { StockType } from "@/types/Stock";
import { useState, useEffect } from "react";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";

const StocksFeed = () => {

    const [stocks, setStocks] = useState<StockType[]>([]);

    useEffect(() => {
        console.log('Stocks Page')
        const url = 'https://apidojo-yahoo-finance-v1.p.rapidapi.com/stock/v2/get-recommendations?symbol=INTC';
        const options = {
            method: 'GET',
            headers: {
                'x-rapidapi-key': 'ffaf6ad2abmsh70a89661d9de965p17f77ejsnb6b30bdc783f',
                'x-rapidapi-host': 'apidojo-yahoo-finance-v1.p.rapidapi.com'
            }
        };
        const fetchOptions = async () => {
            const response = await fetch(url, options);
            const result = await response.json();
            setStocks(result.finance.result[0].quotes);
        }
        fetchOptions();
    }, [])

    return (
        <div className="flex flex-col text-left py-4 md:w-[420px]">
            {stocks.length > 0 && (
                <>
                    <h1 className="text-2xl font-medium">Trending Stocks</h1>
                    <p className="text-xl text-gray pr-5 mb-4 mt-2">Here are some rising stocks worth keeping an eye on.</p>
                    <ScrollArea className="md:h-[320px] pr-2">
                        {
                            stocks.map((stock, index) => (
                                <div key={index} className="flex flex-col w-full border-y-2 border-gray my-2 py-4 text-white p-3 cursor-pointer">
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
                            ))
                        }
                        <ScrollBar />
                    </ScrollArea>
                </>
            )}
        </div>
    )
}

export default StocksFeed