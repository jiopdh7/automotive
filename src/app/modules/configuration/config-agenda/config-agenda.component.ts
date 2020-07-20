import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatDialog, MatPaginatorIntl } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { ConfigurationService } from 'src/app/services/configuration.service';
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
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyService } from 'src/app/services/company.service';
import { WorkshopService } from 'src/app/services/workshop.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { DatePipe } from '@angular/common';
import { MyErrorStateMatcher } from 'src/app/compartido/MyErrorStateMatcher';
import { UtilityClass } from 'src/app/compartido/Utility';
const colors: any = {
  red: {
    primary: '#f44336',
    secondary: '#f44336',
  }
};
@Component({
  selector: 'app-config-agenda',
  templateUrl: './config-agenda.component.html',
  styleUrls: ['./config-agenda.component.css'],
  providers: [DatePipe]
})
export class ConfigAgendaComponent implements OnInit {

  utility = new UtilityClass();
  /**
   * Declare variables for class
  */
  public IsPrincipalLoading: boolean = false;
  public cIsOnlyRecord: FormControl = new FormControl(true);
  public vCurrentDate: Date = new Date();
  public vMaximunDate: Date = new Date(new Date().setMonth(new Date().getMonth() + 6));
  private vCompanyId: string = null;
  public cLockedDate: FormControl = new FormControl();
  public vCompanyUser: any = null;
  private vAgendaId: number = null;
  public vServices: any[] = [];
  public vChannels: any[] = [];
  public vWorkshops: any[] = [];
  public cIsAllDay: FormControl = new FormControl(true);
  public cStartDate: FormControl = new FormControl(this.utility.fnStringToDate('2020-01-01T00:00:00'));
  public cEndDate: FormControl = new FormControl(this.utility.fnStringToDate('2020-01-01T23:59:59'));
  public cIsCurrentWeek: FormControl = new FormControl(false);
  public cEndCurrentDate: FormControl = new FormControl(this.vMaximunDate);
  public c_titulo: FormControl = new FormControl("");
  public c_descripcion: FormControl = new FormControl("");  
  matcher = new MyErrorStateMatcher();
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
  public vView: CalendarView = CalendarView.Month;
  public vCalendarView = CalendarView;
  public vViewDate: Date = new Date();
  public vCalendarAgenda: CalendarEvent[] = [];
  public vActiveDayIsOpen: boolean = false;
  public vWeekStartsOn: string = '1';
  public vHourSegments: number = 4;
  public vDayStartHour: number = 7;
  private vActionAgenda: CalendarEventAction[] = [
    {
      label: '<span class="material-icons">delete_forever</span>',
      a11yLabel: 'Eliminar',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.fnDeleteEvent(event.meta.Name, event.meta.AgendaId);
      }
    }
  ];
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
    private cDatePipe: DatePipe,
    private cRouter: Router,
  ) {
    this.cTranslateService.setDefaultLang('es');
    this.vCompanyId = this.cActivatedRoute.snapshot.params.CompanyId;
    this.cMatPaginatorIntl.itemsPerPageLabel = "Filas por página";
    this.cMatPaginatorIntl.nextPageLabel = "Página siguiente";
    this.cMatPaginatorIntl.previousPageLabel = "Página anterior";
  }
  ngOnInit() {
    this.fnGetMasterAgenda(1, true, null);
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
    let vStartDateCurrent = startOfMonth(subMonths(this.vViewDate,1));
    let vEndDateCurrent = endOfMonth(addMonths(this.vViewDate,1)); 
    let vStartDateAux = this.cDatePipe.transform( vStartDateCurrent, 'yyyy-MM-dd');
    let vEndDateAux = this.cDatePipe.transform( vEndDateCurrent , 'yyyy-MM-dd');
    this.labelDataStart = vStartDateCurrent;
    this.labelDataend=vEndDateCurrent;
    let oParametersAgendaGet = {
      agendaId: AgendaId,
      masterUserId: this.sCurrentCompanyUser.MasterUserId,
      startDate: vStartDateAux,
      endDate: vEndDateAux,
      onlyHeader: OnlyHeader,
      companyId: null,
      workshopId: null,
      channelId: null,
      serviceId: null,
      companyAdviserId: null,
      eventType: 1
    };
    this.cConfigurationService.AgendaGet(oParametersAgendaGet).subscribe((aResponseAgendaGet) => {
      let CalendarAgendaAux = [];
      aResponseAgendaGet.forEach(oAgenda => {
        CalendarAgendaAux.push({
          title: oAgenda.Name,
          actions: this.vActionAgenda,
          color: colors.red,
          draggable: false,
          start: this.utility.fnStringToDate(oAgenda.StartDate),
          end: this.utility.fnStringToDate(oAgenda.EndDate),
          allDay: oAgenda.IsAllDay,
          meta: oAgenda
        });
      });
      this.vCalendarAgenda = CalendarAgendaAux;
      this.vSourceAgenda = new MatTableDataSource<any[]>(aResponseAgendaGet);
      this.vSourceAgenda.paginator = this.paginator;
    }, () => { 
    }, () => {
    })
  }
 
  /**
   * Funcion que seleciona los canales, talleres y servicios selecionados
   */
  onSetSeleccionException(): void {
    this.vChannels.forEach(element => {
      let oSelectionAux = this.vSelecterEvent.meta.AgendaDetails.find(oEle => oEle.ChannelId);
      // if(element.)
      element.cControlChannel.setValue(true);
    });

  }
  onResetVariables() {
    this.vServices = [];
    this.vChannels = [];
    this.vWorkshops = [];
    this.vAgendaId = null;
    this.cIsAllDay = new FormControl(true);
    this.cStartDate = new FormControl(startOfDay(new Date()));
    this.cEndDate = new FormControl(endOfDay(new Date()));
    this.cIsCurrentWeek = new FormControl(false);
    this.cEndCurrentDate = new FormControl(this.vMaximunDate);
    this.cLockedDate= new FormControl();
    this.c_titulo = new FormControl('');    
    this.c_descripcion = new FormControl('');
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
  }
  /**
   * Funcion que cierra el panel inzquierdo de opciones
   */
  closedStart() {
    this.IsDrawerOpen = false;
  }
  onChangeLockedAllDay() {
    if (this.cIsAllDay.value) {
      this.cStartDate = new FormControl(startOfDay(new Date()));
      this.cEndDate = new FormControl(endOfDay(new Date()));
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
    this.envOpenDrawer();
  }
  /**
   * Funcion que setea los datos de una agenda para editar
   * @param meta AgendaObject
   */
  onEditAgenda(meta) {
    this.envOpenDrawer();
    this.vDrawerView = 'edit';
    this.cIsCurrentWeek.setValue(meta.IsRecurrent);
    if (this.cIsCurrentWeek.value) {
      this.cEndCurrentDate.setValue(new Date(meta.toDate));
    }
    this.cIsAllDay.setValue(meta.IsAllDay);
    this.cStartDate.setValue(new Date(meta.StartDate));
    this.cEndDate.setValue(new Date(meta.EndDate));
  }
  envOpenDrawer() {
    this.IsDrawerOpen = true;
  }
  envCloseDrawer() {
    this.IsDrawerOpen = false;
    this.onResetVariables();
  }
  onDeleteAgenda(agendaIdAux) { 
    let oDataSend = {
      agendaId: agendaIdAux,
      masterUserId: this.sCurrentCompanyUser.MasterUserId,
      companyId: null,
      workshopId:null,
      companyAdviserId: null
    };
    this.cConfigurationService.AgendaDelete(oDataSend).subscribe((oData) => { 
      this.fnGetMasterAgenda(1, true, null);
    }, () => {

    }, () => {

    })

  }
  onValidSaveAgenda() {
    if (!this.c_titulo.valid) {
      return false;
    } else if (!this.c_descripcion.valid) {
      return false;
    }
    return true;
  }
  onSaveAgendaModify() {
    if (!this.onValidSaveAgenda()) {
      return;
    }
    
    this.cStartDate = new FormControl(startOfDay(new Date()));
    this.cEndDate = new FormControl(endOfDay(new Date()));
    let oDataSend = {
      agendaId: null,
      eventType: 1,
      startDate: this.cDatePipe.transform(startOfDay(this.cLockedDate.value), 'yyyy-MM-ddTHH:mm:ss') ,
      endDate: this.cDatePipe.transform(endOfDay(this.cLockedDate.value), 'yyyy-MM-ddTHH:mm:ss') ,
      isAllDay: this.cIsAllDay.value,
      name: this.c_titulo.value,
      detail: this.c_descripcion.value,
      credentialAdd: this.sCurrentCompanyUser.OrganizationUserId,
      credentialUpd: this.sCurrentCompanyUser.OrganizationUserId,
      masterUserId: this.sCurrentCompanyUser.MasterUserId,
      companyId: '',
      workshopId: '',
      channelId: '',
      serviceId: '',
      companyAdviserId: ''
    };
    this.cConfigurationService.AgendaModify(oDataSend).subscribe((oData) => { 
      this.fnGetMasterAgenda(1, true, null);
      this.envCloseDrawer();
      let sMessage = '';
      this.cTranslateService.get('guardadoExitosamente').subscribe((text: string) => {
        sMessage = text;
      });
      this.cSnackbarService.openSnackBar(sMessage, '', 'Success');
    }, () => {
    }, () => {
    })
  }
  fnDeleteEvent(sMessage, AgendaId) {
    const dialogRef = this.cMatDialog.open(DeleteAgendaComponent, {
      data: sMessage
    });
    dialogRef.afterClosed().subscribe(oResp => {
      if (oResp) {
        this.onDeleteAgenda(AgendaId);
        this.closeOpenMonthViewDay();
      }
    });
  }
  closeOpenMonthViewDay() {
    this.vActiveDayIsOpen = false;
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
