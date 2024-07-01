import { OrderModel } from '../../../core/models/order.model';

export interface OrderGroup {
  symbol: string;
  orders: OrderModel[];
}
