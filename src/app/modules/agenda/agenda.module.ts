import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InitComponent } from './init/init.component';
import { AgendaRoutingModule } from './agenda-routing.module';
import { CompartidoModule } from 'src/app/compartido/compartido.module';



@NgModule({
  declarations: [InitComponent],
  imports: [
    CompartidoModule,
    AgendaRoutingModule
  ]
})
export class AgendaModule { }
