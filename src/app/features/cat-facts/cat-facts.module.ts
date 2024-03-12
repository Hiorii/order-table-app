import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CatFactsRoutingModule } from './cat-facts-routing.module';
import { FactsContainerComponent } from './facts-container/facts-container.component';

@NgModule({
  declarations: [FactsContainerComponent],
  imports: [CommonModule, CatFactsRoutingModule]
})
export class CatFactsModule {}
