import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MyInterceptor } from './app.interceptor';
import { MatSnackBarModule, MatIconModule } from '@angular/material';
import { SnakbarComponent } from './snakbar/snakbar.component';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

@NgModule({
  declarations: [
    AppComponent,
    SnakbarComponent,
  ],
  imports: [
    MatIconModule,
    MatSnackBarModule,
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    DateInputsModule,
    CalendarModule.forRoot({ provide: DateAdapter, useFactory: adapterFactory })
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MyInterceptor,
      multi: true
    }],
  entryComponents: [SnakbarComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
