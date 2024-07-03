import { OrderSymbol } from '../../features/orders/enums/order-symbol.enum';
import { BaseTableData } from '../../shared/components/table/models/base-table-data.model';

export interface OrderModel extends BaseTableData {
  openTime: Date | string;
  openPrice: number;
  swap: number;
  closePrice: number;
  symbol: OrderSymbol;
  side: string;
  size: number;
  profit?: number;
  styles?: {
    [key: string]: string | undefined;
  };
}
