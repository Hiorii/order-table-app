import { TestBed } from '@angular/core/testing';
import { ProfitCalculationService } from './profit-calculation.service';
import { OrderModel } from '../../../core/models/order.model';
import { OrderSymbol } from '../enums/order-symbol.enum';
import { QuoteData } from '../../../core/models/web-sockets/quote-data.model';
import { OrderGroup } from '../models/order-group.model';

describe('ProfitCalculationService', () => {
  let service: ProfitCalculationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProfitCalculationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('calculateOrderProfit', () => {
    it('should calculate profit correctly for BUY order', () => {
      const order: OrderModel = {
        id: 1,
        openTime: new Date(),
        openPrice: 100,
        closePrice: 150,
        symbol: OrderSymbol.BTCUSD,
        side: 'BUY',
        size: 1,
        swap: 0
      };
      const closePrice = 200;
      const result = service.calculateOrderProfit(order, closePrice);
      expect(result.profit).toBe(((200 - 100) * 100) / 100);
      expect(result.styles?.['profit']).toBe(service.textPositive);
    });

    it('should calculate profit correctly for SELL order', () => {
      const order: OrderModel = {
        id: 1,
        openTime: new Date(),
        openPrice: 150,
        closePrice: 100,
        symbol: OrderSymbol.ETHUSD,
        side: 'SELL',
        size: 1,
        swap: 0
      };
      const closePrice = 250;
      const result = service.calculateOrderProfit(order, closePrice);
      expect(result.profit).toBe(((closePrice - order.openPrice) * 1000 * -1) / 100);
      expect(result.styles?.['profit']).toBe(service.textNegative);
    });

    it('should use order closePrice if closePrice is null', () => {
      const order: OrderModel = {
        id: 1,
        openTime: new Date(),
        openPrice: 150,
        closePrice: 200,
        symbol: OrderSymbol.TTWO_US,
        side: 'BUY',
        size: 1,
        swap: 0
      };
      const result = service.calculateOrderProfit(order, null);
      expect(result.profit).toBe(((order.closePrice - order.openPrice) * 10) / 100);
      expect(result.styles?.['profit']).toBe(service.textPositive);
    });
  });

  describe('updateProfitValues', () => {
    it('should update profit values for order groups', () => {
      const orderGroups: OrderGroup[] = [
        {
          symbol: OrderSymbol.BTCUSD,
          size: 1,
          openPrice: 100,
          swap: 0,
          profit: 0,
          children: [
            {
              id: 1,
              openTime: new Date(),
              openPrice: 100,
              closePrice: 150,
              symbol: OrderSymbol.BTCUSD,
              side: 'BUY',
              size: 1,
              swap: 0
            }
          ],
          styles: {}
        }
      ];

      const data: QuoteData[] = [{ s: OrderSymbol.BTCUSD, b: 200, a: 0, t: 0 }];

      const result = service.updateProfitValues(orderGroups, data);
      expect(result[0].profit).toBe(((200 - 100) * 100) / 100);
      expect(result[0].styles?.['profit']).toBe(service.textPositive);
    });

    it('should set profit styles correctly based on total profit', () => {
      const orderGroups: OrderGroup[] = [
        {
          symbol: OrderSymbol.BTCUSD,
          size: 1,
          openPrice: 100,
          swap: 0,
          profit: 0,
          children: [
            {
              id: 1,
              openTime: new Date(),
              openPrice: 100,
              closePrice: 150,
              symbol: OrderSymbol.BTCUSD,
              side: 'BUY',
              size: 1,
              swap: 0
            },
            {
              id: 2,
              openTime: new Date(),
              openPrice: 200,
              closePrice: 150,
              symbol: OrderSymbol.BTCUSD,
              side: 'SELL',
              size: 1,
              swap: 0
            }
          ],
          styles: {}
        }
      ];

      const data: QuoteData[] = [
        { s: OrderSymbol.BTCUSD, b: 200, a: 0, t: 0 },
        { s: OrderSymbol.BTCUSD, b: 300, a: 0, t: 0 }
      ];

      const result = service.updateProfitValues(orderGroups, data);
      const totalProfit = ((200 - 100) * 100) / 100 + ((300 - 200) * 100 * -1) / 100;
      expect(result[0].profit).toBe(totalProfit);
      expect(result[0].styles?.['profit']).toBe(service.textNegative);
    });

    it('should handle case when no price data is found for a symbol', () => {
      const orderGroups: OrderGroup[] = [
        {
          symbol: OrderSymbol.BTCUSD,
          size: 1,
          openPrice: 100,
          swap: 0,
          profit: 0,
          children: [
            {
              id: 1,
              openTime: new Date(),
              openPrice: 100,
              closePrice: 150,
              symbol: OrderSymbol.BTCUSD,
              side: 'BUY',
              size: 1,
              swap: 0
            }
          ],
          styles: {}
        }
      ];

      const data: QuoteData[] = [];

      const result = service.updateProfitValues(orderGroups, data);
      expect(result[0].profit).toBe(0);
      expect(result[0].styles?.['profit']).toBe(service.textNegative);
    });
  });

  describe('getMultiplier', () => {
    it('should return correct multiplier for BTCUSD', () => {
      expect(service.getMultiplier(OrderSymbol.BTCUSD)).toBe(100);
    });

    it('should return correct multiplier for ETHUSD', () => {
      expect(service.getMultiplier(OrderSymbol.ETHUSD)).toBe(1000);
    });

    it('should return correct multiplier for TTWO.US', () => {
      expect(service.getMultiplier(OrderSymbol.TTWO_US)).toBe(10);
    });

    it('should return 1 for unknown symbol', () => {
      expect(service.getMultiplier('UNKNOWN' as OrderSymbol)).toBe(1);
    });
  });
});
