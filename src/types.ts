export type Holding = {
  ticker: string;
  shares: number;
  buyPrice: number;
};

export interface Stock {
  ticker: string;
  quantity: number;
  purchasePrice: number;
  currentPrice: number;
  profitLossPercentage: number;
};