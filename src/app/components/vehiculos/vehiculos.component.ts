import { Component, OnInit } from '@angular/core';
import { VehiculoService } from 'src/app/services/vehiculo/vehiculo.service';
import { VehiculoModel } from 'src/app/models/vehiculo.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vehiculos',
  templateUrl: './vehiculos.component.html',
  styleUrls: ['./vehiculos.component.css']
})
export class VehiculosComponent implements OnInit {
  aVehiculos: VehiculoModel[] = [];
  nHiloAux = 0;
  nHiloGeneral = 1;
  progress: boolean =false;
  constructor(private cVehiculoService: VehiculoService, private cRouter: Router) { }

  ngOnInit() {
    //this.onListarVehiculo();
  }
  onListarVehiculo() {
    this.progress =true;
    let oDataSend = {
      p_i_usuario: localStorage.getItem("p_i_usuario")
    };
    this.cVehiculoService.onObtenerVehiculos(oDataSend).subscribe((aVehiculos) => {
      this.aVehiculos = aVehiculos;
    }, (oErr) => {

    }, () => {
      this.nHiloAux++; 
      this.onCallbackCompleteHilo();
    })
  }
  onCallbackCompleteHilo() {
    if (this.nHiloAux === this.nHiloGeneral) { 
      this.progress =false;
    }

  }
  onGoConsultar(oVehiculo: VehiculoModel){
    localStorage.setItem("c_Placa", oVehiculo.p_c_placa); 
    this.cRouter.navigate(["/consultar"]);
  }
  onGoAgendar(oVehiculo: VehiculoModel):void{    
    localStorage.setItem("c_Placa", oVehiculo.p_c_placa);
    this.cRouter.navigateByUrl('/agendar/' + oVehiculo.p_c_placa);
  }

}
