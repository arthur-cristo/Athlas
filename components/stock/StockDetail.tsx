'use client'

import { StockDetailType } from "@/types/Stock";
import { useState, useEffect } from "react";
import Header from "../Header";
import { dollarFormat } from "@/lib/utils";
import { Button } from "../ui/button";
import { Share, Star } from "lucide-react";
import { Bar, BarChart, CartesianGrid, LineChart, XAxis } from "recharts"

import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const StockDetail = ({ symbol }: { symbol: string }) => {

    const [stock, setStock] = useState<StockDetailType>();
    const chartData = [
        { month: "January", desktop: 186, mobile: 80 },
        { month: "February", desktop: 305, mobile: 200 },
        { month: "March", desktop: 237, mobile: 120 },
        { month: "April", desktop: 73, mobile: 190 },
        { month: "May", desktop: 209, mobile: 130 },
        { month: "June", desktop: 214, mobile: 140 },
    ]

    const chartConfig = {
        desktop: {
            label: "Desktop",
            color: "#2563eb",
        },
        mobile: {
            label: "Mobile",
            color: "#60a5fa",
        },
    } satisfies ChartConfig

    useEffect(() => {
        const url = `https://apidojo-yahoo-finance-v1.p.rapidapi.com/stock/v2/get-chart?symbol=${symbol}`;
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
            setStock(result.chart.result[0]);
        }
        fetchOptions();
    }, [])

    const regularMarketPrice = stock?.meta.regularMarketPrice || 0;
    const chartPreviousClose = stock?.meta.chartPreviousClose || 0;
    const regularMarketChange = ((regularMarketPrice - chartPreviousClose) / chartPreviousClose) * 100;



    return (
        <main className="mx-8">
            {stock && (
                <div className="flex flex-col w-full my-2 py-4 p-3">
                    <div className="flex justify-between text-muted-foreground">
                        <h3 className="text-xl">{stock.meta.shortName} ({stock.meta.symbol})</h3>
                        <div className="md:flex gap-4 hidden">
                            <Button className="w-20">Buy</Button>
                            <Button variant={'secondary'} className="w-20 hover:bg-secondary/80">Sell</Button>
                            <Button className='bg-muted hover:bg-muted/80' variant={'ghost'}><Star /></Button>
                            <Button className='bg-muted hover:bg-muted/80' variant={'ghost'}><Share /></Button>
                        </div>
                    </div>
                    <div className="flex items-center mt-2">
                        <p className="font-bold text-3xl mr-4">$ {dollarFormat.format(stock.meta.regularMarketPrice).slice(1)}</p>
                        {regularMarketChange > 0 ? (
                            <p className="font-medium text-primary text-xl">+{regularMarketChange.toFixed(2)}%</p>
                        ) : (
                            <p className="font-medium text-destructive text-xl px-2 py-1 rounded-full">{regularMarketChange.toFixed(2)}%</p>
                        )}
                    </div>
                    <div className="flex gap-4 md:hidden w-full justify-center my-4">
                        <Button className="w-20">Buy</Button>
                        <Button variant={'secondary'} className="w-20 hover:bg-secondary/80">Sell</Button>
                        <Button className='bg-muted hover:bg-muted/80' variant={'ghost'}><Star /></Button>
                        <Button className='bg-muted hover:bg-muted/80' variant={'ghost'}><Share /></Button>
                    </div>
                    <ChartContainer config={chartConfig} className=" w-24">
                        <BarChart accessibilityLayer data={chartData}>
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="month"
                                tickLine={false}
                                tickMargin={10}
                                axisLine={false}
                                tickFormatter={(value) => value.slice(0, 3)}
                            />
                            <ChartLegend content={<ChartLegendContent />} />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
                            <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
                            <LineChart accessibilityLayer />
                        </BarChart>
                    </ChartContainer>
                </div>

            )}
        </main>
    )
}

export default StockDetail