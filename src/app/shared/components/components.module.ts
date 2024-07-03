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
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmModalComponent } from './confirm-modal/confirm-modal.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { EmptyComponent } from './empty/empty.component';
import { ButtonComponent } from './button/button.component';

const components = [
  BaseComponent,
  TableComponent,
  IconComponent,
  DisplayValuePipe,
  ToastComponent,
  ConfirmModalComponent,
  EmptyComponent,
  ButtonComponent
];
const modules = [FontAwesomeModule, ToastModule, ConfirmDialogModule];

@NgModule({
  declarations: [...components],
  imports: [CommonModule, ReactiveFormsModule, ...modules],
  exports: [...components, ...modules],
  providers: [FaIconLibrary, MessageService, ConfirmationService]
})
export class ComponentsModule {}
