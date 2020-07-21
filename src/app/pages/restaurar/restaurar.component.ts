import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { ConfigService } from 'src/app/services/config.service';
import { FormControl, Validators, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher, MatSnackBar } from '@angular/material';
import { SesionService } from 'src/app/services/sesion/sesion.service';
import { ImagenesService } from 'src/app/services/imagenes/imagenes.service';
import { ConfiguracionService } from 'src/app/services/configuracion/configuracion.service';
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
@Component({
  selector: 'app-restaurar',
  templateUrl: './restaurar.component.html',
  styleUrls: ['./restaurar.component.css']
})
export class RestaurarComponent implements OnInit, OnDestroy {


  matcher = new MyErrorStateMatcher();
  public recentToken: string = '';
  public sTelefono = '';
  shouldRun = [/(^|\.)plnkr\.co$/, /(^|\.)stackblitz\.io$/].some(h => h.test(window.location.host));
  public activeLang = 'es';
  mobileQuery: MediaQueryList;
  public emails = new FormControl('', [
    Validators.required,
  ]);
  public bButtonDisabled:boolean = false;
  public bPassSee: boolean = true;
  public p_i_marca = null;
  constructor(
    private cConfigService:ConfigService,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private translate: TranslateService,
    private cRouter: Router,
    private cMatSnackBar:MatSnackBar,
    private cSesionService:SesionService,
    private cImagenesService:ImagenesService,
    private cConfiguracionService:ConfiguracionService

  ) {
    this.translate.setDefaultLang(this.activeLang);
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    this.p_i_marca = cConfigService.onObtenerMarcaBase();
  }

  ngOnInit() {
    this.onObtenerTelefono();
    this.onGetFoto();
  }

  onObtenerTelefono() {
    var oData = {
      c_descripcion: 'TELEFONO_DFSK',
    }
    this.cConfiguracionService.onObtenerTelefono(oData).subscribe(resp => {
      this.sTelefono = resp[0].c_valor1;
    });
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
      });
      this.onSetFoto(imagenHomeAux);
    });
  }

  interval = null;
  onSetFoto(oData) {
    let element;
    if (oData.length !== 0) {
      let countMax = oData.length;
      if (countMax > 1) {
        let element2 = oData[0].c_link;
          document.getElementById('back').style.background = "url('" + [element2] + "')";
          document.getElementById('back').style.backgroundPosition = 'center';
          document.getElementById('back').style.backgroundRepeat = 'no-repeat';
          document.getElementById('back').style.backgroundSize = 'cover';
          if (oData[0].c_descripcionapi !== 'home_movil') {
            document.getElementById('back').style.height = '100vh';

          }
          document.getElementById('back').style.top = '0';
        this.interval = setInterval(function () {

          for (let index = 0; index < oData.length; index++) {
            setTimeout(function () {
              element = oData[index].c_link;
              document.getElementById('back').style.background = "url('" + [element] + "')";
              document.getElementById('back').style.backgroundPosition = 'center';
              document.getElementById('back').style.backgroundRepeat = 'no-repeat';
              document.getElementById('back').style.backgroundSize = 'cover';
              if (oData[index].c_descripcionapi !== 'home_movil') {
                document.getElementById('back').style.height = '100vh';

              }
              document.getElementById('back').style.top = '0';
            }, index * 10000);
          }

        }, (10000 * countMax));
      } else {
        for (let index = 0; index < oData.length; index++) {

          element = oData[index].c_link;
          document.getElementById('back').style.background = "url('" + [element] + "')";
          document.getElementById('back').style.backgroundPosition = 'center';
          document.getElementById('back').style.backgroundRepeat = 'no-repeat';
          document.getElementById('back').style.backgroundSize = 'cover';
          if (oData[index].c_descripcionapi !== 'home_movil') {
            document.getElementById('back').style.height = '100vh';

          }
          document.getElementById('back').style.top = '0';
        }
      }


    } else {
      if (this.mobileQuery.matches) {
        document.getElementById('back').style.background = 'url("../../../assets/images/banner1movil@2x.png")';
        document.getElementById('back').style.backgroundRepeat = 'no-repeat';
        document.getElementById('back').style.backgroundSize = 'cover';
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
  validateAfterSend(){
    let flat = true;
    if(!this.emails.valid){
      flat = false;
      this.cMatSnackBar.open("El correo no es válido", "cerrar", {
        verticalPosition: 'top',
        horizontalPosition:'end',
        duration: 2000,
      });
    }
    return flat;
  }
  onSubmitRestaurar(){

    var that = this;
    if(this.validateAfterSend()){
      this.bButtonDisabled=true;
      this.cSesionService.onRestaurarContrasena((this.emails.value)).subscribe(oData => {

        if(oData.codigo == 0){
          this.cMatSnackBar.open("Se envió un mensaje de restauración a la cuenta de E-mail asociado a este usuario" , "cerrar", {
            verticalPosition: 'top',
            horizontalPosition:'end',
            duration: 3000,
          });
          this.cRouter.navigateByUrl('/logon');
          this.bButtonDisabled=false;
        }
      }, oErr => {
        this.cMatSnackBar.open("Ocurrió un error, verifique su conexión a internet", "cerrar", {
          verticalPosition: 'top',
          horizontalPosition:'end',
          duration: 2000,
        });
        this.bButtonDisabled=false;
      })

    }

  }
  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
  private _mobileQueryListener: () => void;
  onGoIniciarSesion() {
    this.cRouter.navigateByUrl('/logon');
  }

  onCallTelefono(){
    window.open('tel:' + this.sTelefono, '_blank');
  }
}
