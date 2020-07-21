import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../config.service';
import { Observable } from 'rxjs';
import { RespuestaModel } from 'src/app/models/respuesta.model';

@Injectable({
  providedIn: 'root'
})
export class CorreoService {
  private sServicio = 'Correo';
  constructor(
    private cHttpClient: HttpClient,
    private cConfigService: ConfigService
  ) { }

  onCorreo(oData): Observable<any> {
    let urlRequest = this.cConfigService.onObtenerBaseUrlServicios(this.sServicio);
    return this.cHttpClient.post(urlRequest, oData);
  }

  onValidarCorreo(oData) {
    let urlRequest = this.cConfigService.onObtenerBaseUrlServicios(this.sServicio) + '?' +this.cConfigService.onObtenerParametrosGet(oData);
    return this.cHttpClient.get<RespuestaModel>(urlRequest);
  }
}
