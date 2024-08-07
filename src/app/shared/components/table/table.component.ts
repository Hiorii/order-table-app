import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { TableHeader } from './models/table-header.model';
import { TableData } from './models/table-data.model';
import { BaseTableData } from './models/base-table-data.model';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { OrderSymbol } from '../../../features/orders/enums/order-symbol.enum';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableComponent<T extends BaseTableData> {
  @Input({ required: true }) headers: TableHeader[] | null = [];

  @Input({ required: true }) set data(value: TableData<T>[] | null) {
    if (!value) return;
    this._data = value.map((item) => ({ ...item, arrowIcon: faChevronDown }));
  }

  @Output() actionTriggered = new EventEmitter<{ action: string; item: T }>();
  public expandedGroups: Set<string> = new Set<string>();
  public _data: TableData<T>[] = [];

  toggleGroup(symbol: OrderSymbol): void {
    if (this.expandedGroups.has(symbol)) {
      this.expandedGroups.delete(symbol);
      this.setArrowIcon(symbol, faChevronDown);
    } else {
      this.expandedGroups.add(symbol);
      this.setArrowIcon(symbol, faChevronUp);
    }
  }

  trackByFn(_: number, item: TableData<T>): number | undefined {
    return item.id;
  }

  setArrowIcon(symbol: OrderSymbol, icon: IconDefinition): void {
    const item = this._data.find((item) => item.symbol === symbol);
    if (!item) return;
    item.arrowIcon = icon;
  }
}
