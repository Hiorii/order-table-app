// src/app/shared/components/table/models/table-data.model.ts
import { BaseTableData } from './base-table-data.model';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

export interface TableData<T extends BaseTableData> {
  symbol: string;
  arrowIcon?: IconDefinition;
  children: T[];

  [key: string]: any;
}
