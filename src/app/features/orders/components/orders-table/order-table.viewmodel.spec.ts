import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { OrdersTableViewModel } from './order-table.viewmodel';
import { OrderService } from '../../services/order.service';
import { OrderGroup } from '../../models/order-group.model';
import { TableHeader } from '../../../../shared/components/table/models/table-header.model';

describe('OrdersTableViewModel', () => {
  let viewModel: OrdersTableViewModel;
  let orderService: jest.Mocked<OrderService>;

  beforeEach(() => {
    const orderServiceMock = {
      orderGroups$: of([] as OrderGroup[]),
      headers$: of([] as TableHeader[]),
      loadOrders: jest.fn(),
      setupWebSocket: jest.fn()
    };

    TestBed.configureTestingModule({
      providers: [OrdersTableViewModel, { provide: OrderService, useValue: orderServiceMock }]
    });

    viewModel = TestBed.inject(OrdersTableViewModel);
    orderService = TestBed.inject(OrderService) as jest.Mocked<OrderService>;
  });

  it('should load orders', () => {
    viewModel.loadOrders();
    expect(orderService.loadOrders).toHaveBeenCalled();
  });

  it('should setup WebSocket', () => {
    viewModel.setupWebSocket();
    expect(orderService.setupWebSocket).toHaveBeenCalled();
  });

  it('should have orderGroups$ observable', (done) => {
    viewModel.orderGroups$.subscribe((orderGroups) => {
      expect(orderGroups).toEqual([]);
      done();
    });
  });

  it('should have headers$ observable', (done) => {
    viewModel.headers$.subscribe((headers) => {
      expect(headers).toEqual([]);
      done();
    });
  });
});
