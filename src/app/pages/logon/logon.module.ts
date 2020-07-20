import { NgModule } from '@angular/core';  
import { LogonRoutingModule } from './logon-routing.module';
import { LogonComponent } from './logon.component'; 
import { CompartidoModule } from 'src/app/compartido/compartido.module';



@NgModule({
  declarations: [ LogonComponent],
  imports: [ 
    LogonRoutingModule,
    CompartidoModule
  ], 
})
export class LogonModule { }
