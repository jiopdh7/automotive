import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../config.service';
import { ConfiguracionModel } from 'src/app/models/configuracion.model';

@Injectable({
  providedIn: 'root'
})
export class ConfiguracionService {
  private sServicio = 'Configuracion';
  private sCustomersByCompanyPITGet = 'CustomersByCompanyPITGet';
  private sCustomersByCompanyPITModify = 'CustomersByCompanyPITModify';
  constructor(
    private cHttpClient: HttpClient,
    private cConfigService: ConfigService
  ) { }

  onObtenerTelefono(oData) {
    let urlRequest = this.cConfigService.onObtenerBaseUrlServicios(this.sServicio) + '?' +this.cConfigService.onObtenerParametrosGet(oData);
    return this.cHttpClient.get<ConfiguracionModel>(urlRequest);
  }
  CustomersByCompanyPITGet(oData){
    let urlRequest = this.cConfigService.onObtenerBaseUrlServicios(this.sCustomersByCompanyPITGet) + '?' +this.cConfigService.onObtenerParametrosGet(oData);
    return this.cHttpClient.get<any[]>(urlRequest);

  }
  CustomersByCompanyPITModify(oData){
    let urlRequest = this.cConfigService.onObtenerBaseUrlServicios(this.sCustomersByCompanyPITModify) 
    return this.cHttpClient.post<any>(urlRequest,oData);

  }
  

}
