// src/app/shared/components/table/table.component.ts
import { Component, Input } from '@angular/core';
import { TableHeader } from './models/table-header.model';
import { TableData } from './models/table-data.model';
import { BaseTableData } from './models/base-table-data.model';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent<T extends BaseTableData> {
  @Input() headers: TableHeader[] = [];
  @Input() data: TableData<T>[] = [];
  expandedGroups: Set<string> = new Set<string>();

  toggleGroup(symbol: string): void {
    if (this.expandedGroups.has(symbol)) {
      this.expandedGroups.delete(symbol);
    } else {
      this.expandedGroups.add(symbol);
    }
  }

  trackByFn(index: number, item: any): any {
    return item.symbol || index;
  }

  getDisplayValue(item: any, key: string): string | number | null {
    const value = item[key];
    return value !== undefined && value !== null ? value : '';
  }
}
