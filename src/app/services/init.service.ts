import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class InitService {
   constructor( 
    private cHttpClient: HttpClient,
    private cConfigService: ConfigService
  ) {
  }   
  
}
