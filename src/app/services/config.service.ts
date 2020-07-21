import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

//ng build --base-href "/" --prod
@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  public flujoAlterno = false;
  private aMarcaGeneral = [
    { dominio: "subarudev", p_i_marca: 1, CompanyId:'4E49676B-EED1-4181-9AF0-C1161B178D33' }, 
    { dominio: "dfskdev", p_i_marca: 2, CompanyId:'8CCFECF1-6ECD-4EEF-AC85-75E94A296B66' },
    { dominio: "bmwdev", p_i_marca: 3, CompanyId:'BBA3784F-B00A-4C8E-9274-C7C1B46BD9D4'},    
    { dominio: "subaruqa", p_i_marca: 1, CompanyId:'4E49676B-EED1-4181-9AF0-C1161B178D33' }, 
    { dominio: "dfskqa", p_i_marca: 2, CompanyId:'8CCFECF1-6ECD-4EEF-AC85-75E94A296B66' },
    { dominio: "bmwqa", p_i_marca: 3, CompanyId:'BBA3784F-B00A-4C8E-9274-C7C1B46BD9D4'}  , 
    { dominio: "subaru", p_i_marca: 1, CompanyId:'4E49676B-EED1-4181-9AF0-C1161B178D33' }, 
    { dominio: "dfsk", p_i_marca: 2, CompanyId:'8CCFECF1-6ECD-4EEF-AC85-75E94A296B66' },
    { dominio: "bmw", p_i_marca: 3, CompanyId:'BBA3784F-B00A-4C8E-9274-C7C1B46BD9D4'}
  ];
  private p_i_marca = 0;
  private bDesarrollo = false;
  private sBaseUrlServicios = "";
  private sBaseUrlSeguridad = "";
  public s3Bucket = 'https://inchcape-agendamiento.s3.us-east-2.amazonaws.com/';
  constructor(private cRouter: Router) {
    localStorage.setItem('Token', '11D56EDB-307B-491D-919E-52E9FE091106');
    localStorage.setItem('MasterUserId', 'A8F20DB0-D6DB-4617-9ADA-D0377CCE32C9');
    localStorage.setItem("AppId" ,'AF586A48-390C-457B-8FC0-4AEAB7FB400D');
    this.onGenerarUrls();
  }
  private onGenerarUrls() {
    if (!this.bDesarrollo) {
      // this.sBaseUrlServicios = "https://api.inchcapelatam.app/adminrest/api/";
      // this.sBaseUrlSeguridad = "https://api.inchcapelatam.app/seguridadrest/api/";
      // this.sBaseUrlServicios = "https://apiqa.inchcapelatam.app/adminrestqa/api/";
      // this.sBaseUrlSeguridad = "https://apiqa.inchcapelatam.app/seguridadrestqa/api/";
      this.sBaseUrlServicios = "https://apidev.inchcapelatam.app/adminrestdev/api/";
      this.sBaseUrlSeguridad = "https://apidev.inchcapelatam.app/seguridadrestdev/api/";
      this.onObtenerMarcaApplicacion();
    } else { 
      this.sBaseUrlSeguridad = "http://localhost:54879/api/"; //EDUARDO
      //this.sBaseUrlServicios = "http://localhost:57229/api/"; //EDUARDO
      //this.sBaseUrlSeguridad = "https://localhost:44303/api/"; //JP
      //this.sBaseUrlServicios = "https://localhost:44314/api/"; //JP
      // this.sBaseUrlServicios = "http://192.168.1.62/adminrestqa/api/"; //TEO
      this.sBaseUrlSeguridad = "http://192.168.1.62/seguridadrestqa/api/"; //TEO
      this.onObtenerMarcaApplicacion();
    }
  }
  private onObtenerMarcaApplicacion() {
    let aMarca = window.location.host.split(".");
    let index = this.aMarcaGeneral.findIndex(oEle => oEle.dominio == aMarca[0]);
    //para desarrollo
    if (index == -1) { index = 0; }
    //---
    if (index !== -1) {
      this.p_i_marca = this.aMarcaGeneral[index].p_i_marca;
      localStorage.setItem('CompanyId', this.aMarcaGeneral[index].CompanyId);
    }
  }

  public onObtenerMarcaBase(): number {
    //return 1;
    return this.p_i_marca;
  }

  public onObtenerBaseUrlServicios(sServicio: string): string {
    return this.sBaseUrlServicios + sServicio;
  }

  public onOtenerBaseUrlSeguridad(sServicio: string): string {
    return this.sBaseUrlSeguridad + sServicio;
  }

  public onObtenerParametrosGet(oData) {
    var sParametros = new URLSearchParams(oData);
    return sParametros.toString();
  }
}
