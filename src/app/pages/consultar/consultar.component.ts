import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AgendarGeneralService } from 'src/app/services/agendar-general.service';
import { CustomerService } from 'src/app/services/customer.service';
import { MediaMatcher } from '@angular/cdk/layout';
import { ConfigService } from 'src/app/services/config.service';
import { SesionService } from 'src/app/services/sesion/sesion.service';

@Component({
  selector: 'app-consultar',
  templateUrl: './consultar.component.html',
  styleUrls: ['./consultar.component.css']
})
export class ConsultarComponent implements OnInit {
  public oDataMain: any = { "p_i_usuario_usuario": 0, "c_apellidos_usuario": "", "c_nombres_usuario": "", "c_documento_usuario": "", "c_correo_usuario": "", "p_i_usuario_cliente": 0, "c_apellidos_cliente": "", "c_nombres_cliente": "", "c_documento_cliente": "", "c_correo_cliente": "" };
  public activeLang = 'es';
  public mobileQuery: MediaQueryList;
  public progress: boolean = false;
  private PlateName: string;
  public CompanyId: string;
  public MasterUserId: string;
  private _mobileQueryListener: () => void;
  public telefono;
  public user;
  shouldRun = [/(^|\.)plnkr\.co$/, /(^|\.)stackblitz\.io$/].some(h => h.test(window.location.host));
  p_i_marca ;
  constructor(
    private cSesionService: SesionService,
    public changeDetectorRef: ChangeDetectorRef,
    public media: MediaMatcher,
    private translate: TranslateService,
    private cRouter: Router,
    public cAgendarGeneralService: AgendarGeneralService,
    private cActivatedRoute: ActivatedRoute,
    private cConfigService:ConfigService,
    private cCustomerService: CustomerService,    
  ) {
    this.translate.setDefaultLang(this.activeLang);
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    this.PlateName = localStorage.getItem("PlateName");
    this.p_i_marca = cConfigService.onObtenerMarcaBase();
  }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem("UserData"));
    if(!this.user) this.onGoHome();//Add by security
    else this.user = JSON.parse(localStorage.getItem("UserData"))[0];//Add by security

    this.CompanyId = localStorage.getItem("CompanyId");
    this.MasterUserId = localStorage.getItem("MasterUserId");
    this.telefono = localStorage.getItem("telefono");
  }
  //Redirige al inicio
  onGoHome() {
    this.cRouter.navigateByUrl('/');
  }
  onDestroy(){

    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  //Cerrar la sesión
  onCerrarSesion() {
    this.cAgendarGeneralService.fnRestaurarReservaSesion();
    var odata={
      "sessionId": localStorage.getItem('SessionId')
    }    
    this.cSesionService.onCerrarSesion(odata).subscribe(resp => {
      localStorage.setItem('SessionId', "");
      localStorage.setItem('CredentialId', "");
      localStorage.setItem('UserData', "");
      this.cRouter.navigate(["/"]);
    }, err => { 
    });
  }
  onCallTelefono(){
    window.open('tel:' + this.telefono, '_blank');
  }

}
