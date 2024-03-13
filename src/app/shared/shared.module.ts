import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentsModule } from './components/components.module';
import { OverflowCheckDirective } from './directives/overflow-check.directive';

@NgModule({
  declarations: [OverflowCheckDirective],
  imports: [CommonModule, ComponentsModule],
  exports: [ComponentsModule, OverflowCheckDirective]
})
export class SharedModule {}
