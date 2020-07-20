import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InitComponent } from './init/init.component';
import { ConfigurationRoutingModule } from './configuration-routing';
import { CompartidoModule } from 'src/app/compartido/compartido.module';
import { ModuleComponent } from './module/module.component';
import { ModuleEditComponent } from './module/edit/module-edit/module-edit.component';
import { ChannelComponent } from './channel/channel.component';
import { ChannelModifyComponent } from './channel/modify/channel-modify/channel-modify.component';
import { SendScheduleComponent } from './send-schedule/send-schedule.component';
import { BlockDurationComponent } from './block-duration/block-duration.component';
import { ConfigRoleComponent } from './config-role/config-role.component';
import { RoleModifyComponent } from './config-role/modify/role-modify/role-modify.component';
import { ConfigAgendaComponent } from './config-agenda/config-agenda.component';
import { DeleteAgendaComponent } from './config-agenda/confirm/delete-agenda/delete-agenda.component'; 



@NgModule({
  declarations: [InitComponent, ModuleComponent, ModuleEditComponent, ChannelComponent, ChannelModifyComponent, SendScheduleComponent, BlockDurationComponent, ConfigRoleComponent, RoleModifyComponent, ConfigAgendaComponent, DeleteAgendaComponent ],
  imports: [
    ConfigurationRoutingModule,
    CompartidoModule
  ],
  entryComponents:[ModuleEditComponent,ChannelModifyComponent,SendScheduleComponent,BlockDurationComponent,RoleModifyComponent,DeleteAgendaComponent]
})
export class ConfigurationModule { }
