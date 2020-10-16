import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PrizeWheelModule } from 'projects/prize-wheel/src';
import { PdfViewModule } from 'projects/pdf-view/src/public-api';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    PrizeWheelModule,
    PdfViewModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
