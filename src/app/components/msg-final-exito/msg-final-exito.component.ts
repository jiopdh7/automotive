import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { ImagenesService } from 'src/app/services/imagenes/imagenes.service';
import { ConfigService } from 'src/app/services/config.service';
import { AgendarGeneralService } from 'src/app/services/agendar-general.service';
import { SesionService } from 'src/app/services/sesion/sesion.service';


@Component({
  selector: 'app-msg-final-exito',
  templateUrl: './msg-final-exito.component.html',
  styleUrls: ['./msg-final-exito.component.css']
})
export class MsgFinalExitoComponent implements OnInit {
  public activeLang = 'es';
  mobileQuery: MediaQueryList;
  p_i_marca;
  constructor(
    private cSesionService: SesionService,
    private translate: TranslateService,
    private cRouter: Router,
    changeDetectorRef: ChangeDetectorRef,
    cConfigService:ConfigService,
    public cAgendarGeneralService: AgendarGeneralService,
    media: MediaMatcher,
    private cImagenesService: ImagenesService) {
    this.translate.setDefaultLang(this.activeLang);
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    //this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    //this.mobileQuery.addListener(this._mobileQueryListener);
    this.p_i_marca = cConfigService.onObtenerMarcaBase();
  }

  ngOnInit() {
    this.onGetFoto();
  }
  ngAfterViewInit() {
    this.modificarFont();
 }
 modificarFont(){
   switch (this.p_i_marca) {
     case 1://subaru
       var list, index;
       list = document.getElementsByClassName("example-container");
       for (index = 0; index < list.length; ++index) {
           list[index].style.fontFamily = "AvenirNext-Regular"
       }
       break;
       break;
     case 2://dfsk
       var list, index;
       list = document.getElementsByClassName("example-container");
       for (index = 0; index < list.length; ++index) {
           list[index].style.fontFamily = "HelveticaLTStd"
       }
       break;
     case 3://bmw
       var list, index;
       list = document.getElementsByClassName("example-container");
       for (index = 0; index < list.length; ++index) {
           list[index].style.fontFamily = "AvenirNextLTPro"
       }
       break;
   }
 }
  onGetFoto() {
    var oData;
    if (this.mobileQuery.matches) {
       oData = {
        masterUserId: localStorage.getItem("MasterUserId"),
        companyId: localStorage.getItem("CompanyId"),
        contentId: null,
        parentId: null, 
        identifier: 'AgendaSuccessMobile',
        isPublished:true
      }
    } else {
       oData = {
        masterUserId: localStorage.getItem("MasterUserId"),
        companyId: localStorage.getItem("CompanyId"),
        contentId: null,
        parentId: null,
        identifier: 'AgendaSuccess',
        isPublished:true
      } 
    }
    this.cImagenesService.onGetImagen(oData).subscribe(resp => {
      let imagenHomeAux = [];
      resp.forEach(element => {       
        imagenHomeAux.push(element);
      });
      this.onSetFoto(imagenHomeAux);
    });
  }

  onSetFoto(oData) {

    if (oData.length !== 0) {
      let element = oData[0].MainImage;
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
    this.cAgendarGeneralService.fnRestaurarReservaSesion();
    var odata={
      "sessionId": localStorage.getItem('SessionId')
    }    
    this.cSesionService.onCerrarSesion(odata).subscribe(resp => {
      localStorage.setItem('SessionId', "");
      localStorage.setItem('CredentialId', "");
      localStorage.setItem('UserData', "");
      this.cRouter.navigateByUrl('/');
    }, err => { 
    });
  }

  // ngOnDestroy(): void {
  //   this.mobileQuery.removeListener(this._mobileQueryListener);
  // }
  // private _mobileQueryListener: () => void;

  // shouldRun = [/(^|\.)plnkr\.co$/, /(^|\.)stackblitz\.io$/].some(h => h.test(window.location.host));

}
