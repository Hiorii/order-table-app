import { Component, inject, OnInit } from '@angular/core';
import { BaseComponent } from '../../../../shared/components/base.component';
import { filter, Observable, takeUntil } from 'rxjs';
import { Store } from '@ngxs/store';
import { OrdersState } from '../../store/orders.state';
import { OrderModel } from '../../../../core/models/order.model';
import { GetOrdersData } from '../../store/orders.actions';
import { OrderGroup } from '../../models/order-group.model';
import { OrderSymbol } from '../../enums/order-symbol.enum';
import { TableHeader } from '../../../../shared/components/table/models/table-header.model';
import { faCloudArrowDown, faFaceSurprise, faTrash, faX } from '@fortawesome/free-solid-svg-icons';
import { BaseTableData } from '../../../../shared/components/table/models/base-table-data.model';
import { ToastService } from '../../../../shared/components/toast/services/toast.service';
import { ConfirmModalService } from '../../../../shared/components/confirm-modal/services/confirm-modal.service';
import { EmptyOrderModel } from '../../../../shared/components/empty/models/empty-order.model';
import { ButtonModel } from '../../../../shared/components/button/models/button.model';

@Component({
  selector: 'app-orders-table',
  templateUrl: './orders-table.component.html',
  styleUrl: './orders-table.component.scss'
})
export class OrdersTableComponent extends BaseComponent implements OnInit {
  ordersData$: Observable<OrderModel[] | null> = inject(Store).select(OrdersState.ordersData);
  ordersData: OrderModel[] | null = [];
  orderGroups: OrderGroup[] = [];
  headers: TableHeader[] = [];
  emptyData: EmptyOrderModel;
  buttonData: ButtonModel;

  constructor(
    private store: Store,
    private toastService: ToastService,
    private confirmModalService: ConfirmModalService
  ) {
    super();
  }

  ngOnInit(): void {
    this.getOrdersData();
    this.initializeHeaderData();
    this.initializeComponentsData();
    this.listenToOrdersDataChanges();
  }

  getOrdersData(): void {
    this.store.dispatch(new GetOrdersData());
  }

  initializeHeaderData(): void {
    this.headers = [
      { id: 'symbol', name: 'Symbol' },
      { id: 'id', name: 'Order ID' },
      { id: 'side', name: 'Side' },
      { id: 'size', name: 'Size' },
      { id: 'openTime', name: 'Open Time' },
      { id: 'openPrice', name: 'Open Price' },
      { id: 'swap', name: 'Swap' },
      { id: 'profit', name: 'Profit' },
      {
        id: 'actions',
        name: '',
        isAction: true,
        mainActions: [
          {
            icon: faTrash,
            name: 'removeGroup',
            click: (group: BaseTableData, event) => this.removeGroup(group, event)
          }
        ],
        childActions: [
          {
            icon: faX,
            name: 'removeItem',
            click: (item: BaseTableData, event) => this.removeItem(item, event)
          }
        ]
      }
    ];
  }

  initializeComponentsData(): void {
    this.emptyData = {
      icon: faFaceSurprise,
      title: 'Brak zleceń',
      details: 'Brak zleceń do wyświetlenia.'
    };

    this.buttonData = {
      text: 'Załaduj zlecenia',
      icon: faCloudArrowDown
    };
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
      (acc: Record<OrderSymbol, OrderModel[]>, order) => {
        if (!acc[order.symbol]) {
          acc[order.symbol] = [];
        }
        acc[order.symbol].push(order);
        return acc;
      },
      {} as Record<OrderSymbol, OrderModel[]>
    );

    this.orderGroups = Object.keys(groups).map((symbol) => ({
      symbol: symbol as OrderSymbol,
      size: this.calculateTotalSize(groups[symbol as OrderSymbol]),
      openPrice: this.calculateAverageOpenPrice(groups[symbol as OrderSymbol]),
      swap: this.calculateTotalSwap(groups[symbol as OrderSymbol]),
      profit: this.calculateAverageProfit(groups[symbol as OrderSymbol]),
      children: groups[symbol as OrderSymbol]
    }));
  }

  calculateTotalSize(orders: OrderModel[]): number {
    return orders.reduce((acc, order) => acc + order.size, 0);
  }

  calculateAverageOpenPrice(orders: OrderModel[]): number {
    return orders.reduce((acc, order) => acc + order.openPrice, 0) / orders.length;
  }

  calculateTotalSwap(orders: OrderModel[]): number {
    return orders.reduce((acc, order) => acc + order.swap, 0);
  }

  calculateAverageProfit(orders: OrderModel[]): number {
    return orders.reduce((acc, order) => acc + order.profit, 0) / orders.length;
  }

  removeItem(item: BaseTableData, event?: Event): void {
    event?.stopPropagation();
    const group = this.orderGroups.find((group) => group.symbol === item['symbol']);
    if (!group) return;

    this.confirmModalService.confirm('Zamknięcie zlecenia', 'Czy na pewno chcesz zamknąć to zlecenie?', () => {
      this.orderGroups = this.orderGroups
        .map((group) => {
          if (group.symbol === item['symbol']) {
            return {
              ...group,
              children: group.children.filter((child) => child['id'] !== item['id'])
            };
          }
          return group;
        })
        .filter((group) => group.children.length > 0);
      this.toastService.showSuccess('Zamknięto zlecenie', `Zamknięto zlecenie nr ${item['id']}`);
    });
  }

  removeGroup(group: BaseTableData, event?: Event): void {
    event?.stopPropagation();
    const groupData = this.orderGroups.find((g) => g.symbol === group['symbol']);
    if (!groupData) return;

    this.confirmModalService.confirm(
      'Zamknięcie grupy',
      'Wszystkie zlecenia z grupy zostaną usunięte.<br>Czy na pewno chcesz zamknąć tę grupę?',
      () => {
        const groupsIds = groupData.children.map((child) => child['id']);
        this.orderGroups = this.orderGroups.filter((g) => g.symbol !== group['symbol']);
        this.toastService.showSuccess('Zamknięto grupę', `Zamknięto zlecenia nr ${groupsIds.join(', ')}`);
      }
    );
  }
}
