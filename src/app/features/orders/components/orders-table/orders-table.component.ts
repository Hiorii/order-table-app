import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { BaseComponent } from '../../../../shared/components/base.component';
import { filter, Observable, switchMap, takeUntil, throttleTime } from 'rxjs';
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
import { WebSocketService } from '../../../../core/services/web-socket.service';

@Component({
  selector: 'app-orders-table',
  templateUrl: './orders-table.component.html',
  styleUrls: ['./orders-table.component.scss']
})
export class OrdersTableComponent extends BaseComponent implements OnInit, OnDestroy {
  ordersData$: Observable<OrderModel[] | null> = inject(Store).select(OrdersState.ordersData);
  ordersData: OrderModel[] | null = [];
  orderGroups: OrderGroup[] = [];
  headers: TableHeader[] = [];
  emptyData: EmptyOrderModel;
  buttonData: ButtonModel;
  private symbols: string[] = [];

  constructor(
    private store: Store,
    private toastService: ToastService,
    private confirmModalService: ConfirmModalService,
    private webSocketService: WebSocketService
  ) {
    super();
  }

  ngOnInit(): void {
    this.getOrdersData();
    this.initializeHeaderData();
    this.initializeComponentsData();
    this.listenToOrdersDataChanges();
    this.setupWebSocket();
  }

  override ngOnDestroy(): void {
    this.unsubscribeFromSymbols();
    this.webSocketService.disconnect();
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
      size: this.calculateTotalValue(groups[symbol as OrderSymbol], 'size'),
      openPrice: this.calculateAverageValue(groups[symbol as OrderSymbol], 'openPrice'),
      swap: this.calculateTotalValue(groups[symbol as OrderSymbol], 'swap'),
      profit: this.calculateAverageValue(groups[symbol as OrderSymbol], 'profit'),
      children: groups[symbol as OrderSymbol]
    }));
  }

  calculateTotalValue(orders: OrderModel[], element: string): number {
    if (!element) return 0;
    return orders.reduce((acc, order) => {
      const el = order[element] as number;
      return el ? acc + el : acc;
    }, 0);
  }

  calculateAverageValue(orders: OrderModel[], element: string): number {
    if (!element) return 0;
    const total = orders.reduce((acc, order) => {
      const el = order[element] as number;
      return el ? acc + el : acc;
    }, 0);
    return total / orders.length;
  }

  setupWebSocket(): void {
    this.webSocketService.connect('wss://webquotes.geeksoft.pl/websocket/quotes');
    this.webSocketService
      .getConnectionState()
      .pipe(
        filter((isOpen) => isOpen),
        switchMap(() => {
          this.subscribeToSymbols();
          return this.webSocketService.getMessages();
        }),
        throttleTime(5000),
        takeUntil(this.destroyed$)
      )
      .subscribe((message: any) => {
        if (message.p === '/quotes/subscribed') {
          const filteredData = message.d.filter((priceData: { s: string; b: number }) => this.symbols.includes(priceData.s));
          this.updateProfitValues(filteredData);
        }
      });
  }

  subscribeToSymbols(): void {
    this.symbols = this.orderGroups.map((group) => group.symbol);
    this.webSocketService.sendMessage({
      p: '/subscribe/addlist',
      d: this.symbols
    });
  }

  unsubscribeFromSymbols(): void {
    this.webSocketService.sendMessage({
      p: '/subscribe/removelist',
      d: this.symbols
    });
  }

  updateProfitValues(data: { s: string; b: number }[]): void {
    this.orderGroups = this.orderGroups.map((group) => {
      const currentPriceData = data.find((priceData) => priceData.s === group.symbol);
      const currentPrice = currentPriceData ? currentPriceData.b : null;
      const updatedChildren = group.children.map((order) => this.calculateOrderProfit(order, currentPrice));
      const totalProfit = updatedChildren.reduce((acc, order) => (order.profit ? acc + order.profit : 0), 0);
      return {
        ...group,
        children: updatedChildren,
        profit: totalProfit,
        styles: totalProfit > 0 ? { profit: 'text-light-profitPositive' } : { profit: 'text-light-profitNegative' }
      };
    });
  }

  calculateOrderProfit(order: OrderModel, closePrice: number | null): OrderModel {
    const price = closePrice ? closePrice : order.closePrice;
    const multiplier = this.getMultiplier(order.symbol);
    const sideMultiplier = order.side === 'BUY' ? 1 : -1;
    const profit = ((price - order.openPrice) * multiplier * sideMultiplier) / 100;

    const newStyles = {
      ...(order.styles && typeof order.styles === 'object' ? order.styles : {}),
      profit: profit > 0 ? 'text-light-profitPositive' : 'text-light-profitNegative'
    };

    return {
      ...order,
      profit,
      styles: newStyles
    };
  }

  getMultiplier(symbol: OrderSymbol): number {
    switch (symbol) {
      case 'BTCUSD':
        return 10 ** 2;
      case 'ETHUSD':
        return 10 ** 3;
      case 'TTWO.US':
        return 10 ** 1;
      default:
        return 1;
    }
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
