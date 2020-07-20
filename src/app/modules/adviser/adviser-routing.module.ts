  
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';  
import { InitComponent } from './init/init.component';
import { ConfigServicesComponent } from './config-services/config-services.component'; 
import { ConfigCalendarComponent } from './config-calendar/config-calendar.component';
const routes: Routes = [
  {
    path:"",
    component: InitComponent
  },  
  {
      path:"config-services/:companyId/:companyAdviserId",
      component: ConfigServicesComponent
  },  
  {
      path:"config-calendar/:companyId/:companyAdviserId",
      component: ConfigCalendarComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdviserRoutingModule { }