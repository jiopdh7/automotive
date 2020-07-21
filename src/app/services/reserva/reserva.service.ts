import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../config.service';
import { Observable } from 'rxjs';
import { ReservaModel } from 'src/app/models/reserva.model';

@Injectable({
  providedIn: 'root'
})
export class ReservaService {
  reservaEditar;
  private sServicio = 'Reserva';
  private sAgendaAppointmentDashboardGet = "AgendaAppointmentDashboardGet";
  private sAgendaAppointmentModify = "AgendaAppointmentModify";
  private sCancelAgendaAppointment = "CancelAgendaAppointment";
  private sAppointmentConfirmationDelivery = "AppointmentConfirmationDelivery";
  constructor(
    private cHttpClient: HttpClient,
    private cConfigService: ConfigService
  ) { }
  crearReserva(oData): Observable<any> {
    let urlRequest = this.cConfigService.onObtenerBaseUrlServicios(this.sAgendaAppointmentModify)
    return this.cHttpClient.post<ReservaModel[]>(urlRequest, oData);
  }
  obtenerReservas(oData): Observable<any> {
    let urlRequest = this.cConfigService.onObtenerBaseUrlServicios(this.sAgendaAppointmentDashboardGet) + '?' +this.cConfigService.onObtenerParametrosGet(oData)
    return this.cHttpClient.get<ReservaModel[]>(urlRequest);
  }
  onObtenerEstadoProteccionDatos(oData): Observable<any[]> {
    let urlRequest = this.cConfigService.onObtenerBaseUrlServicios(this.sServicio) + '?' +this.cConfigService.onObtenerParametrosGet(oData)
    return this.cHttpClient.get<any[]>(urlRequest);
  }
  anularReservas(oData): Observable<any> {
    let urlRequest = this.cConfigService.onObtenerBaseUrlServicios(this.sCancelAgendaAppointment) + '?' +this.cConfigService.onObtenerParametrosGet(oData)
    return this.cHttpClient.post<ReservaModel[]>(urlRequest, oData);
  }
  actulizarReserva(oData): Observable<any> {
    let urlRequest = this.cConfigService.onObtenerBaseUrlServicios(this.sServicio)
    return this.cHttpClient.put<any[]>(urlRequest, oData);
  }
  enviarCorreo(oData): Observable<any> {
    let urlRequest = this.cConfigService.onObtenerBaseUrlServicios(this.sAppointmentConfirmationDelivery) + '?' +this.cConfigService.onObtenerParametrosGet(oData)
    return this.cHttpClient.post<ReservaModel[]>(urlRequest, oData);
  }
}
