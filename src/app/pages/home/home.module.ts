import { NgModule } from '@angular/core'; 
import { HomeComponent } from './home.component';
import { CompartidoModule } from 'src/app/compartido/compartido.module';
import { HomeRoutingModule } from './home-routing.module'; 
import { ChangePasswordComponent } from 'src/app/modules/credential/change-password/change-password.component';



@NgModule({
  declarations: [HomeComponent,ChangePasswordComponent],
  imports: [
    HomeRoutingModule,
    CompartidoModule 
  ],
  entryComponents:[ChangePasswordComponent]
})
export class HomeModule { }
