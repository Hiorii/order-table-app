/* eslint max-classes-per-file: 0 */
/* eslint max-lines: 0 */
import { inject, Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { OrdersStateModel } from './orders.state.model';
import { GetOrdersData } from './orders.actions';
import { tap } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { OrderModel } from '../../../core/models/order.model';

const defaultState = {
  name: 'orders',
  defaults: {
    ordersData: null
  }
};

@State<OrdersStateModel>(defaultState)
@Injectable()
export class OrdersState {
  private apiService = inject(ApiService);

  @Selector()
  static ordersData(state: OrdersStateModel): OrderModel[] | null {
    return state.ordersData;
  }

  @Action(GetOrdersData)
  getOrdersData({ patchState }: StateContext<OrdersStateModel>) {
    return this.apiService.getOrdersData().pipe(
      tap((result: { data: OrderModel[] }) => {
        patchState({
          ordersData: result.data ?? null
        });
      })
    );
  }
}
