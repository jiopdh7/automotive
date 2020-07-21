import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../config.service';
import { Observable } from 'rxjs';
import { ReservaModel } from 'src/app/models/reserva.model';
import { ClienteModel } from 'src/app/models/cliente.model';
import { RespuestaModel } from 'src/app/models/respuesta.model';

@Injectable({
  providedIn: 'root'
})
export class SesionService {
  reservaEditar;
  private sServicio = 'LoginUser';
  private sLoginFlujoAlterno = 'loginFlujoAlterno';
  private sSesionPlaca = 'Cliente';
  private sPassword = 'resetPassword'
  private sIdenticationTypeGet = 'IdenticationTypeGet';
  private sAgendaUserLogin = 'AgendaUserLogin';
  private sGeolocationGet = 'GeolocationGet';
  private sRegistroUsuario = 'AppUserRegistration';
  private sMasterSessionDelete = 'MasterSessionDelete';
  constructor(
    private cHttpClient: HttpClient,
    private cConfigService: ConfigService
  ) { }

  onGenerarSesion(oData): Observable<any> {
    let urlRequest = this.cConfigService.onOtenerBaseUrlSeguridad(this.sServicio);
    return this.cHttpClient.post<any>(urlRequest, oData);
  }

  obtenerSesionPlaca(oData): Observable<any> {
    let urlRequest = this.cConfigService.onOtenerBaseUrlSeguridad(this.sAgendaUserLogin);
    return this.cHttpClient.post<any>(urlRequest,oData);
  }

  obtenerSesionClienteAlterno(oData): Observable<any> {
    let urlRequest = this.cConfigService.onOtenerBaseUrlSeguridad(this.sLoginFlujoAlterno);
    return this.cHttpClient.post<any>(urlRequest,oData);
  }

  obtenerDatosUsuario(oData): Observable<any> {
    let urlRequest = this.cConfigService.onObtenerBaseUrlServicios(this.sSesionPlaca);
    return this.cHttpClient.post<any>(urlRequest,oData);
  }

  onRestaurarContrasena(c_correo){
    let urlRequest = this.cConfigService.onOtenerBaseUrlSeguridad(this.sPassword);
    return this.cHttpClient.post<any>(urlRequest, { "c_clave": "","c_usuario": c_correo,"c_flag_temp":"" });
  }
  getIPAddress()  
  {  
    return this.cHttpClient.get("https://cors-anywhere.herokuapp.com/https://api.ipify.org/?format=json");  
  }  
  getReniec(dni)  
  {  
    let urlRequest = "https://cors-anywhere.herokuapp.com/https://api.reniec.cloud/dni/" + dni;
    return this.cHttpClient.get(urlRequest);  
  }  
  obtenerDocumentos(): Observable<any> {
    let urlRequest = this.cConfigService.onOtenerBaseUrlSeguridad(this.sIdenticationTypeGet)
    return this.cHttpClient.get<any[]>(urlRequest);
  }
  onGeolocationGet(oData): Observable<any> {
    let urlRequest = this.cConfigService.onOtenerBaseUrlSeguridad(this.sGeolocationGet) + '?' + this.cConfigService.onObtenerParametrosGet(oData)
    return this.cHttpClient.get<any[]>(urlRequest);
  }
  registrarUsuario(oData): Observable<any> {
    let urlRequest = this.cConfigService.onOtenerBaseUrlSeguridad(this.sRegistroUsuario);
    return this.cHttpClient.post<any>(urlRequest,oData);
  }
  onCerrarSesion(oData):Observable<any> {
    let urlRequest = this.cConfigService.onOtenerBaseUrlSeguridad(this.sMasterSessionDelete)+ '?' + this.cConfigService.onObtenerParametrosGet(oData);
    return this.cHttpClient.delete<any>(urlRequest);
  }
}
