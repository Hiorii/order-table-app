import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { CatFactsRoutingModule } from './cat-facts-routing.module';
import { FactsContainerComponent } from './facts-container/facts-container.component';
import { CardTemplateComponent } from './card-template/card-template.component';

@NgModule({
  declarations: [FactsContainerComponent, CardTemplateComponent],
  imports: [CommonModule, CatFactsRoutingModule, NgOptimizedImage]
})
export class CatFactsModule {}
