'use client'

import { StockType } from "@/types/Stock";
import { useState, useEffect } from "react";

const StockDetail = () => {

    const [stock, setStock] = useState<StockType>();

    useEffect(() => {
        const url = 'https://apidojo-yahoo-finance-v1.p.rapidapi.com/stock/v2/get-chart?symbol=AMD';
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
            console.log(result.chart.result[0])
            setStock(result.chart.result[0]);
        }
        fetchOptions();
    }, [])

    return (
        <div>StockDetail</div>
    )
}

export default StockDetail