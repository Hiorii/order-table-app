import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { BaseComponent } from './base.component';
import { TableComponent } from './table/table.component';
import { IconComponent } from './icon/icon.component';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DisplayValuePipe } from '../pipes/display-value.pipe';
import { ToastComponent } from './toast/toast.component';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

const components = [BaseComponent, TableComponent, IconComponent, DisplayValuePipe, ToastComponent];

@NgModule({
  declarations: [...components],
  imports: [CommonModule, ReactiveFormsModule, FontAwesomeModule, ToastModule],
  exports: [...components, FontAwesomeModule, ToastModule],
  providers: [FaIconLibrary, MessageService]
})
export class ComponentsModule {}
