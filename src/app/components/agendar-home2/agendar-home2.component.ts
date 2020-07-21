import { Component, OnInit, ChangeDetectorRef, ViewChild, Inject, AfterViewInit } from '@angular/core';
import { AgendaModel } from 'src/app/models/agenda.model';
import { TranslateService } from '@ngx-translate/core';
import { FormControl,Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AgendarGeneralService } from 'src/app/services/agendar-general.service';
import { MediaMatcher } from '@angular/cdk/layout';
import { IgxCalendarComponent, DateRangeType } from 'igniteui-angular';
import { CalendarioService } from 'src/app/services/calendario/calendario.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DOCUMENT } from '@angular/common';
import { TerminosService } from 'src/app/services/terminos/terminos.service';
import { AdviserService } from 'src/app/services/adviser.service';
import { MsgAlertComponent } from '../msg-alert/msg-alert.component';
import { MatDialog } from '@angular/material';
import { SesionService } from 'src/app/services/sesion/sesion.service';
import { MyErrorStateMatcher } from 'src/app/pages/home/home.component';
import { ImagenesService } from 'src/app/services/imagenes/imagenes.service';
import { ConfiguracionService } from 'src/app/services/configuracion/configuracion.service';
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
import { ConfigService } from 'src/app/services/config.service';
import { UtilityClass } from 'src/app/Utility';
@Component({
  selector: 'app-agendar-home2',
  templateUrl: './agendar-home2.component.html',
  styleUrls: ['./agendar-home2.component.css']
})
export class AgendarHome2Component implements OnInit, AfterViewInit {
  @ViewChild("calendar", { static: true }) public calendar: IgxCalendarComponent;
  public activeLang = 'es';
  public oAgenda: AgendaModel = {} as AgendaModel;
  public formatOptions: any;
  public formatViews: any;
  public isEditable: boolean = false;
  public isLinear: boolean = true;
  public isShownRepresentante: boolean = false;
  public isShownNoRepresentante: boolean = false;
  public isHorarioVacio: boolean = false;
  private PlateName: string;
  matcher = new MyErrorStateMatcher();
  utility = new UtilityClass();
  /*CALENDARIO MOVIL */
  descMes: string;
  descAnio: string;
  dias: any = [];
  fechaPrinc: Date;
  diasSemana: any = [];
  /*CALENDARIO MOVIL */
  public mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;
  public today = new Date(Date.now());
  public range = []; 
  public sTerminosCondiciones: any = { c_descripcion: "" };
  sProteccion : any = {c_descripcion:"Protección de datos"};
  public sRepresentante: any = { c_descripcion: "" };
  public CompanyId;
  public MasterUserId;
  public oDataMain: any = { "p_i_usuario_usuario": 0, "c_apellidos_usuario": "", "c_nombres_usuario": "", "c_documento_usuario": "", "c_correo_usuario": "", "p_i_usuario_cliente": 0, "c_apellidos_cliente": "", "c_nombres_cliente": "", "c_documento_cliente": "", "c_correo_cliente": "" };
  p_c_placa;
  aTiposDocumentos: any[] = [];
  public aPrimerDiaDisponible = [];

  public oProteccionDatos = false ;
  p_i_marca
  constructor(
    private cSesionService: SesionService,
    public cMatDialog: MatDialog,
    private translate: TranslateService,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private cRouter: Router,
    public cAgendarGeneralService: AgendarGeneralService,
    private cMatSnackBar: MatSnackBar,

    private cAdviserService: AdviserService,
    private cCalendarioService: CalendarioService,
    private cImagenesService: ImagenesService,
    private cConfiguracionService: ConfiguracionService,
    private cActivatedRoute: ActivatedRoute,
    private cTerminosService: TerminosService,
    private cConfigService: ConfigService,
    @Inject(DOCUMENT) private cDocument: Document
  ) {
    this.translate.setDefaultLang(this.activeLang);
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    //this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    this.PlateName = localStorage.getItem("PlateName");
    this.CompanyId = localStorage.getItem("CompanyId");
    this.MasterUserId = localStorage.getItem("MasterUserId");
    this.p_c_placa = this.cActivatedRoute.snapshot.params.sPlaca;
    this.p_i_marca = cConfigService.onObtenerMarcaBase();
  }
   
  ngOnInit() { 
    if (this.cAgendarGeneralService.oAgenda.sKilometraje === '------') {
      //if (JSON.parse(localStorage.getItem("UserData")) == null) {
      this.cRouter.navigate(["/agendar/" + localStorage.getItem("PlateName")]);
      return;
    }
    let user = JSON.parse(localStorage.getItem("UserData"))[0];
    if(user==undefined || user==null){
      user = JSON.parse(localStorage.getItem("UserData"));
    }
    this.oDataMain = user;
    this.onObtenerTiposDocumento();
    this.cAgendarGeneralService.oAgenda.c_proteciondatos.setValue(this.cAgendarGeneralService.oAgenda.c_proteciondatos.value);
    this.cAgendarGeneralService.oAgenda.c_repre_tipoDoc = new FormControl( this.cAgendarGeneralService.oAgenda.c_repre_tipoDoc.value, [
      Validators.required
    ]); 
    this.cAgendarGeneralService.oAgenda.c_asesor = new FormControl({ value: this.cAgendarGeneralService.oAgenda.c_asesor.value });    
    this.onGetAsesores(); 
    this.formatOptions = { day: 'numeric', month: 'long', weekday: 'narrow', year: 'numeric' };
    this.formatViews = { day: true, month: true, year: true };
    
    /*if (this.cAgendarGeneralService.oAgenda.isRepresentante !== null) {
      let sBool = this.cAgendarGeneralService.oAgenda.isRepresentante ? 'NO' : 'SI';
      this.toogleRepresentante(sBool);
    }*/
    this.fnObtenerPrimerDiaDisponible();
    this.onCargarLegal();
    this.onObtenerEstadoProteccionDatos();
  }
  onObtenerEstadoProteccionDatos() {
    this.cAgendarGeneralService.isGlobalLoading = true;
    let oData = {
      companyId:localStorage.getItem("CompanyId"),
      masterUserId:localStorage.getItem('MasterUserId'),
      customerId:this.oDataMain.CustomerId
    }
    this.cConfiguracionService.CustomersByCompanyPITGet(oData).subscribe(resp => {
      if (resp.length > 0) {
        if (resp[0].DatePIT === null) {
          this.oProteccionDatos = true;
          //this.cAgendarGeneralService.oAgenda.c_proteciondatos.setValue(false);
        }else{
          this.oProteccionDatos = false;
        }
      }else{
        this.oProteccionDatos = true;
      }
      this.cAgendarGeneralService.isGlobalLoading = false;

    }, err=>{
      this.cAgendarGeneralService.isGlobalLoading = false;
    });
  }
  ngAfterViewInit() {
    setTimeout(() => {
      this.cAgendarGeneralService.oAgenda.bPasoSegundo = false;
      this.cDocument.body.scrollTop = 0;
    });
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
  //Obtiene los asesores habilitados de los talleres
  onGetAsesores() { 
    //Activa la barra de carga
    this.cAgendarGeneralService.isGlobalLoading = true;
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
      var indi={
        FirstName:"Me es indiferente",
        LastName:"",
        CompanyAdviserId:0,
        WorkshopId:null,
        MasterUserId:this.MasterUserId
      }
      var asesores = [];
      asesores.push(indi);
      oRes.forEach(element => {
        asesores.push(element);
      });  
      this.cAgendarGeneralService.oAgenda.sAsesor=indi.FirstName;
      this.cAgendarGeneralService.oAgenda.aAsesores = asesores;
      this.cAgendarGeneralService.oAgenda.c_asesor.setValue(indi.CompanyAdviserId);
      //Desactiva la barra de carga
      this.cAgendarGeneralService.isGlobalLoading = false;
      //deshabilita las fechas anteriores al día de hoy
    }, oError => {
      //Desactiva la barra de carga
      this.cAgendarGeneralService.isGlobalLoading = false;
    });
  }

  //Seleccion de un asesor
  onSeleccionarAsesor(oAsesor) {
    this.cAgendarGeneralService.oAgenda.sAsesor = oAsesor.FirstName.trim() + ' ' + oAsesor.LastName.trim();
    this.cAgendarGeneralService.oAgenda.aHorario = [];
    let fechaInicio = new Date(this.fechaPrinc.getFullYear(), (this.fechaPrinc.getMonth() - 1), 1);
    let fechaFinal = new Date(this.fechaPrinc.getFullYear(), (this.fechaPrinc.getMonth() + 2), 1);    
     //limpia bloqueos especificos
     var temp= this.calendar.disabledDates[0];
     this.calendar.disabledDates = [];
     this.calendar.disabledDates.push(temp);
    let oDataSend = {
      masterUserId: this.MasterUserId,
      startDate: this.fnConvertirDateToString(fechaInicio),
      endDate: this.fnConvertirDateToString(fechaFinal),
      onlyHeader: true,
      companyId: this.CompanyId,
      workshopId: this.cAgendarGeneralService.oAgenda.p_c_taller,
      channelId: this.cAgendarGeneralService.oAgenda.aCanales[0].ChannelId,
      serviceId: this.cAgendarGeneralService.oAgenda.c_tipo_servicio.value,
      companyAdviserId: oAsesor.CompanyAdviserId,
      eventType: (oAsesor.CompanyAdviserId == 0) ? 3 : 4,
      agendaId:null
    }; 
    //this.fnObtenerPrimerDiaDisponible();
    this.fnObtenerHorarios();
    this.fnObtenerCalendario(oDataSend);
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

  //Función usada para obtener los valores desde desde la vista móvil
  onSelectAsesor() {
    if (this.mobileQuery.matches) {
      this.cAgendarGeneralService.oOpciones.toogle = true;
      this.cAgendarGeneralService.oOpciones.sTitulo = 'Asesor';
      this.cAgendarGeneralService.oOpciones.sControl = 'sAsesor';
      this.cAgendarGeneralService.oOpciones.tipo = "Asesor";
      this.cAgendarGeneralService.oOpciones.aLista = this.cAgendarGeneralService.oAgenda.aAsesores;
    }
  }  
  //Obtiene la información del calendario
  fnObtenerCalendario(oDataSend) {    
    this.onGenerateLastDay();
    this.cAgendarGeneralService.isGlobalLoading = true;
    this.cCalendarioService.onObtenerCalendario(oDataSend).subscribe(oRes => {
 
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
    }, oError => {
      this.cAgendarGeneralService.isGlobalLoading = false;
    },()=> {
      this.cAgendarGeneralService.isGlobalLoading = false;
      this.OnBuildHorarioTaller();
    });
  }
  onGenerateLastDay(){
    var r = [this.utility.fnStringToDate(this.aPrimerDiaDisponible[0].AvailableDate)];  
    var r2 = [this.utility.fnStringToDate(this.aPrimerDiaDisponible[0].EndAvailableDate)];   
    this.calendar.disabledDates = [{ type: DateRangeType.Before, dateRange: r },{ type: DateRangeType.After, dateRange: r2 } , { type: DateRangeType.Specific, dateRange: r2 }];   

  }
  fnObtenerPrimerDiaDisponible() {
    this.cAgendarGeneralService.isGlobalLoading = true;
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
      }/*else{
        var data = {
          tipo:"Info",
          mensajeCorto:"No hay horarios disponibles para este asesor ",
          mensajeLargo:""
        }
        this.onMostrarMensaje(data);
      }*/ 
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
        eventType: 3
      };   
      this.fnObtenerCalendario(oDataCal);
    }, oErr => {
      this.cAgendarGeneralService.isGlobalLoading = false;

    },() => { 
      this.cAgendarGeneralService.isGlobalLoading = false;
    });
  }
  fnObtenerHorarios(){
    if(this.cAgendarGeneralService.oAgenda.sFecha!="------"){
      this.cAgendarGeneralService.isGlobalLoading = true;
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
        filterDate:this.cAgendarGeneralService.oAgenda.sFecha,
        channelId: 1
  
      };
      this.cCalendarioService.ObtenerHorario(oDataSend).subscribe(oRes => { 
        let aData = [];
        oRes.forEach(element => {
          aData.push({ isSelecion: false, d_horario: this.utility.fnStringToDate( this.cAgendarGeneralService.oAgenda.sFecha + 'T' + element.ToHour),FirstName:element.CompanyAdviserFullName,c_asesor:element.CompanyAdviserId })
        });
        this.cAgendarGeneralService.oAgenda.aHorario = aData;
        if (aData.length === 0) {
          this.isHorarioVacio = true;
        } else {
          this.isHorarioVacio = false;
        }
      }, oErr => {
        this.cAgendarGeneralService.isGlobalLoading = false; 
      },() => { 
        this.cAgendarGeneralService.isGlobalLoading = false;
      });
    }

  }
  onMostrarMensaje(data){
    const dialogRef = this.cMatDialog.open(MsgAlertComponent, {
      data: data
    });
    dialogRef.afterClosed().subscribe(oResp => { 
    });       
  }
  onSeleccionFecha(d_fecha_selecion: Date) {
    //this.onObtenerBloqueosPorRango(d_fecha_selecion);
    this.cAgendarGeneralService.oAgenda.sFecha = this.fnConvertirDateToStringFecha(d_fecha_selecion);
    this.cAgendarGeneralService.oAgenda.d_fecha = d_fecha_selecion;
    this.cAgendarGeneralService.oAgenda.d_horario = null;
    this.cAgendarGeneralService.oAgenda.sHora = '------'; 
    this.fnObtenerHorarios();
  }

  toogleRepresentante(eleccion) {
    if (eleccion === 'NO') {
      this.cAgendarGeneralService.oAgenda.isRepresentante = true;
      this.cAgendarGeneralService.oAgenda.c_repre_nombre.setValue("");
      this.cAgendarGeneralService.oAgenda.c_repre_apellido.setValue("");
      this.cAgendarGeneralService.oAgenda.c_repre_documento.setValue("");
      this.cAgendarGeneralService.oAgenda.c_repre_telefono.setValue("");
      this.cAgendarGeneralService.oAgenda.c_repre_desicion.setValue(false);
    } else {
      this.cAgendarGeneralService.oAgenda.isRepresentante = false;
    }
  }

  /*CALENDARIO MOVIL*/

  /*onNumDiasEnUnMes(mes, año) {
    return new Date(año, mes, 0).getDate();
  }

  onPrimerDiaMes(fecha) {
    return new Date(fecha.getFullYear(), fecha.getMonth(), 1).getDay();
  }*/

  onLlenarNumerosCalendario(fecha) {
    this.descMes = fecha.toLocaleDateString('es', { month: 'long' });
    this.descMes = this.onPrimeraLetraUpper(this.descMes);
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
      /*let sIndex = this.calendar.disabledDates[0].dateRange.findIndex(oEle => this.fnConvertirDateToStringFecha(oEle) === this.fnConvertirDateToStringFecha(fechaAux))
      if (sIndex !== -1) {
        isBlock = true;
      }*/
      if(this.calendar.disabledDates.length>0){
        if(this.calendar.disabledDates[0].dateRange[0]>fechaAux ){
          isBlock = true;
        }
        if(index!=0){
          if(this.fnConvertirDateToStringFecha(this.calendar.disabledDates[index].dateRange[0]) == this.fnConvertirDateToStringFecha(fechaAux)){
            isBlock = true;
          }
        }
        
      }
      aDiasAux.push({ dia: index, fecha: fechaAux, isSelecion: c_estado, isblock: isBlock });
    }
    this.dias = aDiasAux;
  }

  //Retroceder en el calendario
  fnIrAntes() {
    this.fechaPrinc = new Date(this.fechaPrinc.setDate(this.fechaPrinc.getDate() - 3));;
    let fechaInicio = new Date(this.fechaPrinc.getFullYear(), (this.fechaPrinc.getMonth() - 1), 1);
    let fechaFinal = new Date(this.fechaPrinc.getFullYear(), (this.fechaPrinc.getMonth() + 2), 1);
    var asesor =null;
    if(this.cAgendarGeneralService.oAgenda.c_asesor.value!=0){
      asesor=this.cAgendarGeneralService.oAgenda.c_asesor.value;
    }
    let oDataSend = {
      masterUserId: this.MasterUserId,
      startDate: this.fnConvertirDateToString(fechaInicio),
      endDate: this.fnConvertirDateToString(fechaFinal),
      onlyHeader: true,
      companyId: this.CompanyId,
      workshopId: this.cAgendarGeneralService.oAgenda.p_c_taller,
      channelId: this.cAgendarGeneralService.oAgenda.aCanales[0].ChannelId,
      serviceId: this.cAgendarGeneralService.oAgenda.c_tipo_servicio.value,
      companyAdviserId: asesor,
      eventType: 4,
      agendaId:null
    }; 
    this.fnObtenerCalendario(oDataSend);
  }

  //Avanzar en el calendario
  fnIrSiguiente() {
    this.fechaPrinc = new Date(this.fechaPrinc.setDate(this.fechaPrinc.getDate() + 5));;
    let fechaInicio = new Date(this.fechaPrinc.getFullYear(), (this.fechaPrinc.getMonth() - 1), 1);
    let fechaFinal = new Date(this.fechaPrinc.getFullYear(), (this.fechaPrinc.getMonth() + 2), 1);
    var asesor =null;
    if(this.cAgendarGeneralService.oAgenda.c_asesor.value!=0){
      asesor=this.cAgendarGeneralService.oAgenda.c_asesor.value;
    }
    let oDataSend = {
      masterUserId: this.MasterUserId,
      startDate: this.fnConvertirDateToString(fechaInicio),
      endDate: this.fnConvertirDateToString(fechaFinal),
      onlyHeader: true,
      companyId: this.CompanyId,
      workshopId: this.cAgendarGeneralService.oAgenda.p_c_taller,
      channelId: this.cAgendarGeneralService.oAgenda.aCanales[0].ChannelId,
      serviceId: this.cAgendarGeneralService.oAgenda.c_tipo_servicio.value,
      companyAdviserId: asesor,
      eventType: 4,
      agendaId:null
    }; 
    this.fnObtenerCalendario(oDataSend);
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
      this.fnObtenerCalendario(oDataSend);
    }
  }

  onSeleccionarFecha(dia) {
    if (!dia.isblock) {
      this.dias.forEach(element => {
        element.isSelecion = false;
      });
      this.cAgendarGeneralService.oAgenda.c_fecha_calendario.setValue(dia.fecha);
      this.cAgendarGeneralService.oAgenda.d_fecha = dia.fecha;
      this.cAgendarGeneralService.oAgenda.sFecha = this.fnConvertirDateToStringFecha(dia.fecha);

      this.cAgendarGeneralService.oAgenda.d_horario = null;
      this.cAgendarGeneralService.oAgenda.sHora = '------';
      //this.fnObtenerPrimerDiaDisponible();
      dia.isSelecion = true;
    }
  }

  onSelecionarHorario(oHorario) {
    this.cAgendarGeneralService.oAgenda.aHorario.forEach(element => {
      element.isSelecion = false;
    });
    this.cAgendarGeneralService.oAgenda.d_horario = oHorario.d_horario;
    this.cAgendarGeneralService.oAgenda.sHora = this.fnConvertirDateToStringHora(oHorario.d_horario);
    oHorario.isSelecion = true;
    this.cAgendarGeneralService.oAgenda.sAsesorFinal = oHorario;
    //this.cAgendarGeneralService.oAgenda.c_asesor.setValue(oHorario.c_asesor);
  }

  onValidarFinalizar() {
    let flag = true;
    if (this.cAgendarGeneralService.oAgenda.c_asesor.value === '') {
      flag = false;
      this.cMatSnackBar.open("Seleccionar asesor", "cerrar", {
        verticalPosition: 'top',
        horizontalPosition: 'end',
        duration: 2000,
      });
    } else if (this.cAgendarGeneralService.oAgenda.d_fecha === null) {
      flag = false;
      this.cMatSnackBar.open("Seleccionar fecha", "cerrar", {
        verticalPosition: 'top',
        horizontalPosition: 'end',
        duration: 2000,
      });
    } else if (this.cAgendarGeneralService.oAgenda.d_horario === null) {
      flag = false;
      this.cMatSnackBar.open("Seleccionar horario", "cerrar", {
        verticalPosition: 'top',
        horizontalPosition: 'end',
        duration: 2000,
      });
    } else if (this.cAgendarGeneralService.oAgenda.isRepresentante) {
      if (this.cAgendarGeneralService.oAgenda.c_repre_nombre.value === '') {
        flag = false;
        this.cMatSnackBar.open("Ingresar nombre representante", "cerrar", {
          verticalPosition: 'top',
          horizontalPosition: 'end',
          duration: 2000,
        });
      } else if (this.cAgendarGeneralService.oAgenda.c_repre_documento.value === '') {
        flag = false;
        this.cMatSnackBar.open("Ingresar documento representante", "cerrar", {
          verticalPosition: 'top',
          horizontalPosition: 'end',
          duration: 2000,
        });
      } else if (this.cAgendarGeneralService.oAgenda.c_repre_telefono.value === '') {
        flag = false;
        this.cMatSnackBar.open("Ingresar telefono representante", "cerrar", {
          verticalPosition: 'top',
          horizontalPosition: 'end',
          duration: 2000,
        });
      } else if (!this.cAgendarGeneralService.oAgenda.c_terminos.value) {
        flag = false;
        this.cMatSnackBar.open("Aceptar términos y condiciones", "cerrar", {
          verticalPosition: 'top',
          horizontalPosition: 'end',
          duration: 2000,
        });
      } 
      if(this.oProteccionDatos){
        if (!this.cAgendarGeneralService.oAgenda.c_proteciondatos.value) {
          flag = false;
          this.cMatSnackBar.open("Aceptar la protección de datos", "cerrar", {
            verticalPosition: 'top',
            horizontalPosition: 'end',
            duration: 2000,
          });
        }
      }
     
      //  else if (!this.cAgendarGeneralService.oAgenda.c_repre_desicion.value) {
      //   flag = false;
      //   this.cMatSnackBar.open("Aceptar la política de privacidad para la protección de datos personales", "cerrar", {
      //     verticalPosition: 'top',
      //     horizontalPosition: 'end',
      //     duration: 2000,
      //   });
      // }
    } else if (!this.cAgendarGeneralService.oAgenda.isRepresentante) {
      if (!this.cAgendarGeneralService.oAgenda.c_terminos.value) {
        flag = false;
        this.cMatSnackBar.open("Aceptar términos y condiciones", "cerrar", {
          verticalPosition: 'top',
          horizontalPosition: 'end',
          duration: 2000,
        });
      }
      if(this.oProteccionDatos){
        if (!this.cAgendarGeneralService.oAgenda.c_proteciondatos.value) {
          flag = false;
          this.cMatSnackBar.open("Aceptar la protección de datos", "cerrar", {
            verticalPosition: 'top',
            horizontalPosition: 'end',
            duration: 2000,
          });
        }
      }
     
      // else if (!this.cAgendarGeneralService.oAgenda.c_proteciondatos.value) {
      //   flag = false;
      //   this.cMatSnackBar.open("Aceptar la política de privacidad para la protección de datos personales", "cerrar", {
      //     verticalPosition: 'top',
      //     horizontalPosition: 'end',
      //     duration: 2000,
      //   });
      // }
    }
    return flag;
  }

  onCargarLegal() {
    var oData;   
       oData = {
        masterUserId: localStorage.getItem("MasterUserId"),
        companyId: localStorage.getItem("CompanyId"),
        contentId: 0,
        parentId: null,
        identifier: 'Términos',
        isPublished: null
      }
    this.cImagenesService.onGetImagen(oData).subscribe(resp => {
      let imagenHomeAux = [];
      resp.forEach(element => {
        this.sTerminosCondiciones = element;
        this.sTerminosCondiciones.c_descripcion = 'Acepto los términos y condiciones.';
      });
    });
 
    oData = {
      masterUserId: localStorage.getItem("MasterUserId"),
      companyId: localStorage.getItem("CompanyId"),
      contentId: 0,
      parentId: null,
      identifier: 'Protección',
      isPublished: null
    }
  this.cImagenesService.onGetImagen(oData).subscribe(resp => {
    let imagenHomeAux = [];
    resp.forEach(element => {
      this.sProteccion = element;
      this.sProteccion.c_descripcion = 'Declaro conocer y entender la Política y protección de datos personales y autorizo expresamente el tratamiento de mis datos personales.';
    });
  });
  }

  onVerTerminos() { 
    if (this.sTerminosCondiciones.Text !== '') {
      window.open(this.sTerminosCondiciones.Text, '_blank');
    }
  }

  onVerProtecionDatos() { 
    if (this.sProteccion.Text !== '') {
      window.open(this.sProteccion.Text, '_blank');
    }
  }

  onVerRepresentantes() { 
    if (this.sProteccion.c_url !== '') {
      window.open(this.sProteccion.c_url, '_blank');
    }
  }

  //Convertir fecha y hora a string
  fnConvertirDateToString(d_fecha: Date) {
    let d_fecha_aux = d_fecha.toLocaleString('es', { year: "numeric", month: "2-digit", day: "2-digit", hour: '2-digit', minute: '2-digit', second: "2-digit", hour12: false }).split(" ");
    let fecha = d_fecha_aux[0].split("/");
    let hora = d_fecha_aux[1];
    return fecha[2] + '-' + fecha[1] + '-' + fecha[0] + 'T' + hora;
  }

  //Convertir fecha a string
  fnConvertirDateToStringFecha(d_fecha: Date) {
    let d_fecha_aux = d_fecha.toLocaleString('es', { year: "numeric", month: "2-digit", day: "2-digit", hour: '2-digit', minute: '2-digit', second: "2-digit", hour12: false }).split(" ");
    let fecha = d_fecha_aux[0].split("/");
    let hora = d_fecha_aux[1];
    return fecha[2] + '-' + fecha[1] + '-' + fecha[0];
  }

  //Convertir hora a string
  fnConvertirDateToStringHora(d_fecha: Date) {
    let d_fecha_aux = d_fecha.toLocaleString('es', { year: "numeric", month: "2-digit", day: "2-digit", hour: '2-digit', minute: '2-digit', second: "2-digit", hour12: false }).split(" ");
    let fecha = d_fecha_aux[0].split("/");
    let hora = d_fecha_aux[1];
    return hora;
  }

  //Convierte la primera del string ingresado a mayúscula
  onPrimeraLetraUpper(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  //Redirige al paso 1 del agendamiento
  onIrPasoUno() {
    this.cRouter.navigateByUrl('/agendar/' + this.PlateName);
  }

  //Redirige a la página de verificación de reserva
  onGoVerificar() {
    if (this.onValidarFinalizar()) {
      this.cRouter.navigateByUrl('/agendar/' + this.PlateName + '/verificar');
    }
  }

  // ngOnDestroy(): void {
  //   this.mobileQuery.removeListener(this._mobileQueryListener);
  // }
  onObtenerTiposDocumento() {
    this.cSesionService.obtenerDocumentos().subscribe(oContent => {
      this.aTiposDocumentos = oContent
    });
  }
  onValidarTelefono(e){
    //var patt = new RegExp(/^\+?1?\s*?\(?\d{3}(?:\)|[-|\s])?\s*?\d{3}[-|\s]?\d{4}$/);
    // if(!patt.test(e.key)){
    //   e.preventDefault();
    // } 
    var key = window.event ? e.which : e.keyCode;
    if(key!= 45 && key!= 40&& key!= 41&& key!= 32&& key!= 43){
      if (key < 48 || key > 57) {
        e.preventDefault();
      }
     }     
  }

  //shouldRun = [/(^|\.)plnkr\.co$/, /(^|\.)stackblitz\.io$/].some(h => h.test(window.location.host));
}
