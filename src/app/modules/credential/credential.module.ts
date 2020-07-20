import { NgModule } from '@angular/core'; 
import { ResetorePasswordComponent } from './resetore-password/resetore-password.component';
import { CreatePasswordComponent } from './create-password/create-password.component';
import { TokenExpiredComponent } from './token-expired/token-expired.component';
import { InitComponent } from './init/init.component';
import { CredentialRoutingModule } from './credential-routing.module';
import { CompartidoModule } from 'src/app/compartido/compartido.module';
import { HttpClientModule } from '@angular/common/http';
import { SessionExpiredComponent } from './session-expired/session-expired.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ChangePasswordComponent } from './change-password/change-password.component';



@NgModule({
  declarations: [ResetPasswordComponent,ResetorePasswordComponent, CreatePasswordComponent, TokenExpiredComponent, InitComponent, SessionExpiredComponent],
  imports: [
    CredentialRoutingModule, 
    CompartidoModule
  ],
})
export class CredentialModule { }
