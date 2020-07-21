import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { TranslateService } from '@ngx-translate/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ConfiguracionService } from 'src/app/services/configuracion/configuracion.service';
import { SesionService } from 'src/app/services/sesion/sesion.service';
import { AgendarGeneralService } from 'src/app/services/agendar-general.service';
import { ConfigService } from 'src/app/services/config.service';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar, MatDialog } from '@angular/material';
import { MyErrorStateMatcher } from 'src/app/pages/home/home.component';
import { Subscription } from 'rxjs';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { SharedService } from 'src/app/services/shared.service';
import { MsgAlertComponent } from '../msg-alert/msg-alert.component';

export class UploadFile {
  constructor(public base64: string, public name: string, public size: number, public type: string) { }
}

@Component({
  selector: 'app-agendar-cliente-alterno',
  templateUrl: './agendar-cliente-alterno.component.html',
  styleUrls: ['./agendar-cliente-alterno.component.css']
})
export class AgendarClienteAlternoComponent implements OnInit {
  public oDataMain: any = { "p_i_usuario_usuario": 0, "c_apellidos_usuario": "", "c_nombres_usuario": "", "c_documento_usuario": "", "c_correo_usuario": "", "p_i_usuario_cliente": 0, "c_apellidos_cliente": "", "c_nombres_cliente": "", "c_documento_cliente": "", "c_correo_cliente": "" };
  public activeLang = 'es';
  mobileQuery: MediaQueryList;
  private allExecutionsSubscription: Subscription;
  private singleExecutionSubscription: Subscription;
  public recentToken: string = '';
  matcher = new MyErrorStateMatcher();
  selectedFileDocumento: any[];
  archivoDocumento: string = '';
  goUploadDocumento: boolean = false;
  telefono = "";
  p_i_marca;
  modificar = true;

  formNombres = new FormControl('', [ ]);
  formApellidos = new FormControl('', [
    Validators.required
  ]);
  formTipoDocumento = new FormControl('', [
    Validators.required
  ]);
  aTiposDocumentos: any[] = [];
  formNDocumento = new FormControl('', [
    Validators.required
  ]);
  formCorreo = new FormControl('', [
    Validators.required,
    Validators.pattern(/^[^@]+@[^@]+\.[a-zA-Z]{2,}$/)
  ]);
  formCelular = new FormControl('', [
    Validators.required,
    Validators.pattern(/^[0-9]*$/)
  ]);

  formDepartamento = new FormControl('', [
    Validators.required
  ]);
  aDepartamento: any[] = [];

  formProvincia = new FormControl('', [
    Validators.required
  ]);
  aProvincias: any[] = [];

  formDistrito = new FormControl('', [
    Validators.required
  ]);
  aDistritos: any[] = [];

  formDireccion = new FormControl('', [
    Validators.required
  ]);

  CustomerId;
  PlateName;
  IdenticationDocument;
  GeoLocationId;
  lengthDocumento = 15;
  regExDocumento = /^[A-Za-z0-9]{1,15}$/;
  aUploadFiles: UploadFile[] = [];
  Status; // 3 registro pendiente (nuevo cliente), 4 asignación de vehículo por confirmar (cliente existente, vehículo nuevo)
  shouldRun = [/(^|\.)plnkr\.co$/, /(^|\.)stackblitz\.io$/].some(h => h.test(window.location.host));
  ipAddress;
  constructor(
    public cMatDialog: MatDialog,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private translate: TranslateService,
    private cRouter: Router,
    private cConfiguracionService: ConfiguracionService,
    private cSesionService: SesionService,
    private cAgendarGeneralService: AgendarGeneralService,
    private cConfigService: ConfigService,
    private cActivatedRoute: ActivatedRoute,
    private cMatSnackBar: MatSnackBar,
    private recaptchaV3Service: ReCaptchaV3Service,
    //NUEVO
    private cSharedService: SharedService,
  ) {
    this.translate.setDefaultLang(this.activeLang);
    this.p_i_marca = cConfigService.onObtenerMarcaBase();
    this.PlateName = this.cActivatedRoute.snapshot.params.sPlaca;
    this.IdenticationDocument = '17493248';
    this.cConfigService.flujoAlterno = true;
  }

  ngOnInit() {
    this.telefono = localStorage.getItem("telefono");
    let  habilitar = localStorage.getItem("read");
    this.modificar = ( habilitar == "X" ? false : true ); 
    //this.onObtenerTelefono();//no existe el servicio en .net
    this.getIP();
    this.onObtenerDepartamentos();
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
  onObtenerTiposDocumento() {
    this.cSesionService.obtenerDocumentos().subscribe(oContent => {
      this.aTiposDocumentos = oContent
    }, (oEr) => {

    }, () => {
      this.onSetBackendCustomerData();
    });
  }

  onSetBackendCustomerData() { 
    let  valUser = localStorage.getItem("UserData");    
    if(valUser != "undefined" && valUser != "null" && valUser != "") {
      let user = JSON.parse(localStorage.getItem("UserData"))[0];
      if(user==undefined || user==null){
        user = JSON.parse(localStorage.getItem("UserData"));
      }
      let identicationExternalCode: string;
      let geolocationExternalCode: string="";
      let departmentoExternalCode: string="";
      let provinciaExternalCode: string="";
      if(user.ExternalCodeGeolocation !=undefined && user.ExternalCodeGeolocation !="" ){
        geolocationExternalCode= user.ExternalCodeGeolocation;
        departmentoExternalCode= (geolocationExternalCode ? geolocationExternalCode.substr(0, 2) + '0000' : "");
        provinciaExternalCode = (geolocationExternalCode ? geolocationExternalCode.substr(0, 4) + '00' : "");
      }
     
      let distritoExternalCode: string = geolocationExternalCode;
      if(localStorage.getItem('falloReniec')==""){
        this.CustomerId = user.CustomerId;
        this.formNombres.setValue((user.FirstName) ? user.FirstName.trim():'');
        this.formApellidos.setValue((user.LastName) ? user.LastName.trim():'');
        this.formCorreo.setValue((user.Email) ? user.Email.trim() : "");
        this.formCelular.setValue(user.Phone);
        this.GeoLocationId = user.GeolocationId;
        this.formDireccion.setValue(user.Address);
      }      
      this.formDepartamento.setValue(departmentoExternalCode);
      this.onSelectionChangeDepartamento(departmentoExternalCode);
      this.formProvincia.setValue(provinciaExternalCode);
      this.onSelectionChangeProvincia(provinciaExternalCode);
      this.formDistrito.setValue(distritoExternalCode);
      this.onSelectionChangeDistrito(distritoExternalCode);      
      this.formTipoDocumento.setValue(user.IdenticationTypeId);
      this.formNDocumento.setValue(user.IdenticationDocument.trim());
      this.aTiposDocumentos.forEach(element => {
        if (element.IdenticationTypeId === user.IdenticationTypeId) {
          identicationExternalCode = element.ExternalId
          this.onSetRegExDocumento(identicationExternalCode);
        }
      });
      this.modificar = (user.FirstName != '' || user.FirstName != undefined ? false : true );
    } 
    this.formTipoDocumento.setValue(parseInt(localStorage.getItem("xTipoDocu")));
    this.formNDocumento.setValue(localStorage.getItem("xNumDocu").trim());
    /* -@id
    else{
      let  userReniec = JSON.parse(localStorage.getItem("userReniec"));
      this.formNombres.setValue(userReniec.nombres);
      this.formApellidos.setValue(userReniec.apellido_paterno + " " + userReniec.apellido_materno);
      this.formNDocumento.setValue(userReniec.dni);
      this.formTipoDocumento.setValue(1);
      this.CustomerId = null;
      this.GeoLocationId =null;
    }*/
  }
  onValidarData(oData){
    if(oData != null){
      return oData;
    }
    return oData
  }

  onObtenerDepartamentos() {
    let oDataSend = {
      externalCode: 'X',
      masterUserId: null,
      companyId: null,
      flagGlobal:true
    } 
    this.cSesionService.onGeolocationGet(oDataSend).subscribe(oContent => {
      this.aDepartamento = oContent
    }, (oErr) => {

    }, () => {
    this.onObtenerTiposDocumento();
    });
  }

  onSelectionChangeDepartamento(departamentoExternalCode) {
   // this.formProvincia.setValue('');
    //this.formDistrito.setValue('');
    let trimExternalCode = departamentoExternalCode.substr(0, 2);
    this.onObtenerProvincias(trimExternalCode);
  }

  onObtenerProvincias(externalCode) {
    let oDataSend = {
      externalCode: externalCode.toString(),
      masterUserId: null,
      companyId: null,
      flagGlobal:true
    }
    this.cSesionService.onGeolocationGet(oDataSend).subscribe(oContent => {
      this.aProvincias = oContent
    });
  }

  onSelectionChangeProvincia(provinciaExternalCode) {
    //this.formDistrito.setValue('');
    let trimExternalCode = provinciaExternalCode.substr(0, 4);
    this.onObtenerDistritos(trimExternalCode);
  }

  onObtenerDistritos(externalCode) {
    let oDataSend = {
      externalCode: externalCode.toString(),
      masterUserId: null,
      companyId: null,
      flagGlobal:true
    }
    this.cSesionService.onGeolocationGet(oDataSend).subscribe(oContent => {
      this.aDistritos = oContent
    });
  }

  onSelectionChangeDistrito(distritoExternalCode) { 
    this.aDistritos.forEach(element => { 
      if (element.ExternalCode === distritoExternalCode) {
        this.GeoLocationId = element.GeoLocationId; 
      }
    });
  }

  onSetRegExDocumento(externalCode) {
    if (externalCode === 'P1') {            //Documento de Identidad
      this.regExDocumento = /^[0-9]{8}$/
      this.lengthDocumento = 8;
    } else if (externalCode === 'P6') {     //RUC
      this.regExDocumento = /^[0-9]{11}$/
      this.lengthDocumento = 11;
    } else {
      this.lengthDocumento = 15;
      this.regExDocumento = /^[A-Za-z0-9]{1,15}$/
    }
  }

  onVerificarDatos() {
    let flat = true;
    let detalle = '';
    if (!this.formApellidos.valid) {
      flat = false;
      detalle = "Complete correctamente el apellido";
    } else if (!this.formCorreo.valid) {
      flat = false;
      detalle = "Complete correctamente el correo";
    } else if (!this.formCelular.valid) {
      flat = false;
      detalle = "Complete correctamente el celular";
    } else if (!this.formDepartamento.valid) {
      flat = false;
      detalle = "Elija una región";
    } else if (!this.formProvincia.valid) {
      flat = false;
      detalle = "Elija una provincia";
    } else if (!this.formDistrito.valid) {
      flat = false;
      detalle = "Elija un distrito";
    } else if (!this.formDireccion.valid) {
      flat = false;
      detalle = "Complete correctamente la dirección";
    } else if (!this.formTipoDocumento.valid) {
      flat = false;
      detalle = "Elija un tipo de documento";
    } else if (!this.formNDocumento.valid) {
      flat = false;
      detalle = "Complete correctamente el documento";
    } else if (!this.formNDocumento.valid) {
      flat = false;
      detalle = "Complete correctamente el documento";
    } else if (!this.regExDocumento.test(this.formNDocumento.value.trim())) {
      flat = false;
      detalle = "Ingrese un formato válido de para el tipo de documento seleccionado";
    }
    let postVerificacion = {
      'flat': flat,
      'detalle': detalle
    }
    return postVerificacion
  }
  getIP()  
  {  
      this.cSesionService.getIPAddress().subscribe(oRes => {
        this.ipAddress=oRes;  
        this.ipAddress = this.ipAddress.ip;
      });
  } 
  onGoRegistrar() {
    if (this.onVerificarDatos().flat) {
      
      let postData = {
        CustomerId: this.CustomerId,
        Firstname: this.formNombres.value,
        Lastname: this.formApellidos.value,
        TypeDocId: this.formTipoDocumento.value,
        DocumentId: this.formNDocumento.value,
        Phone: this.formCelular.value,
        Address: this.formDireccion.value,
        Email: this.formCorreo.value,
        geolocationId: this.GeoLocationId,
        Host:this.ipAddress,
        AppId: localStorage.getItem("AppId"),
        CompanyId:localStorage.getItem("CompanyId"),
        b64files: JSON.stringify(this.aUploadFiles),
        Plate: localStorage.getItem('PlateName'),
        Status:localStorage.getItem("tipoEnvio"),
        channelId: 1,
        RequestType: 1,
        IsOwner: true
      } 
      this.cSesionService.registrarUsuario(postData).subscribe(resp => {
        var type="";
        resp.CodeResponse? type="Exito":type="Error"     
        var data = {
          tipo:type,
          mensajeCorto:resp.RetMessage,
          mensajeLargo:resp.TraceMessage
        }
        if(resp.CodeResponse || resp.idType==4){
          if(localStorage.getItem("SessionId")=="" && localStorage.getItem("CredentialId")=="" ){
            localStorage.setItem('UserData', resp.UserData);
            localStorage.setItem('SessionId', resp.SessionId);
            localStorage.setItem('CredentialId', resp.CredentialId);
          }
          this.onGoAgendarRoute();
        }else{
          this.onMostrarMensaje(data,this);
        }
      }, orr => {

      });
    } else {
      this.cMatSnackBar.open(this.onVerificarDatos().detalle, "cerrar", {
        verticalPosition: 'top',
        horizontalPosition: 'end',
        duration: 2000,
      });
    }
  }
  onMostrarMensaje(data,that){
    const dialogRef = that.cMatDialog.open(MsgAlertComponent, {
      data: data
    });
    dialogRef.afterClosed().subscribe(oResp => { 
    });       
  }

  selectFileDocumento(fileInput: any) {
    let that = this;
    if (fileInput.target.files.length !== 0) {
      this.selectedFileDocumento = fileInput.target.files;
      this.aUploadFiles = [];
      Array.from(this.selectedFileDocumento).forEach(element => {
        let reader = new FileReader();
        let splitBase64;
        reader.readAsDataURL(element);
        reader.onload = function () {
          let base64: string = reader.result.toString();
          splitBase64 = base64.split(',')[1];
          if(!(element.type.includes("image/")) && !(element.type.includes("application/pdf"))){
            that.aUploadFiles = [];
            fileInput.target.value = "";
            that.onMostrarMensaje({ 
              tipo:"Error",
              mensajeCorto:"Se detectaron archivos no permitidos. Solo se permiten archivos de imágenes y PDF.",
              mensajeLargo: ""
            }, that)         
            return;
          }
          that.aUploadFiles.push(new UploadFile(splitBase64, element.name, element.size, element.type));
        };
      });  
    }
  }



  /*selectFile(fileInput: any) {
    if (fileInput.target.files.length !== 0) {
      this.selectedImage = fileInput.target.files[0];
      let nameAux = this.selectedImage.name;
      let sizeAux = this.selectedImage.size;
      if (this.onValidarImagen(nameAux, sizeAux) !== false) {
        this.formExtensionFile = '.' + this.onValidarImagen(nameAux, sizeAux);
        let reader = new FileReader();
        reader.readAsDataURL(this.selectedImage);
        reader.onload = (e: any) => {
          let preview = document.getElementById('previewImage');
          preview.setAttribute("src", String(reader.result));
          let base64: string = e.target.result;
          this.formBase64Image = base64.split(',')[1];
        };
      } else {
        let sMessage = '';
        let sTrans = "ContentInitErrorImage";
        this.cTranslateService.get(sTrans).subscribe((text: string) => {
          sMessage = text;
        });
        this.cSnackbarService.openSnackBar(sMessage, '', 'Error');
      }
    } else {

    }
  }*/

  private onGoAgendarRoute() {
    this.cConfigService.flujoAlterno = true;
    this.cRouter.navigateByUrl('/agendar/' + this.PlateName);
  }

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

  onGoHome() {
    this.cRouter.navigateByUrl('/');
  }

  onObtenerTelefono() {
    var oData = {
      c_descripcion: 'TELEFONO_DFSK',
    }
    this.cConfiguracionService.onObtenerTelefono(oData).subscribe(resp => {
      this.telefono = resp[0].c_valor1;
    });
  }
  onCallTelefono(){
    window.open('tel:' + this.telefono, '_blank');
  }
}
