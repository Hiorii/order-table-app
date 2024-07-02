import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { BaseComponent } from './base.component';
import { TableComponent } from './table/table.component';
import { IconComponent } from './icon/icon.component';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';

const components = [BaseComponent, TableComponent, IconComponent];

@NgModule({
  declarations: [...components],
  imports: [CommonModule, ReactiveFormsModule, FontAwesomeModule],
  exports: [...components, FontAwesomeModule],
  providers: [FaIconLibrary]
})
export class ComponentsModule {}
