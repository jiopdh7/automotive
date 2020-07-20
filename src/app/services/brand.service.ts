import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class BrandService {
  private sBrandsByCompanyGet: string = 'BrandsByCompanyGet';  
  private sServicesByBrandByCompanyGet: string ='ServicesByBrandByCompanyGet' ;
  private sServicesByBrandByCompanyModify: string ='ServicesByBrandByCompanyModify' ;
  private sMileagesByCompanyGet: string ='MileagesByCompanyGet' ;
  private sMileagesByCompanyModify: string ='MileagesByCompanyModify' ;
  private sBrandsByCompanyModify: string ='BrandsByCompanyModify' ;
  private sChannelsByBrandByCompanyGet: string ='ChannelsByBrandByCompanyGet' ;
  private sChannelsByBrandByCompanyModify: string ='ChannelsByBrandByCompanyModify' ;
  constructor( 
    private cHttpClient: HttpClient,
    private cConfigService: ConfigService
  ) {
  }   
  BrandsByCompanyGet(oDataSend){ 
    let urlRequest =  this.cConfigService.onObtenerBaseUrlAdministracion(this.sBrandsByCompanyGet)+ '?' + this.cConfigService.onObtenerParametrosGet(oDataSend);
    return this.cHttpClient.get<any[]>(urlRequest);
  }
  BrandsByCompanyModify(oDataSend){ 
    let urlRequest =  this.cConfigService.onObtenerBaseUrlAdministracion(this.sBrandsByCompanyModify);
    return this.cHttpClient.post<any>(urlRequest,oDataSend);
  } 
  ServicesByBrandByCompanyGet(oDataSend){ 
    let urlRequest =  this.cConfigService.onObtenerBaseUrlAdministracion(this.sServicesByBrandByCompanyGet)+ '?' + this.cConfigService.onObtenerParametrosGet(oDataSend);
    return this.cHttpClient.get<any[]>(urlRequest);
  }
  ServicesByBrandByCompanyModify(oDataSend){
    let urlRequest =  this.cConfigService.onObtenerBaseUrlAdministracion(this.sServicesByBrandByCompanyModify);
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
  ChannelsByBrandByCompanyGet(oDataSend){
    let urlRequest =  this.cConfigService.onObtenerBaseUrlAdministracion(this.sChannelsByBrandByCompanyGet)+ '?' + this.cConfigService.onObtenerParametrosGet(oDataSend);
    return this.cHttpClient.get<any[]>(urlRequest);
  }
  ChannelsByBrandByCompanyModify(oDataSend){
    let urlRequest =  this.cConfigService.onObtenerBaseUrlAdministracion(this.sChannelsByBrandByCompanyModify);
    return this.cHttpClient.post<any>(urlRequest,oDataSend);
  }
}
