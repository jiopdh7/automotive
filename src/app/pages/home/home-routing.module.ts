
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';


const routes: Routes = [
  {
    path: "",
    component: HomeComponent,
    children: [
      {
        path: "dashboard",
        loadChildren: () => import("../../modules/dashboard/dashboard.module").then(m => m.DashboardModule)
      },
      {
        path: "content",
        loadChildren: () => import("../../modules/content/content.module").then(m => m.ContentModule)
      },
      {
        path: "configuration",
        loadChildren: () => import("../../modules/configuration/configuration.module").then(m => m.ConfigurationModule)
      },
      {
        path: "brand",
        loadChildren: () => import("../../modules/brand/brand.module").then(m => m.BrandModule)
      },
      {
        path: "user",
        loadChildren: () => import("../../modules/user/user.module").then(m => m.UserModule)
      },
      {
        path: "workshop",
        loadChildren: () => import("../../modules/workshop/workshop.module").then(m => m.WorkshopModule)
      },
      {
        path: "customer",
        loadChildren: () => import("../../modules/customer/customer.module").then(m => m.CustomerModule)
      },
      {
        path: "adviser",
        loadChildren: () => import("../../modules/adviser/adviser.module").then(m => m.AdviserModule)
      },
      {
        path: "agenda",
        loadChildren: () => import("../../modules/agenda/agenda.module").then(m => m.AgendaModule)
      },
      {
        path: "customerrequest",
        loadChildren: () => import("../../modules/customer-request/customer-request.module").then(m => m.CustomerRequestModule)
      },
      {
        path: "company",
        loadChildren: () => import("../../modules/company/company.module").then(m => m.CompanyModule)
      },
      {
        path: "callcenter",
        loadChildren: () => import("../../modules/callcenter/callcenter.module").then(m => m.CallcenterModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
