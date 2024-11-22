export interface StockType {
    "language": string
    "region": string
    "quoteType": string
    "typeDisp": string
    "quoteSourceName": string
    "triggerable": boolean,
    "customPriceAlertConfidence": string
    "hasPrePostMarketData": boolean,
    "firstTradeDateMilliseconds": number,
    "priceHint": number,
    "regularMarketChange": number,
    "regularMarketChangePercent": number,
    "regularMarketTime": number,
    "regularMarketPrice": number,
    "regularMarketPreviousClose": number,
    "exchange": string
    "market": string
    "fullExchangeName": string
    "shortName": string
    "marketState": string
    "sourceInterval": number,
    "exchangeDataDelayedBy": number,
    "exchangeTimezoneName": string
    "exchangeTimezoneShortName": string
    "gmtOffSetMilliseconds": number,
    "esgPopulated": boolean,
    "tradeable": boolean,
    "cryptoTradeable": boolean,
    "symbol": string
}

export interface StockDetailType {
    meta: {
        currency: string;
        symbol: string;
        exchangeName: string;
        fullExchangeName: string;
        instrumentType: string;
        firstTradeDate: number;
        regularMarketTime: number;
        hasPrePostMarketData: boolean;
        gmtoffset: number;
        timezone: string;
        exchangeTimezoneName: string;
        regularMarketPrice: number;
        fiftyTwoWeekHigh: number;
        fiftyTwoWeekLow: number;
        regularMarketDayHigh: number;
        regularMarketDayLow: number;
        regularMarketVolume: number;
        longName: string;
        shortName: string;
        chartPreviousClose: number;
        previousClose: number;
        scale: number;
        priceHint: number;
        currentTradingPeriod: {
            pre: TradingPeriod;
            regular: TradingPeriod;
            post: TradingPeriod;
        };
        tradingPeriods: {
            pre: TradingPeriod[][];
            regular: TradingPeriod[][];
            post: TradingPeriod[][];
        };
        dataGranularity: string;
        range: string;
        validRanges: string[];
    };
    timestamp: number[];
    indicators: {
        quote: {
            high: number[];
            low: number[];
            volume: number[];
            open: number[];
            close: number[];
        }[];
    };
}

interface TradingPeriod {
    timezone: string;
    start: number;
    end: number;
    gmtoffset: number;
}