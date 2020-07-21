import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from './config.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  private sMasterCompanyGet = 'MasterCompanyGet';
  private sMileagesByCompanyGet = 'MileagesByCompanyGet';
  constructor(
    private cHttpClient: HttpClient,
    private cConfigService: ConfigService
  ) { }

  onMasterCompanyGet(oData): Observable<any> {
    let urlRequest = this.cConfigService.onObtenerBaseUrlServicios(this.sMasterCompanyGet) + '?' + this.cConfigService.onObtenerParametrosGet(oData)
    return this.cHttpClient.get<any[]>(urlRequest);
  }

  onMileagesByCompanyGet(oData): Observable<any> {
    let urlRequest = this.cConfigService.onObtenerBaseUrlServicios(this.sMileagesByCompanyGet) + '?' + this.cConfigService.onObtenerParametrosGet(oData)
    return this.cHttpClient.get<any[]>(urlRequest);
  }


}
