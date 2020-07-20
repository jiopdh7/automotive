import { NgModule } from '@angular/core'; 
import { InitComponent } from './init/init.component';
import { WorkshopRoutingModule } from './workshop-routing.module';
import { CompartidoModule } from 'src/app/compartido/compartido.module';
import { WorkshopModifyComponent } from './workshop-modify/workshop-modify.component';
import { SendReportComponent } from './send-report/send-report.component';
import { ConfigServiceComponent } from './config-service/config-service.component';
import { ConfigCalendarComponent } from './config-calendar/config-calendar.component';
import { ModifyServicesStopComponent } from './config-service/modify/modify-services-stop/modify-services-stop.component';
import { DeleteAgendaComponent } from './config-calendar/confirm/delete-agenda/delete-agenda.component';
import { MessageAlertComponent } from './message-alert/message-alert.component';



@NgModule({
  declarations: [InitComponent, WorkshopModifyComponent, SendReportComponent, ConfigServiceComponent, ConfigCalendarComponent, ModifyServicesStopComponent, DeleteAgendaComponent, MessageAlertComponent],
  imports: [
    WorkshopRoutingModule,
    CompartidoModule
  ],
  entryComponents:[SendReportComponent,ModifyServicesStopComponent,DeleteAgendaComponent,MessageAlertComponent]
})
export class WorkshopModule { }
