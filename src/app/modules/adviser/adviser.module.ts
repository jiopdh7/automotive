import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InitComponent } from './init/init.component';
import { AdviserRoutingModule } from './adviser-routing.module';
import { CompartidoModule } from 'src/app/compartido/compartido.module';
import { ConfigServicesComponent } from './config-services/config-services.component';
import { ConfigServiceModifyComponent } from './config-services/modify/config-service-modify/config-service-modify.component';
import { ConfigScheduleComponent } from './config-schedule/config-schedule.component';
import { ConfigCalendarComponent } from './config-calendar/config-calendar.component'; 
import { DeleteAgendaComponent } from './config-calendar/confirm/delete-agenda/delete-agenda.component';



@NgModule({
  declarations: [InitComponent, ConfigServicesComponent, ConfigServiceModifyComponent, ConfigScheduleComponent, ConfigCalendarComponent, DeleteAgendaComponent],
  imports: [
    CompartidoModule,
    AdviserRoutingModule
  ],
  entryComponents:[ConfigServiceModifyComponent,ConfigScheduleComponent,DeleteAgendaComponent]
})
export class AdviserModule { }
