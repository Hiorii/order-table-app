import { OrderModel } from '../../../core/models/order.model';
import { TableData } from '../../../shared/components/table/models/table-data.model';

export interface OrderGroup extends TableData<OrderModel> {
  symbol: string;
  size: number;
  openPrice: number;
  swap: number;
  profit: number;
  children: OrderModel[];
}
