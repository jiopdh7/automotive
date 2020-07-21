import { NgModule, LOCALE_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { registerLocaleData } from '@angular/common';
import localePe from '@angular/common/locales/es-PE';
registerLocaleData(localePe, 'es-PE');
import { HomeComponent } from './home/home.component';
import { PagesRoutingModule } from './pages-routing.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatMenuModule } from '@angular/material/menu';
import { MatListModule } from '@angular/material/list';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSelectModule } from '@angular/material/select';
import { AgendarComponent } from './agendar/agendar.component';
import { ConsultarComponent } from './consultar/consultar.component';
import { ComponentsModule } from '../components/components.module';
import { PopoverModule } from "ngx-smart-popover";

//Translation
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import {  RecaptchaV3Module, RECAPTCHA_V3_SITE_KEY } from 'ng-recaptcha'; 
import {MatTooltipModule} from '@angular/material/tooltip';
import { InicioComponent } from './inicio/inicio.component';
import { RestaurarComponent } from './restaurar/restaurar.component'; 
 
@NgModule({
  declarations: [HomeComponent, AgendarComponent, ConsultarComponent, InicioComponent, RestaurarComponent],
  imports: [
    CommonModule,
    PagesRoutingModule,
    ComponentsModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatSidenavModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatInputModule,
    MatProgressBarModule,
    MatSnackBarModule,
    MatMenuModule,
    MatListModule,
    MatStepperModule,
    MatSelectModule,
    FlexLayoutModule,
    PopoverModule,
    RecaptchaV3Module, 
    MatTooltipModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (http: HttpClient) => {
          return  new TranslateHttpLoader(http, "assets/i18n/", ".json")
        },
        deps: [HttpClient]
      }
    })
  ],
  providers: [{ provide: LOCALE_ID, useValue: 'es-PE' },
  { provide: RECAPTCHA_V3_SITE_KEY, useValue: '6Lc6ZfQUAAAAAH9XL1i4rubtOccV0zCYqfd6MC9G' }]
})
export class PagesModule { }
