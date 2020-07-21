import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../config.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImagenesService {
  private sServicio = 'OrganizationContentGet';
  imagenesHome = [];
  imagenesExito = [];
  imagenesCancelar = [];
  constructor(
    private cHttpClient: HttpClient,
    private cConfigService: ConfigService
  ) { }

  onGetImagen(oData): Observable<any> {
    let urlRequest = this.cConfigService.onObtenerBaseUrlServicios(this.sServicio) + '?' +this.cConfigService.onObtenerParametrosGet(oData);
    return this.cHttpClient.get<ImagenesService>(urlRequest);
  }
}
