import { TestBed } from '@angular/core/testing';
import { NgxsModule, Store } from '@ngxs/store';
import { of } from 'rxjs';
import { OrderService } from './order.service';
import { WebSocketService } from '../../../core/services/web-socket.service';
import { ProfitCalculationService } from './profit-calculation.service';
import { ConfirmModalService } from '../../../shared/components/confirm-modal/services/confirm-modal.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { OrdersState } from '../store/orders.state';
import { environment } from '../../../../environments/environment';
import { QuotesSubscribedMessage } from '../../../core/models/web-sockets/quotes-subscribed-message.model';
import { OrderSymbol } from '../enums/order-symbol.enum';
import { OrderSideEnum } from '../../../core/enums/order-side.enum';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('OrderService', () => {
  let service: OrderService;
  let store: Store;
  let webSocketService: WebSocketService;
  let profitCalculationService: ProfitCalculationService;
  let confirmModalService: ConfirmModalService;
  let messageService: MessageService;
  let mockDate: Date;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([OrdersState]), HttpClientTestingModule],
      providers: [OrderService, WebSocketService, ProfitCalculationService, ConfirmModalService, MessageService, ConfirmationService]
    });

    service = TestBed.inject(OrderService);
    store = TestBed.inject(Store);
    webSocketService = TestBed.inject(WebSocketService);
    profitCalculationService = TestBed.inject(ProfitCalculationService);
    confirmModalService = TestBed.inject(ConfirmModalService);
    messageService = TestBed.inject(MessageService);

    jest.spyOn(store, 'dispatch').mockImplementation(() => of(void 0));
    jest.spyOn(webSocketService, 'connect').mockImplementation(() => {});
    jest.spyOn(webSocketService, 'getConnectionState').mockReturnValue(of(true));
    jest.spyOn(webSocketService, 'getMessages').mockReturnValue(
      of({
        p: '/quotes/subscribed',
        d: []
      } as QuotesSubscribedMessage)
    );
    jest.spyOn(webSocketService, 'sendMessage').mockImplementation(() => {});
    jest.spyOn(profitCalculationService, 'updateProfitValues').mockReturnValue([]);
    jest.spyOn(confirmModalService, 'confirm').mockImplementation((title, message, accept) => accept());
    jest.spyOn(messageService, 'add').mockImplementation(() => {});

    mockDate = new Date('2024-07-04T16:34:08.219Z');
    jest.spyOn(globalThis, 'Date').mockImplementation(() => mockDate as any);
  });

  it('should setup WebSocket and handle messages correctly', () => {
    service.setupWebSocket();

    expect(webSocketService.connect).toHaveBeenCalledWith(environment.webSockets.webSocketUrl);
    expect(webSocketService.getConnectionState).toHaveBeenCalled();

    webSocketService.getMessages().subscribe((msg) => {
      expect(profitCalculationService.updateProfitValues).toHaveBeenCalledWith(service['orderGroupsSubject'].value, msg.d);
      expect(service['orderGroupsSubject'].value).toEqual([]);
    });
  });

  it('should remove an item correctly', () => {
    const group = {
      symbol: OrderSymbol.BTCUSD,
      size: 30,
      openPrice: 100,
      swap: 1,
      profit: 10,
      children: [
        {
          id: 1,
          symbol: OrderSymbol.BTCUSD,
          size: 10,
          openPrice: 100,
          closePrice: 150,
          side: OrderSideEnum.BUY,
          swap: 1,
          profit: 10,
          openTime: mockDate
        }
      ]
    };
    service['orderGroupsSubject'].next([group]);

    service.removeItem({ id: 1, symbol: OrderSymbol.BTCUSD });

    expect(service['orderGroupsSubject'].value).toEqual([]);
    expect(messageService.add).toHaveBeenCalledWith({
      severity: 'success',
      summary: 'Zamknięto zlecenie',
      detail: 'Zamknięto zlecenie nr 1'
    });
  });

  it('should remove a group correctly', () => {
    const group = {
      symbol: OrderSymbol.BTCUSD,
      size: 30,
      openPrice: 100,
      swap: 1,
      profit: 10,
      children: [
        {
          id: 1,
          symbol: OrderSymbol.BTCUSD,
          size: 10,
          openPrice: 100,
          closePrice: 150,
          side: OrderSideEnum.BUY,
          swap: 1,
          profit: 10,
          openTime: mockDate
        }
      ]
    };
    service['orderGroupsSubject'].next([group]);

    service.removeGroup({ symbol: OrderSymbol.BTCUSD });

    expect(service['orderGroupsSubject'].value).toEqual([]);
    expect(messageService.add).toHaveBeenCalledWith({
      severity: 'success',
      summary: 'Zamknięto grupę',
      detail: 'Zamknięto zlecenia nr 1'
    });
  });
});
