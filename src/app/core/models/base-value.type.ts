import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { TableActionModel } from '../../shared/components/table/models/table-action.model';

export type BaseValueType = string | number | boolean | Date | IconDefinition | TableActionModel | TableActionModel[] | null | undefined;
