import { BaseValueType } from '../../../../core/models/base-value.type';

export interface BaseTableData {
  id?: number;

  [key: string]: BaseValueType;
}
