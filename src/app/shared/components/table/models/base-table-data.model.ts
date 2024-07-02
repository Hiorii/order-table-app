import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

export interface BaseTableData {
  [key: string]: string | number | boolean | Date | IconDefinition | null | undefined;
}
