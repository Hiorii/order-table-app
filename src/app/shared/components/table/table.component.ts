// src/app/shared/components/table/table.component.ts
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TableHeader } from './models/table-header.model';
import { TableData } from './models/table-data.model';
import { BaseTableData } from './models/base-table-data.model';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableComponent<T extends BaseTableData> {
  @Input() headers: TableHeader[] = [];

  @Input() set data(value: TableData<T>[]) {
    if (!value) return;
    this._data = value;
    this._data.forEach(item => {
      item.arrowIcon = faChevronDown;
    })
  }

  public expandedGroups: Set<string> = new Set<string>();
  public _data: TableData<T>[] = [];

  toggleGroup(symbol: string): void {
    if (this.expandedGroups.has(symbol)) {
      this.expandedGroups.delete(symbol);
      this.setArrowIcon(symbol, faChevronDown);
    } else {
      this.expandedGroups.add(symbol);
      this.setArrowIcon(symbol, faChevronUp);
    }
  }

  trackByFn(index: number, item: any): any {
    return item.symbol || index;
  }

  setArrowIcon(symbol: string, faChevronUp: IconDefinition) {
    const item = this._data.find(item => item.symbol === symbol);
    if (!item) return;
    item.arrowIcon = faChevronUp;
  }
}
