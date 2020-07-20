import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  private sMasterCompanyGet: string = 'MasterCompanyGet'; 
  private sMasterCompanyModify: string = 'MasterCompanyModify'; 
  private sServicesByCompanyModify: string = 'ServicesByCompanyModify';  
  private sBrandsByCompanyGet: string = 'BrandsByCompanyGet';    
  private sMileagesByCompanyModify: string = 'MileagesByCompanyModify';    
  private sMileagesByCompanyGet: string = 'MileagesByCompanyGet';  
  private sChannelsByCompanyModify: string = 'ChannelsByCompanyModify';  
  
  constructor( 
    private cHttpClient: HttpClient,
    private cConfigService: ConfigService
  ) {
  }   
  MasterCompanyGet(oDataSend){ 
    let urlRequest =  this.cConfigService.onObtenerBaseUrlAdministracion(this.sMasterCompanyGet)+ '?' + this.cConfigService.onObtenerParametrosGet(oDataSend);
    return this.cHttpClient.get<any[]>(urlRequest);
  }  
  MasterCompanyModify(oDataSend){
    let urlRequest =  this.cConfigService.onObtenerBaseUrlAdministracion(this.sMasterCompanyModify);
    return this.cHttpClient.post<any>(urlRequest,oDataSend);
  }
  
  BrandsByCompanyGet(oDataSend){ 
    let urlRequest =  this.cConfigService.onObtenerBaseUrlAdministracion(this.sBrandsByCompanyGet)+ '?' + this.cConfigService.onObtenerParametrosGet(oDataSend);
    return this.cHttpClient.get<any[]>(urlRequest);
  }
  ServicesByCompanyModify(oDataSend){
    let urlRequest =  this.cConfigService.onObtenerBaseUrlAdministracion(this.sServicesByCompanyModify);
    return this.cHttpClient.post<any>(urlRequest,oDataSend);
  } 
  MileagesByCompanyGet(oDataSend){ 
    let urlRequest =  this.cConfigService.onObtenerBaseUrlAdministracion(this.sMileagesByCompanyGet)+ '?' + this.cConfigService.onObtenerParametrosGet(oDataSend);
    return this.cHttpClient.get<any[]>(urlRequest);
  }
  MileagesByCompanyModify(oDataSend){
    let urlRequest =  this.cConfigService.onObtenerBaseUrlAdministracion(this.sMileagesByCompanyModify);
    return this.cHttpClient.post<any>(urlRequest,oDataSend);
  }
  ChannelsByCompanyModify(oDataSend){
    let urlRequest =  this.cConfigService.onObtenerBaseUrlAdministracion(this.sChannelsByCompanyModify);
    return this.cHttpClient.post<any>(urlRequest,oDataSend);
  }
  
}
