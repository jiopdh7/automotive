import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WorkshopService {
  private sMasterWorkshopGet = 'MasterWorkshopGet';
  constructor(
    private cHttpClient: HttpClient,
    private cConfigService: ConfigService
  ) { }

  onMasterWorkshopGet(oData): Observable<any> {
    let urlRequest = this.cConfigService.onObtenerBaseUrlServicios(this.sMasterWorkshopGet) + '?' + this.cConfigService.onObtenerParametrosGet(oData)
    return this.cHttpClient.get<any[]>(urlRequest);
  }
}
