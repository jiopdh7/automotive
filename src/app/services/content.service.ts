import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ContentService {
  private cService: string = 'content';
  private sOrganizationContentGet = 'OrganizationContentGet';
  private sOrganizationContentModify = 'OrganizationContentModify';
  private sContentByBrandByCompanyDelete = 'OrganizationContentDelete';
  constructor(
    private cHttpClient: HttpClient,
    public cConfigService: ConfigService
  ) {
  }

  ObtenerContenido(oDataSend) {
    let urlRequest = this.cConfigService.onObtenerBaseUrlAdministracion(this.sOrganizationContentGet) + '?' + this.cConfigService.onObtenerParametrosGet(oDataSend);
    return this.cHttpClient.get<any>(urlRequest);
  }

  ModificarContenido(oDataSend) {
    let urlRequest = this.cConfigService.onObtenerBaseUrlAdministracion(this.sOrganizationContentModify);
    return this.cHttpClient.post<any>(urlRequest, oDataSend);
  }

  BorrarContenido(oDataSend) {
    let urlRequest = this.cConfigService.onObtenerBaseUrlAdministracion(this.sContentByBrandByCompanyDelete);
    return this.cHttpClient.post<any>(urlRequest, oDataSend);
  }
}
