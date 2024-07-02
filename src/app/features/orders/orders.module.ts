import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdersTableComponent } from './components/orders-table/orders-table.component';
import { NgxsModule } from '@ngxs/store';
import { OrdersState } from './store/orders.state';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [OrdersTableComponent],
  imports: [CommonModule, NgxsModule.forFeature([OrdersState]), SharedModule]
})
export class OrdersModule {}
