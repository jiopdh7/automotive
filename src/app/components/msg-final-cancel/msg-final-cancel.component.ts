import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { ImagenesService } from 'src/app/services/imagenes/imagenes.service';
import { ConfigService } from 'src/app/services/config.service';


@Component({
  selector: 'app-msg-final-cancel',
  templateUrl: './msg-final-cancel.component.html',
  styleUrls: ['./msg-final-cancel.component.css']
})
export class MsgFinalCancelComponent implements OnInit {
  public activeLang = 'es';
  mobileQuery: MediaQueryList;
  p_i_marca;
  constructor(
    private translate: TranslateService,
    private cRouter: Router,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    cConfigService:ConfigService,
    private cImagenesService: ImagenesService) {
    this.translate.setDefaultLang(this.activeLang);
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    this.p_i_marca = cConfigService.onObtenerMarcaBase();
  }

  ngOnInit() {
    this.onGetFoto();
  }

  onGetFoto() {
    if (this.mobileQuery.matches) {
      var oData = {
        identifier: 'AgendaCancel',
        p_i_marca:this.p_i_marca,
        isPublished:true
      }

    } else {
      var oData = {
        identifier: 'AgendaCancelMobile',
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
    if (oData.length !== 0) {
      let element = oData[0].c_link;
      document.getElementById('back').style.background = "url('" + [element] + "')";
      document.getElementById('back').style.backgroundRepeat = 'no-repeat';
      document.getElementById('back').style.backgroundSize = 'cover';
      document.getElementById('back').style.height = '100vh';
      document.getElementById('back').style.top = '0';
    } else {
      if (this.mobileQuery.matches) {
        document.getElementById('back').style.backgroundColor="white";
        document.getElementById('back').style.backgroundRepeat = 'no-repeat';
        document.getElementById('back').style.backgroundSize = 'cover';
        document.getElementById('back').style.height = '100vh';
        document.getElementById('back').style.top = '0';
      } else {
        document.getElementById('back').style.backgroundColor="white";
        document.getElementById('back').style.backgroundRepeat = 'no-repeat';
        document.getElementById('back').style.backgroundSize = 'cover';
        document.getElementById('back').style.height = '100vh';
        document.getElementById('back').style.top = '0';
      }
    }
  }

  onGoHome() {
    this.cRouter.navigateByUrl('/');
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
  private _mobileQueryListener: () => void;

  shouldRun = [/(^|\.)plnkr\.co$/, /(^|\.)stackblitz\.io$/].some(h => h.test(window.location.host));


}
