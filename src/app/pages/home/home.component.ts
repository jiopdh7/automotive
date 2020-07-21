import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AgendaModel } from 'src/app/models/agenda.model';
import { Router } from '@angular/router';
import { MediaMatcher } from '@angular/cdk/layout';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ErrorStateMatcher } from '@angular/material/core';
import { FormGroupDirective, NgForm, FormControl, Validators } from '@angular/forms'; 
import { ImagenesService } from 'src/app/services/imagenes/imagenes.service';
import { ReCaptchaV3Service, OnExecuteData } from 'ng-recaptcha';
import { Subscription } from 'rxjs';
import { SesionService } from 'src/app/services/sesion/sesion.service';
import { ConfigService } from 'src/app/services/config.service';
import { MatDialog } from '@angular/material';
import { MensajeDialogoFlujoclienteAlternoComponent } from 'src/app/components/mensaje-dialogo-flujocliente-alterno/mensaje-dialogo-flujocliente-alterno.component';
import { SharedService } from 'src/app/services/shared.service'; 
import { MsgAlertComponent } from 'src/app/components/msg-alert/msg-alert.component';
import { CompanyService } from 'src/app/services/company.service';
import { AgendarGeneralService } from 'src/app/services/agendar-general.service';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public activeLang = 'es';
  public telefono: string = '';
  public recentToken: string = '';
  public readonly executionLog: OnExecuteData[] = [];
  private allExecutionsSubscription: Subscription;
  private singleExecutionSubscription: Subscription;
  public c_placa = new FormControl('', [Validators.required]);
  public c_documento = new FormControl('', [Validators.required]);
  public c_recaptcha = new FormControl(null, [Validators.required]);
  public aTipoServicio = [];
  public bButtonDisabled: boolean = false;
  public oAgenda: AgendaModel = {} as AgendaModel;
  public mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;
  public shouldRun = [/(^|\.)plnkr\.co$/, /(^|\.)stackblitz\.io$/].some(h => h.test(window.location.host));
  public CompanyId =localStorage.getItem("CompanyId");
  public MasterUserId = localStorage.getItem("MasterUserId");
  public valCanal=false;
  public bInvalido : boolean = true;
  p_i_marca;
  ipAddress
  aTiposDocumentos: any[] = [];
  formTipoDocumento = new FormControl('', [
    Validators.required
  ]);
  matcher = new MyErrorStateMatcher();
  tituloLibro="";
  linkLibro="";
  constructor(
    private cCompaniaService: CompanyService,
    public dialog: MatDialog,
    public changeDetectorRef: ChangeDetectorRef,
    public media: MediaMatcher,
    private recaptchaV3Service: ReCaptchaV3Service,
    private cSesionService: SesionService,
    private translate: TranslateService,
    private cRouter: Router,
    private cMatSnackBar: MatSnackBar,
    private cImagenesService: ImagenesService,
    public cConfigService: ConfigService,
    private cSharedService: SharedService,
    private cTranslateService:TranslateService,
    public cAgendarGeneralService:AgendarGeneralService,
    public cMatDialog: MatDialog,
  ) {
    this.translate.setDefaultLang(this.activeLang);
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    this.p_i_marca = cConfigService.onObtenerMarcaBase();
  }

  ngOnInit() {
    this.cAgendarGeneralService.isGlobalLoading = false;
    this.onObtenerTiposDocumento();
    //this.getIP();
    this.allExecutionsSubscription = this.recaptchaV3Service.onExecute
      .subscribe((data) => this.executionLog.push(data));
    this.onGetMasterCompany();
    this.onGetFoto();
    this.onGetLibroReclamaciones(); 
    //this.modificarFont();
  this.c_documento.setErrors({
    notUnique: true
  });

  }
  ngAfterViewInit(){
    //this.modificarFont();
  }
  modificarFont(){
    switch (this.p_i_marca) {
      case 1://subaru
        //document.getElementById("fontTilde").style.fontFamily = "AvenirNext-Regular";
        //document.getElementById("fontTilde").setAttribute("font-family", "AvenirNext-Regular !important");
        break;
      case 2://dfsk
        //document.getElementById("fontTilde").style.fontFamily = "Helvetica_Condensed";
        //document.getElementById("fontTilde").setAttribute("font-family", "Helvetica_Condensed !important");
        var list, index;
        list = document.getElementsByClassName("fontTilde");
        for (index = 0; index < list.length; ++index) {
            //list[index].setAttribute("fontFamily", "Helvetica_Condensed");
            list[index].style.fontFamily = "Helvetica_Condensed"
        }
        break;
      case 3://bmw
        //document.getElementById("fontTilde").style.fontFamily = "BMWG_light";
        break;
    }
  }
  getIP() {
    this.cSesionService.getIPAddress().subscribe(oRes => {
      this.ipAddress = oRes;
      this.ipAddress = this.ipAddress.ip;
    });
  }
  onGetFoto() { 

    this.cAgendarGeneralService.isGlobalLoading = true;
    var oData;
    if (this.mobileQuery.matches) {
      oData = {
        masterUserId: localStorage.getItem("MasterUserId"),
        companyId: localStorage.getItem("CompanyId"),
        contentId: null,
        parentId: null,
        identifier: 'MobileHome',
        isPublished:true
      }
    } else {
      oData = {
        masterUserId: localStorage.getItem("MasterUserId"),
        companyId: localStorage.getItem("CompanyId"),
        contentId: null,
        parentId: null,
        identifier: 'DesktopHome',
        isPublished:true
      }
    }
    this.cImagenesService.onGetImagen(oData).subscribe(resp => {
      let imagenHomeAux = [];
      resp.forEach(element => {
        imagenHomeAux.push(element);
      });
      this.onSetFoto(imagenHomeAux);
    },(error)=>{

      this.cAgendarGeneralService.isGlobalLoading = false;
    },()=>{
      
    this.cAgendarGeneralService.isGlobalLoading = false;
    });
  }

  interval = null;
  onSetFoto(oData) {
    let that = this;
    let element;
    if (oData.length !== 0) {
      let countMax = oData.length;
      if (countMax > 1) {
        let element2 = oData[0].MainImage;
        document.getElementById('body-general').style.background = "url('" + [element2] + "')";
        document.getElementById('body-general').style.backgroundRepeat = 'no-repeat'; 
        if (that.mobileQuery.matches) {
          document.getElementById('body-general').style.backgroundSize = 'auto';
        }else{
          document.getElementById('body-general').style.backgroundSize = 'cover';

        }
         
        this.interval = setInterval(function () {

          for (let index = 0; index < oData.length; index++) {
            setTimeout(function () {
              element = oData[index].MainImage;
              document.getElementById('body-general').style.background = "url('" + [element] + "')";
              document.getElementById('body-general').style.backgroundRepeat = 'no-repeat'; 
              if (that.mobileQuery.matches) {
                document.getElementById('body-general').style.backgroundSize = 'auto';
              }else{
                document.getElementById('body-general').style.backgroundSize = 'cover';
      
              }
               
            }, index * 10000);
          }

        }, (10000 * countMax));
      } else {
        for (let index = 0; index < oData.length; index++) {

          element = oData[index].MainImage;
          document.getElementById('body-general').style.background = "url('" + [element] + "')"; 
          document.getElementById('body-general').style.backgroundRepeat = 'no-repeat'; 
          if (that.mobileQuery.matches) {
            document.getElementById('body-general').style.backgroundSize = 'auto';
          }else{
            document.getElementById('body-general').style.backgroundSize = 'cover';
  
          }
        }
      }


    } else {
      if (that.mobileQuery.matches) {
        document.getElementById('body-general').style.backgroundColor="white";
        document.getElementById('body-general').style.backgroundRepeat = 'no-repeat'; 
        document.getElementById('body-general').style.backgroundSize = 'auto';
      } else {
        document.getElementById('body-general').style.backgroundColor="white";
        document.getElementById('body-general').style.backgroundRepeat = 'no-repeat'; 
        document.getElementById('body-general').style.backgroundSize = 'cover';
      }
    }
  }

  onGoAgendar() {
    this.cAgendarGeneralService.isGlobalLoading = true;
    if(this.valCanal){
      this.bButtonDisabled = true;
      this.executeAction('agendar_agendamiento', this.onValidarCredenciales, 1);
    }else{
      var data = {
        tipo: "Info",
        mensajeCorto: "En estos momentos estamos en mantenimiento",
        mensajeLargo:""
      }
      this.onMostrarMensaje(data,this);
      this.cAgendarGeneralService.isGlobalLoading = false;
    }
    
  }

  onGoConsultar() {
    this.cAgendarGeneralService.isGlobalLoading = true;
    this.executeAction('consultar_agendamiento', this.onValidarCredenciales, 2);
  }
  /**
   * Muestra un diálogo de confirmación
   * @param element objeto mixto. Debe tener, al menos, un atributo element.message
   */
  fnShowDialogClienteAlterno(element) {
    const dialogRef = this.dialog.open(MensajeDialogoFlujoclienteAlternoComponent, {
      panelClass: 'popUp',
      data: element
    });
    dialogRef.afterClosed().subscribe(res => {
      this.bButtonDisabled = false;
    });
  }

  onValidarCredenciales(sToken, that, tipo) {    
    let oDataSend = {
      Plate: that.c_placa.value.trim(),
      DocumentId: that.c_documento.value.trim(),
      TypeDocId: that.formTipoDocumento.value,
      Host: that.ipAddress == undefined ? "" : that.ipAddress,
      AppId: localStorage.getItem("AppId"),
      CompanyId: localStorage.getItem("CompanyId"),
      RequestType: tipo
    }
    that.cSesionService.obtenerSesionPlaca(oDataSend).subscribe(oRes => {
      if(that.c_placa.value.indexOf("-")==-1){
        that.c_placa.setValue(that.c_placa.value.substring(0,3)+'-'+that.c_placa.value.substring(3,6));
      }
      localStorage.setItem('PlateName', that.c_placa.value);
      localStorage.setItem('falloReniec', "");
      var type = oRes.CodeResponse ? "Éxito" : "Error";
      var data = {
        tipo: type,
        mensajeCorto: oRes.RetMessage,
        mensajeLargo: oRes.TraceMessage
      }
      switch (oRes.idType) {
        case 0:         
          localStorage.setItem('UserData', oRes.UserData);
          localStorage.setItem("read", "");
          localStorage.setItem("habilitarPickUp", "X");
          switch (tipo) {
            case 1: {
              localStorage.setItem('SessionId', oRes.SessionId);
              localStorage.setItem('CredentialId', oRes.CredentialId);
              that.onGoAgendarRoute();
            } break;
            case 2: {
              localStorage.setItem('SessionId', oRes.SessionId);
              localStorage.setItem('CredentialId', oRes.CredentialId);
              that.onGoConsultarRoute();
            } break;
          }
          break;
        case 3:
          if (tipo == 1) {
            //nuevo usuario
            localStorage.setItem("read", "X");
            localStorage.setItem("tipoEnvio", oRes.idType.toString());
            // +@id
            localStorage.setItem('SessionId', "");
            localStorage.setItem('CredentialId', "");
            //si falla la consulta con reniec, devuelve null
            if (!oRes.UserData || oRes.UserData == null || oRes.UserData == 'null') {
              //falloreniec
              localStorage.setItem('falloReniec', "X");
              var objTmp = {
                IdenticationTypeId: that.formTipoDocumento.value,
                IdenticationDocument: that.c_documento.value,
              };
              oRes.UserData = JSON.stringify(objTmp);
            }
            localStorage.setItem('UserData', oRes.UserData);
            var objMsg = { "placa": that.c_placa.value, "message": oRes.RetMessage };
            localStorage.setItem("xTipoDocu", that.formTipoDocumento.value );
            localStorage.setItem("xNumDocu", that.c_documento.value );
            that.fnShowDialogClienteAlterno(objMsg);
          } else {
            data = {
              tipo: 'Error',
              mensajeCorto: 'No se encontraron coincidencias.',
              mensajeLargo: ''
            }
            that.onMostrarMensaje(data, that);
          }
          break;
        case 4:
          if (tipo == 1) {
            //usuario existe, pero no está asociado al vehículo
            localStorage.setItem("tipoEnvio", oRes.idType.toString());
            localStorage.setItem("read", ""); 
            localStorage.setItem('SessionId', oRes.SessionId);
            localStorage.setItem('CredentialId', oRes.CredentialId);
            //var user = JSON.parse(oRes.UserData);
            //localStorage.setItem('UserData', JSON.stringify(user[0]));
            localStorage.setItem('UserData', oRes.UserData);

            var objMsg = { "placa": that.c_placa.value, "message": oRes.RetMessage };
            
            localStorage.setItem("xTipoDocu", that.formTipoDocumento.value );
            localStorage.setItem("xNumDocu", that.c_documento.value );
            that.fnShowDialogClienteAlterno(objMsg);
          } else {
            let sMessage = '';
            let sTrans = "home.no.matches.found";
            that.cTranslateService.get(sTrans).subscribe((text: string) => {
              sMessage = text;
            });
            let sMessageError = '';
            let sTransError = "home.no.matches.error";
            that.cTranslateService.get(sTransError).subscribe((text: string) => {
              sMessageError = text;
            });

            
            data = {
              tipo: sMessageError,
              mensajeCorto: sMessage,
              mensajeLargo: ''
            }
            that.onMostrarMensaje(data, that);
          }
          break;
        default:
          if(data.mensajeCorto.indexOf("Call Center")!="-1"){
            data.mensajeCorto = data.mensajeCorto + " " + that.telefono
          }
          that.onMostrarMensaje(data, that);
          break;
      }
      that.bButtonDisabled = false;
    }, oError => {
      that.bButtonDisabled = false;
    }, ()=>{

      that.cAgendarGeneralService.isGlobalLoading = false;
    });
  }
  onMostrarMensaje(data, that) {
    const dialogRef = that.cMatDialog.open(MsgAlertComponent, {
      data: data
    });
    dialogRef.afterClosed().subscribe(oResp => { 
    });
  }

  onChangePlaca() {
    let oPlaca = this.c_placa.value.trim();
    this.c_placa.setValue(oPlaca);
    this.onChangeDocumento();
  }

  onChangeDocumento() { 
    var iTipoDocumento = this.formTipoDocumento.value;
    let sDocumento = this.c_documento.value.trim();
    if(iTipoDocumento && iTipoDocumento === 1){
        (sDocumento.length === 8) ? this.bInvalido = false : this.bInvalido = true;
    }else if(iTipoDocumento && iTipoDocumento === 6){
        (sDocumento.length === 11) ? this.bInvalido = false : this.bInvalido = true;
      //this.bInvalido = (!this.validarInput(sDocumento));
    }else if(iTipoDocumento){
         this.bInvalido = false;
    }
    this.c_documento.setValue(sDocumento);
  }

  validarInput(input) {
    var ruc       = input.replace(/[-.,[\]()\s]+/g,"");
    
    //Es entero?    
    if ((ruc = Number(ruc)) && ruc % 1 === 0
    	&& this.rucValido(ruc)) { // ⬅️ ⬅️ ⬅️ ⬅️ Acá se comprueba
    	return true;
    } else {
      return false;
    }
}

// Devuelve un booleano si es un RUC válido
// (deben ser 11 dígitos sin otro caracter en el medio)
rucValido(ruc) {
    //11 dígitos y empieza en 10,15,16,17 o 20
    if (!(ruc >= 1e10 && ruc < 11e9
       || ruc >= 15e9 && ruc < 18e9
       || ruc >= 2e10 && ruc < 21e9))
        return false;
    var dRuc = ruc - 1 + 1;
    
    for (var suma = -(ruc%10<2), i = 0; i<11; i++, ruc = ruc/10|0)
        suma += (ruc % 10) * (i % 7 + (i/7|0) + 1);
    let complemento = 11 - (suma % 11);
    return dRuc % 10 == complemento % 10

    // return suma % 11 === 0;    
}

  private onGoAgendarRoute() {
    this.cRouter.navigateByUrl('/agendar/' + this.c_placa.value);
  }

  private onGoConsultarRoute() {
    this.cRouter.navigateByUrl('/consultar');
  }

  public executeAction(action: string, CallBack, tipo: number): void {
    let that = this;
    if (this.singleExecutionSubscription) {
      this.singleExecutionSubscription.unsubscribe();
    }
    this.singleExecutionSubscription = this.recaptchaV3Service.execute(action)
      .subscribe((token) => {
        this.recentToken = token;
        CallBack(this.recentToken, that, tipo);
      });
  }

  public onGoLogon() {
    this.cRouter.navigateByUrl("/logon");
  }

  ngOnDestroy(): void {
    /*clearInterval(this.interval);
    this.mobileQuery.removeListener(this._mobileQueryListener);
    if (this.allExecutionsSubscription) {
      this.allExecutionsSubscription.unsubscribe();
    }
    if (this.singleExecutionSubscription) {
      this.singleExecutionSubscription.unsubscribe();
    }*/
  }
  onObtenerTiposDocumento() {
    this.cAgendarGeneralService.isGlobalLoading = true;
    this.cSesionService.obtenerDocumentos().subscribe(oContent => {
      this.aTiposDocumentos = oContent
    },()=> {

      this.cAgendarGeneralService.isGlobalLoading = false;
    },()=> {

    this.cAgendarGeneralService.isGlobalLoading = false;
    });
  }
  //Obtener datos de compañia
  onGetMasterCompany() {

    this.cAgendarGeneralService.isGlobalLoading = true;
    //Activa la barra de carga
    //Objeto JSON para enviar el request
    var oData = {
      masterUserId: this.MasterUserId,
      companyId: this.CompanyId,
      isActived: true
    }
    //Consumir API
    var canales=[];
    this.cCompaniaService.onMasterCompanyGet(oData).subscribe(oRes => { 
      oRes.forEach(element => {
        if(element.CompanyId.toUpperCase()==this.CompanyId.toUpperCase()){
          localStorage.setItem("telefono",element.Phone);
          this.telefono =element.Phone;
        }
        canales = element.ChannelsByCompany;
      });
      canales.forEach(element => {
        if(element.ChannelId == 1){
          this.valCanal= true;
        }
      });
    
    }, oErr => {
      //Desactiva la barra de carga 

    this.cAgendarGeneralService.isGlobalLoading = false;
    },()=>{

    this.cAgendarGeneralService.isGlobalLoading = false;
    });
  }
  onGetLibroReclamaciones() {
    this.cAgendarGeneralService.isGlobalLoading = true;
    var oData;
    oData = {
      masterUserId: localStorage.getItem("MasterUserId"),
      companyId: localStorage.getItem("CompanyId"),
      contentId: null,
      parentId: null,
      identifier: 'LIBRODERECLAMAC',
      isPublished:true
    }
    this.cImagenesService.onGetImagen(oData).subscribe(resp => {
     if(resp.length>0){
      this.tituloLibro=resp[0].Title;
      this.linkLibro=resp[0].Text;
     }
    },(error)=>{

      this.cAgendarGeneralService.isGlobalLoading = false;
    },()=>{

      this.cAgendarGeneralService.isGlobalLoading = false;
    });
  }
  onCallTelefono(){
    window.open('tel:' + this.telefono, '_blank');
  }
}
