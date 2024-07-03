// src/app/shared/components/table/table.component.ts
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { TableHeader } from './models/table-header.model';
import { TableData } from './models/table-data.model';
import { BaseTableData } from './models/base-table-data.model';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  providers: [MessageService],
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

  @Output() actionTriggered = new EventEmitter<{ action: string, item: any }>();
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

  onAction(action: string, item: any, event: Event): void {
    event.stopPropagation();
    this.actionTriggered.emit({action, item});
  }

  // removeItem(symbol: string, id: number, event: Event): void {
  //   event.stopPropagation();
  //   const group = this._data.find(group => group.symbol === symbol);
  //   if (!group) return;
  //
  //   group.children = group.children.filter(item => item['id'] !== id);
  //   if (group.children.length === 0) {
  //     this._data = this._data.filter(group => group.symbol !== symbol);
  //     this.expandedGroups.delete(symbol);
  //   }
  //   this.messageService.add({severity: 'success', summary: 'Success', detail: `"Zamknięto zlecenie nr ${id}"`});
  // }
  //
  // removeGroup(symbol: string, event: Event): void {
  //   event.stopPropagation();
  //   const group = this._data.find(group => group.symbol === symbol);
  //   if (!group) return;
  //   const groupsIds = group.children.map(item => item['id']);
  //   this._data = this._data.filter(group => group.symbol !== symbol);
  //   this.expandedGroups.delete(symbol);
  //   this.messageService.add({
  //     severity: 'success',
  //     summary: 'Success',
  //     detail: `"Zamknięto zlecenia nr ${groupsIds.join(', ')}"`
  //   });
  // }
}
