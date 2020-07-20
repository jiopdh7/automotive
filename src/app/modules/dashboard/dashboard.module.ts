import { NgModule } from '@angular/core';  
import { DashboardRoutingModule } from './dashboard-routing.module';
import { CompartidoModule } from 'src/app/compartido/compartido.module';
import { InitComponent } from './init/init.component';
import { MuereComponent } from './muere/muere.component'; 



@NgModule({
  declarations: [ InitComponent, MuereComponent],
  imports: [   
    DashboardRoutingModule,
    CompartidoModule
  ]
})
export class DashboardModule { }
