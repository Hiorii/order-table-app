import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsRoutingModule } from './settings-routing.module';
import { MenuComponent } from './menu/menu.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from '../../shared/components/components.module';

@NgModule({
  declarations: [MenuComponent],
  imports: [CommonModule, SettingsRoutingModule, ReactiveFormsModule, FormsModule, ComponentsModule]
})
export class SettingsModule {}
