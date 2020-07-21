import { NgModule, LOCALE_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { registerLocaleData } from '@angular/common';
import localePe from '@angular/common/locales/es-PE';
registerLocaleData(localePe, 'es-PE');
import { ReservaHomeComponent } from './reserva-home/reserva-home.component';
import { AgendarHomeComponent } from './agendar-home/agendar-home.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatMenuModule } from '@angular/material/menu';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatListModule } from '@angular/material/list';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSelectModule } from '@angular/material/select';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AgendarMireservaComponent } from './agendar-mireserva/agendar-mireserva.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { IgxCalendarModule } from 'igniteui-angular';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AgendarVerificarComponent } from './agendar-verificar/agendar-verificar.component';
import { MensajeDialogoComponent } from './mensaje-dialogo/mensaje-dialogo.component';
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { MsgFinalCancelComponent } from './msg-final-cancel/msg-final-cancel.component';
import { MsgFinalExitoComponent } from './msg-final-exito/msg-final-exito.component';
import { ConsultarVerificarComponent } from './consultar-verificar/consultar-verificar.component';
import { ConsultarEditarComponent } from './consultar-editar/consultar-editar.component';
import { MensajeDialogoOkComponent } from './mensaje-dialogo-ok/mensaje-dialogo-ok.component';
import {PopoverModule} from "ngx-smart-popover";
import {MatDialogModule} from '@angular/material/dialog';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';

/*TRANSLATE*/
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateHttpLoader} from '@ngx-translate/http-loader';
import { AgendarHome2Component } from './agendar-home2/agendar-home2.component';
import { TerminosComponent } from './terminos/terminos.component';
import { VehiculosComponent } from './vehiculos/vehiculos.component';
import { MensajeDialogoFlujoclienteAlternoComponent } from './mensaje-dialogo-flujocliente-alterno/mensaje-dialogo-flujocliente-alterno.component';
import { AgendarClienteAlternoComponent } from './agendar-cliente-alterno/agendar-cliente-alterno.component';
import { MsgAlertComponent } from './msg-alert/msg-alert.component';



@NgModule({
  declarations: [ReservaHomeComponent,
    AgendarHomeComponent,
    AgendarMireservaComponent,
    AgendarVerificarComponent,
    MensajeDialogoComponent,
    MsgFinalCancelComponent,
    MsgFinalExitoComponent,
    ConsultarVerificarComponent,
    ConsultarEditarComponent,
    MensajeDialogoOkComponent,
    AgendarHome2Component,
    TerminosComponent,
    VehiculosComponent,
    MensajeDialogoFlujoclienteAlternoComponent,
    AgendarClienteAlternoComponent,
    MsgAlertComponent],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatSidenavModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
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
    MatDatepickerModule,
    MatNativeDateModule,
    IgxCalendarModule,
    MatCheckboxModule,
    MatGridListModule,
    HttpClientModule,
    PopoverModule,
    MatDialogModule,
    MatExpansionModule,
    MatSlideToggleModule,
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
  providers: [{ provide: LOCALE_ID, useValue: 'es-PE' }, { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { hasBackdrop: true } }],
  exports: [AgendarMireservaComponent],
  entryComponents: [MensajeDialogoComponent, MensajeDialogoOkComponent,MensajeDialogoFlujoclienteAlternoComponent,MsgAlertComponent]
})
export class ComponentsModule { }
