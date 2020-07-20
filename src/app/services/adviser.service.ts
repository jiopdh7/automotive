import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class AdviserService {
  private sCompanyAdviserGet = 'CompanyAdviserGet';  
  private sCompanyAdviserModify = 'CompanyAdviserModify';  
  private sCompanyServicesAdviserGet = 'ServicesByWorkshopByBrandByAdviserGet'; 
  private sServicesByCompanyAdviserModify = 'ServicesByCompanyAdviserModify';
  private sSendEmailOnDemand = 'SendEmailOnDemand';  
  asesorModel; 
  constructor(
    private cHttpClient: HttpClient,
    public cConfigService: ConfigService
  ) { }
  ObtenerAsesores(oDataSend) {
    let urlRequest = this.cConfigService.onObtenerBaseUrlAdministracion(this.sCompanyAdviserGet) + '?' + this.cConfigService.onObtenerParametrosGet(oDataSend); 
    return this.cHttpClient.get<any>(urlRequest);
  }
  CompanyAdviserModify(oDataSend){
    let urlRequest =  this.cConfigService.onObtenerBaseUrlAdministracion(this.sCompanyAdviserModify);
    return this.cHttpClient.post<any>(urlRequest,oDataSend);
  }
  ObtenerServiciosxAsesores(oDataSend) {
    let urlRequest = this.cConfigService.onObtenerBaseUrlAdministracion(this.sCompanyServicesAdviserGet) + '?' + this.cConfigService.onObtenerParametrosGet(oDataSend);
    return this.cHttpClient.get<any>(urlRequest);
  }
  CompanyAdviserServiceModify(oDataSend){
    let urlRequest =  this.cConfigService.onObtenerBaseUrlAdministracion(this.sServicesByCompanyAdviserModify);
    return this.cHttpClient.post<any>(urlRequest,oDataSend);
  }
  SendEmailOnDemand(oDataSend){
    let urlRequest =  this.cConfigService.onObtenerBaseUrlAdministracion(this.sSendEmailOnDemand);
    return this.cHttpClient.post<any>(urlRequest,oDataSend);
  }
}
