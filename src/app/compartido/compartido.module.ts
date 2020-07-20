
import { NgModule, LOCALE_ID } from '@angular/core';
import { registerLocaleData, CommonModule } from '@angular/common';
import localePe from '@angular/common/locales/es-PE';
registerLocaleData(localePe, 'es-PE');
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatListModule } from '@angular/material/list';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatChipsModule } from '@angular/material/chips';
import { MatSidenavModule, MatToolbarModule, MatMenuModule } from '@angular/material';
import { MatRadioModule } from '@angular/material/radio';
import { MatRippleModule, MatNativeDateModule } from '@angular/material/core';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { GoogleChartsModule } from 'angular-google-charts';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RecaptchaV3Module, RECAPTCHA_V3_SITE_KEY } from 'ng-recaptcha';
import {MatTreeModule} from '@angular/material/tree';
import { RichTextEditorAllModule } from '@syncfusion/ej2-angular-richtexteditor';
import { IntlModule } from '@progress/kendo-angular-intl';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs'; 
import { ModifyView } from './modify-view';
import {MatDividerModule} from '@angular/material/divider';
import { IgxCalendarModule } from 'igniteui-angular';
@NgModule({
  declarations: [],
  imports: [ 
    IntlModule,
    IgxCalendarModule,
    DateInputsModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (http: HttpClient) => {
          return new TranslateHttpLoader(http);
        },
        deps: [HttpClient]
      }
    })
  ],
  exports:[
    CommonModule,
    MatFormFieldModule,
    FlexLayoutModule,
    FormsModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatCheckboxModule,
    MatDialogModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatButtonToggleModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatMenuModule,
    MatPaginatorModule,
    MatExpansionModule,
    MatRadioModule,
    MatDatepickerModule,
    MatSnackBarModule,
    MatCardModule,
    MatGridListModule,
    MatChipsModule,
    MatRippleModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    DragDropModule,
    MatTabsModule,
    MatTooltipModule,
    GoogleChartsModule,
    CalendarModule,
    TranslateModule,
    RecaptchaV3Module,
    MatTreeModule,
    MatProgressBarModule,
    RichTextEditorAllModule,
    MatNativeDateModule,
    IntlModule,
    DateInputsModule ,
    MatDividerModule,
    IgxCalendarModule
  ],
  providers: [
    MatDatepickerModule,
    { provide: LOCALE_ID, useValue: 'es-PE' },
    { provide: RECAPTCHA_V3_SITE_KEY, useValue: '6LdnZfQUAAAAABHNsIT_frEchEXZuTyrF2fIRyRk' }],
})
export class CompartidoModule { }
