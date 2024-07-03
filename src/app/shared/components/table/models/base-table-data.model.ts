import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

export interface BaseTableData {
  id: number;

  [key: string]: string | number | boolean | Date | IconDefinition | null | undefined;
}
