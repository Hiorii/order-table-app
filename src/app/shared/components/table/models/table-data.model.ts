import { BaseTableData } from './base-table-data.model';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { OrderSymbol } from '../../../../features/orders/enums/order-symbol.enum';

export interface TableData<T extends BaseTableData> extends BaseTableData {
  symbol: OrderSymbol;
  arrowIcon?: IconDefinition;
  children: T[];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}
