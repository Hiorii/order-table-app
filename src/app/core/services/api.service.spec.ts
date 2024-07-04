import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ApiService } from './api.service';
import { environment } from '../../../environments/environment';
import { OrderModel } from '../models/order.model';
import { OrderSymbol } from '../../features/orders/enums/order-symbol.enum';
import { OrderSideEnum } from '../enums/order-side.enum';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiService]
    });
    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch orders data', () => {
    const mockOrders: OrderModel[] = [
      {
        id: 1,
        openTime: '2021-09-01',
        openPrice: 100,
        swap: 1,
        closePrice: 110,
        symbol: OrderSymbol.BTCUSD,
        side: OrderSideEnum.BUY,
        size: 1,
        profit: 10
      },
      {
        id: 2,
        openTime: '2021-09-02',
        openPrice: 200,
        swap: 2,
        closePrice: 220,
        symbol: OrderSymbol.ETHUSD,
        side: OrderSideEnum.SELL,
        size: 2,
        profit: 20
      }
    ];

    service.getOrdersData().subscribe((response) => {
      expect(response.data).toEqual(mockOrders);
    });

    const req = httpMock.expectOne(environment.apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush({ data: mockOrders });
  });
});
