export interface OrderModel {
  openTime: number;
  openPrice: number;
  swap: number;
  closePrice: number;
  id: number;
  symbol: string;
  side: string;
  size: number;
}
