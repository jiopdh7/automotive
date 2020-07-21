import { AgendarHome2Component } from './../components/agendar-home2/agendar-home2.component';
import { ConsultarEditarComponent } from './../components/consultar-editar/consultar-editar.component';
import { ConsultarVerificarComponent } from './../components/consultar-verificar/consultar-verificar.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AgendarComponent } from './agendar/agendar.component';
import { AgendarHomeComponent } from '../components/agendar-home/agendar-home.component';
import { AgendarVerificarComponent } from '../components/agendar-verificar/agendar-verificar.component';
import { ConsultarComponent } from './consultar/consultar.component';
import { MsgFinalExitoComponent } from './../components/msg-final-exito/msg-final-exito.component';
import { MsgFinalCancelComponent } from './../components/msg-final-cancel/msg-final-cancel.component';
import { TerminosComponent } from '../components/terminos/terminos.component'; 
import { VehiculosComponent } from '../components/vehiculos/vehiculos.component';
import { InicioComponent } from './inicio/inicio.component';
import { RestaurarComponent } from './restaurar/restaurar.component';
import { AgendarClienteAlternoComponent } from '../components/agendar-cliente-alterno/agendar-cliente-alterno.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'agendar/:sPlaca/verificar',
    component: AgendarVerificarComponent
  }, 
  {
    path: 'terminos',
    component: TerminosComponent
  },
  {
    path: 'agendar/:sPlaca',
    component: AgendarComponent,
    children: [
      {
        path: '',
        component: AgendarHomeComponent
      }, {
        path: 'segundo',
        component: AgendarHome2Component
      },
      {
        path:"vehiculos",
        component: VehiculosComponent
      }
    ]
  },
  {
    path: 'inicio',
    component: InicioComponent,
    children: [

      {
        path:"",
        component: VehiculosComponent
      }
    ]
  },
  {
    path: 'consultar',
    component: ConsultarComponent,
    children: [
      {
        path: '',
        component: ConsultarVerificarComponent
      },
    ]
  },

  {
    path: 'restaurar',
    component: RestaurarComponent,
  },
  {
    path: 'editar/:sPlaca',
    component: ConsultarEditarComponent
  },
  {
    path: 'msg-cancelar',
    component: MsgFinalCancelComponent
  },
  {
    path: 'msg-exito',
    component: MsgFinalExitoComponent
  },{
    path: 'registrar/:sPlaca',
    component: AgendarClienteAlternoComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
