import { NgModule } from '@angular/core';  
import { BrandRoutingModule } from './brand-routing.module';
import { InitComponent } from './init/init.component'; 
import { CompartidoModule } from 'src/app/compartido/compartido.module';
import { WelcomeMessageComponent } from './welcome-message/welcome-message.component';
import { ConfigServicesComponent } from './config-services/config-services.component';
import { ConfigServiceModifyComponent } from './config-services/modify/config-service-modify/config-service-modify.component'; 
import { ConfigMileagesModifyComponent } from './config-services/modify/config-mileages-modify/config-mileages-modify.component';
import { ConfigCalendarComponent } from './config-calendar/config-calendar.component'; 



@NgModule({
  declarations: [ InitComponent, WelcomeMessageComponent, ConfigServicesComponent, ConfigServiceModifyComponent, ConfigMileagesModifyComponent, ConfigCalendarComponent],
  imports: [
    BrandRoutingModule,
    CompartidoModule
  ],
  entryComponents:[ConfigServiceModifyComponent,ConfigMileagesModifyComponent]
})
export class BrandModule {
  
}
