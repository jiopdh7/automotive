import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private sCompanyUserGet = 'CompanyUserGet';
  private sCompanyUserModify = 'CompanyUserModify';
  constructor(
    private cHttpClient: HttpClient,
    public cConfigService: ConfigService
  ) { }

  ObtenerUsuarios(oDataSend) {
    let urlRequest = this.cConfigService.onObtenerBaseUrlAdministracion(this.sCompanyUserGet) + '?' + this.cConfigService.onObtenerParametrosGet(oDataSend);
    return this.cHttpClient.get<any>(urlRequest);
  }

  CompanyUserModify(oDataSend){
    let urlRequest =  this.cConfigService.onObtenerBaseUrlAdministracion(this.sCompanyUserModify);
    return this.cHttpClient.post<any>(urlRequest,oDataSend);
  }
}
