import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TextFieldComponent } from './text-field/text-field.component';
import { AsFormControl } from '../pipes/as-form-control.pipe';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonComponent } from './button/button.component';
import { ValidationMessageComponent } from './validation-message/validation-message.component';

const components = [TextFieldComponent, ButtonComponent, ValidationMessageComponent];

@NgModule({
  declarations: [...components, AsFormControl],
  imports: [CommonModule, ReactiveFormsModule],
  exports: [...components, AsFormControl]
})
export class ComponentsModule {}
