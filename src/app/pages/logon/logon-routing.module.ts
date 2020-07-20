import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router'; 
import { LogonComponent } from './logon.component';


const routes: Routes = [
  {
    path:"", 
    component: LogonComponent,
    children: [
      {
        path:"credential",
        loadChildren: () => import("../../modules/credential/credential.module").then(m => m.CredentialModule)
      }
    ]
  } 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LogonRoutingModule { }