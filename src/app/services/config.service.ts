import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
//ng build --base-href "/" --prod
@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private bDesarrollo = false;
  private sBaseUrlApplication = "";
  private sBaseUrlAdministracion = "";
  private sBaseUrlSeguridad = "";
  constructor(private cRouter: Router) {
    localStorage.setItem('Token', '11D56EDB-307B-491D-919E-52E9FE091106');
    localStorage.setItem("AppId" ,'AF586A48-390C-457B-8FC0-4AEAB7FB400D');
    this.onGenerarUrls();
  }
  private onGenerarUrls() {
    if (!this.bDesarrollo) {
      this.sBaseUrlAdministracion = "https://api.inchcapelatam.app/adminrest/api/";
      this.sBaseUrlSeguridad = "https://api.inchcapelatam.app/seguridadrest/api/";
      // this.sBaseUrlAdministracion = "https://apiqa.inchcapelatam.app/adminrestqa/api/";
      // this.sBaseUrlSeguridad = "https://apiqa.inchcapelatam.app/seguridadrestqa/api/";
      // this.sBaseUrlAdministracion = "https://apidev.inchcapelatam.app/adminrestdev/api/";
      // this.sBaseUrlSeguridad = "https://apidev.inchcapelatam.app/seguridadrestdev/api/";
    } else {
      //this.sBaseUrlSeguridad = "http://3.23.154.42:83/seguridadrestqa/api/"; //SERVER
      //this.sBaseUrlAdministracion = "http://localhost:57229/api/"; //EDUARDO
      //this.sBaseUrlSeguridad = "http://localhost:54879/api/";  //EDUARDO
      //this.sBaseUrlAdministracion = "https://localhost:44314//api/"; //JP
      //this.sBaseUrlAdministracion = "http://192.168.1.62/adminrestqa/api/"; //TEO
      // this.sBaseUrlAdministracion = "http://localhost:57229/api/"; //TEO
      //this.sBaseUrlSeguridad = "http://192.168.1.62/seguridadrestqa/api/"; //TEO
      //this.sBaseUrlSeguridad = "http://localhost:54879/api/"; //TEO
      this.sBaseUrlSeguridad = "https://localhost:44303/api/"; //JP
      this.sBaseUrlAdministracion = "https://localhost:44314/api/"; //JP
    }
  }
  public onObtenerBaseUrlAdministracion(sServicio: string): string {
    return this.sBaseUrlAdministracion + sServicio;
  }

  public onObtenerBaseUrlAplicaciones(): string {
    return this.sBaseUrlApplication;
  }

  public onObtenerParametrosGet(oData) {
    var sParametros = new URLSearchParams(oData);
    return sParametros.toString();
  }
  public onObtenerBaseUrlSeguridad(sServicio: string): string {
    return this.sBaseUrlSeguridad + sServicio;
  }
}
