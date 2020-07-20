import { Injectable } from '@angular/core'; 
import { Observable } from 'rxjs';   
import { ConfigService } from './config.service'; 
import { HttpClient } from '@angular/common/http';
import { CompanyUserModel } from '../models/companyuser.model';

@Injectable({
  providedIn: 'root'
})
export class CompanyUserService {
  private sOrganizationUserGet: string = 'OrganizationUserGet';  
  private sOrganizationUserModify: string = 'OrganizationUserModify';
  private sOrganizationUserDelete: string = 'OrganizationUserDelete';
  constructor( 
    private cHttpClient: HttpClient,
    public cConfigService: ConfigService
  )
  {
  }  
  OrganizationUserGet(oDataSend){
    let urlRequest =  this.cConfigService.onObtenerBaseUrlAdministracion(this.sOrganizationUserGet) + '?' +this.cConfigService.onObtenerParametrosGet(oDataSend);
    return this.cHttpClient.get<any[]>(urlRequest);
  }
  OrganizationUserModify(oDataSend){
    let urlRequest =  this.cConfigService.onObtenerBaseUrlAdministracion(this.sOrganizationUserModify);
    return this.cHttpClient.post<any>(urlRequest,oDataSend);
  }
  OrganizationUserDelete(oDataSend){
    let urlRequest =  this.cConfigService.onObtenerBaseUrlAdministracion(this.sOrganizationUserDelete)+ '?' +this.cConfigService.onObtenerParametrosGet(oDataSend);
    return this.cHttpClient.delete<any>(urlRequest);
    
  }
}
