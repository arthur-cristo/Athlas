'use client'

import { StockDetailType } from "@/types/Stock";
import { useState, useEffect } from "react";
import { dollarFormat } from "@/lib/utils";
import { Button } from "../ui/button";
import { Share, Star } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"

const StockDetail = ({ symbol }: { symbol: string }) => {

    const [stock, setStock] = useState<StockDetailType>();
    const [chartData, setChartData] = useState<{ date: string; close: number }[]>([]);
    const [timeRange, setTimeRange] = useState<string>('1d');
    const [isChartUpdated, setIsChartUpdated] = useState<boolean>(false);
    const [xAxisDates, setXAxisDates] = useState<string[]>([]);
    const [marketChange, setMarketChange] = useState<number>(0);
    const chartConfig = {
        close: {
            label: "Close",
            color: "hsl(var(--primary))",
        },
        date: {
            label: "Date",
            color: "hsl(var(--muted-foreground))",
        }
    } satisfies ChartConfig;
    useEffect(() => {
        setIsChartUpdated(false);
        const url = `https://apidojo-yahoo-finance-v1.p.rapidapi.com/stock/v3/get-chart?symbol=${symbol}&range=${timeRange}`;
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
                if (!result.chart.result[0]) return;
                setStock(result.chart.result[0]);
                const formattedChartData = stock!.timestamp.map((time: number, index: number) => ({
                    date: new Date(time * 1000).toLocaleDateString([], { hour: '2-digit', minute: '2-digit' }),
                    close: parseFloat(dollarFormat.format(stock!.indicators.quote[0].close[index]).slice(1)),
                })).filter((data => data.close > 0));
                setChartData(formattedChartData);
                const regularMarketPrice = formattedChartData[formattedChartData.length - 1]?.close || 0;
                const chartPreviousClose = formattedChartData[0]?.close || 0;
                const regularMarketChange = ((regularMarketPrice - chartPreviousClose) / chartPreviousClose) * 100;
                setMarketChange(regularMarketChange);
                setXAxisDates(formattedChartData.map((data: { date: string; }) => data.date));
                setIsChartUpdated(true);
            } catch (error) {
                /* console.error('Error fetching stock data:', error); */
            }
        }
        fetchOptions();
    }, [symbol, timeRange]);



    return (
        <main className="mx-8">
            {stock && (
                <div className="flex flex-col w-full my-2 py-4 ">
                    <div className="flex justify-between text-muted-foreground">
                        <h3 className="text-xl">{stock.meta.shortName} ({stock.meta.symbol})</h3>
                        <div className="md:flex gap-4 hidden">
                            <Button className="w-20">Buy</Button>
                            <Button variant={'secondary'} className="w-20 hover:bg-secondary/80">Sell</Button>
                            <Button className='bg-muted hover:bg-muted/80' variant={'ghost'}><Star /></Button>
                            <Button className='bg-muted hover:bg-muted/80' variant={'ghost'}><Share /></Button>
                        </div>
                    </div>
                    <div className="flex items-center mt-2 justify-between">
                        <div className="flex items-center">
                            <p className="font-bold text-3xl mr-4">$ {dollarFormat.format(stock.meta.regularMarketPrice).slice(1)}</p>
                            {marketChange > 0 ? (
                                <p className="font-medium text-primary text-xl">+{marketChange.toFixed(2)}%</p>
                            ) : (
                                <p className="font-medium text-destructive text-xl px-2 py-1 rounded-full">{marketChange.toFixed(2)}%</p>
                            )}
                        </div>
                        <div className="bg-muted rounded-md mt-2 hidden md:flex">
                            <Button
                                className={timeRange === '1d' ? 'bg-primary text-primary-foreground cursor-default hover:bg-primary' : 'bg-muted text-muted-foreground hover:text-foreground'}
                                onClick={() => setTimeRange('1d')}
                                disabled={!isChartUpdated}
                            >1D</Button>
                            <Button
                                className={timeRange === '5d' ? 'bg-primary text-primary-foreground cursor-default hover:bg-primary' : 'bg-muted text-muted-foreground hover:text-foreground'}
                                onClick={() => setTimeRange('5d')}
                                disabled={!isChartUpdated}
                            >5D</Button>
                            <Button
                                className={timeRange === '1mo' ? 'bg-primary text-primary-foreground cursor-default hover:bg-primary' : 'bg-muted text-muted-foreground hover:text-foreground'}
                                onClick={() => setTimeRange('1mo')}
                                disabled={!isChartUpdated}
                            >1M</Button>
                        </div>
                    </div>
                    <div className="flex gap-4 md:hidden w-full justify-center my-8">
                        <Button className="w-20">Buy</Button>
                        <Button variant={'secondary'} className="w-20 hover:bg-secondary/80">Sell</Button>
                        <Button className='bg-muted hover:bg-muted/80' variant={'ghost'}><Star /></Button>
                        <Button className='bg-muted hover:bg-muted/80' variant={'ghost'}><Share /></Button>
                    </div>
                    <div className="mt-2 md:hidden flex justify-end">
                        <div className="bg-muted rounded-md">
                            <Button
                                className={timeRange === '1d' ? 'bg-primary text-primary-foreground cursor-default hover:bg-primary' : 'bg-muted text-muted-foreground hover:text-foreground'}
                                onClick={() => setTimeRange('1d')}
                                disabled={!isChartUpdated}
                            >1D</Button>
                            <Button
                                className={timeRange === '5d' ? 'bg-primary text-primary-foreground cursor-default hover:bg-primary' : 'bg-muted text-muted-foreground hover:text-foreground'}
                                onClick={() => setTimeRange('5d')}
                                disabled={!isChartUpdated}
                            >5D</Button>
                            <Button
                                className={timeRange === '1mo' ? 'bg-primary text-primary-foreground cursor-default hover:bg-primary' : 'bg-muted text-muted-foreground hover:text-foreground'}
                                onClick={() => setTimeRange('1mo')}
                                disabled={!isChartUpdated}
                            >1M</Button>
                        </div>
                    </div>
                    <ChartContainer config={chartConfig} className="h-64 mt-10">
                        <AreaChart
                            accessibilityLayer
                            data={chartData}
                        >
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="date"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={16}
                                interval={timeRange === '1d' ? 8 : timeRange === '5d' ? 32 : 128}
                                tickFormatter={(value, index) => {
                                    if (isChartUpdated === false) return "";
                                    if (timeRange === '1d') return xAxisDates[index]?.slice(-5);
                                    if (timeRange === '5d' || timeRange === '1mo') return xAxisDates[index]?.slice(0, 5);
                                    return ""
                                }}
                            />
                            <YAxis
                                tickMargin={0}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `$${value.toFixed(2)}`}
                                tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                                domain={['dataMin', 'dataMax']} // Adjust the starting point
                            />
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent indicator="dot" hideLabel />}
                            />
                            <Area
                                dataKey="close"
                                type={'monotone'}
                                fill={chartConfig.close.color}
                                fillOpacity={0.4}
                                stroke={chartConfig.close.color}
                            />
                        </AreaChart>
                    </ChartContainer>
                </div>

            )
            }
        </main >
    )
}

export default StockDetail