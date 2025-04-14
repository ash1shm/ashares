import { NextApiRequest, NextApiResponse } from 'next';

type AlphaVantageQuote = {
  'Global Quote': {
    '01. symbol': string;
    '02. open': string;
    '03. high': string;
    '04. low': string;
    '05. price': string;
    '06. volume': string;
    '07. latest trading day': string;
    '08. previous close': string;
    '09. change': string;
    '10. change percent': string;
  };
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { ticker } = req.query;

  if (!ticker || typeof ticker !== "string") {
    return res.status(400).json({ error: "Ticker symbol is required" });
  }

  try {
    const apiKey = 'Z3HWBENT351RVC5O'; // Replace with your actual Alpha Vantage API key
    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${ticker}&apikey=${apiKey}`;
    console.log(`Fetching from: ${url}`);
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status} - ${response.statusText}`);
    }
    const data: AlphaVantageQuote = await response.json();
    const price = data["Global Quote"] ? data["Global Quote"]["05. price"] : null;

    if (!data || !data["Global Quote"] || price === undefined || price === null) {
      return res.status(200).json({ price: "N/A" });
    }

    res.status(200).json({ price: parseFloat(price) });
  } catch (error: any) {
    console.error("Error fetching real-time price:", error);
    res.status(500).json({ error: "Failed to retrieve real-time price" });
  }
}
