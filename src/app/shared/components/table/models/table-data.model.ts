import { BaseTableData } from './base-table-data.model';

export interface TableData<T extends BaseTableData> {
  symbol: string;
  children: T[];
}
