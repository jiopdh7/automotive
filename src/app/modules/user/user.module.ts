import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InitComponent } from './init/init.component';
import { UserRoutingModule } from './user-routing';
import { CompartidoModule } from 'src/app/compartido/compartido.module';
import { ModifyComponent } from './modify/modify.component';
import { DeleteComponent } from './delete/delete.component';
import { CreateComponent } from './create/create.component';



@NgModule({
  declarations: [InitComponent, ModifyComponent, DeleteComponent, CreateComponent],
  imports: [
    UserRoutingModule,
    CompartidoModule
  ],
  entryComponents:[ModifyComponent,DeleteComponent,CreateComponent]
})
export class UserModule { }
