import { MediaMatcher } from '@angular/cdk/layout';
import { Component, OnInit, ChangeDetectorRef, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MensajeDialogoOkComponent } from './../mensaje-dialogo-ok/mensaje-dialogo-ok.component';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
/*FULL COMBO*/
import { AgendarGeneralService } from 'src/app/services/agendar-general.service';
import { OpcionesModel } from 'src/app/models/opciones.model';
import { AgendaModel } from 'src/app/models/agenda.model';
import { CorreoService } from 'src/app/services/correo/correo.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfiguracionService } from 'src/app/services/configuracion/configuracion.service';
import { ReservaService } from 'src/app/services/reserva/reserva.service';
import { ConfigService } from 'src/app/services/config.service';
import { IgxCalendarComponent, DateRangeType } from 'igniteui-angular';
import { CalendarioService } from 'src/app/services/calendario/calendario.service';
import { SesionService } from 'src/app/services/sesion/sesion.service';
import { TerminosService } from 'src/app/services/terminos/terminos.service';
import { CustomerService } from 'src/app/services/customer.service';
import { SharedService } from 'src/app/services/shared.service';
import { WorkshopService } from 'src/app/services/workshop.service';
import { AdviserService } from 'src/app/services/adviser.service'; 
import { CompanyService } from 'src/app/services/company.service';
import { ImagenesService } from 'src/app/services/imagenes/imagenes.service';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours,
  addMinutes,
  startOfMonth,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
  endOfYear,
} from 'date-fns';
import { UtilityClass } from 'src/app/Utility';
@Component({
  selector: 'app-consultar-editar',
  templateUrl: './consultar-editar.component.html',
  styleUrls: ['./consultar-editar.component.css']
})
export class ConsultarEditarComponent implements OnInit, OnDestroy , AfterViewInit {
  public oDataMain: any = { "p_i_usuario_usuario": 0, "c_apellidos_usuario": "", "c_nombres_usuario": "", "c_documento_usuario": "", "c_correo_usuario": "", "p_i_usuario_cliente": 0, "c_apellidos_cliente": "", "c_nombres_cliente": "", "c_documento_cliente": "", "c_correo_cliente": "" };
  @ViewChild("calendar", { static: true }) public calendar: IgxCalendarComponent;
  public activeLang = 'es';
  public formatOptions: any;
  public formatViews: any;
  public telefono: string = "";
  public flag = false;
  public progress: boolean = false;
  public isShownRepresentante: boolean = false;
  public isShownNoRepresentante: boolean = false;
  public CompanyId = localStorage.getItem("CompanyId");
  public MasterUserId = localStorage.getItem("MasterUserId");
  p_i_marca;
  /*CALENDARIO MOVIL */
  descMes: string;
  descAnio: string;
  dias: any = [];
  fechaPrinc: Date;
  diasSemana: any = [];
  /*CALENDARIO MOVIL */
  public sTerminosCondiciones: any = { c_descripcion: "" };
  public sProteccion: any = { c_descripcion: "" };
  public sRepresentante: any = { c_descripcion: "" };
  /*FULL COMBO*/
  public OpcionesGeneral: OpcionesModel[] = [];
  public oAgenda: AgendaModel = {} as AgendaModel;
  utility = new UtilityClass();
  public mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;
  public aRegiones: any[] = [];
  public aTalleres: any[] = [];
  public aAsesores: any[] = [];
  public user;
  public aHoras: any[] = [];
  private PlateName: string;
  public isHorarioVacio: boolean = false;
  aTiposDocumentos: any[] = [];
  public aPrimerDiaDisponible = [];
  constructor(
    private translate: TranslateService,
    private cRouter: Router,
    public cMatDialog: MatDialog,
    /*FULL COMBO*/
    public cAgendarGeneralService: AgendarGeneralService,
    public changeDetectorRef: ChangeDetectorRef,
    public media: MediaMatcher,
    private cCustomerService: CustomerService,
    private cCorreoService: CorreoService,
    private cMatSnackBar: MatSnackBar,
    private cConfiguracionService: ConfiguracionService,
    private cReservaService: ReservaService,
    private cActivatedRoute: ActivatedRoute,
    private cSesionService: SesionService,
    private cConfigService: ConfigService,
    private cWorkshop: WorkshopService,
    private cAdviserService: AdviserService,
    private cTerminosService: TerminosService,
    private cSharedService: SharedService,
    private cCalendarioService: CalendarioService,
    private cCompaniaService: CompanyService,
    private cImagenesService: ImagenesService,
    private ReservasService: ReservaService) {
    this.translate.setDefaultLang(this.activeLang);
    /*FULL COMBO*/
    this.cAgendarGeneralService.oAgenda.sPaso = 'false-color';
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
    
    if(this.ReservasService.reservaEditar == undefined || this.ReservasService.reservaEditar==""){
      this.cAgendarGeneralService.fnRestaurarReservaSesion();
      this.cRouter.navigateByUrl('/consultar');
      return;
    } 
    this.cAgendarGeneralService.oAgenda.isRepresentante = this.ReservasService.reservaEditar.IsRepresentativeControl;
    this.cAgendarGeneralService.oAgenda.c_repre_nombre.setValue(this.ReservasService.reservaEditar.RepresentativeFirstName);
    this.cAgendarGeneralService.oAgenda.c_repre_apellido.setValue(this.ReservasService.reservaEditar.RepresentativeLastName);
    this.cAgendarGeneralService.oAgenda.c_repre_documento.setValue(this.ReservasService.reservaEditar.RepresentativeIdenticationDocument);
    
    this.cAgendarGeneralService.oAgenda.p_c_taller = this.ReservasService.reservaEditar.WorkshopId;
    this.cAgendarGeneralService.oAgenda.c_asesor.setValue(this.ReservasService.reservaEditar.CompanyAdviserId);
    this.cAgendarGeneralService.oAgenda.c_fecha_calendario.setValue(this.utility.fnStringToDate(this.ReservasService.reservaEditar.StartDate));
    
    this.cAgendarGeneralService.oAgenda.c_repre_telefono.setValue(this.ReservasService.reservaEditar.RepresentativeTelephone);
    this.cAgendarGeneralService.oAgenda.sFecha = this.fnConvertirDateToStringFecha(this.utility.fnStringToDate(this.ReservasService.reservaEditar.StartDate));
    this.cAgendarGeneralService.oAgenda.sHora = this.fnConvertirDateToStringHora(this.utility.fnStringToDate(this.ReservasService.reservaEditar.StartDate));
    this.cAgendarGeneralService.oAgenda.d_fecha = this.utility.fnStringToDate(this.ReservasService.reservaEditar.StartDate); 
    
    this.onGetMasterCompany(null);
    this.onGetDepartamentos(this.ReservasService.reservaEditar.GeoLocationId);
    this.onObtenerTiposDocumento(this.ReservasService.reservaEditar.RepresentativeIdenticationTypeId);
    var onSendTalleres = {
      masterUserId: this.MasterUserId,
      companyId: this.CompanyId,
      workshopId: null,
      isActived: true,
      geoLocationId: this.ReservasService.reservaEditar.GeoLocationId
    }
    this.onGetTalleres(onSendTalleres,this.ReservasService.reservaEditar.WorkshopId);


    
    this.fnObtenerHorario();
    this.onCargarLegal()
    
    this.fnObtenerPrimerDiaDisponible();
    this.fechaPrinc = new Date(this.fnConvertirDateToStringFecha(new Date()));
    let fechaInicio = new Date(this.fechaPrinc.getFullYear(), (this.fechaPrinc.getMonth() - 1), 1);
    let fechaFinal = new Date(this.fechaPrinc.getFullYear(), (this.fechaPrinc.getMonth() + 2), 1);  
 
    // this.onObtenerBloqueGeneral(fechaInicio,fechaFinal);
    // //bloqueos taller    
    // let oDataTaller = {
    //   agendaId : null,
    //   masterUserId: this.MasterUserId,
    //   startDate: this.fnConvertirDateToString(fechaInicio),
    //   endDate: this.fnConvertirDateToString(fechaFinal),
    //   onlyHeader: true,
    //   companyId: this.CompanyId,
    //   workshopId: this.ReservasService.reservaEditar.WorkshopId,
    //   channelId: this.cAgendarGeneralService.oAgenda.aCanales[0].ChannelId,
    //   serviceId: null,
    //   companyAdviserId: null,
    //   eventType: 3
    // };   
    // this.fnObtenerCalendario(oDataTaller);
    //
    //bloqueos asesor    
 
    let oDataAsesor = {
      agendaId : null,
      masterUserId: this.MasterUserId,
      startDate: this.fnConvertirDateToString(fechaInicio),
      endDate: this.fnConvertirDateToString(fechaFinal),
      onlyHeader: true,
      companyId: this.CompanyId,
      workshopId: this.ReservasService.reservaEditar.WorkshopId,
      channelId: this.cAgendarGeneralService.oAgenda.aCanales[0].ChannelId,
      serviceId: null,
      companyAdviserId: this.ReservasService.reservaEditar.CompanyAdviserId,
      eventType: 4
    };   
    this.fnObtenerCalendario(oDataAsesor);
   
    
    this.telefono = localStorage.getItem("telefono");
  }
  onloadFinalBottom(){
    let top = document.getElementById('top'); 
      if (top !== null) {
        top.scrollIntoView();
        top = null; 
      }
    return '';
  } 
  onObtenerBloqueGeneral(fechaInicio,fechaFinal){
    //bloqueos generales    
    let oDataCal = {
      agendaId : null,
      masterUserId: this.MasterUserId,
      startDate: this.fnConvertirDateToString(fechaInicio),
      endDate: this.fnConvertirDateToString(fechaFinal),
      onlyHeader: true,
      companyId: this.CompanyId,
      workshopId: null,
      channelId: this.cAgendarGeneralService.oAgenda.aCanales[0].ChannelId,
      serviceId: null,
      companyAdviserId: null,
      eventType: 1
    };   
    this.fnObtenerCalendario(oDataCal);
    //
  }
  
  onGenerateLastDay(){
    var r = [this.utility.fnStringToDate(this.aPrimerDiaDisponible[0].AvailableDate)];  
    var r2 = [this.utility.fnStringToDate(this.aPrimerDiaDisponible[0].EndAvailableDate)];   
    this.calendar.disabledDates = [{ type: DateRangeType.Before, dateRange: r },{ type: DateRangeType.After, dateRange: r2 } , { type: DateRangeType.Specific, dateRange: r2 }];   

  }
  fnObtenerPrimerDiaDisponible() {
    this.progress = true;
    var asesor =null;
    if(this.cAgendarGeneralService.oAgenda.c_asesor.value!=0){
      asesor=this.cAgendarGeneralService.oAgenda.c_asesor.value;
    }
    let oDataSend = {
      masterUserId: this.MasterUserId,
      companyId: this.CompanyId,
      workshopId: this.cAgendarGeneralService.oAgenda.p_c_taller,
      companyAdviserId: asesor,
      serviceId: this.cAgendarGeneralService.oAgenda.c_tipo_servicio.value,
      channelId: this.cAgendarGeneralService.oAgenda.aCanales[0].ChannelId
    };
    this.cCalendarioService.ObtenerPrimerDiaDisponible(oDataSend).subscribe(oRes => { 
      if(oRes.length>0){
        this.aPrimerDiaDisponible = oRes;    
         
    this.onGenerateLastDay();
      }/*else{
        var data = {
          tipo:"Info",
          mensajeCorto:"No hay horarios disponibles para este asesor ",
          mensajeLargo:""
        }
        this.onMostrarMensaje(data);
      }*/
      this.progress = false;
      this.fechaPrinc = new Date(this.fnConvertirDateToStringFecha(new Date()));
      let fechaInicio = new Date(this.fechaPrinc.getFullYear(), (this.fechaPrinc.getMonth() - 1), 1);
      let fechaFinal = new Date(this.fechaPrinc.getFullYear(), (this.fechaPrinc.getMonth() + 2), 1);      
      let oDataCal = {
        agendaId : null,
        masterUserId: this.MasterUserId,
        startDate: this.fnConvertirDateToString(fechaInicio),
        endDate: this.fnConvertirDateToString(fechaFinal),
        onlyHeader: true,
        companyId: this.CompanyId,
        workshopId: this.cAgendarGeneralService.oAgenda.p_c_taller,
        channelId: this.cAgendarGeneralService.oAgenda.aCanales[0].ChannelId,
        serviceId: this.cAgendarGeneralService.oAgenda.c_tipo_servicio.value,
        companyAdviserId: null,
        eventType: 4
      };   
      //this.fnObtenerCalendario(oDataCal);
    }, oErr => {
      this.progress = false;

    });
  }
  onGetMasterCompany(GeoLocationId?) {
      //Activa la barra de carga
      this.progress = true;
      //Objeto JSON para enviar el request
      var oData = {
        masterUserId: this.MasterUserId,
        companyId: this.CompanyId,
        isActived: true
      }
      //Consumir API
      this.cCompaniaService.onMasterCompanyGet(oData).subscribe(oRes => { 
        if (oRes.length > 0) {
          //Obtener servicios por compañía y llenar el array de aTiposServicios
          this.cAgendarGeneralService.oAgenda.aTiposServicio = oRes[0].ServicesByCompany;
          this.cAgendarGeneralService.oAgenda.aCanales = oRes[0].ChannelsByCompany; 
        }
        //Desactiva la barra de carga
        this.progress = false;
      }, oErr => {
        //Desactiva la barra de carga
        this.progress = false;
         
      });
    }

  onLlenarNumerosCalendario(fecha) {
    this.descMes = fecha.toLocaleDateString('es', { month: 'long' });
    this.descMes = this.onPrimeraMay(this.descMes);
    this.descAnio = String(fecha.getFullYear());
    let aDiasAux = [];
    let aFechaAux = new Date(fecha.setDate(fecha.getDate() - 1));
    for (let index = 0; index < 4; index++) {
      let fechaAux = new Date(aFechaAux.setDate(aFechaAux.getDate() + 1));
      let c_estado = false;
      let isBlock = false;
      if (this.fnConvertirDateToStringFecha(this.cAgendarGeneralService.oAgenda.c_fecha_calendario.value) === this.fnConvertirDateToStringFecha(fechaAux)) {
        c_estado = true;
      }
      let sIndex = this.calendar.disabledDates[0].dateRange.findIndex(oEle => this.fnConvertirDateToStringFecha(oEle) === this.fnConvertirDateToStringFecha(fechaAux))
      if (sIndex !== -1) {
        isBlock = true;
      }
      aDiasAux.push({ dia: index, fecha: fechaAux, isSelecion: c_estado, isblock: isBlock });
    }
    this.dias = aDiasAux;
  }
  fnIrAntes() {
    this.fechaPrinc = new Date(this.fechaPrinc.setDate(this.fechaPrinc.getDate() - 3));;
    let fechaInicio = new Date(this.fechaPrinc.getFullYear(), (this.fechaPrinc.getMonth() - 1), 1);
    let fechaFinal = new Date(this.fechaPrinc.getFullYear(), (this.fechaPrinc.getMonth() + 2), 1);
    let oDataSend = {
      d_fecha_inicio: this.fnConvertirDateToString(fechaInicio),
      d_fecha_fin: this.fnConvertirDateToString(fechaFinal),
      p_c_taller: this.cAgendarGeneralService.oAgenda.p_c_taller
    };
    //this.fnObtenerCalendario(oDataSend);
  }

  fnIrSiguiente() {
    this.fechaPrinc = new Date(this.fechaPrinc.setDate(this.fechaPrinc.getDate() + 5));;
    let fechaInicio = new Date(this.fechaPrinc.getFullYear(), (this.fechaPrinc.getMonth() - 1), 1);
    let fechaFinal = new Date(this.fechaPrinc.getFullYear(), (this.fechaPrinc.getMonth() + 2), 1);
    let oDataSend = {
      d_fecha_inicio: this.fnConvertirDateToString(fechaInicio),
      d_fecha_fin: this.fnConvertirDateToString(fechaFinal),
      p_c_taller: this.cAgendarGeneralService.oAgenda.p_c_taller
    };
    //this.fnObtenerCalendario(oDataSend);
  }

  // fnObtenerCalendario(oDataSend) {
  //   this.progress = true;

  //   this.cCalendarioService.onObtenerCalendario(oDataSend).subscribe(aResponse => {
  //     let aRangos = [];
  //     aResponse.forEach(element => {
  //       if(element.IsAllDay){
  //         aRangos.push(new Date(element.StartDate));
  //       }
  //     });     
  //     this.calendar.disabledDates.push({ type: DateRangeType.Specific, dateRange: aRangos }); 

  //     if (this.mobileQuery.matches) {
  //       this.onLlenarNumerosCalendario(this.fechaPrinc);
  //     }
  //     this.progress = false;
  //   }, oError => {
  //     this.progress = false;

  //   });
  // }
    //Obtiene la información del calendario
  fnObtenerCalendario(oDataSend) { 
    this.progress = true;
    this.cCalendarioService.onObtenerCalendario(oDataSend).subscribe(oRes => {
  
      this.onGenerateLastDay();
      let aRangos = [];
      oRes.forEach(element => {
        if(element.IsAllDay){
          aRangos.push(this.utility.fnStringToDate(element.StartDate));
        }
      });     
      this.calendar.disabledDates.push({ type: DateRangeType.Specific, dateRange: aRangos });
      //this.calendar.disabledDates.push({ type: DateRangeType.Specific, dateRange: aRangos });
      // if (this.mobileQuery.matches) {
      //   this.onLlenarNumerosCalendario(this.fechaPrinc);
      // }
      this.progress = false;
    }, oError => {
      this.progress = false;
    });
    this.OnBuildHorarioTaller();
  }
  OnBuildHorarioTaller( ) {
    let oDiasCode = [1, 2, 3, 4, 5, 6, 7];
    let oDiasAuxLocked = [];
    let oWorkshop = this.cAgendarGeneralService.oAgenda.aTalleres.find(oEle => oEle.WorkshopId.toLowerCase() === this.cAgendarGeneralService.oAgenda.p_c_taller.toLowerCase());
    if (oWorkshop) {
      oDiasCode.forEach(element => {
        let index = oWorkshop.MasterSchedule.findIndex(oEle => element.toString() === oEle.WeekDay.toString());
        if (index == -1) {
          oDiasAuxLocked.push((parseInt(element.toString()) - 1));
        }
      });
      this.onGenerateEventLocked(oDiasAuxLocked );
    }
  }
  onGenerateEventLocked(element ) { 
    let oFechaInicio = subDays(startOfMonth(this.fechaPrinc),20);
    let oFechafinal = addDays(endOfYear(this.fechaPrinc),20);
    let aRangos = [];
    while (oFechaInicio.getTime() <= oFechafinal.getTime()) {
      let oDataIndex = element.findIndex(oEle => oEle.toString() === oFechaInicio.getDay().toString());
      if (oDataIndex != -1) {
        let dateFechaAux = oFechaInicio; 
        aRangos.push(dateFechaAux);
      }
      oFechaInicio = addDays(oFechaInicio, 1);
    } 
    this.calendar.disabledDates.push({ type: DateRangeType.Specific, dateRange: aRangos }); 
  }
  onObtenerTiposDocumento(RepresentativeIdenticationTypeId?) {
    this.cSesionService.obtenerDocumentos().subscribe(oContent => {
      this.aTiposDocumentos = oContent
    },(err)=>{

    },()=>{
      if(RepresentativeIdenticationTypeId != null){
        this.cAgendarGeneralService.oAgenda.c_repre_tipoDoc.setValue(Number(RepresentativeIdenticationTypeId));

      }
    });
  }
  onSelecionarFecha(dia) {
    this.dias.forEach(element => {
      element.isSelecion = false;
    });
    this.cAgendarGeneralService.oAgenda.c_fecha_calendario.setValue(dia.fecha);
    this.cAgendarGeneralService.oAgenda.d_fecha = dia.fecha;
    this.cAgendarGeneralService.oAgenda.sFecha = this.fnConvertirDateToStringFecha(dia.fecha);

    this.cAgendarGeneralService.oAgenda.d_horario = '';
    this.cAgendarGeneralService.oAgenda.sHora = '------';
    this.fnObtenerHorario();
    dia.isSelecion = true;
  }


  onPrimeraMay(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  //Obtiene departamentos con talleres habilitados de acuerdo al servicio
  onGetDepartamentos(GeoLocationId?) { 
    //Activa la barra de carga
    this.progress = true;
    //Objeto JSON para enviar el request
    let oData = {
      externalCode: 'X',
      masterUserId: this.MasterUserId,
      companyId: this.CompanyId,
      flagGlobal:null
    }
    //Consumir API
    this.cSharedService.onGeolocationGet(oData).subscribe(oRes => { 
      if (oRes.length > 0) {
        this.cAgendarGeneralService.oAgenda.aRegiones = oRes;
        //this.cAgendarGeneralService.oAgenda.c_region.setValue(this.ReservasService.reservaEditar.GeoLocationId);
      }
      //Desactiva la barra de carga
      this.progress = false;
      //this.onGetTalleres();
    }, err => {
      //Desactiva la barra de carga
      this.progress = false;
      
    },()=> {
      if(GeoLocationId!=null){
        this.cAgendarGeneralService.oAgenda.c_region.setValue(Number(GeoLocationId.toString().substring(0,2)));
      }
    });
  }
  //Selección de un departamento
  onSeleccionarDepartamentos(oData) {
    this.cAgendarGeneralService.oAgenda.c_region.setValue(oData.GeoLocationIdDepartment);
    this.cAgendarGeneralService.oAgenda.sRegion = oData.Department;
    var onSendTalleres = {
      masterUserId: this.MasterUserId,
      companyId: this.CompanyId,
      workshopId: null,
      isActived: true,
      geoLocationId: oData.GeoLocationIdDepartment
    }
    this.onGetTalleres(onSendTalleres,null);
  }  
  //Obtiene talleres habilitados en el departamento
  onGetTalleres(oData,WorkshopId?) {
    //Activa la barra de carga
    this.progress = true;
    //Objeto JSON para enviar el request
    
    //Consumir API
    this.cWorkshop.onMasterWorkshopGet(oData).subscribe(oRes => { 
      if (oRes.length > 0) {
        this.cAgendarGeneralService.oOpciones.toogleTaller = true;
        oRes.forEach(element => {
          element.isSelected = false
        });
        this.cAgendarGeneralService.oAgenda.aTalleres = this.onValidateWorkshops(oRes);;                
        this.onGetAsesores("");
      }
      //Desactiva la barra de carga
      this.progress = false;
    }, err => {
      //Desactiva la barra de carga
      this.progress = false;
      
    },()=>{
      if(WorkshopId!=null){
        this.cAgendarGeneralService.oAgenda.c_taller.setValue(""+WorkshopId.toLowerCase());
      }
    });
  }
  onValidateWorkshops(oData){
    let aData = [];
    oData.forEach(element => {
      let channel = element.ChannelsByWorkshop.find(oEle => oEle.ChannelId.toString() === '1')
      if(channel){
        aData.push(element);
      }else{
        if(this.cAgendarGeneralService.oAgenda.p_c_taller.toLowerCase() === element.WorkshopId.toLowerCase() ){
          aData.push(element);
        }
      }
    });
    return aData;
  }

  onSelecionTaller(oTalleres) {
    this.cAgendarGeneralService.oAgenda.sTaller = oTalleres.FriendlyName;
    this.cAgendarGeneralService.oAgenda.p_c_taller = oTalleres.WorkshopId;
    this.onGetAsesores("X");
    this.cAgendarGeneralService.oAgenda.aHorario = [];    
    //limpia bloqueos especificos
    var temp= this.calendar.disabledDates[0];
    this.calendar.disabledDates = [];
    this.calendar.disabledDates.push(temp);
    //bloqueos generales
    let fechaInicio = new Date(this.fechaPrinc.getFullYear(), (this.fechaPrinc.getMonth() - 1), 1);
    let fechaFinal = new Date(this.fechaPrinc.getFullYear(), (this.fechaPrinc.getMonth() + 2), 1);  
    let oDataCal = {
      agendaId : null,
      masterUserId: this.MasterUserId,
      startDate: this.fnConvertirDateToString(fechaInicio),
      endDate: this.fnConvertirDateToString(fechaFinal),
      onlyHeader: true,
      companyId: this.CompanyId,
      workshopId: oTalleres.WorkshopId,
      channelId: this.cAgendarGeneralService.oAgenda.aCanales[0].ChannelId,
      serviceId: null,
      companyAdviserId: null,
      eventType: 3
    };   
    this.fnObtenerCalendario(oDataCal);
    //
   // this.fnObtenerAsesorListado(oTalleres.p_c_taller)

  }

  //Obtiene los asesores habilitados de los talleres
  onGetAsesores(Indiferente) {
    //Activa la barra de carga
    this.progress = true;
    //Objeto JSON para enviar el request
    let aDataSend = {
      masterUserId: this.MasterUserId,
      companyId: this.CompanyId,
      workshopId: this.cAgendarGeneralService.oAgenda.p_c_taller,
      companyAdviserId: null,
      isActived: true
    };
    //Consumir API
    this.cAdviserService.onCompanyAdviserGet(aDataSend).subscribe(oRes => {
      var indi = {
        FirstName: "Me es indiferente",
        LastName: "",
        CompanyAdviserId: 0,
        WorkshopId: null,
        MasterUserId: this.MasterUserId
      }
      var asesores = [];
      asesores.push(indi);
      oRes.forEach(element => {
        asesores.push(element);
      });
      if(Indiferente=="X"){
        this.cAgendarGeneralService.oAgenda.sAsesor=indi.FirstName;
        this.cAgendarGeneralService.oAgenda.aAsesores = asesores;
        this.cAgendarGeneralService.oAgenda.c_asesor.setValue(indi.CompanyAdviserId);
      }else{
        this.cAgendarGeneralService.oAgenda.aAsesores = asesores;
      }   
      this.fnObtenerHorario();         
      //Desactiva la barra de carga
      this.progress = false;
      //deshabilita las fechas anteriores al día de hoy
    }, oError => {
      //Desactiva la barra de carga
      this.progress = false;
    });
  }
  onSetRegiones(oData) {
    if (this.cAgendarGeneralService.oAgenda.p_c_region === '') {
      this.cAgendarGeneralService.oAgenda.p_c_region = oData.p_c_region;
      this.cAgendarGeneralService.oAgenda.sRegion = oData.c_descripcion;
      this.cAgendarGeneralService.oAgenda.c_region.setValue(oData.p_c_region);
      //this.onGetTalleres(oData.p_c_region, this.cAgendarGeneralService.oAgenda.c_tipo_servicio.value, this.cConfigService.onObtenerMarcaBase());
    } else {
      this.cAgendarGeneralService.oAgenda.c_region.setValue(this.cAgendarGeneralService.oAgenda.p_c_region);
      let oDataAux = this.cAgendarGeneralService.oAgenda.aRegiones.find(oEle => oEle.p_c_region === this.cAgendarGeneralService.oAgenda.p_c_region);
      this.cAgendarGeneralService.oAgenda.sRegion = oDataAux.c_descripcion;
      //this.onGetTalleres(oDataAux.p_c_region, this.cAgendarGeneralService.oAgenda.c_tipo_servicio.value, this.cConfigService.onObtenerMarcaBase());
    }
  }
  fnObtenerHorario() {
    this.progress = true;
    var asesor =null;
    if(this.cAgendarGeneralService.oAgenda.c_asesor.value!=0){
      asesor=this.cAgendarGeneralService.oAgenda.c_asesor.value;
    }
    let oDataSend = {
      masterUserId: this.MasterUserId,
      companyId: this.CompanyId,
      workshopId: this.cAgendarGeneralService.oAgenda.p_c_taller,
      companyAdviserId: asesor,
      serviceId:this.ReservasService.reservaEditar.ServiceId,
      filterDate:this.cAgendarGeneralService.oAgenda.sFecha,
      channelId: 1

    };
    this.cCalendarioService.ObtenerHorario(oDataSend).subscribe(oRes => { 
      let aData = [];
      if(oRes.length>0){
       
        if(this.cAgendarGeneralService.oAgenda.sFecha == this.fnConvertirDateToStringFecha(new Date(this.ReservasService.reservaEditar.StartDate))){
          aData.push({ isSelecion: true, d_horario: this.utility.fnStringToDate(this.ReservasService.reservaEditar.StartDate),FirstName:this.ReservasService.reservaEditar.CompanyAdviserFirstName,c_asesor:this.ReservasService.reservaEditar.CompanyAdviserId })
        }      
        oRes.forEach(element => {
          aData.push({ isSelecion: false, d_horario: this.utility.fnStringToDate( this.cAgendarGeneralService.oAgenda.sFecha + 'T' + element.ToHour),FirstName:element.CompanyAdviserFullName,c_asesor:element.CompanyAdviserId })
        });
        this.cAgendarGeneralService.oAgenda.aHorario = aData;
        if (aData.length === 0) {
          this.isHorarioVacio = true;
        } else {
          this.isHorarioVacio = false;
        }
      }else{
        if(this.ReservasService.reservaEditar.WorkshopId ==  this.cAgendarGeneralService.oAgenda.p_c_taller){
          if(this.cAgendarGeneralService.oAgenda.sFecha == this.fnConvertirDateToStringFecha(new Date(this.ReservasService.reservaEditar.StartDate))){
            aData.push({ isSelecion: true, d_horario: this.utility.fnStringToDate(this.ReservasService.reservaEditar.StartDate),FirstName:this.ReservasService.reservaEditar.CompanyAdviserFirstName,c_asesor:this.ReservasService.reservaEditar.CompanyAdviserId })
          }     
          this.cAgendarGeneralService.oAgenda.aHorario = aData;
          this.isHorarioVacio = false;
        }else{
          this.cAgendarGeneralService.oAgenda.aHorario=[];
          this.isHorarioVacio = true;
        }
        
      }
      this.progress = false;
    }, oErr => {
      this.progress = false;

    });

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
  onSelecionarHorario(oHorario) {
    this.cAgendarGeneralService.oAgenda.aHorario.forEach(element => {
      element.isSelecion = false;
    });
    this.cAgendarGeneralService.oAgenda.d_horario = oHorario.d_horario;
    this.cAgendarGeneralService.oAgenda.sHora = this.fnConvertirDateToStringHora(oHorario.d_horario);
    this.cAgendarGeneralService.oAgenda.sAsesorFinal = oHorario;
    oHorario.isSelecion = true;
  }
  fnConvertirDateToStringHora(d_fecha: Date) {
    let d_fecha_aux = d_fecha.toLocaleString('es', { year: "numeric", month: "2-digit", day: "2-digit", hour: '2-digit', minute: '2-digit', second: "2-digit", hour12: false }).split(" ");
    let fecha = d_fecha_aux[0].split("/");
    let hora = d_fecha_aux[1];
    return hora;
  }
  onObtenerBloqueosPorRango(d_fecha_selecion: Date) {
    if (d_fecha_selecion.getMonth() !== this.fechaPrinc.getMonth()) {
      this.fechaPrinc = d_fecha_selecion;
      let fechaInicio = new Date(d_fecha_selecion.getFullYear(), (d_fecha_selecion.getMonth()), 1);
      let fechaFinal = new Date(d_fecha_selecion.getFullYear(), (d_fecha_selecion.getMonth() + 2), 1);
      let oDataSend = {
        d_fecha_inicio: this.fnConvertirDateToString(fechaInicio),
        d_fecha_fin: this.fnConvertirDateToString(fechaFinal),
        p_c_taller: this.cAgendarGeneralService.oAgenda.p_c_taller
      };
      //this.fnObtenerCalendario(oDataSend);
    }
  }
  onSelecionFecha(d_fecha_selecion: Date) {
    //this.onObtenerBloqueosPorRango(d_fecha_selecion);
    this.cAgendarGeneralService.oAgenda.sFecha = this.fnConvertirDateToStringFecha(d_fecha_selecion);
    this.cAgendarGeneralService.oAgenda.d_fecha = d_fecha_selecion;
    this.fnObtenerHorario();
  }
  fnConvertirDateToStringFecha(d_fecha: Date) {
    let d_fecha_aux = d_fecha.toLocaleString('es', { year: "numeric", month: "2-digit", day: "2-digit", hour: '2-digit', minute: '2-digit', second: "2-digit", hour12: false }).split(" ");
    let fecha = d_fecha_aux[0].split("/");
    let hora = d_fecha_aux[1];
    return fecha[2] + '-' + fecha[1] + '-' + fecha[0];
  }

  onGoHome() {
    this.cRouter.navigateByUrl('/');
  }

  onGuardarCambios() {
    let estadoReserva;
    if (this.onValidarReserva) {
      if(this.cConfigService.flujoAlterno){
        estadoReserva = 5
      }else{
        estadoReserva = 1
      }
      var asesor=this.cAgendarGeneralService.oAgenda.c_asesor.value;
      if(this.cAgendarGeneralService.oAgenda.sAsesorFinal != ""){
        asesor = this.cAgendarGeneralService.oAgenda.sAsesorFinal.c_asesor;
      }
      this.progress = true;
      let oDataSend = {
        agendaId : this.ReservasService.reservaEditar.AgendaId,
        eventType:100,
        startDate:this.fnConvertirDateToStringFecha(this.cAgendarGeneralService.oAgenda.d_fecha) + 'T' + this.cAgendarGeneralService.oAgenda.sHora,
        name:"",
        detail:"",
        credentialId:localStorage.getItem('CredentialId'),
        masterUserId:localStorage.getItem('MasterUserId'),
        companyId: localStorage.getItem("CompanyId"),
        workshopId:this.cAgendarGeneralService.oAgenda.p_c_taller,
        channelId:this.cAgendarGeneralService.oAgenda.aCanales[0].ChannelId,
        serviceId:this.ReservasService.reservaEditar.ServiceId,
        companyAdviserId:asesor,
        vehicleId:null,
        plate:localStorage.getItem('PlateName'),
        mileageValue:this.ReservasService.reservaEditar.MileageValue,
        mileagePackage:this.ReservasService.reservaEditar.MileagePackage,
        customerId:this.ReservasService.reservaEditar.CustomerId,
        statusId:1,
        representativeId:0,
        identicationTypeId:this.cAgendarGeneralService.oAgenda.c_repre_tipoDoc.value =="" ? null : this.cAgendarGeneralService.oAgenda.c_repre_tipoDoc.value,
        representativeFirstName:this.cAgendarGeneralService.oAgenda.c_repre_nombre.value==null ? '' : this.cAgendarGeneralService.oAgenda.c_repre_nombre.value,
        representativeLastName:this.cAgendarGeneralService.oAgenda.c_repre_apellido.value==null ? '' : this.cAgendarGeneralService.oAgenda.c_repre_apellido.value,
        identicationDocument:this.cAgendarGeneralService.oAgenda.c_repre_documento.value==null ? '' : this.cAgendarGeneralService.oAgenda.c_repre_documento.value,
        isRepresentativeControl:this.cAgendarGeneralService.oAgenda.c_repre_desicion.value,
        IsPickUpAndDelivery:null
      }
      if(asesor == 0){
        this.cMatSnackBar.open("Seleccione una hora para continuar", "cerrar", {
          verticalPosition: 'top',
          horizontalPosition: 'end',
          duration: 4000,
        });
        return;
      }
      this.cReservaService.crearReserva(oDataSend).subscribe(oRespuesta => { 
        if (oRespuesta.codeResponse) {          
          this.cAgendarGeneralService.fnRestaurarReservaSesion();
          this.cRouter.navigateByUrl('/consultar');

        }
        this.progress = false;
      }, oErr => {
        this.progress = false;

      });
    }
    // if (this.onValidarReserva()) {
    //   let sAnio = new Date();
    //   var OData = {
    //     p_i_reserva: this.cReservaService.reservaEditar.p_i_reserva,
    //     p_i_usuarioinch: localStorage.getItem("p_i_usuario"),// this.cAgendarGeneralService.oAgenda.oUsuario.p_i_usuario,
    //     p_c_cliente: this.cAgendarGeneralService.oAgenda.oCliente.p_c_cliente,//this.cAgendarGeneralService.oAgenda.oUsuario.p_c_cliente,
    //     p_c_vin: this.cAgendarGeneralService.oAgenda.oCliente.p_c_vin,
    //     p_c_asesor: this.cAgendarGeneralService.oAgenda.c_asesor.value,
    //     p_c_taller: this.cAgendarGeneralService.oAgenda.p_c_taller,
    //     p_i_servicio: this.cAgendarGeneralService.oAgenda.p_i_servicio,
    //     c_placa: this.PlateName,//this.cAgendarGeneralService.oAgenda.oUsuario.c_placa,
    //     c_kilometraje: this.cAgendarGeneralService.oAgenda.c_kilometraje.value.replace(/ KM/g, ""),
    //     p_i_marca: this.cConfigService.onObtenerMarcaBase(),
    //     c_ot: "",
    //     c_preorden: "",
    //     c_orden: "",//this.cAgendarGeneralService.oAgenda.sPreOT,
    //     c_anio: sAnio.getFullYear(),
    //     d_fecha: this.fnConvertirDateToString(this.cAgendarGeneralService.oAgenda.d_fecha),
    //     d_hora: this.fnConvertirDateToString(this.cAgendarGeneralService.oAgenda.d_horario),
    //     c_procedencia: "WEB",
    //     p_i_canal: "1",
    //     c_observaciones: "",
    //     c_flagrepresentante: this.cAgendarGeneralService.oAgenda.isRepresentante ? '' : 'X',
    //     c_flagpermisosrepre: this.cAgendarGeneralService.oAgenda.c_repre_desicion.value ? '' : 'X',
    //     c_flagterminos: this.cAgendarGeneralService.oAgenda.c_terminos.value ? '' : 'X',
    //     c_nombrerepresentante: this.cAgendarGeneralService.oAgenda.c_repre_nombre.value,
    //     c_documento: this.cAgendarGeneralService.oAgenda.c_repre_documento.value,
    //     c_telefono: this.cAgendarGeneralService.oAgenda.c_repre_telefono.value,
    //     c_flagprotdatos: this.cAgendarGeneralService.oAgenda.c_proteciondatos.value ? '' : 'X'
    //   };

    //   this.cReservaService.actulizarReserva(OData).subscribe(resp => {
    //     if (resp.codigo === 0) {
    //       const dialogRef = this.cMatDialog.open(MensajeDialogoOkComponent, {
    //         width: '410px',
    //         height: '210px',
    //         data: {
    //           sMensaje: 'Se han guardado las cambios. Te llegará un correo confirmando los cambios',
    //           sButton: 'OK'
    //         }
    //       });
    //       dialogRef.afterClosed().subscribe(result => {
    //         if (result === 'OK') {
    //           this.onGoMsgOk();

    //         } else {
    //           return;
    //         }
    //       });
    //     }
    //     this.cMatSnackBar.open(resp.detalle, "cerrar", {
    //       verticalPosition: 'top',
    //       horizontalPosition: 'end',
    //       duration: 2000,
    //     });
    //   });
    // }
  }

  fnConvertirDateToString(d_fecha: Date) {
    let d_fecha_aux = d_fecha.toLocaleString('es', { year: "numeric", month: "2-digit", day: "2-digit", hour: '2-digit', minute: '2-digit', second: "2-digit", hour12: false }).split(" ");
    let fecha = d_fecha_aux[0].split("/");
    let hora = d_fecha_aux[1];
    return fecha[2] + '-' + fecha[1] + '-' + fecha[0] + 'T' + hora;
  }

  onGoMsgOk() {
    this.cAgendarGeneralService.fnRestaurarReservaSesion()
    this.cRouter.navigateByUrl('/consultar');
  }

  onCardHora() {
    if (this.flag === false) {
      document.getElementById('idCardHora').style.cssText = 'background: #00ADEE;color: #FFFFFF;box-shadow: 0 0 15px #C4ECFB';
      this.flag = true;
    } else {
      document.getElementById('idCardHora').style.cssText = 'background: #FFFFFF;color: black';
      this.flag = false;
    }
  }

  toogleRepresentante(eleccion) {
    if (eleccion === 'NO') {
      this.cAgendarGeneralService.oAgenda.isRepresentante = true;
      this.cAgendarGeneralService.oAgenda.c_repre_nombre.setValue("");
      this.cAgendarGeneralService.oAgenda.c_repre_documento.setValue("");
      this.cAgendarGeneralService.oAgenda.c_repre_telefono.setValue("");
      this.cAgendarGeneralService.oAgenda.c_repre_desicion.setValue(false);
    } else {
      this.cAgendarGeneralService.oAgenda.isRepresentante = false;
    }
  }

  onSelectOption(oLista, sCombo) {
    this.cAgendarGeneralService.oOpciones.toogle = false;
    if (this.cAgendarGeneralService.oOpciones.tipo == "Servicio") {
      this.cAgendarGeneralService.oAgenda.p_i_servicio = oLista.p_i_servicio;
      this.cAgendarGeneralService.oAgenda.c_tipo_servicio.setValue(oLista.p_i_servicio);
      this.cAgendarGeneralService.oAgenda.sTipoServicio = oLista.c_descripcionappweb;
      this.onObtenerKilometraje();
      this.onGetDepartamentos();
    } else if (this.cAgendarGeneralService.oOpciones.tipo == "Kilometraje") {
      this.cAgendarGeneralService.oAgenda.sKilometraje = oLista.c_descripcion;
      this.cAgendarGeneralService.oAgenda.c_kilometraje.setValue(oLista.c_descripcion);
    } else if (this.cAgendarGeneralService.oOpciones.tipo == "Region") {
      this.cAgendarGeneralService.oAgenda.sRegion = oLista.c_descripcion;
      this.cAgendarGeneralService.oAgenda.c_region.setValue(oLista.p_c_region);
      //this.onGetTalleres(oLista.p_c_region, this.cAgendarGeneralService.oAgenda.c_tipo_servicio.value, this.p_i_marca);
    } else if (this.cAgendarGeneralService.oOpciones.tipo == "Asesor") {
      this.cAgendarGeneralService.oAgenda.c_asesor.setValue(oLista.p_c_asesor);
      this.cAgendarGeneralService.oAgenda.sAsesor = oLista.c_nombres + ' ' + oLista.c_apellidos;
      this.cAgendarGeneralService.oAgenda.aHorario = [];
      //this.onGetTalleres(oLista.p_c_region, this.cAgendarGeneralService.oAgenda.c_tipo_servicio.value ,2);
    } else if (this.cAgendarGeneralService.oOpciones.tipo == "Taller") {
      this.cAgendarGeneralService.oAgenda.c_taller.setValue(oLista.p_c_taller);
      this.cAgendarGeneralService.oAgenda.aHorario = [];

      //this.onGetTalleres(oLista.p_c_region, this.cAgendarGeneralService.oAgenda.c_tipo_servicio.value ,2);
    }
  }

  onObtenerKilometraje() {
    let oData = {
      p_i_marca: this.cConfigService.onObtenerMarcaBase(),
      p_i_servicio: this.cAgendarGeneralService.oAgenda.c_tipo_servicio.value
    }
    /*this.cKilometrajeService.obtenerRegiones(oData).subscribe(oData => {
      if (oData.length > 0) {
        this.cAgendarGeneralService.oAgenda.c_kilometraje.setValue('');
        this.cAgendarGeneralService.oAgenda.aKilometraje = oData;
      } else {
        this.cAgendarGeneralService.oAgenda.c_kilometraje.setValue('');
        this.cAgendarGeneralService.oAgenda.aKilometraje = [];
      }
    }, oErr => {

    })*/
  }

  oncloseMenu() {
    this.cAgendarGeneralService.oOpciones.toogle = false;
  }

  onSelectRegion() {
    if (this.mobileQuery.matches) {
      this.cAgendarGeneralService.oOpciones.toogle = true;
      this.cAgendarGeneralService.oOpciones.sTitulo = 'Selecionar Región';
      this.cAgendarGeneralService.oOpciones.sControl = 'sRegion';
      this.cAgendarGeneralService.oOpciones.aLista = this.cAgendarGeneralService.oAgenda.aRegiones;
      this.cAgendarGeneralService.oOpciones.tipo = "Region";
    }
  }

  onSelecionRegiones(oData) {
    this.cAgendarGeneralService.oAgenda.p_c_region = oData.p_c_region;
    this.cAgendarGeneralService.oAgenda.sRegion = oData.c_descripcion;
    //this.onGetTalleres(oData.p_c_region, this.cAgendarGeneralService.oAgenda.c_tipo_servicio.value, this.cConfigService.onObtenerMarcaBase());
    this.cAgendarGeneralService.oAgenda.aHorario = [];
  }
  onSelectAsesor() {
    if (this.mobileQuery.matches) {
      this.cAgendarGeneralService.oOpciones.toogle = true;
      this.cAgendarGeneralService.oOpciones.sTitulo = 'Selecionar Asesor';
      this.cAgendarGeneralService.oOpciones.sControl = 'sAsesor';
      this.cAgendarGeneralService.oOpciones.aLista = this.cAgendarGeneralService.oAgenda.aAsesores;
      this.cAgendarGeneralService.oOpciones.tipo = "Asesor";
    }
  }

  onSelectTaller() {
    if (this.mobileQuery.matches) {
      this.cAgendarGeneralService.oOpciones.toogle = true;
      this.cAgendarGeneralService.oOpciones.sTitulo = 'Selecionar taller';
      this.cAgendarGeneralService.oOpciones.sControl = 'sTaller';
      this.cAgendarGeneralService.oOpciones.aLista = this.cAgendarGeneralService.oAgenda.aTalleres;
      this.cAgendarGeneralService.oOpciones.tipo = "Taller";
    }
  }
  //imgLogo, correoCliente, nombresCliente, apellidosCliente, placa, descTaller, descDireccion, nomAsesor, descServicio, fecha, hora
  onEnviarCorreo(oData, imgLogo) {
    let sLogo = imgLogo;
    let sTitulo = 'Su reserva ha sido reprogramada';
    let sNombres = oData.nombresCliente + ' ' + oData.apellidosCliente;
    let sPlaca = oData.placa;
    let sDescTaller = oData.descTaller;
    let sDescDireccion = oData.descDireccion;
    let sDescAsesor = oData.nomAsesor;
    let sDescServicio = oData.descServicio;
    let sDescFecha = oData.fecha;
    let sDescHora = oData.hora;
    let sBody = this.onBuildCorreo(sLogo, sTitulo, sNombres, sPlaca, sDescTaller, sDescDireccion, sDescAsesor, sDescServicio, sDescFecha, sDescHora);
    let oCuerpo = {
      c_nombre_dest: sNombres,
      c_correo_dest: oData.correoCliente,
      c_asunto: "Reserva reprogramada",
      c_mensaje: sBody,
      b_ishtml: true,
      i_tipo: 2
    };
    this.cCorreoService.onCorreo(oCuerpo).subscribe(oData => {
      if (oData.codigo === 0) {
        var oSend = JSON.stringify(oData);
      } else {
        var oSend = JSON.stringify(oData);
      }
    }, oErr => {
      this.cMatSnackBar.open("Ocurrió un error, verifique su conexión a internet", "cerrar", {
        verticalPosition: 'top',
        horizontalPosition: 'end',
        duration: 2000,
      });
    });
  }

  onBuildCorreo(sLogo, sTitulo, sNombres, sPlaca, sDescTaller, sDescDireccion, sDescAsesor, sDescServicio, sDescFecha, sDescHora) {
    let sBody = '<div style="border: 1px solid black;padding: 25px;font-family: sans-serif;">' +
      '<div style="text-align: center;padding: 10px;">' +
      '<img src="' + sLogo + '" alt="logo" height="50px" width="150px">' +
      '</div>' +
      '<div style="text-align: center;">' +
      '<h2>' + sTitulo + '</h2>' +
      '</div>' +

      '<p><span style="font-weight: bold;">' + sNombres + '</span>, la reserva para su auto con placa <span style="font-weight: bold;">' + sPlaca + '</span>, ha sido reprogramada exitosamente</p>' +
      '<p><span style="font-weight: bold;">Taller: </span>' + sDescTaller + '</p>' +
      '<p><span style="font-weight: bold;">Dirección: </span>' + sDescDireccion + '</p>' +
      '<p><span style="font-weight: bold;">Asesor: </span>' + sDescAsesor + '</p>' +
      '<p><span style="font-weight: bold;">Servicio: </span>' + sDescServicio + '</p>' +
      '<p><span style="font-weight: bold;">Fecha: </span>' + sDescFecha + '</p>' +
      '<p><span style="font-weight: bold;">Hora: </span>' + sDescHora + '</p>' +
      '</div>'
    return sBody;
  }

  onSelecionarAsesor(asesor) {
    //this.cAgendarGeneralService.oAgenda.sAsesor = oAsesor.c_nombres + ' ' + oAsesor.c_apellidos;
    this.cAgendarGeneralService.oAgenda.c_asesor.setValue(asesor.CompanyAdviserId);
    this.cAgendarGeneralService.oAgenda.aHorario = [];
    this.fnObtenerHorario();
    let fechaInicio = new Date(this.fechaPrinc.getFullYear(), (this.fechaPrinc.getMonth() - 1), 1);
    let fechaFinal = new Date(this.fechaPrinc.getFullYear(), (this.fechaPrinc.getMonth() + 2), 1);    
    //limpia bloqueos especificos
    var temp= this.calendar.disabledDates[0];
    this.calendar.disabledDates = [];
    this.calendar.disabledDates.push(temp);
    //bloqueos asesor    
    let oDataAsesor = {
      agendaId : null,
      masterUserId: this.MasterUserId,
      startDate: this.fnConvertirDateToString(fechaInicio),
      endDate: this.fnConvertirDateToString(fechaFinal),
      onlyHeader: true,
      companyId: this.CompanyId,
      workshopId: this.cAgendarGeneralService.oAgenda.p_c_taller,
      channelId: this.cAgendarGeneralService.oAgenda.aCanales[0].ChannelId,
      serviceId:null,
      companyAdviserId:asesor.CompanyAdviserId,
      eventType: 4
    };   
    this.fnObtenerCalendario(oDataAsesor);
  }

  onCargarLegal() {
    var oData;   
       oData = {
        masterUserId: localStorage.getItem("MasterUserId"),
        companyId: localStorage.getItem("CompanyId"),
        contentId: 0,
        parentId: null,
        title: 'Términos y Condiciones',
        isPublished:true
      }
    this.cImagenesService.onGetImagen(oData).subscribe(resp => {
      let imagenHomeAux = [];
      resp.forEach(element => {
        this.sTerminosCondiciones = element;
        this.sTerminosCondiciones.c_descripcion = 'Acepto Términos y Condiciones';
      });
    });
  }

  onVerTerminos() {
      if (this.sTerminosCondiciones.MainImage !== '') {
      window.open(this.sTerminosCondiciones.MainImage, '_blank');
    }
  }

  onVerProtecionDatos() { 
    if (this.sProteccion.c_url !== '') {
      window.open(this.sProteccion.c_url, '_blank');
    }
  }

  onVerRepresentantes() {
    if (this.sProteccion.c_url !== '') {
      window.open(this.sProteccion.c_url, '_blank');
    }
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

  ngOnDestroy(): void {
    this.cAgendarGeneralService.fnRestaurarReservaSesion();
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
  ngAfterViewInit() {

    setTimeout(()=> {
      this.onloadFinalBottom();
      this.modificarFont();
    }, 0);
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
           list[index].style.fontFamily = "BMW_reg"
       }
       break;
   }
 }

  shouldRun = [/(^|\.)plnkr\.co$/, /(^|\.)stackblitz\.io$/].some(h => h.test(window.location.host));
  onCallTelefono(){
    window.open('tel:' + this.telefono, '_blank');
  }
}
