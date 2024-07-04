import { TestBed } from '@angular/core/testing';
import { ProfitCalculationService } from './profit-calculation.service';
import { OrderModel } from '../../../core/models/order.model';
import { OrderSymbol } from '../enums/order-symbol.enum';
import { QuoteData } from '../../../core/models/web-sockets/quote-data.model';
import { OrderGroup } from '../models/order-group.model';
import { OrderSideEnum } from '../../../core/enums/order-side.enum';

describe('ProfitCalculationService', () => {
  let service: ProfitCalculationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProfitCalculationService]
    });
    service = TestBed.inject(ProfitCalculationService);
  });

  describe('updateProfitValues', () => {
    it('should set profit to 0 and apply negative style if no data is provided', () => {
      const orderGroups: OrderGroup[] = [
        {
          symbol: OrderSymbol.BTCUSD,
          size: 10,
          openPrice: 100,
          swap: 1,
          profit: 0,
          children: [],
          styles: { profit: '' }
        }
      ];

      const result = service.updateProfitValues(orderGroups, []);

      expect(result).toEqual([
        {
          symbol: OrderSymbol.BTCUSD,
          size: 10,
          openPrice: 100,
          swap: 1,
          profit: 0,
          children: [],
          styles: { profit: service.textNegative }
        }
      ]);
    });

    it('should update profit values and styles based on provided data', () => {
      const orderGroups: OrderGroup[] = [
        {
          symbol: OrderSymbol.BTCUSD,
          size: 10,
          openPrice: 100,
          swap: 1,
          profit: 0,
          children: [
            {
              symbol: OrderSymbol.BTCUSD,
              id: 1,
              size: 10,
              openPrice: 100,
              closePrice: 150,
              side: OrderSideEnum.BUY,
              swap: 1,
              profit: 0,
              openTime: new Date(),
              styles: {}
            }
          ],
          styles: { profit: '' }
        }
      ];

      const quoteData: QuoteData[] = [
        {
          s: OrderSymbol.BTCUSD,
          b: 200,
          a: 210,
          t: 0
        }
      ];

      const result = service.updateProfitValues(orderGroups, quoteData);

      expect(result[0].profit).toBeGreaterThan(0);
      expect(result[0].styles?.['profit']).toEqual(service.textPositive);
    });
  });

  describe('calculateOrderProfit', () => {
    it('should correctly calculate the profit for a BUY order', () => {
      const order: OrderModel = {
        symbol: OrderSymbol.BTCUSD,
        id: 1,
        size: 10,
        openPrice: 100,
        closePrice: 150,
        side: OrderSideEnum.BUY,
        swap: 1,
        profit: 0,
        openTime: new Date(),
        styles: {}
      };

      const result = service.calculateOrderProfit(order, 200);

      expect(result.profit).toBeGreaterThan(0);
      expect(result.styles?.['profit']).toEqual(service.textPositive);
    });

    it('should correctly calculate the profit for a SELL order', () => {
      const order: OrderModel = {
        symbol: OrderSymbol.BTCUSD,
        id: 1,
        size: 10,
        openPrice: 200,
        closePrice: 150,
        side: OrderSideEnum.SELL,
        swap: 1,
        profit: 0,
        openTime: new Date(),
        styles: {}
      };

      const result = service.calculateOrderProfit(order, 100);

      expect(result.profit).toBeGreaterThan(0);
      expect(result.styles?.['profit']).toEqual(service.textPositive);
    });
  });

  describe('getMultiplier', () => {
    it('should return the correct multiplier for BTCUSD', () => {
      const result = service.getMultiplier(OrderSymbol.BTCUSD);
      expect(result).toBe(10 ** 2);
    });

    it('should return the correct multiplier for ETHUSD', () => {
      const result = service.getMultiplier(OrderSymbol.ETHUSD);
      expect(result).toBe(10 ** 3);
    });

    it('should return the correct multiplier for TTWO_US', () => {
      const result = service.getMultiplier(OrderSymbol.TTWO_US);
      expect(result).toBe(10 ** 1);
    });

    it('should return the default multiplier for an unknown symbol', () => {
      const result = service.getMultiplier('UNKNOWN' as OrderSymbol);
      expect(result).toBe(1);
    });
  });
});
