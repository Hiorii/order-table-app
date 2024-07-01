import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdersTableComponent } from './components/orders-table/orders-table.component';
import { NgxsModule } from '@ngxs/store';
import { OrdersState } from './store/orders.state';

@NgModule({
  declarations: [OrdersTableComponent],
  imports: [CommonModule, NgxsModule.forFeature([OrdersState])]
})
export class OrdersModule {}
