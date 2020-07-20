import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class CustomerRequestService {
  private sCustomerRequestGet = 'CustomerRequestGet';
  private sCustomerRequestModify = 'CustomerRequestModify';
  private sGetFileToS3 = "getFileToS3";
  constructor(
    private cHttpClient: HttpClient,
    public cConfigService: ConfigService
  ) { }

  ObtenerSolicitudesClientes(oDataSend) {
    let urlRequest = this.cConfigService.onObtenerBaseUrlAdministracion(this.sCustomerRequestGet)+ '?' + this.cConfigService.onObtenerParametrosGet(oDataSend);
    return this.cHttpClient.get<any>(urlRequest);
  }

  ModificarSolicitudesClientes(oDataSend) {
    let urlRequest = this.cConfigService.onObtenerBaseUrlAdministracion(this.sCustomerRequestModify);
    return this.cHttpClient.post<any>(urlRequest, oDataSend);
  }
  ObtenerBase64S3(oDataSend) {
    let urlRequest = this.cConfigService.onObtenerBaseUrlSeguridad(this.sGetFileToS3)+ '?' + this.cConfigService.onObtenerParametrosGet(oDataSend);
    return this.cHttpClient.get<any>(urlRequest);
  }
}
