import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MensajeDialogoComponent } from '../mensaje-dialogo/mensaje-dialogo.component';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { AgendarGeneralService } from 'src/app/services/agendar-general.service';
import { ReservaService } from 'src/app/services/reserva/reserva.service';
import { CorreoService } from 'src/app/services/correo/correo.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfiguracionService } from 'src/app/services/configuracion/configuracion.service';
import { ServiciopoService } from 'src/app/services/serviciopo/serviciopo.service';
import { ConfigService } from 'src/app/services/config.service';
import { TerminosService } from 'src/app/services/terminos/terminos.service';
import { SesionService } from 'src/app/services/sesion/sesion.service';
import { ThrowStmt } from '@angular/compiler';

@Component({
  selector: 'app-agendar-verificar',
  templateUrl: './agendar-verificar.component.html',
  styleUrls: ['./agendar-verificar.component.css']
})
export class AgendarVerificarComponent implements OnInit {
  telefono = "";
  p_c_placa;
  private oUsuario;
  public oProteccionDatos = false ;
  public activeLang = 'es';
  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;
  shouldRun = [/(^|\.)plnkr\.co$/, /(^|\.)stackblitz\.io$/].some(h => h.test(window.location.host));
  p_i_marca;
  sTerminosCondiciones : any = {c_descripcion:""};
  sProteccion : any = {c_descripcion:"Protección de datos"};
  progress:boolean = false;
  public oDataMain: any = { "p_i_usuario_usuario": 0, "c_apellidos_usuario": "", "c_nombres_usuario": "", "c_documento_usuario": "", "c_correo_usuario": "", "p_i_usuario_cliente": 0, "c_apellidos_cliente": "", "c_nombres_cliente": "", "c_documento_cliente": "", "c_correo_cliente": "" };
  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private translate: TranslateService,
    private cConfigService: ConfigService,
    public cMatDialog: MatDialog,
    private cRouter: Router,
    public cAgendarGeneralService: AgendarGeneralService,
    private cReservaService: ReservaService,
    private cCorreoService: CorreoService,
    private cMatSnackBar: MatSnackBar,
    private cConfiguracionService: ConfiguracionService,
    private cServiciopoService: ServiciopoService,
    private cActivatedRoute: ActivatedRoute,
    private cTerminosService:TerminosService,
    private cSesionService: SesionService,
  ) {
    
    this.translate.setDefaultLang(this.activeLang);
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    this.p_c_placa = this.cActivatedRoute.snapshot.params.sPlaca;
    this.p_i_marca = cConfigService.onObtenerMarcaBase();
  }

  ngOnInit() {
    if (localStorage.getItem("UserData") == "") {
      this.cRouter.navigate(["/agendar/" + this.p_c_placa]);
      return;
    }
    let user = JSON.parse(localStorage.getItem("UserData")); 
    if(user==undefined || user==null){
      user = JSON.parse(localStorage.getItem("UserData"));
      this.cRouter.navigateByUrl('/'); //Add by security
      return;
    }else{
      user = JSON.parse(localStorage.getItem("UserData"))[0]; //Add by security
    }
    this.oDataMain = user;
    this.telefono = localStorage.getItem("telefono")
    //this.onObtenerTelefono();
    //this.onObtenerEstadoProteccionDatos();
    //this.onCargarLegal();
  }
  ngAfterViewInit() {
     //ir arriba en la pagina
     let top = document.getElementById('top');
     if (top !== null) {
       top.scrollIntoView();
       top = null;
     }
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
  onObtenerTelefono() {
    this.progress = true;
    var oData = {
      c_descripcion: 'TELEFONO_DFSK',
    }
    this.cConfiguracionService.onObtenerTelefono(oData).subscribe(resp => {
      this.telefono = resp[0].c_valor1;
      this.progress = false;
    }, err => {
      this.progress = false;
    });
  }
  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
  onObtenerEstadoProteccionDatos() {
    this.progress = true;
    let oData = {
      companyId:localStorage.getItem("CompanyId"),
      masterUserId:localStorage.getItem('MasterUserId'),
      customerId:this.oDataMain.CustomerId
    }
    this.cConfiguracionService.CustomersByCompanyPITGet(oData).subscribe(resp => {
      if (resp.length > 0) {
        if (resp[0].DatePIT === null) {
          this.oProteccionDatos = true;
          this.cAgendarGeneralService.oAgenda.c_proteciondatos.setValue(false);
        }else{
          this.oProteccionDatos = false;
        }
      }else{
        this.oProteccionDatos = true;
      }
      this.progress = false;

    }, err=>{
      this.progress = false;
    });
  }
  onGrabarProteccionDeDatos() { 
    let oData = {
      companyId:localStorage.getItem("CompanyId"),
      masterUserId:localStorage.getItem('MasterUserId'),
      customerId:this.oDataMain.CustomerId
    }
    this.cConfiguracionService.CustomersByCompanyPITModify(oData).subscribe(resp => {
      
    }, err=>{ 
    });
  }
  onCancelarReserva() {
    const dialogRef = this.cMatDialog.open(MensajeDialogoComponent, {
      width: '400px',
      height: '260px',
      data: {
        sMensaje: '¿Seguro que deseas cancelar la reserva seleccionada?',
        sButton: 'CANCELAR RESERVA',
        sNo: 'NO'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'OK') {       
         this.onGoHome();
      } else {
        return;
      }
    });
  }

  onGoAgendar() {
    this.cRouter.navigateByUrl('/agendar/' + this.p_c_placa);
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
        this.cRouter.navigate(["/"]);
      }, err => { 
      });    
  }

  onGoMsgCancel() {
    this.cRouter.navigateByUrl('/msg-cancelar');
  }
  fnConvertirDateToString(d_fecha: Date) {
    let d_fecha_aux = d_fecha.toLocaleString('es', { year: "numeric", month: "2-digit", day: "2-digit", hour: '2-digit', minute: '2-digit', second: "2-digit", hour12: false }).split(" ");
    let fecha = d_fecha_aux[0].split("/");
    let hora = d_fecha_aux[1];
    return fecha[2] + '-' + fecha[1] + '-' + fecha[0] + 'T' + hora;
  }
  onGoMsgExito() {
    let estadoReserva;
    if (this.onValidarReserva) {
      if(this.cConfigService.flujoAlterno){
        estadoReserva = 5
      }else{
        estadoReserva = 1
      }
      var placa = localStorage.getItem('PlateName');
      if(placa.indexOf("-")==-1){
        placa = placa.substring(0,3) + '-' + placa.substring(3,6);
      }
      this.progress = true;
      let oDataSend = {
        agendaId : null,
        eventType:100,
        startDate:this.fnConvertirDateToStringFecha(this.cAgendarGeneralService.oAgenda.d_fecha) + 'T' + this.cAgendarGeneralService.oAgenda.sHora,
        name:"",
        detail:this.cAgendarGeneralService.oAgenda.c_observaciones.value,
        credentialId:localStorage.getItem('CredentialId'),
        masterUserId:localStorage.getItem('MasterUserId'),
        companyId: localStorage.getItem("CompanyId"),
        workshopId:this.cAgendarGeneralService.oAgenda.p_c_taller,
        channelId:this.cAgendarGeneralService.oAgenda.aCanales[0].ChannelId,
        serviceId:this.cAgendarGeneralService.oAgenda.c_tipo_servicio.value,
        companyAdviserId:this.cAgendarGeneralService.oAgenda.sAsesorFinal.c_asesor,
        vehicleId:null,
        plate:placa,
        mileageValue:this.cAgendarGeneralService.oAgenda.sKilometraje.replace(/ KM/g, ""),
        mileagePackage:this.cAgendarGeneralService.oAgenda.sPackage,
        customerId:this.oDataMain.CustomerId,
        statusId:1,
        representativeId:0,
        identicationTypeId:this.cAgendarGeneralService.oAgenda.c_repre_tipoDoc.value =="" ? null : this.cAgendarGeneralService.oAgenda.c_repre_tipoDoc.value,
        representativeFirstName:this.cAgendarGeneralService.oAgenda.c_repre_nombre.value==null ? '' : this.cAgendarGeneralService.oAgenda.c_repre_nombre.value,
        representativeLastName:this.cAgendarGeneralService.oAgenda.c_repre_apellido.value==null ? '' : this.cAgendarGeneralService.oAgenda.c_repre_apellido.value,
        identicationDocument:this.cAgendarGeneralService.oAgenda.c_repre_documento.value==null ? '' : this.cAgendarGeneralService.oAgenda.c_repre_documento.value,
        isRepresentativeControl:this.cAgendarGeneralService.oAgenda.c_repre_desicion.value,
        IsPickUpAndDelivery:this.cAgendarGeneralService.oAgenda.isPickUpAndDelivery.value
      }
      this.cReservaService.crearReserva(oDataSend).subscribe(oRespuesta => { 
        if (oRespuesta.codeResponse) {
          if(this.cAgendarGeneralService.oAgenda.c_proteciondatos.value){
            this.onGrabarProteccionDeDatos();
          }     
          this.cAgendarGeneralService.fnRestaurarReservaSesion();
          this.cRouter.navigateByUrl('/msg-exito'); 
        }else{
          this.cMatSnackBar.open("No se pudo registrar la reserva, intente en un horario diferente", "cerrar", {
            verticalPosition: 'top',
            horizontalPosition: 'end',
            duration: 2000,
          });
        }
        this.progress = false;
      }, oErr => {
        this.progress = false;

      })    
    }
  }
  onEnvioCorreo(datos){
    var nombreRepre ="";
    var documentoRepre ="";
    var telefonoRepre ="";
    if(this.cAgendarGeneralService.oAgenda.isRepresentante){
      nombreRepre= datos.representativeFirstName +" "+ datos.representativeLastName;
      documentoRepre = datos.identicationDocument;
      telefonoRepre= this.cAgendarGeneralService.oAgenda.c_repre_telefono.value;
    }
    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

    var odata={
      Plate:datos.plate,
      Region:this.cAgendarGeneralService.oAgenda.sRegion,
      Taller:this.cAgendarGeneralService.oAgenda.sTaller,
      Direccion:this.cAgendarGeneralService.oAgenda.sDireccionTaller,
      Asesor:this.cAgendarGeneralService.oAgenda.sAsesorFinal.FirstName,
      Servicio:this.cAgendarGeneralService.oAgenda.sTipoServicio,
      Kilometraje:this.cAgendarGeneralService.oAgenda.sKilometraje,
      Dia:this.cAgendarGeneralService.oAgenda.sAsesorFinal.d_horario.toLocaleDateString(undefined, options),
      Hora: this.cAgendarGeneralService.oAgenda.sAsesorFinal.d_horario.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }),
      isRepresentate:this.cAgendarGeneralService.oAgenda.isRepresentante==null ? false:this.cAgendarGeneralService.oAgenda.isRepresentante,
      NombreRepre:nombreRepre,
      DocumentoRepre:documentoRepre,
      TelefonoRepre:telefonoRepre,
      isTomaraDecisiones:datos.isRepresentativeControl==null ? '' :datos.isRepresentativeControl,
      telefono:localStorage.getItem("telefono"),
      Email:this.oDataMain.Email,
      Nombre:this.onPascalCaseString(this.oDataMain.FirstName + " "+ this.oDataMain.LastName),
      CustomerId:datos.customerId,
    }
    this.cReservaService.enviarCorreo(odata).subscribe(oRespuesta => {
      if (oRespuesta.codeResponse) {
        
      }else{
        this.cMatSnackBar.open("Hubo un problema al enviar el correo", "cerrar", {
          verticalPosition: 'top',
          horizontalPosition: 'end',
          duration: 2000,
        });
      }
      this.progress = false;
    }, oErr => {
      this.progress = false;

    })  
  }
  onPascalCaseString(sPalabras: string): string {
    let aux = '';
    sPalabras.split(" ").forEach(element => {
      element = element.toLowerCase();
      aux += " " + element.charAt(0).toUpperCase() + '' + element.substring(1);
    });
    return aux;
  }
  fnConvertirDateToStringFecha(d_fecha: Date) {
    let d_fecha_aux = d_fecha.toLocaleString('es', { year: "numeric", month: "2-digit", day: "2-digit", hour: '2-digit', minute: '2-digit', second: "2-digit", hour12: false }).split(" ");
    let fecha = d_fecha_aux[0].split("/");
    let hora = d_fecha_aux[1];
    return fecha[2] + '-' + fecha[1] + '-' + fecha[0];
  }
  onValidarReserva(): boolean {
    let flag = true;
    if (this.cAgendarGeneralService.oAgenda.isRepresentante) {
      if (this.cAgendarGeneralService.oAgenda.c_repre_nombre.value === '') {
        flag = false;
        this.cMatSnackBar.open("Ingresar nombre de representante", "cerrar", {
          verticalPosition: 'top',
          horizontalPosition: 'end',
          duration: 2000,
        });
      } else if (this.cAgendarGeneralService.oAgenda.c_repre_documento.value === '') {
        flag = false;
        this.cMatSnackBar.open("Ingresar documento de representante", "cerrar", {
          verticalPosition: 'top',
          horizontalPosition: 'end',
          duration: 2000,
        });
      } else if (this.cAgendarGeneralService.oAgenda.c_repre_telefono.value === '') {
        flag = false;
        this.cMatSnackBar.open("Ingresar teléfono de representante", "cerrar", {
          verticalPosition: 'top',
          horizontalPosition: 'end',
          duration: 2000,
        });
      }
    }
    return flag;
  }
  onCargarLegal() {
    let dataSend = {
      p_i_marca: this.p_i_marca
    }
    this.cTerminosService.obtenerTalleres(dataSend).subscribe(oData => {
      oData.forEach(element => {
        if(element.c_codigo === 'TYC'){
          this.sTerminosCondiciones = element;
        }
        if(element.c_codigo ==='PPD'){
          this.sProteccion = element;
        }
      });
    }, oError => {

    })
  }
  onVerProtecionDatos() { 
    if(this.sProteccion.c_url !== ''){
      window.open(this.sProteccion.c_url, '_blank');
    }
  }


  onCallTelefono(){
    window.open('tel:' + this.telefono, '_blank');
  }
}
