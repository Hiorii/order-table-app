import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TableComponent } from './table/table.component';
import { IconComponent } from './icon/icon.component';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DisplayValuePipe } from '../pipes/display-value.pipe';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService } from 'primeng/api';
import { ConfirmModalComponent } from './confirm-modal/confirm-modal.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { EmptyComponent } from './empty/empty.component';
import { ButtonDirective } from './button/button.directive';
import { ThemeToggleComponent } from './theme-toggle/theme-toggle.component';

const components = [
  TableComponent,
  IconComponent,
  DisplayValuePipe,
  ConfirmModalComponent,
  EmptyComponent,
  ButtonDirective,
  ThemeToggleComponent
];
const modules = [FontAwesomeModule, ToastModule, ConfirmDialogModule];

@NgModule({
  declarations: [...components],
  imports: [CommonModule, ReactiveFormsModule, ...modules],
  exports: [...components, ...modules],
  providers: [FaIconLibrary, ConfirmationService]
})
export class ComponentsModule {}
