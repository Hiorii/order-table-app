import { Pipe, PipeTransform } from '@angular/core';
import { format } from 'date-fns';
import { BaseTableData } from '../components/table/models/base-table-data.model';
import { BaseValueType } from '../../core/models/base-value.type';
import { OrderItemsEnum } from '../../features/orders/enums/order-items.enum';

@Pipe({
  name: 'displayValue'
})
export class DisplayValuePipe implements PipeTransform {
  transform(value: BaseTableData[keyof BaseTableData], key: keyof BaseTableData): BaseValueType {
    if (key === OrderItemsEnum.openTime && value) {
      return format(new Date(value as number), 'dd.MM.yyyy HH:mm:ss');
    }
    if (typeof value === 'number') {
      if (key === OrderItemsEnum.swap || key === OrderItemsEnum.profit) {
        return this.formatToFourDecimalPlaces(value);
      } else {
        return this.formatToTwoDecimalPlaces(value);
      }
    }

    return value !== undefined && value !== null ? value : '';
  }

  private formatToFourDecimalPlaces(value: number): string {
    return value.toFixed(4).replace(/\.?0+$/, '');
  }

  private formatToTwoDecimalPlaces(value: number): string {
    return value.toFixed(2).replace(/\.?0+$/, '');
  }
}
