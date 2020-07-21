import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AgendarGeneralService } from 'src/app/services/agendar-general.service';
import { TerminosService } from 'src/app/services/terminos/terminos.service';
import { ConfiguracionService } from 'src/app/services/configuracion/configuracion.service';
import { MediaMatcher } from '@angular/cdk/layout';
import { ImagenesService } from 'src/app/services/imagenes/imagenes.service';
import { ConfigService } from 'src/app/services/config.service';

@Component({
  selector: 'app-terminos',
  templateUrl: './terminos.component.html',
  styleUrls: ['./terminos.component.css']
})
export class TerminosComponent implements OnInit {
  customHtml = '';
  telefono = "";
  mobileQuery: MediaQueryList;
  p_i_marca;
  constructor(
    private cTerminosService: TerminosService,
    private cConfiguracionService: ConfiguracionService,
    changeDetectorRef: ChangeDetectorRef,
    cConfigService:ConfigService,
    media: MediaMatcher,
    private cImagenesService: ImagenesService) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    this.p_i_marca = cConfigService.onObtenerMarcaBase();
  }

  ngOnInit() {
    let dataSend = {
      p_i_marca: this.p_i_marca
    }
    this.cTerminosService.obtenerTalleres(dataSend).subscribe(oData => {
      this.customHtml = oData[0].c_descripcion;
    }, oError => {

    })
    this.onObtenerTelefono();
    this.onGetFoto();
  }

  onGetFoto() {
    if (this.mobileQuery.matches) {
      var oData = {
        c_descripcionapi: 'home_movil',
        p_i_marca: this.p_i_marca,
        isPublished:true
      }

    } else {
      var oData = {
        c_descripcionapi: 'home_desktop',
        p_i_marca: this.p_i_marca,
        isPublished:true
      }
    }

    this.cImagenesService.onGetImagen(oData).subscribe(resp => {
      let imagenHomeAux = [];
      resp.forEach(element => {
        imagenHomeAux.push(element);
        this.onSetFoto(imagenHomeAux);
      });
    });
  }

  onSetFoto(oData) {
    let element;
    if (oData.length !== 0) {
      for (let index = 0; index < oData.length; index++) {
        setTimeout(function () {
          element = oData[index].c_link;
          document.getElementById('back').style.background = "url('" + [element] + "')";
          document.getElementById('back').style.backgroundRepeat = 'no-repeat';
          document.getElementById('back').style.backgroundSize = 'cover';
          document.getElementById('back').style.height = '100vh';
          document.getElementById('back').style.top = '0';
        }, index * 10000);
      }
    } else {
      if (this.mobileQuery.matches) {
        document.getElementById('back').style.background = 'url("../../../assets/images/banner1movil@2x.png")';
        document.getElementById('back').style.backgroundRepeat = 'no-repeat';
        document.getElementById('back').style.backgroundSize = 'cover';
        document.getElementById('back').style.height = '100vh';
        document.getElementById('back').style.top = '0';
      } else {
        document.getElementById('back').style.background = 'url("../../../assets/images/bannerdesktop@2x.png")';
        document.getElementById('back').style.backgroundRepeat = 'no-repeat';
        document.getElementById('back').style.backgroundSize = 'cover';
        document.getElementById('back').style.height = '100vh';
        document.getElementById('back').style.top = '0';
      }
    }
  }



  onObtenerTelefono() {
    var oData = {
      c_descripcion: 'TELEFONO_DFSK',
    }
    this.cConfiguracionService.onObtenerTelefono(oData).subscribe(resp => {
      this.telefono = resp[0].c_valor1;
    });
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
  private _mobileQueryListener: () => void;

  shouldRun = [/(^|\.)plnkr\.co$/, /(^|\.)stackblitz\.io$/].some(h => h.test(window.location.host));

}
