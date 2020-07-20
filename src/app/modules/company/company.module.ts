import { NgModule } from '@angular/core'; 
import { InitComponent } from './init/init.component';
import { ConfigCalendarComponent } from './config-calendar/config-calendar.component';
import { ConfigServicesComponent } from './config-services/config-services.component';
import { WelcomeMessageComponent } from './welcome-message/welcome-message.component';
import { CompanyRoutingModule } from './company-routing.module';
import { CompartidoModule } from 'src/app/compartido/compartido.module'; 
import { ConfigServiceModifyComponent } from './config-services/modify/config-service-modify/config-service-modify.component';
import { ConfigMileagesModifyComponent } from './config-services/modify/config-mileages-modify/config-mileages-modify.component';
import { DeleteAgendaComponent } from './config-calendar/confirm/delete-agenda/delete-agenda.component'; 



@NgModule({
  declarations: [InitComponent, ConfigCalendarComponent, ConfigServicesComponent, WelcomeMessageComponent, ConfigMileagesModifyComponent, ConfigServiceModifyComponent, DeleteAgendaComponent],
  imports: [
    CompanyRoutingModule,
    CompartidoModule
  ],
  entryComponents:[ConfigServiceModifyComponent,ConfigMileagesModifyComponent,DeleteAgendaComponent]
})
export class CompanyModule { }
