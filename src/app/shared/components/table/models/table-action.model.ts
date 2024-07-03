import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { BaseTableData } from './base-table-data.model';

export interface TableActionModel {
  name: string;
  icon: IconDefinition;
  textStyle?: any;
  buttonStyle?: any;
  style?: any;
  click: (item: BaseTableData, event?: Event) => void;
}
