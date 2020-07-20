import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class WorkshopService {
  private sMasterWorkshopGet: string = 'MasterWorkshopGet';  
  private sServicesByWorkshopModify: string = 'ServicesByWorkshopModify'; 
  private sOrganizationUserManagerGet: string = 'OrganizationUserManagerGet';  
  private sMasterWorkshopModify: string = 'MasterWorkshopModify';  
  

  constructor( 
    private cHttpClient: HttpClient,
    private cConfigService: ConfigService
  ) {
  }   
  MasterWorkshopModify(oDataSend){
    let urlRequest =  this.cConfigService.onObtenerBaseUrlAdministracion(this.sMasterWorkshopModify);
    return this.cHttpClient.post<any>(urlRequest,oDataSend);
    
  }
  MasterWorkshopGet(oDataSend){ 
    let urlRequest =  this.cConfigService.onObtenerBaseUrlAdministracion(this.sMasterWorkshopGet)+ '?' + this.cConfigService.onObtenerParametrosGet(oDataSend);
    return this.cHttpClient.get<any[]>(urlRequest);
  }
  BrandsByCompanyModify(oDataSend){ 
    let urlRequest =  this.cConfigService.onObtenerBaseUrlAdministracion(this.sMasterWorkshopGet);
    return this.cHttpClient.post<any>(urlRequest,oDataSend);
  } 
  ServicesByWorkshopModify(oDataSend){ 
    let urlRequest =  this.cConfigService.onObtenerBaseUrlAdministracion(this.sServicesByWorkshopModify);
    return this.cHttpClient.post<any>(urlRequest,oDataSend);
  }
  OrganizationUserManagerGet(oDataSend){ 
    let urlRequest =  this.cConfigService.onObtenerBaseUrlAdministracion(this.sOrganizationUserManagerGet)+ '?' + this.cConfigService.onObtenerParametrosGet(oDataSend);
    return this.cHttpClient.get<any[]>(urlRequest);
  }
}
