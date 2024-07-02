import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeaturesRoutingModule } from './features-routing.module';
import { OrdersModule } from './orders/orders.module';

@NgModule({
  imports: [CommonModule, FeaturesRoutingModule, OrdersModule]
})
export class FeaturesModule {}
