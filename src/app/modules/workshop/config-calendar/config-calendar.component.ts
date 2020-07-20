import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatDialog, MatTableDataSource, MatPaginatorIntl } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { WorkshopService } from 'src/app/services/workshop.service';
import { ActivatedRoute, Router } from '@angular/router';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours,
  startOfMonth,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
  subWeeks,
} from 'date-fns';
import { Subject } from 'rxjs';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView,
} from 'angular-calendar';
import { DeleteAgendaComponent } from './confirm/delete-agenda/delete-agenda.component';
import { FormControl } from '@angular/forms';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { CompanyService } from 'src/app/services/company.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { DatePipe } from '@angular/common';
import { AdviserService } from 'src/app/services/adviser.service';
import { UtilityClass } from 'src/app/compartido/Utility';
const colors: any = {
  red: {
    primary: '#f44336',
    secondary: '#f44336',
  }
};
@Component({
  selector: 'app-config-calendar',
  templateUrl: './config-calendar.component.html',
  styleUrls: ['./config-calendar.component.css'],
  providers: [DatePipe]
})
export class ConfigCalendarComponent implements OnInit {
  /**
   * Declare variables for class
  */
  private _viewDate: Date;
  utility = new UtilityClass();
  public IsPrincipalLoading: boolean = false;
  public cIsOnlyRecord: FormControl = new FormControl(true);
  public vCurrentDate: Date = new Date();
  public vMaximunDate: Date = new Date(new Date().setMonth(new Date().getMonth() + 6));
  private vCompanyId: string = null;
  public cLockedDate: FormControl = new FormControl();
  public vCompanyUser: any = null;
  private vWorkshopId: string = null;
  public vWorkshopModel: any = null;

  private vAgendaId: number = null;
  public vServices: any[] = [];
  public vChannels: any[] = [];
  public vCompanyAdviser: any[] = [];
  public vAdviserAppointment: any[] = [];
  public aServiceColor: any[] = [];
  public cIsAllDay: FormControl = new FormControl(false);
  public cStartDate: FormControl = new FormControl(this.utility.fnStringToDate('2020-01-01T00:00:00'));
  public cEndDate: FormControl = new FormControl(this.utility.fnStringToDate('2020-01-01T23:59:59'));
  public cIsCurrentWeek: FormControl = new FormControl(false);
  public cEndCurrentDate: FormControl = new FormControl(this.vMaximunDate);

  /**
   * Declare variables for Drawer
  */
  public IsDrawerOpen = false;
  public IsDrawerLoading = false;
  public vDrawerView = 'new';

  /**
   * Declare variables for Calendar
  */
  public vSelecterEvent: any = null;
  public vAgendaLockedDetail: any[] = [];
  public vView: CalendarView = CalendarView.Month;
  public vCalendarView = CalendarView;
  public vViewDate: Date = new Date();
  public vCalendarAgenda: CalendarEvent[] = [];
  public vActiveDayIsOpen: boolean = false;
  public vWeekStartsOn: any = 1;
  public vHourSegments: number = 4;
  public vDayStartHour: number = 0;
  public vDayEndHour: number = 23;
  private vActionAgendaEdit: CalendarEventAction =
    {
      label: '<span class="material-icons">edit</span>',
      a11yLabel: 'Editar',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.vAgendaId = event.meta.AgendaId;
        this.vSelecterEvent = event;
        this.onLoadWorkshops();
      }
    };
  private vActionAgendaDelete: CalendarEventAction = {
    label: '<span class="material-icons">delete_forever</span>',
    a11yLabel: 'Eliminar',
    onClick: ({ event }: { event: CalendarEvent }): void => {
      this.fnDeleteEvent(event.meta);
    }
  };
  
  public labelDataStart: Date = new Date();
  public labelDataend: Date = new Date();
  /**
   * Declare variables for DataTable
  */
  public vColumnAgenda: string[] = ['Date', 'Name', 'Action'];
  public vSourceAgenda: MatTableDataSource<any[]> = new MatTableDataSource<any[]>([]);
  /**
   * Declare Views
  */
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  /**
   * Declare variables for session
  */
  public sCurrentModule = JSON.parse(localStorage.getItem('ModuleSelected'));
  public sCurrentCompanyUser = JSON.parse(localStorage.getItem('CompanyUser'));

  constructor(
    private cTranslateService: TranslateService,
    private cMatPaginatorIntl: MatPaginatorIntl,
    private cActivatedRoute: ActivatedRoute,
    private cConfigurationService: ConfigurationService,
    private cMatDialog: MatDialog,
    private cCompanyService: CompanyService,
    private cWorkshopService: WorkshopService,
    private cSnackbarService: SnackbarService,
    private cAdviserService: AdviserService,
    private cDatePipe: DatePipe,
    private cRouter: Router
  ) {
    this.cTranslateService.setDefaultLang('es');
    this.vCompanyId = this.cActivatedRoute.snapshot.params.companyId;
    this.vWorkshopId = this.cActivatedRoute.snapshot.params.workshopId;
    this.cMatPaginatorIntl.itemsPerPageLabel = "Filas por página";
    this.cMatPaginatorIntl.nextPageLabel = "Página siguiente";
    this.cMatPaginatorIntl.previousPageLabel = "Página anterior";
  }
  ngOnInit() {
    this.fnGetMasterAgenda(1, true, null);
    this.onLoadWorkshops();
  }
  onRegresar(){
    var modulo =JSON.parse(localStorage.getItem("ModuleSelected"));    
    this.cRouter.navigate([modulo.ModulePath]);
  }
  /**
   * Funcion que obtiene los bloqueos de agenda desde una fecha a otra.
   * Para las vistas por mes, semana, dia y lista.
   * @param StartDate 
   * @param EndDate 
   */
  fnGetMasterAgenda(sCountDates: number, OnlyHeader: boolean, AgendaId?: number): void {  
    this.IsPrincipalLoading = true;
    let oRangoFechas = this.onGetRangoFechas(); 
    let vStartDateAux = this.cDatePipe.transform(oRangoFechas.StartDate, 'yyyy-MM-dd');
    let vEndDateAux = this.cDatePipe.transform(oRangoFechas.EndDate, 'yyyy-MM-dd');

    this.labelDataStart = oRangoFechas.StartDate;
    this.labelDataend=oRangoFechas.EndDate;
    let oParametersAgendaGet = {
      agendaId: AgendaId,
      masterUserId: this.sCurrentCompanyUser.MasterUserId,
      startDate: vStartDateAux,
      endDate: vEndDateAux,
      onlyHeader: OnlyHeader,
      companyId: this.vCompanyId,
      workshopId: this.vWorkshopId,
      channelId: null,
      serviceId: null,
      companyAdviserId: null,
      eventType: 3
    };
    this.cConfigurationService.AgendaGet(oParametersAgendaGet).subscribe((aResponseAgendaGet) => {
      let CalendarAgendaAux = [];

      aResponseAgendaGet.forEach(oAgenda => {
        let vActionAgenda = [];
        if (oAgenda.EventType === 3) {
          vActionAgenda.push(this.vActionAgendaEdit);
          vActionAgenda.push(this.vActionAgendaDelete);
        } else {
          vActionAgenda.push(this.vActionAgendaDelete);
        }
        CalendarAgendaAux.push({
          title: oAgenda.Name,
          actions: vActionAgenda,
          color: colors.red,
          draggable: false,
          start: this.utility.fnStringToDate(oAgenda.StartDate),
          end: this.utility.fnStringToDate(oAgenda.EndDate),
          allDay: oAgenda.IsAllDay,
          meta: oAgenda
        });
      });
      if (AgendaId) {
        this.vAgendaLockedDetail = aResponseAgendaGet;
      } else {
        this.vCalendarAgenda = CalendarAgendaAux;
        this.vSourceAgenda = new MatTableDataSource<any[]>(aResponseAgendaGet);
        this.vSourceAgenda.paginator = this.paginator;
      }
    }, (Err) => {
      
    this.IsPrincipalLoading = false;
    }, () => { 
      if (this.vAgendaId) {
        this.onEditAgenda(this.vSelecterEvent.meta);
      }
      this.onLoadAgendaAppointment();
    })
  }
  
  onGetRangoFechas() {
    let oDataFechas = {
      "StartDate": null,
      "EndDate": null
    };
    switch (this.vView.toString()) {
      case "month":
        oDataFechas.StartDate = startOfMonth(this.vViewDate);
        oDataFechas.EndDate = endOfMonth(this.vViewDate);
        break;
      case "week":
        if(this.vViewDate.getDay() == 0){
          oDataFechas.StartDate =  addDays(startOfWeek(subWeeks(this.vViewDate,1)), 1) ;
          oDataFechas.EndDate = addDays(endOfWeek(subWeeks(this.vViewDate,1)), 1) ;
        }else{
          oDataFechas.StartDate =  addDays(startOfWeek(this.vViewDate), 1) ;
          oDataFechas.EndDate = addDays(endOfWeek(this.vViewDate), 1) ;
        } 
        break;
      case "day":
        oDataFechas.StartDate = startOfDay(this.vViewDate);
        oDataFechas.EndDate = endOfDay(this.vViewDate);
        break;
    }
    return oDataFechas;

  }
  /**
   * Funcion que obtiene los datos de la compania selecionada
   * Lista los servicios y los canales
   */
  /**
   * Funcion que obtiene los taller que tiene una compania
   */
  onLoadWorkshops() {
    let oParametersWorkshopGet = {
      masterUserId: this.sCurrentCompanyUser.MasterUserId,
      companyId: this.vCompanyId,
      workshopId: this.vWorkshopId,
      isActived: '',
      geoLocationId: ''
    };
    this.cWorkshopService.MasterWorkshopGet(oParametersWorkshopGet).subscribe((aResponseWorkshop) => {
      this.vWorkshopModel = aResponseWorkshop[0];
      this.vServices = [];
      // if (this.vWorkshopModel) {
      //   this.vWorkshopModel.ServicesByWorkshop.forEach(oCompanyMaster => {
      //     oCompanyMaster.cControlService = new FormControl(false);
      //     this.vServices.push(oCompanyMaster);
      //   });
      // }
      this.onLoadService();
      this.vChannels = [];
      if (this.vWorkshopModel) {
        this.vWorkshopModel.ChannelsByWorkshop.forEach(oCompanyMaster => {
          oCompanyMaster.IsActived = (oCompanyMaster.IsActived.toString() === '1') ? true : false;
          if (oCompanyMaster.IsActived) {
            oCompanyMaster.cControlChannel = new FormControl(false);
            this.vChannels.push(oCompanyMaster);
          }
        });
      }
      if (this.vWorkshopModel) {
        this.onSetHoourInitalCalendarWeek(this.vWorkshopModel);
      }

    }, (oErr) => {

    }, () => {
      this.onLoadAdviser();
    });
  }
      /**
   * Function que lista los servicios 
   */
  onLoadService() {
    let oDataSend = {
      masterUserId: this.sCurrentCompanyUser.MasterUserId,
      companyId: this.vCompanyId
    };
    this.cCompanyService.BrandsByCompanyGet(oDataSend).subscribe((oData) => {
      var serviceAux = [];
      oData.forEach(element => {
        if(element.IsActived == "1"){
          element.cControlService = new FormControl(false);
          serviceAux.push(element);
        }
      });
      this.vServices = serviceAux;
    }, (oErr) => {

    }, () => {
    });
  }
  onSetHoourInitalCalendarWeek(cWorkshopService){ 
    let oStarHour = this.utility.fnStringToDate("2020-01-01T"+ cWorkshopService.MasterSchedule[0].StartTime); 
    let oEndHour =  this.utility.fnStringToDate("2020-01-01T"+ cWorkshopService.MasterSchedule[0].EndTime); 
    cWorkshopService.MasterSchedule.forEach(element => {
      let DataStart = this.utility.fnStringToDate("2020-01-01T"+ element.StartTime);  
      if(oStarHour.getTime() > DataStart.getTime()){
        oStarHour = DataStart;
      }  
      let DataEnd = this.utility.fnStringToDate("2020-01-01T"+ element.EndTime);  
      if(oEndHour.getTime() < DataEnd.getTime()){
        oEndHour = DataEnd;
      } 
    });
    this.vDayStartHour = oStarHour.getHours();
    this.vDayEndHour = oEndHour.getHours();
  }
  onLoadAdviser() {
    let oDataSend = {
      masterUserId: this.sCurrentCompanyUser.MasterUserId,
      companyId: this.vCompanyId,
      workshopId: this.vWorkshopId,
      companyAdviserId: null,
      isActived: true
    }
    this.cAdviserService.ObtenerAsesores(oDataSend).subscribe(aCompanyAdviser => {
      let oCompanyAdviserAux = [];
      aCompanyAdviser.forEach(element => {
        element.cControlCompanyAdviser = new FormControl(false);
        oCompanyAdviserAux.push(element);
      });
      this.vCompanyAdviser = oCompanyAdviserAux;
    }, (oRrr) => {

    }, () => {
      if (this.vAgendaId) {
        this.fnGetMasterAgenda(1, false, this.vAgendaId);
      }

    });
  }
  onResetVariables() {
    this.vAgendaId = null;
    this.vCompanyAdviser = [];
    this.vServices = [];
    this.vChannels = [];
    this.cLockedDate = new FormControl();
    this.cIsAllDay = new FormControl(false);
    this.cStartDate = new FormControl(this.utility.fnStringToDate('2020-01-01T00:00:00'));
    this.cEndDate = new FormControl(this.utility.fnStringToDate('2020-01-01T00:00:00'));
    this.cIsCurrentWeek = new FormControl(false);
    this.cEndCurrentDate = new FormControl(this.vMaximunDate);
  }
  /**
   * Funcion que se ejecuta cuando se da click en un dia del calendario
   * @param param0 
   */
  envDayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.vViewDate)) {
      if (
        (isSameDay(this.vViewDate, date) && this.vActiveDayIsOpen === true) ||
        events.length === 0
      ) {
        this.vActiveDayIsOpen = false;
      } else {
        this.vActiveDayIsOpen = true;
      }
      this.vViewDate = date;
      this.cLockedDate.setValue(date);
    }
  }
  /**
   * Funcion que se ejecuta cuando se cambia la vista para Mes, Semana, Día y Listado   
   * @param pCalendarView  tipo de calendario
   */
  envChangeView(pView: CalendarView) {
    this.vView = pView;
    if (pView) {
      this.fnGetMasterAgenda(1, true, null);
    }
  }
  /**
   * Funcion que cierra el panel inzquierdo de opciones
   */
  closedStart() {
    this.IsDrawerOpen = false;
  }
  onChangeLockedAllDay() {
    if (this.cIsAllDay.value) {
      this.cStartDate.setValue(this.utility.fnStringToDate('2020-01-01T00:00:00'));
      this.cEndDate.setValue(this.utility.fnStringToDate('2020-01-01T23:59:00'));
    }
  }
  fnValidateStartEndDate(event, tipo) {
    if (this.cStartDate.value > this.cEndDate.value) {
      let sMessage = '';
      this.cTranslateService.get('BrandConfigServicesSaturdayStopError').subscribe((text: string) => {
        sMessage = text;
      });
      this.cSnackbarService.openSnackBar(sMessage, '', 'Error');
      if (tipo === 1) {
        let oDataAux = new Date(event.setMinutes(event.getMinutes() - 1));
        this.cEndDate.setValue(oDataAux)
      } else if (tipo === 2) {
        let oDataAux = new Date(event.setMinutes(event.getMinutes() - 1));
        this.cStartDate.setValue(oDataAux)
      }
    }
  }

  /**
   * Funcion que lista las citas agendadas.
   */
  onLoadAgendaAppointment() { 
    
    let oRangoFechas = this.onGetRangoFechas(); 
    let vStartDateAux = this.cDatePipe.transform(oRangoFechas.StartDate, 'yyyy-MM-dd');
    let vEndDateAux = this.cDatePipe.transform(oRangoFechas.EndDate, 'yyyy-MM-dd');
    let oDataSendAppointment = {
      agendaId:null,
      masterUserId: this.sCurrentCompanyUser.MasterUserId,
      startDate: vStartDateAux,
      endDate: vEndDateAux,
      companies: this.vCompanyId,
      workshops: this.vWorkshopId,
      channels: '',
      services: '',
      advisers: '',
      customerId: '',
      statusId: '1,5',
      geolocations: '',
      isPickUpAndDelibery: '',
      haveRepresentative: null,
      plateName: ''
    };
    this.cConfigurationService.AgendaAppointmentDashboardGet(oDataSendAppointment).subscribe((aAgendaAppointmentResponse) => {
       
      let vDataAgendaShowAux = [];
      aAgendaAppointmentResponse.forEach(element => { 
        let Title = '<span class="contenido-title">Cliente: ' + this.onPascalCaseString(element.CustomerFirstName).trim() + ' '+ this.onPascalCaseString(element.CustomerLastName).trim() + '<br/>';
        Title += 'Placa: ' + element.PlateName.toUpperCase() + '<br/>';
        Title += 'Asesor: ' + this.onPascalCaseString(element.CompanyAdviserFirstName.trim() + ' ' + this.onPascalCaseString(element.CompanyAdviserLastName)).trim() + '<br/>';
        Title += 'De: ' + this.cDatePipe.transform(this.utility.fnStringToDate(element.StartDate), 'HH:mm') + ' hasta: ' + this.cDatePipe.transform(this.utility.fnStringToDate(element.EndDate), 'HH:mm') + '</span>';
       
        let vActionAgenda = {
          title: Title,
           color: {
            primary: element.ColorHex.trim(),
            secondary: element.ColorHex.trim(),
          },
          draggable: false,
          start: this.utility.fnStringToDate(element.StartDate),
          end: this.utility.fnStringToDate(element.EndDate),
          meta: element
        };
        vDataAgendaShowAux.push(vActionAgenda);
      });
      this.vCalendarAgenda = this.vCalendarAgenda.concat(vDataAgendaShowAux);
      this.onBuildDataAsesor(aAgendaAppointmentResponse);
    }, (oErr) => {

      this.IsPrincipalLoading = false;
    }, () => {
      this.IsPrincipalLoading = false;

    })
  }
  /**
   * Funcion que ordena las agandas por asesor y por servicios
   * @param oData Array de agendamiento
   */
  onBuildDataAsesor(oData) {
    let aChannelAux = [];
    let aServiceAux = [];
    let aAdviserAux = [];
    oData.forEach(element => {
      let indexCanal = aChannelAux.findIndex(oEle => oEle.ChannelId === element.ChannelId);
      if (indexCanal === -1) {
        aChannelAux.push(element);
      }

      let indexColor = aServiceAux.findIndex(oEle => oEle.ServiceId === element.ServiceId);
      if (indexColor === -1) {
        let oAuxData = Object.assign({ n_total: 1 }, element)
        aServiceAux.push(oAuxData);
      }

      let index = aAdviserAux.findIndex(oEle => oEle.CompanyAdviserId === element.CompanyAdviserId);
      if (index === -1) {
        let oAuxData = Object.assign({ n_total: 1 }, element)
        oAuxData.aCitas = [element];
        aAdviserAux.push(oAuxData);
      } else {
        aAdviserAux[index].n_total++;
        aAdviserAux[index].aCitas.push(element);
      }
    });
    this.aServiceColor = aServiceAux;
    aAdviserAux.forEach(element => {
      let aAux = [];
      element.aCitas.forEach(element1 => {
        let index = aAux.findIndex(oEle => oEle.ServiceId === element1.ServiceId);
        if (index === -1) {
          let oAuxData = Object.assign({ n_total_reserva: 1 }, element1)
          oAuxData.nPorcentaje = oAuxData.n_total_reserva / element.n_total * 100;
          oAuxData.aReservas = [element1];
          aAux.push(oAuxData);
        } else {
          aAux[index].n_total_reserva++;
          aAux[index].nPorcentaje = aAux[index].n_total_reserva / element.n_total * 100;
          aAux[index].aReservas.push(element1);
        }
      });
      element.aHijo = aAux;
    });
    this.vAdviserAppointment = aAdviserAux;
  }
  onNewAgenda() {
    this.vDrawerView = 'new';
    this.onLoadWorkshops();
    this.envOpenDrawer();
  }
  /**
   * Funcion que setea los datos de una agenda para editar
   * @param meta AgendaObject
   */
  onEditAgenda(meta) {
    this.envOpenDrawer();
    this.vDrawerView = 'edit';
    this.cLockedDate.setValue(this.utility.fnStringToDate(meta.StartDate));
    this.cIsCurrentWeek.setValue(meta.IsRecurrent);
    this.cEndCurrentDate.setValue(this.utility.fnStringToDate(meta.toDate));
    this.cIsAllDay.setValue(meta.IsAllDay);
    this.cStartDate.setValue(this.utility.fnStringToDate(meta.StartDate));
    this.cEndDate.setValue(this.utility.fnStringToDate(meta.EndDate));
    this.onCleanData(this.vAgendaLockedDetail);
  }
  onCleanData(aData) {
    let aChannelSelected = [];
    let aCompanyAdviserSelected = [];
    let aServiceSelected = [];
    aData.forEach(element => {
      if (element.ChannelId) {
        let aChannelSelectedIndex = aChannelSelected.findIndex(oEle => oEle.toString() === element.ChannelId.toString())
        if (aChannelSelectedIndex == -1) {
          aChannelSelected.push(element.ChannelId.toString())
        }
      }
      if (element.CompanyAdviserId) {
        let aCompanyAdviserSelectedIndex = aCompanyAdviserSelected.findIndex(oEle => oEle.toLowerCase() === element.CompanyAdviserId.toLowerCase())
        if (aCompanyAdviserSelectedIndex == -1) {
          aCompanyAdviserSelected.push(element.CompanyAdviserId.toLowerCase())
        }
      }
      if (element.ServiceId) {
        let aServiceSelectedIndex = aServiceSelected.findIndex(oEle => oEle.toString() === element.ServiceId.toString())
        if (aServiceSelectedIndex == -1) {
          aServiceSelected.push(element.ServiceId.toString())
        }
      }
    });
    aChannelSelected.forEach(element => {
      let oData = this.vChannels.find(oEle => oEle.ChannelId.toString() === element.toString())
      if (oData) {
        oData.cControlChannel.setValue(true);
      }
    });
    aCompanyAdviserSelected.forEach(element => {
      let oData = this.vCompanyAdviser.find(oEle => oEle.CompanyAdviserId.toLowerCase() === element.toLowerCase())
      if (oData) {
        oData.cControlCompanyAdviser.setValue(true);
      }
    });
    aServiceSelected.forEach(element => {
      let oData = this.vServices.find(oEle => oEle.ServiceId.toString() === element.toString())
      if (oData) {
        oData.cControlService.setValue(true);
      }
    });
  }
  envOpenDrawer() {
    this.IsDrawerOpen = true;
  }
  envCloseDrawer() {
    this.IsDrawerOpen = false;
    this.onResetVariables();
  }
  onDeleteAgenda(oAgendaLocked) {
    let oDataSend = {
      agendaId: oAgendaLocked.AgendaId,
      masterUserId: oAgendaLocked.MasterUserId,
      companyId: this.vCompanyId,
      workshopId: this.vWorkshopId,
      companyAdviserId: null
    };
    this.cConfigurationService.AgendaDelete(oDataSend).subscribe((oData) => {
      if(oData.codeResponse){
        this.envCloseDrawer();
        this.fnGetMasterAgenda(1, true, null);
        let sMessage = '';
        this.cTranslateService.get('eliminadoCorrectamente').subscribe((text: string) => {
          sMessage = text;
        });
        this.cSnackbarService.openSnackBar(sMessage, '', 'Success');
      }else{
        let sMessage = '';
        this.cTranslateService.get('errorGuardar').subscribe((text: string) => {
          sMessage = text;
        });
        this.cSnackbarService.openSnackBar(sMessage, '', 'Success');
      }
      
    }, () => {

    }, () => {

    })

  }
  onValidSaveAgenda() {

    if (!this.cLockedDate.valid) {
      return false;
    }

    return true;
  }
  onSaveAgendaModify() {
    if (!this.onValidSaveAgenda()) {
      let sMessage = '';
        this.cTranslateService.get('modificarFechasPasadas').subscribe((text: string) => {
          sMessage = text;
        });
        this.cSnackbarService.openSnackBar(sMessage, '', 'Error');      
      return;
    }
    let vServicesAux = [];
    let vServicesAuxTmp = [];
    this.vServices.forEach((element) => {
      vServicesAuxTmp.push(element.ServiceId.toString())
      if (element.cControlService.value) {
        vServicesAux.push(element.ServiceId.toString());
      }
    });
    let vChannelsAux = [];
    let vChannelsAuxTmp = [];
    this.vChannels.forEach((element) => {
      vChannelsAuxTmp.push(element.ChannelId.toString())
      if (element.cControlChannel.value) {
        vChannelsAux.push(element.ChannelId.toString());
      }
    });
    let vCompanyAdviserAux = [];
    let vCompanyAdviserAuxTmp = [];
    this.vCompanyAdviser.forEach((element) => {
      vCompanyAdviserAuxTmp.push(element.CompanyAdviserId.toString())
      if (element.cControlCompanyAdviser.value) {
        vCompanyAdviserAux.push(element.CompanyAdviserId.toString());
      }
    });
    if (vCompanyAdviserAux.length === 0 && vChannelsAux.length === 0 && vServicesAux.length === 0) {
      vServicesAux = vServicesAuxTmp;
      vChannelsAux = vChannelsAuxTmp;
      vCompanyAdviserAux = vCompanyAdviserAuxTmp;
    }
    let DateStringEnd = this.cIsCurrentWeek.value ? this.cDatePipe.transform(this.cEndCurrentDate.value, 'yyyy-MM-dd') : this.cDatePipe.transform(this.cLockedDate.value, 'yyyy-MM-dd');
    let oDataSend = {
      agendaId: this.vAgendaId,
      eventType: 3,
      startDate: this.cDatePipe.transform(this.cLockedDate.value, 'yyyy-MM-dd') + 'T' + this.cDatePipe.transform(this.cStartDate.value, 'HH:mm:ss'),
      endDate: DateStringEnd + 'T' + this.cDatePipe.transform(this.cEndDate.value, 'HH:mm:ss'),
      isAllDay: this.cIsAllDay.value,
      name: 'Desde ' + this.cDatePipe.transform(this.cStartDate.value, 'hh:mm a') + ' hasta ' + this.cDatePipe.transform(this.cEndDate.value, 'hh:mm a'),
      detail: '',
      credentialAdd: this.sCurrentCompanyUser.OrganizationUserId,
      credentialUpd: this.sCurrentCompanyUser.OrganizationUserId,
      masterUserId: this.sCurrentCompanyUser.MasterUserId,
      companyId: this.vCompanyId,
      workshopId: this.vWorkshopId,
      channelId: vChannelsAux.toString(),
      serviceId: vServicesAux.toString(),
      companyAdviserId: vCompanyAdviserAux.toString()
    };
    this.cConfigurationService.AgendaModify(oDataSend).subscribe((oData) => {
      if(oData.codeResponse){
        this.envCloseDrawer();
        this.fnGetMasterAgenda(1, true, null);
        let sMessage = '';
        this.cTranslateService.get('guardadoExitosamente').subscribe((text: string) => {
          sMessage = text;
        });
        this.cSnackbarService.openSnackBar(sMessage, '', 'Success');
      }else{
        let sMessage = '';
        this.cTranslateService.get('errorGuardar').subscribe((text: string) => {
          sMessage = text;
        });
        this.cSnackbarService.openSnackBar(sMessage, '', 'Error');
      }
     
    }, () => {
    }, () => {
    })
  }
  fnDeleteEvent(oAgendaLockedAux) {
    let oMessage = "" + oAgendaLockedAux.Name;
    const dialogRef = this.cMatDialog.open(DeleteAgendaComponent, {
      data: oMessage
    });
    dialogRef.afterClosed().subscribe(oResp => {
      if (oResp) {
        this.onDeleteAgenda(oAgendaLockedAux);
        this.vActiveDayIsOpen = false;
      }
    });
  }
  closeOpenMonthViewDay() {
    this.vActiveDayIsOpen = false;
    //this.fnGetMasterAgenda(1, true,null);
    if(!this.IsPrincipalLoading){
      this._viewDate = new Date(this.vViewDate);
      this.fnGetMasterAgenda(1, true,null); 
      this.vViewDate = this._viewDate; 
    }else{
      this.vViewDate = this._viewDate;
    }
  }
  onPascalCaseString(sPalabras: string): string {
    let aux = '';
    sPalabras.split(" ").forEach(element => {
      element = element.toLowerCase();
      aux += " " + element.charAt(0).toUpperCase() + '' + element.substring(1);
    });
    return aux;
  }
  envDaySemClicked(dia){
    this.cLockedDate.setValue(dia.date);
  }
}
