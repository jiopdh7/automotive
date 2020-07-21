import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from './config.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdviserService {
  private sCompanyAdviserGet = 'CompanyAdviserGet';
  constructor(
    private cHttpClient: HttpClient,
    private cConfigService: ConfigService
  ) { }

  onCompanyAdviserGet(oData): Observable<any> {
    let urlRequest = this.cConfigService.onObtenerBaseUrlServicios(this.sCompanyAdviserGet) + '?' + this.cConfigService.onObtenerParametrosGet(oData)
    return this.cHttpClient.get<any[]>(urlRequest);
  }
}
