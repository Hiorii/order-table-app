import { TableActionModel } from './table-action.model';

export interface TableHeader {
  id: string;
  name: string;
  isAction?: boolean;
  mainActions?: TableActionModel[];
  childActions?: TableActionModel[];
}
