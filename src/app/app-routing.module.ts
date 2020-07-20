import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {
    path:"logon",
    //loadChildren: '../app/pages/logon/logon.module#LogonModule'
    loadChildren: () => import("../app/pages/logon/logon.module").then(m => m.LogonModule)
  },
  {
    path:"home",
    loadChildren: () => import("../app/pages/home/home.module").then(m => m.HomeModule)
  }, 
  {
    path:"",
    redirectTo:"logon/credential",
    pathMatch:"full"
  },
  {
    path:"**",
    redirectTo:"logon/credential",
    pathMatch:"full"
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
