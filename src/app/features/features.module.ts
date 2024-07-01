import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeaturesRoutingModule } from './features-routing.module';
import { OrdersModule } from './orders/orders.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [CommonModule, FeaturesRoutingModule, OrdersModule, SharedModule]
})
export class FeaturesModule {}
