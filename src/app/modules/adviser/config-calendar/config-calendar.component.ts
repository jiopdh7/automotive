
import {
  Component,
  OnInit,
  ViewChild,
  TemplateRef,
} from '@angular/core';
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
  subMonths,
  addMonths,
  subWeeks,
  startOfWeek,
  endOfWeek,
} from 'date-fns';
import { Subject } from 'rxjs';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView,
} from 'angular-calendar';
import { DeleteAgendaComponent } from './confirm/delete-agenda/delete-agenda.component';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog, MatPaginatorIntl } from '@angular/material';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyService } from 'src/app/services/company.service';
import { WorkshopService } from 'src/app/services/workshop.service';
import { FormControl } from '@angular/forms';
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
  public IsPrincipalLoading: boolean = false;
  utility = new UtilityClass();
  public cIsOnlyRecord: FormControl = new FormControl(true);
  public vCurrentDate: Date = new Date();
  public vMaximunDate: Date = addMonths(new Date(),6);// new Date(new Date().setMonth(new Date().getMonth() + 6));
  private vCompanyId: string = null;
  public cLockedDate: FormControl = new FormControl();
  public vCompanyUser: any = null;
  private vWorkshopId: string = null;
  public vWorkshopModel: any = null;
  public vCompanyAdviserId: any = null;
  public vCompanyAdviserModel: any = null;
  private vAgendaId: number = null;
  public vServices: any[] = [];
  public vChannels: any[] = [];
  public vCompanyAdviser: any[] = [];
  public cIsAllDay: FormControl = new FormControl(false);
  public cStartDate: FormControl = new FormControl(this.utility.fnStringToDate('2020-01-01T00:00:00'));
  public cEndDate: FormControl = new FormControl(this.utility.fnStringToDate('2020-01-01T23:59:59'));
  public cIsCurrentWeek: FormControl = new FormControl(false);
  public cEndCurrentDate: FormControl = new FormControl(this.vMaximunDate);
  sNombreCompletoAsesor:string = "";
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
  public vWeekStartsOn: string = '1';
  public vHourSegments: number = 4;
  public vDayStartHour: number = 7;
  public vDayEndHour:number = 23;
  private vActionAgendaEdit: CalendarEventAction =
    {
      label: '<span class="material-icons">edit</span>',
      a11yLabel: 'Editar',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.vAgendaId = event.meta.AgendaId;
        this.vSelecterEvent = event;
        this.onLoadAdviser();
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
    this.vCompanyAdviserId = this.cActivatedRoute.snapshot.params.companyAdviserId;
    this.cMatPaginatorIntl.itemsPerPageLabel = "Filas por página";
    this.cMatPaginatorIntl.nextPageLabel = "Página siguiente";
    this.cMatPaginatorIntl.previousPageLabel = "Página anterior";
  }
  ngOnInit() {
    this.fnGetMasterAgenda(1, true, null);
    this.onLoadAdviser();
  }
  onRegresar(){
    var modulo =JSON.parse(localStorage.getItem("ModuleSelected"));    
    this.cRouter.navigate([modulo.ModulePath]);
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
   * Funcion que obtiene los bloqueos de agenda desde una fecha a otra.
   * Para las vistas por mes, semana, dia y lista.
   * @param StartDate 
   * @param EndDate 
   */
  fnGetMasterAgenda(sCountDates: number, OnlyHeader: boolean, AgendaId?: number): void {

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
      companyAdviserId: this.vCompanyAdviserId,
      eventType: 4
    };
    this.cConfigurationService.AgendaGet(oParametersAgendaGet).subscribe((aResponseAgendaGet) => {
      let CalendarAgendaAux = [];

      aResponseAgendaGet.forEach(oAgenda => {
        let vActionAgenda = [];
        if (oAgenda.EventType === 4) {
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
    }, () => {
      if (this.vAgendaId) {
        this.onEditAgenda(this.vSelecterEvent.meta);
      }
    })
  }
  onLoadAdviser() {
    let oDataSend = {
      masterUserId: this.sCurrentCompanyUser.MasterUserId,
      companyId: this.vCompanyId,
      workshopId: '',
      companyAdviserId: this.vCompanyAdviserId,
      isActived: ''
    }
    this.cAdviserService.ObtenerAsesores(oDataSend).subscribe(aCompanyAdviser => {      
      if (aCompanyAdviser.length > 0) {        
        this.vCompanyAdviserModel = aCompanyAdviser[0];
        this.sNombreCompletoAsesor= this.onPascalCaseString(this.vCompanyAdviserModel.FirstName.trim() + " " + this.vCompanyAdviserModel.LastName.trim());
        this.vWorkshopId = this.vCompanyAdviserModel.WorkshopId;
        // let oCompanyAdviserAux = [];
        // this.vCompanyAdviserModel.ServicesByCompanyAdviser.forEach(element => {
        //   element.cControlService = new FormControl(false);
        //   oCompanyAdviserAux.push(element);
        // });
        // this.vServices = oCompanyAdviserAux;
        this.onLoadService();
      }
    }, (oRrr) => {

    }, () => {
      this.onLoadWorkshops();

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
      isActived: '1',
      geoLocationId: ''
    };
    this.cWorkshopService.MasterWorkshopGet(oParametersWorkshopGet).subscribe((aResponseWorkshop) => {
      if (aResponseWorkshop.length > 0) {
        this.vWorkshopModel = aResponseWorkshop[0];
        this.vChannels = [];
        this.vWorkshopModel.ChannelsByWorkshop.forEach(oCompanyMaster => {
          oCompanyMaster.IsActived = (oCompanyMaster.IsActived.toString() === '1') ? true : false;
          if (oCompanyMaster.IsActived) {
            oCompanyMaster.cControlChannel = new FormControl(false);
            this.vChannels.push(oCompanyMaster);
          }
        });
        this.onSetHoourInitalCalendarWeek(this.vWorkshopModel);

      }
    }, (oErr) => {

    }, () => {
      if (this.vAgendaId) {
        this.fnGetMasterAgenda(1, false, this.vAgendaId);
      }
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
  onNewAgenda() {
    this.vDrawerView = 'new';
    this.onLoadAdviser();
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
    let aServiceSelected = [];
    aData.forEach(element => {
      if (element.ChannelId) {
        let aChannelSelectedIndex = aChannelSelected.findIndex(oEle => oEle.toString() === element.ChannelId.toString())
        if (aChannelSelectedIndex == -1) {
          aChannelSelected.push(element.ChannelId.toString())
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
      companyAdviserId: this.vCompanyAdviserId
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
        this.cSnackbarService.openSnackBar(sMessage, '', 'Error');
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
      eventType: 4,
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
      companyAdviserId: this.vCompanyAdviserId
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
    if(!this.IsPrincipalLoading){
      this._viewDate = new Date(this.vViewDate);
      this.fnGetMasterAgenda(1, true,null)
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
