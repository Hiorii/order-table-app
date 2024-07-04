import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { BaseTableData } from './base-table-data.model';

export interface TableActionModel {
  name: string;
  icon: IconDefinition;
  click: (item: BaseTableData, event?: Event) => void;
}
