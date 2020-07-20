import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InitComponent } from './init/init.component';
import { CallcenterRoutingModule } from './callcenter-routing.module';
import { CompartidoModule } from 'src/app/compartido/compartido.module';
import { MessageAlertComponent } from './message-alert/message-alert.component';
import { MessageTopesComponent } from './message-topes/message-topes.component';
import { MessageFlujoAlternoComponent } from './message-flujo-alterno/message-flujo-alterno.component';
import { ModifyComponent } from './modify/modify.component';
import { CreateComponent } from './create/create.component';
import { MessageAdvisersComponent } from './message-advisers/message-advisers.component';
import { MessageQuestionModifyComponent } from './message-question-modify/message-question-modify.component';

@NgModule({
  declarations: [InitComponent, MessageAlertComponent, MessageTopesComponent, MessageFlujoAlternoComponent,ModifyComponent, CreateComponent,MessageAdvisersComponent,MessageQuestionModifyComponent],

  imports: [
    CallcenterRoutingModule,
    CompartidoModule
  ],
  entryComponents:[ 
    MessageTopesComponent,
    MessageAlertComponent,
    MessageFlujoAlternoComponent,
    ModifyComponent,
    MessageAdvisersComponent,
    CreateComponent ,
    MessageQuestionModifyComponent
  ]
  

})
export class CallcenterModule { }
