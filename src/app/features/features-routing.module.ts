import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrdersTableComponent } from './orders/components/orders-table/orders-table.component';

const routes: Routes = [
  {
    path: 'orders-table',
    component: OrdersTableComponent
  },
  {
    path: '**',
    redirectTo: 'orders-table'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FeaturesRoutingModule {}
