import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigService } from './config.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private sGeolocationGet = 'GeolocationGet';
  private sIdenticationTypeGet = 'IdenticationTypeGet';
  private sMasterCustomerGet = 'MasterCustomerGet';
  constructor(
    private cHttpClient: HttpClient,
    private cConfigService: ConfigService
  ) { }

  onGeolocationGet(oData): Observable<any> {
    let urlRequest = this.cConfigService.onObtenerBaseUrlServicios(this.sGeolocationGet) + '?' + this.cConfigService.onObtenerParametrosGet(oData)
    return this.cHttpClient.get<any[]>(urlRequest);
  }

  obtenerDocumentos(): Observable<any> {
    let urlRequest = this.cConfigService.onObtenerBaseUrlServicios(this.sIdenticationTypeGet)
    return this.cHttpClient.get<any[]>(urlRequest);
  }

  obtenerClienteBackend(oData): Observable<any> {
    let urlRequest = this.cConfigService.onObtenerBaseUrlServicios(this.sMasterCustomerGet) + '?' + this.cConfigService.onObtenerParametrosGet(oData)
    return this.cHttpClient.get<any[]>(urlRequest);
  }
}
