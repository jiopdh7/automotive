import { NgModule } from '@angular/core';
import { InitComponent } from './init/init.component';
import { CompartidoModule } from 'src/app/compartido/compartido.module';
import { CustomerRequestRoutingModule } from './customer-request-routing';
import { ApproveComponent } from './approve/approve.component';
import { RejectComponent } from './reject/reject.component';
import { DetalleComponent } from './detalle/detalle.component';



@NgModule({
  declarations: [InitComponent, ApproveComponent, RejectComponent, DetalleComponent],
  imports: [
    CustomerRequestRoutingModule,
    CompartidoModule
  ],
  entryComponents:[ ApproveComponent, RejectComponent,DetalleComponent]
})
export class CustomerRequestModule { }
