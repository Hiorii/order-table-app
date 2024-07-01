import { Component, inject, OnInit } from '@angular/core';
import { BaseComponent } from '../../../../shared/components/base.component';
import { filter, Observable, takeUntil } from 'rxjs';
import { Store } from '@ngxs/store';
import { OrdersState } from '../../store/orders.state';
import { OrderModel } from '../../../../core/models/order.model';
import { GetOrdersData } from '../../store/orders.actions';
import { OrderGroup } from '../../models/order-group.model';

@Component({
  selector: 'app-orders-table',
  templateUrl: './orders-table.component.html',
  styleUrl: './orders-table.component.scss'
})
export class OrdersTableComponent extends BaseComponent implements OnInit {
  ordersData$: Observable<OrderModel[] | null> = inject(Store).select(OrdersState.ordersData);
  ordersData: OrderModel[] | null = [];
  orderGroups: OrderGroup[] = [];
  expandedGroup: string | null = null;

  constructor(private store: Store) {
    super();
  }

  ngOnInit(): void {
    this.store.dispatch(new GetOrdersData());
    this.listenToOrdersDataChanges();
  }

  listenToOrdersDataChanges(): void {
    this.ordersData$.pipe(filter(Boolean), takeUntil(this.destroyed$)).subscribe((data) => {
      this.ordersData = data;
      this.groupOrders();
    });
  }

  groupOrders(): void {
    if (!this.ordersData) {
      this.orderGroups = [];
      return;
    }

    const groups = this.ordersData?.reduce(
      (acc: Record<string, OrderModel[]>, order) => {
        if (!acc[order.symbol]) {
          acc[order.symbol] = [];
        }
        acc[order.symbol].push(order);
        return acc;
      },
      {} as Record<string, OrderModel[]>
    );

    this.orderGroups = Object.keys(groups).map((symbol) => ({
      symbol,
      orders: groups[symbol]
    }));
  }
}
