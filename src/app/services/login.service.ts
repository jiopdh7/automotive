import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigService } from './config.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private sOrganizationUserLogin: string = 'OrganizationUserLogin';
  private sPasswordValidate: string = 'PasswordValidate';
  private sOrganizationUserLogout: string = 'OrganizationUserLogout';
  private sCompanyUserCheckTokenRestore: string = 'CompanyUserCheckTokenRestore';
  private sMasterPasswordModifyByToken: string = 'MasterPasswordModifyByToken';
  private sMasterPasswordModify:string = 'MasterPasswordModify';
  private sRestartPass:string = 'RestartPass';
  
  constructor(
    private cHttpClient: HttpClient,
    public cConfigService: ConfigService
  ) {
  }
  onLogin(oDataSend,c_token){
    let urlRequest =  this.cConfigService.onObtenerBaseUrlSeguridad(this.sOrganizationUserLogin);
    let headers = new HttpHeaders({
      'x-captchatoken': c_token
    });
    return this.cHttpClient.post<any>(urlRequest, oDataSend,{headers:headers});
  }

  onGenerarClave(postData) {
    return this.cHttpClient.post<any>(this.sPasswordValidate, postData);
  }
  onLogout(postData) {
    let urlRequest =  this.cConfigService.onObtenerBaseUrlSeguridad(this.sOrganizationUserLogout);
    return this.cHttpClient.post<any>(urlRequest, postData);
  }
  onValidateToken(postData){
    let urlRequest =  this.cConfigService.onObtenerBaseUrlSeguridad(this.sCompanyUserCheckTokenRestore);
    return this.cHttpClient.post<any>(urlRequest, postData);
  }
  onChangePassowrd(postData){
    let urlRequest =  this.cConfigService.onObtenerBaseUrlSeguridad(this.sMasterPasswordModifyByToken);
    return this.cHttpClient.post<any>(urlRequest, postData);
  }
  MasterPasswordModify(postData){
    let urlRequest =  this.cConfigService.onObtenerBaseUrlSeguridad(this.sMasterPasswordModify);
    return this.cHttpClient.post<any>(urlRequest, postData);
  }
  onRestaurarContraseña(postData){
    let urlRequest = this.cConfigService.onObtenerBaseUrlSeguridad(this.sRestartPass);
    return this.cHttpClient.post<any>(urlRequest,postData,);
  }
  

  // onRestaurarContraseña(c_correo){
  //   let URL = this.cUrlService.oURL;
  //   let urlRequest = URL.sRestaurarPass;
  //   return this.http.post<any>(urlRequest, { "c_clave": "","c_usuario": c_correo,"c_flag_temp":"" });
  // }
  // onCerrarSesion(c_correo,c_token,c_origen){
  //   let URL = this.cUrlService.oURL;
  //   let urlRequest = URL.sCerrarSesion;
  //   return this.http.post<any>(urlRequest,  { "c_token": c_token,"c_usuario": c_correo ,"c_origen":c_origen});
  // }
  // onCambiarContraseña(post){
  //   let URL = this.cUrlService.oURL;
  //   let urlRequest = URL.sSetClave;
  //   return this.http.post<any>(urlRequest,post);
  // }
  // onValidarContraseña(post){
  //   let URL = this.cUrlService.oURL;
  //   let urlRequest = URL.svalidarPass;
  //   return this.http.post<any>(urlRequest,post);
  // }
}
