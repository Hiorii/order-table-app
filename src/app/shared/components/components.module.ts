import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { BaseComponent } from './base.component';

const components = [BaseComponent];

@NgModule({
  declarations: [...components],
  imports: [CommonModule, ReactiveFormsModule],
  exports: [...components]
})
export class ComponentsModule {}
