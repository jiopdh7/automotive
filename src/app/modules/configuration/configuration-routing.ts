  
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router'; 
import { InitComponent } from './init/init.component'; 
import { ModuleComponent } from './module/module.component';
import { ChannelComponent } from './channel/channel.component';
import { ConfigRoleComponent } from './config-role/config-role.component';
import { ConfigAgendaComponent } from './config-agenda/config-agenda.component';


const routes: Routes = [
  {
    path:"",
    component: InitComponent  
  },
  {
    path:"module",
    component:ModuleComponent
  },
  {
    path:"channel",
    component:ChannelComponent
  },
  {
    path:"role",
    component:ConfigRoleComponent
  },
  {
    path:"config-agenda",
    component:ConfigAgendaComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfigurationRoutingModule { }