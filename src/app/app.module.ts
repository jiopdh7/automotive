import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localePe from '@angular/common/locales/es-PE';
registerLocaleData(localePe, 'es-PE');
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NoopAnimationsModule, BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'; 
import { MyInterceptor } from './interceptor';
import { MatSnackBarModule } from '@angular/material';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NoopAnimationsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatSnackBarModule,
  ],
  providers: [{ provide: LOCALE_ID, useValue: 'es-PE' },{
    provide: HTTP_INTERCEPTORS,
    useClass: MyInterceptor,
    multi: true
  } ],
  bootstrap: [AppComponent]
})
export class AppModule {
}

