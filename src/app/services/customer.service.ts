import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private sMasterCustomerGet = 'MasterCustomerGet';
  constructor(
    private cHttpClient: HttpClient,
    private cConfigService: ConfigService
  ) { }

  onMasterCustomerGet(oData): Observable<any> {
    let urlRequest = this.cConfigService.onObtenerBaseUrlServicios(this.sMasterCustomerGet) + '?' + this.cConfigService.onObtenerParametrosGet(oData)
    return this.cHttpClient.get<any[]>(urlRequest);
  }
}
