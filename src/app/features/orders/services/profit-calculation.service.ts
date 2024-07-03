import { Injectable } from '@angular/core';
import { OrderModel } from '../../../core/models/order.model';
import { OrderSymbol } from '../enums/order-symbol.enum';
import { QuoteData } from '../../../core/models/web-sockets/quote-data.model';
import { OrderGroup } from '../models/order-group.model';

@Injectable({
  providedIn: 'root'
})
export class ProfitCalculationService {
  textPositive = 'text-light-profitPositive';
  textNegative = 'text-light-profitNegative';

  updateProfitValues(orderGroups: OrderGroup[], data: QuoteData[]): OrderGroup[] {
    if (!data.length) {
      return orderGroups.map((group) => {
        return {
          ...group,
          profit: 0,
          styles: { profit: this.textNegative }
        };
      });
    }
    return orderGroups.map((group) => {
      const currentPriceData = data.find((priceData) => priceData.s === group.symbol);
      const currentPrice = currentPriceData ? currentPriceData.b : null;
      const updatedChildren = group.children.map((order) => this.calculateOrderProfit(order, currentPrice));
      const totalProfit = updatedChildren.reduce((acc, order) => (order.profit ? acc + order.profit : 0), 0);
      return {
        ...group,
        children: updatedChildren,
        profit: totalProfit,
        styles: totalProfit > 0 ? { profit: this.textPositive } : { profit: this.textNegative }
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
      profit: profit > 0 ? this.textPositive : this.textNegative
    };

    return {
      ...order,
      profit,
      styles: newStyles
    };
  }

  getMultiplier(symbol: OrderSymbol): number {
    switch (symbol) {
      case OrderSymbol.BTCUSD:
        return 10 ** 2;
      case OrderSymbol.ETHUSD:
        return 10 ** 3;
      case OrderSymbol.TTWO_US:
        return 10 ** 1;
      default:
        return 1;
    }
  }
}
