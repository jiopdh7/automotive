  
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router'; 
import { InitComponent } from './init/init.component';
import { MuereComponent } from './muere/muere.component';


const routes: Routes = [
  {
    path:"",
    component: InitComponent  
  },
  {
    path: "excel",
    component: MuereComponent
  } 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }