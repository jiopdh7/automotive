import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MediaMatcher } from '@angular/cdk/layout';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { ConfiguracionService } from 'src/app/services/configuracion/configuracion.service';
import { ConfigService } from 'src/app/services/config.service';
import { SesionService } from 'src/app/services/sesion/sesion.service';
import { AgendarGeneralService } from 'src/app/services/agendar-general.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit, OnDestroy {

  shouldRun = [/(^|\.)plnkr\.co$/, /(^|\.)stackblitz\.io$/].some(h => h.test(window.location.host));

  public activeLang = 'es';
  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;
  p_i_marca;
  public oDataMain: any = { "p_i_usuario_usuario": 0, "c_apellidos_usuario": "", "c_nombres_usuario": "", "c_documento_usuario": "", "c_correo_usuario": "", "p_i_usuario_cliente": 0, "c_apellidos_cliente": "", "c_nombres_cliente": "", "c_documento_cliente": "", "c_correo_cliente": "" };
  constructor(
    private translate: TranslateService,
    private cRouter: Router,
    private cMatSnackBar: MatSnackBar,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private cActivatedRoute: ActivatedRoute,
    private cConfiguracionService: ConfiguracionService,
    private cConfigService: ConfigService,
    private cAgendarGeneralService:AgendarGeneralService,
    private cSesionService: SesionService
  ) {
    this.translate.setDefaultLang(this.activeLang);
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    this.p_i_marca = cConfigService.onObtenerMarcaBase();
  }

  ngOnInit(): void {
    //this.onObtenerDatosUsuario();
  }
  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  onObtenerDatosUsuario() {
    let dataSend = {
      c_placa: "",
      c_usuario: localStorage.getItem('p_i_usuario')
    };
    this.cSesionService.obtenerDatosUsuario(dataSend).subscribe(oData => {
      this.oDataMain = oData;
      localStorage.setItem("oDataMain", JSON.stringify(oData))
    });
  }
  onCerrarSesion() {
    this.cAgendarGeneralService.fnRestaurarReservaSesion();
    localStorage.setItem('SessionId', "");
    localStorage.setItem('CredentialId', "");
    localStorage.setItem('UserData', "");
    this.cRouter.navigate(["/"]);
  }
  onGoHome() {
    this.cRouter.navigateByUrl('/inicio');
  }

}
