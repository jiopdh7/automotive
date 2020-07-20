import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateComponent } from './create/create.component';
import { ModifyComponent } from './modify/modify.component';
import { VehiclesComponent } from './vehicles/vehicles.component';
import { InitComponent } from './init/init.component';
import { CustomerRoutingModule } from './customer-routing';
import { CompartidoModule } from 'src/app/compartido/compartido.module';



@NgModule({
  declarations: [CreateComponent, ModifyComponent, VehiclesComponent, InitComponent],
  imports: [
    CustomerRoutingModule,
    CompartidoModule
  ],
  entryComponents:[ModifyComponent,VehiclesComponent,CreateComponent]
})
export class CustomerModule { }
