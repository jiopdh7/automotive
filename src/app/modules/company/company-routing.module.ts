  
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';  
import { InitComponent } from './init/init.component';
import { WelcomeMessageComponent } from './welcome-message/welcome-message.component';
import { ConfigServicesComponent } from './config-services/config-services.component';
import { ConfigCalendarComponent } from './config-calendar/config-calendar.component';


const routes: Routes = [
  {
    path:"",
    component: InitComponent
  },
  {
      path:"welcome-message/:CompanyId",
      component: WelcomeMessageComponent 
  },
  {
      path:"config-services/:CompanyId",
      component: ConfigServicesComponent
  },
  {
      path:"config-calendar/:CompanyId",
      component: ConfigCalendarComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompanyRoutingModule { }