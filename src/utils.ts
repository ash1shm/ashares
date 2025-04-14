// src/utils.ts
import { Stock } from './types';

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const calculateProfitLossPercentage = (stock: Stock): number => {
  return ((stock.currentPrice - stock.purchasePrice) / stock.purchasePrice) * 100;
};

export const calculateTotalValue = (stocks: Stock[]): Stock[] => {
  return stocks.map(stock => ({
    ...stock,
    profitLossPercentage: calculateProfitLossPercentage(stock),
  }));
};

export const calculateProfitLoss = (stocks: Stock[]): Stock[] => {
  return stocks.map(stock => ({
    ...stock,
    profitLossPercentage: calculateProfitLossPercentage(stock),
  }));
};