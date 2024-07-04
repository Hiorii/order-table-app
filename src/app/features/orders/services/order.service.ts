import { DestroyRef, inject, Injectable } from '@angular/core';
import { BehaviorSubject, filter, Observable, switchMap, throttleTime } from 'rxjs';
import { TableHeader } from '../../../shared/components/table/models/table-header.model';
import { OrderGroup } from '../models/order-group.model';
import { Store } from '@ngxs/store';
import { WebSocketService } from '../../../core/services/web-socket.service';
import { ProfitCalculationService } from './profit-calculation.service';
import { GetOrdersData } from '../store/orders.actions';
import { environment } from '../../../../environments/environment';
import { QuotesSubscribedMessage } from '../../../core/models/web-sockets/quotes-subscribed-message.model';
import { QuoteData } from '../../../core/models/web-sockets/quote-data.model';
import { OrderItemsEnum } from '../enums/order-items.enum';
import { faTrash, faX } from '@fortawesome/free-solid-svg-icons';
import { BaseTableData } from '../../../shared/components/table/models/base-table-data.model';
import { OrderModel } from '../../../core/models/order.model';
import { OrderSymbol } from '../enums/order-symbol.enum';
import { ConfirmModalService } from '../../../shared/components/confirm-modal/services/confirm-modal.service';
import { MessageService } from 'primeng/api';
import { OrdersState } from '../store/orders.state';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private store = inject(Store);
  private webSocketService = inject(WebSocketService);
  private profitCalculationService = inject(ProfitCalculationService);
  private confirmModalService = inject(ConfirmModalService);
  private messageService = inject(MessageService);
  private destroyRef = inject(DestroyRef);
  private ordersDataFromStore$: Observable<OrderModel[] | null> = inject(Store).select(OrdersState.ordersData);
  private headersSubject = new BehaviorSubject<TableHeader[]>(this.getInitialHeaders());
  private orderGroupsSubject = new BehaviorSubject<OrderGroup[]>([]);
  private symbols: string[] = [];

  get headers$(): Observable<TableHeader[]> {
    return this.headersSubject.asObservable();
  }

  get orderGroups$(): Observable<OrderGroup[]> {
    return this.orderGroupsSubject.asObservable();
  }

  loadOrders(): void {
    this.store.dispatch(new GetOrdersData());
    this.ordersDataFromStore$.pipe(filter(Boolean), takeUntilDestroyed(this.destroyRef)).subscribe((ordersData) => {
      this.groupOrders(ordersData);
    });
  }

  setupWebSocket(): void {
    this.webSocketService.connect(environment.webSockets.webSocketUrl);
    this.webSocketService
      .getConnectionState()
      .pipe(
        filter((isOpen) => isOpen),
        switchMap(() => {
          this.subscribeToSymbols();
          return this.webSocketService.getMessages();
        }),
        throttleTime(5000),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((message: QuotesSubscribedMessage) => {
        if (message.p === environment.webSockets.subscribeAddress) {
          const filteredData = message.d.filter((priceData: QuoteData) => this.symbols.includes(priceData.s));
          const updatedOrderGroups = this.profitCalculationService.updateProfitValues(this.orderGroupsSubject.value, filteredData);
          this.orderGroupsSubject.next(updatedOrderGroups);
        }
      });
  }

  private getInitialHeaders(): TableHeader[] {
    return [
      { id: OrderItemsEnum.symbol, name: 'Symbol' },
      { id: OrderItemsEnum.id, name: 'Order ID' },
      { id: OrderItemsEnum.side, name: 'Side' },
      { id: OrderItemsEnum.size, name: 'Size' },
      { id: OrderItemsEnum.openTime, name: 'Open Time' },
      { id: OrderItemsEnum.openPrice, name: 'Open Price' },
      { id: OrderItemsEnum.swap, name: 'Swap' },
      { id: OrderItemsEnum.profit, name: 'Profit' },
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

  private subscribeToSymbols(): void {
    this.symbols = this.orderGroupsSubject.value.map((group) => group.symbol);
    this.webSocketService.sendMessage({
      p: environment.webSockets.addListAddress,
      d: this.symbols
    });
  }

  private groupOrders(orders: OrderModel[]): void {
    const groups = orders.reduce(
      (acc: Record<OrderSymbol, OrderModel[]>, order) => {
        if (!acc[order.symbol]) {
          acc[order.symbol] = [];
        }
        acc[order.symbol].push(order);
        return acc;
      },
      {} as Record<OrderSymbol, OrderModel[]>
    );

    const groupedOrderGroups = Object.keys(groups).map((symbol) => ({
      symbol: symbol as OrderSymbol,
      size: this.calculateTotalValue(groups[symbol as OrderSymbol], OrderItemsEnum.size),
      openPrice: this.calculateAverageValue(groups[symbol as OrderSymbol], OrderItemsEnum.openPrice),
      swap: this.calculateTotalValue(groups[symbol as OrderSymbol], OrderItemsEnum.swap),
      profit: this.calculateAverageValue(groups[symbol as OrderSymbol], OrderItemsEnum.profit),
      children: groups[symbol as OrderSymbol]
    }));

    this.orderGroupsSubject.next(groupedOrderGroups);
  }

  private calculateTotalValue(orders: OrderModel[], element: string): number {
    if (!element) return 0;
    return orders.reduce((acc, order) => {
      const el = order[element] as number;
      return el ? acc + el : acc;
    }, 0);
  }

  private calculateAverageValue(orders: OrderModel[], element: string): number {
    if (!element) return 0;
    const total = orders.reduce((acc, order) => {
      const el = order[element] as number;
      return el ? acc + el : acc;
    }, 0);
    return total / orders.length;
  }

  removeItem(item: BaseTableData, event?: Event): void {
    event?.stopPropagation();
    const group = this.orderGroupsSubject.value.find((group) => group.symbol === item['symbol']);
    if (!group) return;

    this.confirmModalService.confirm('Zamknięcie zlecenia', 'Czy na pewno chcesz zamknąć to zlecenie?', () => {
      const updatedOrderGroups = this.orderGroupsSubject.value
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
      this.orderGroupsSubject.next(updatedOrderGroups);
      this.messageService.add({
        severity: 'success',
        summary: 'Zamknięto zlecenie',
        detail: `Zamknięto zlecenie nr ${item['id']}`
      });
    });
  }

  removeGroup(group: BaseTableData, event?: Event): void {
    event?.stopPropagation();
    const groupData = this.orderGroupsSubject.value.find((g) => g.symbol === group['symbol']);
    if (!groupData) return;

    this.confirmModalService.confirm(
      'Zamknięcie grupy',
      'Wszystkie zlecenia z grupy zostaną usunięte.<br>Czy na pewno chcesz zamknąć tę grupę?',
      () => {
        const groupsIds = groupData.children.map((child) => child['id']);
        const updatedOrderGroups = this.orderGroupsSubject.value.filter((g) => g.symbol !== group['symbol']);
        this.orderGroupsSubject.next(updatedOrderGroups);
        this.messageService.add({
          severity: 'success',
          summary: 'Zamknięto grupę',
          detail: `Zamknięto zlecenia nr ${groupsIds.join(', ')}`
        });
      }
    );
  }
}
