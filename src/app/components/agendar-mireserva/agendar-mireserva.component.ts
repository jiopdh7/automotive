import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AgendarGeneralService } from 'src/app/services/agendar-general.service';
import { TranslateService } from '@ngx-translate/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { ConfigService } from 'src/app/services/config.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-agendar-mireserva',
  templateUrl: './agendar-mireserva.component.html',
  styleUrls: ['./agendar-mireserva.component.css']
})
export class AgendarMireservaComponent implements OnInit {
  public activeLang = 'es';
  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;
  p_i_marca
  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private cRouter: Router,
    private cConfigService: ConfigService,
    private translate: TranslateService, public cAgendaGeneralService: AgendarGeneralService) {
    this.translate.setDefaultLang(this.activeLang);
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    this.p_i_marca = cConfigService.onObtenerMarcaBase();
  }

  ngOnInit() {
    var user = JSON.parse(localStorage.getItem("UserData"));
    if(!user) this.onGoHome();//Add by security
    else user = JSON.parse(localStorage.getItem("UserData"))[0];//Add by security
  }
  onGoHome() {
    this.cRouter.navigateByUrl('/');
  }
  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  shouldRun = [/(^|\.)plnkr\.co$/, /(^|\.)stackblitz\.io$/].some(h => h.test(window.location.host));
  onCamelCase(cadena){
    let aCadena = cadena.toLowerCase();//.split(" ");
    return aCadena;
  }
  ngAfterViewInit() {
    this.modificarFont();
  }
  modificarFont(){
    switch (this.p_i_marca) {
      case 1://subaru
        var list, index;
        list = document.getElementsByClassName("estiloGeneral");
        for (index = 0; index < list.length; ++index) {
            list[index].style.fontFamily = "AvenirNext-Regular"
        }
        break;
        break;
      case 2://dfsk
        var list, index;
        list = document.getElementsByClassName("estiloGeneral");
        for (index = 0; index < list.length; ++index) {
            list[index].style.fontFamily = "HelveticaLTStd"
        }
        break;
      case 3://bmw
        var list, index;
        list = document.getElementsByClassName("estiloGeneral");
        for (index = 0; index < list.length; ++index) {
            list[index].style.fontFamily = "AvenirNextLTPro"
        }
        break;
    }
  }
}
