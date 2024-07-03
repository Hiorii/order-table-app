import { BaseValueType } from '../../../../core/models/base-value.type';

export interface BaseTableData {
  id?: number;
  styles?: {
    [key: string]: string | undefined;
  };

  [key: string]: BaseValueType;
}
