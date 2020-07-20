  
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';  
import { InitComponent } from './init/init.component';
import { WorkshopModifyComponent } from './workshop-modify/workshop-modify.component';
import { ConfigServiceComponent } from './config-service/config-service.component';
import { ConfigCalendarComponent } from './config-calendar/config-calendar.component';
const routes: Routes = [
  {
    path:"",
    component: InitComponent
  }, 
  {
    path:"workshop-modify/:workshopId/:companyId/:acction",
    component: WorkshopModifyComponent
  }, 
  {
    path:"config-service/:workshopId/:companyId",
    component: ConfigServiceComponent
  }, 
  {
    path:"config-calendar/:workshopId/:companyId",
    component: ConfigCalendarComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkshopRoutingModule { }