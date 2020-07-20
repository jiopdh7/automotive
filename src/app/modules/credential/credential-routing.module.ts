
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InitComponent } from './init/init.component';
import { SessionExpiredComponent } from './session-expired/session-expired.component';
import { CreatePasswordComponent } from './create-password/create-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';


const routes: Routes = [
  {
    path:"",
    component: InitComponent
  },
  {
    path:"expired",
    component: SessionExpiredComponent
  },
  {
    path:"create-password/:sToken/:sCompanyId",
    component: CreatePasswordComponent
  },
  {
    path:"reset-password",
    component: ResetPasswordComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CredentialRoutingModule { }
