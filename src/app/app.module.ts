import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CoreModule } from './core/core.module';

@NgModule({
  imports: [HttpClientModule, BrowserModule, AppRoutingModule, BrowserAnimationsModule, CoreModule],
  declarations: [AppComponent],
  bootstrap: [AppComponent]
})
export class AppModule {}
