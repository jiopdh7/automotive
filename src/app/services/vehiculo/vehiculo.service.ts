import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../config.service';
import { Observable } from 'rxjs';
import { VehiculoModel } from 'src/app/models/vehiculo.model';

@Injectable({
  providedIn: 'root'
})
export class VehiculoService {
  private sServicio = 'Vehiculos';
  constructor(
    private cHttpClient: HttpClient,
    private cConfigService: ConfigService
  ) { }
  onObtenerVehiculos(oData): Observable<VehiculoModel[]> {  
    let urlRequest = this.cConfigService.onObtenerBaseUrlServicios(this.sServicio) + '?' +this.cConfigService.onObtenerParametrosGet(oData);
    return this.cHttpClient.get<VehiculoModel[]>(urlRequest);
  }
}
