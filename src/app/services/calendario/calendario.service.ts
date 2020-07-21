import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../config.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CalendarioService {
  private sAgendaGet = 'AgendaLockedGet';
  private sSchedulesByCompanyAdviserGetFirstDate = 'SchedulesByCompanyAdviserGetFirstDate';
  private sSchedulesByCompanyAdviserGet = 'SchedulesByCompanyAdviserGet';

  constructor(
    private cHttpClient: HttpClient,
    private cConfigService: ConfigService
  ) { }

  onObtenerCalendario(oData): Observable<any> {
    let urlRequest = this.cConfigService.onObtenerBaseUrlServicios(this.sAgendaGet) + '?' +this.cConfigService.onObtenerParametrosGet(oData)
    return this.cHttpClient.get<any[]>(urlRequest);
  }

  ObtenerPrimerDiaDisponible(oData): Observable<any> {
    let urlRequest = this.cConfigService.onObtenerBaseUrlServicios(this.sSchedulesByCompanyAdviserGetFirstDate) + '?' +this.cConfigService.onObtenerParametrosGet(oData)
    return this.cHttpClient.get<any[]>(urlRequest);
  }
  ObtenerHorario(oData): Observable<any> {
    let urlRequest = this.cConfigService.onObtenerBaseUrlServicios(this.sSchedulesByCompanyAdviserGet) + '?' +this.cConfigService.onObtenerParametrosGet(oData)
    return this.cHttpClient.get<any[]>(urlRequest);
  }
}
