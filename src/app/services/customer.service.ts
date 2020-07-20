import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private sCustomerGet = 'MasterCustomerGet';
  private sCustomerModify = 'MasterCustomerModify';
  private sVehiclesByCustomerGet = 'VehiclesByCustomerGet';
  private sAppUserModify = 'AppUserModify';
  private sCustomerPassword = 'CustomerPassword';
  constructor(
    private cHttpClient: HttpClient,
    public cConfigService: ConfigService
  ) { }

  ObtenerClientes(oDataSend) {
    let urlRequest = this.cConfigService.onObtenerBaseUrlAdministracion(this.sCustomerGet) + '?' + this.cConfigService.onObtenerParametrosGet(oDataSend);
    return this.cHttpClient.get<any>(urlRequest);
  }

  ModificarClientes(oDataSend) {
    let urlRequest = this.cConfigService.onObtenerBaseUrlAdministracion(this.sCustomerModify);
    return this.cHttpClient.post<any>(urlRequest, oDataSend);
  }

  CrearUsuarioCliente(oDataSend) {
    let urlRequest = this.cConfigService.onObtenerBaseUrlAdministracion(this.sAppUserModify);
    return this.cHttpClient.post<any>(urlRequest, oDataSend);
  }

  ObtenerVehiculos(oDataSend) {
    let urlRequest = this.cConfigService.onObtenerBaseUrlAdministracion(this.sVehiclesByCustomerGet) + '?' + this.cConfigService.onObtenerParametrosGet(oDataSend);
    return this.cHttpClient.get<any>(urlRequest);
  }

  ModificarPasswordCliente(oDataSend) {
    let urlRequest = this.cConfigService.onObtenerBaseUrlAdministracion(this.sCustomerPassword);
    return this.cHttpClient.post<any>(urlRequest, oDataSend);
  }
}
