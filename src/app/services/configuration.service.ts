import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {
  private sOrganizationModuleGet: string = 'OrganizationModuleGet';
  private sCompanyModuleModify: string = 'CompanyModuleModify';
  private sOrganizationChannelGet: string = 'OrganizationChannelGet';
  private sOrganizationChannelModify: string = 'OrganizationChannelModify';
  private sOrganizationRoleGet: string = 'OrganizationRoleGet';
  private sMasterUserConfigurationGet: string = 'MasterUserConfigurationGet';
  private sMasterUserConfigurationModify: string = 'MasterUserConfigurationModify';
  private sCompanyModuleGet: string = 'CompanyModuleGet';
  private sOrganizationRolModify: string = 'OrganizationRolModify';
  private sAgendaModify: string = 'AgendaLockedModify';
  private sAgendaGet: string = 'AgendaLockedGet';
  private sAgendaDelete: string = 'AgendaLockedDelete';
  private sGeolocationGet = 'GeolocationGet';
  private sIdenticationTypeGet = 'IdenticationTypeGet';
  private sMasterCustomerGet = 'MasterCustomerGet';
  private sAgendaUserLogin = 'AgendaUserLogin';
  private sSchedulesByCompanyAdviserGet = 'SchedulesByCompanyAdviserGet';
  private sAgendaAppointmentDashboardGet = 'AgendaAppointmentDashboardGet';
  private sAgendaAppointmentModify = 'AgendaAppointmentModify';
  private sAppointmentStatusGet = 'AppointmentStatusGet';
  private sCancelAgendaAppointment = "CancelAgendaAppointment";
  private sAppointmentConfirmationDelivery = "AppointmentConfirmationDelivery";
  private sMasterJobConfigGet = "MasterJobConfigGet";
  private sMasterJobConfigModifyt = "MasterJobConfigModify";
  private sMasterTypeCustomerRequestGet = "MasterTypeCustomerRequestGet";
  private sMasterStatusCustomerRequestGet = "MasterStatusCustomerRequestGet";
  private sExternalInformationApi = "ExternalInformationApi";
  private sRegistroUsuario = 'AppUserRegistration';
  private sSchedulesByCompanyAdviserGetFirstDate= "SchedulesByCompanyAdviserGetFirstDate";
  constructor(
    private cHttpClient: HttpClient,
    private cConfigService: ConfigService
  ) {
  }
  AgendaModify(oDataSend){
    let urlRequest =  this.cConfigService.onObtenerBaseUrlAdministracion(this.sAgendaModify);
    return this.cHttpClient.post<any>(urlRequest,oDataSend);
  }
  AgendaGet(oDataSend){
    let urlRequest =  this.cConfigService.onObtenerBaseUrlAdministracion(this.sAgendaGet)+ '?' + this.cConfigService.onObtenerParametrosGet(oDataSend);
    return this.cHttpClient.get<any[]>(urlRequest);
  }
  AgendaDelete(oDataSend){
    let urlRequest =  this.cConfigService.onObtenerBaseUrlAdministracion(this.sAgendaDelete)+ '?' + this.cConfigService.onObtenerParametrosGet(oDataSend);
    return this.cHttpClient.delete<any>(urlRequest);
  }
  CompanyRolModify(oDataSend){
    let urlRequest =  this.cConfigService.onObtenerBaseUrlAdministracion(this.sOrganizationRolModify);
    return this.cHttpClient.post<any>(urlRequest,oDataSend);
  }
  ModulesByCompanyUserGet(oDataSend){
    let urlRequest =  this.cConfigService.onObtenerBaseUrlAdministracion(this.sOrganizationModuleGet)+ '?' + this.cConfigService.onObtenerParametrosGet(oDataSend);
    return this.cHttpClient.get<any[]>(urlRequest);
  }
  CompanyModuleModify(oDataSend){
    let urlRequest =  this.cConfigService.onObtenerBaseUrlAdministracion(this.sCompanyModuleModify);
    return this.cHttpClient.post<any>(urlRequest,oDataSend);
  }
  ChannelsByCompanyGet(oDataSend){
    let urlRequest =  this.cConfigService.onObtenerBaseUrlAdministracion(this.sOrganizationChannelGet)+ '?' + this.cConfigService.onObtenerParametrosGet(oDataSend);
    return this.cHttpClient.get<any[]>(urlRequest);
  }
  ChannelsByCompanyModify(oDataSend){
    let urlRequest =  this.cConfigService.onObtenerBaseUrlAdministracion(this.sOrganizationChannelModify);
    return this.cHttpClient.post<any>(urlRequest,oDataSend);
  }
  CompanyModuleGet(oDataSend){
    let urlRequest =  this.cConfigService.onObtenerBaseUrlAdministracion(this.sCompanyModuleGet)+ '?' + this.cConfigService.onObtenerParametrosGet(oDataSend);
    return this.cHttpClient.get<any[]>(urlRequest);
  }
  CompanyRoleGet(oDataSend){
    let urlRequest =  this.cConfigService.onObtenerBaseUrlAdministracion(this.sOrganizationRoleGet)+ '?' + this.cConfigService.onObtenerParametrosGet(oDataSend);
    return this.cHttpClient.get<any[]>(urlRequest);
  }
  CompanyConfigurationGet(oDataSend){
    let urlRequest =  this.cConfigService.onObtenerBaseUrlAdministracion(this.sMasterUserConfigurationGet)+ '?' + this.cConfigService.onObtenerParametrosGet(oDataSend);
    return this.cHttpClient.get<any[]>(urlRequest);
  }
  CompanyConfigurationModify(oDataSend){
    let urlRequest =  this.cConfigService.onObtenerBaseUrlAdministracion(this.sMasterUserConfigurationModify);
    return this.cHttpClient.post<any>(urlRequest,oDataSend);
  }
  onGeolocationGet(oData): Observable<any> {
    let urlRequest = this.cConfigService.onObtenerBaseUrlAdministracion(this.sGeolocationGet) + '?' + this.cConfigService.onObtenerParametrosGet(oData)
    return this.cHttpClient.get<any[]>(urlRequest);
  }
  obtenerDocumentos(): Observable<any> {
    let urlRequest = this.cConfigService.onObtenerBaseUrlAdministracion(this.sIdenticationTypeGet)
    return this.cHttpClient.get<any[]>(urlRequest);
  }
  obtenerClienteBackend(oData): Observable<any> {
    let urlRequest = this.cConfigService.onObtenerBaseUrlAdministracion(this.sMasterCustomerGet) + '?' + this.cConfigService.onObtenerParametrosGet(oData)
    return this.cHttpClient.get<any[]>(urlRequest);
  }  
  obtenerSesionPlaca(oData): Observable<any> {
    let urlRequest = this.cConfigService.onObtenerBaseUrlSeguridad(this.sAgendaUserLogin);
    return this.cHttpClient.post<any>(urlRequest,oData);
  }
  ObtenerHorario(oData): Observable<any> {
    let urlRequest = this.cConfigService.onObtenerBaseUrlAdministracion(this.sSchedulesByCompanyAdviserGet) + '?' +this.cConfigService.onObtenerParametrosGet(oData)
    return this.cHttpClient.get<any[]>(urlRequest);
  }
  
  AgendaAppointmentDashboardGet(oData): Observable<any> {
    let urlRequest = this.cConfigService.onObtenerBaseUrlAdministracion(this.sAgendaAppointmentDashboardGet) + '?' +this.cConfigService.onObtenerParametrosGet(oData)
    return this.cHttpClient.get<any[]>(urlRequest);
  }
  AgendaAppointmentModify(oData): Observable<any> {
    let urlRequest = this.cConfigService.onObtenerBaseUrlAdministracion(this.sAgendaAppointmentModify);
    return this.cHttpClient.post<any>(urlRequest,oData);
  }
  AppointmentStatusGet(): Observable<any> {
    let urlRequest = this.cConfigService.onObtenerBaseUrlAdministracion(this.sAppointmentStatusGet) 
    return this.cHttpClient.get<any[]>(urlRequest); 
  }
  anularReservas(oData): Observable<any> {
    let urlRequest = this.cConfigService.onObtenerBaseUrlAdministracion(this.sCancelAgendaAppointment) + '?' +this.cConfigService.onObtenerParametrosGet(oData)
    return this.cHttpClient.post<any[]>(urlRequest, oData);
  }
  enviarCorreo(oData): Observable<any> {
    let urlRequest = this.cConfigService.onObtenerBaseUrlAdministracion(this.sAppointmentConfirmationDelivery) + '?' +this.cConfigService.onObtenerParametrosGet(oData)
    return this.cHttpClient.post<any[]>(urlRequest, oData);
  }
  ObtenerPrimerDiaDisponible(oData): Observable<any> {
    let urlRequest = this.cConfigService.onObtenerBaseUrlAdministracion(this.sSchedulesByCompanyAdviserGetFirstDate) + '?' +this.cConfigService.onObtenerParametrosGet(oData)
    return this.cHttpClient.get<any[]>(urlRequest);
  }
  obtenerConfiguracion(oData): Observable<any> {
    let urlRequest = this.cConfigService.onObtenerBaseUrlAdministracion(this.sMasterJobConfigGet) + '?' +this.cConfigService.onObtenerParametrosGet(oData)
    return this.cHttpClient.get<any[]>(urlRequest); 
  }
  onCrearConfiguracion(oData): Observable<any> {
    let urlRequest = this.cConfigService.onObtenerBaseUrlAdministracion(this.sMasterJobConfigModifyt)
    return this.cHttpClient.post<any[]>(urlRequest, oData);
  }
  obtenerTiposSolicitudes(): Observable<any> {
    let urlRequest = this.cConfigService.onObtenerBaseUrlAdministracion(this.sMasterTypeCustomerRequestGet)
    return this.cHttpClient.get<any[]>(urlRequest); 
  }
  obtenerEstadosSolicitudes(): Observable<any> {
    let urlRequest = this.cConfigService.onObtenerBaseUrlAdministracion(this.sMasterStatusCustomerRequestGet)
    return this.cHttpClient.get<any[]>(urlRequest); 
  }
  obtenerInfoCliente(oData): Observable<any> {
    let urlRequest = this.cConfigService.onObtenerBaseUrlSeguridad(this.sExternalInformationApi)+ '?' +this.cConfigService.onObtenerParametrosGet(oData)
    return this.cHttpClient.get<any[]>(urlRequest); 
  }
  getIPAddress()  
  {  
    return this.cHttpClient.get("https://cors-anywhere.herokuapp.com/https://api.ipify.org/?format=json");  
  }  
  registrarUsuario(oData): Observable<any> {
    let urlRequest = this.cConfigService.onObtenerBaseUrlSeguridad(this.sRegistroUsuario);
    return this.cHttpClient.post<any>(urlRequest,oData);
  }
}
