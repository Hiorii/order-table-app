import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OrderGroup } from '../../models/order-group.model';
import { TableHeader } from '../../../../shared/components/table/models/table-header.model';
import { OrderService } from '../../services/order.service';

@Injectable({
  providedIn: 'root'
})
export class OrdersTableViewModel {
  private orderService = inject(OrderService);
  orderGroups$: Observable<OrderGroup[]> = this.orderService.orderGroups$;
  headers$: Observable<TableHeader[]> = this.orderService.headers$;

  loadOrders(): void {
    this.orderService.loadOrders();
  }

  setupWebSocket(): void {
    this.orderService.setupWebSocket();
  }
}
