import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatDialog } from '@angular/material';
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
  isThisSecond,
  subWeeks,
} from 'date-fns';
import { Subject } from 'rxjs';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView,
} from 'angular-calendar';
import { DatePipe } from '@angular/common';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { TranslateService } from '@ngx-translate/core';
import { CompanyService } from 'src/app/services/company.service';
import { element } from 'protractor';
import { FormControl, Validators } from '@angular/forms';
import { WorkshopService } from 'src/app/services/workshop.service';
import { AdviserService } from 'src/app/services/adviser.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { MessageTopesComponent } from '../message-topes/message-topes.component';
import { MessageAdvisersComponent } from '../message-advisers/message-advisers.component';
import { MessageFlujoAlternoComponent } from '../message-flujo-alterno/message-flujo-alterno.component';
import { MessageAlertComponent } from '../message-alert/message-alert.component';
import { MyErrorStateMatcher } from 'src/app/compartido/MyErrorStateMatcher';
import { CustomerService } from 'src/app/services/customer.service';
import { flatMap } from 'rxjs/operators';
import { SelectionModel } from '@angular/cdk/collections';
import { ModifyComponent } from '../modify/modify.component';
import { CreateComponent } from '../create/create.component';
import { de } from 'date-fns/locale';
import { debug } from 'console';
import { MessageQuestionModifyComponent } from '../message-question-modify/message-question-modify.component';
import { UtilityClass } from 'src/app/compartido/Utility';

//import { RestrictionCallCenterComponent } from '../restriction-call-center/restriction-call-center.component';
//import { RestrictionComponent } from '../restriction/restriction.component';
const colors: any = {
  red: {
    primary: '#f44336',
    secondary: '#f44336',
  }
};
@Component({
  selector: 'app-init',
  templateUrl: './init.component.html',
  styleUrls: ['./init.component.css'],
  providers: [DatePipe]
})
export class InitComponent implements OnInit {
  /**
   * Declare variables for class
  */

 utility = new UtilityClass();
  public aCompanies: any[] = [];
  public aDepartments: any[] = [];
  public aWorkshops: any[] = [];
  public aAdvisers: any[] = [];
  public aServices: any[] = [];
  public aMileages: any[] = [];
  public aHours: any[] = [];
  private vAgendaId = null;
  private vChannelId = null;
  public cControlCompany: FormControl = new FormControl(null, [Validators.required]);
  public cControlDepartment: FormControl = new FormControl(null, [Validators.required]);
  public cControlWorkshop: FormControl = new FormControl(null, [Validators.required]);
  public cControlAdviser: FormControl = new FormControl(null);
  public cControlService: FormControl = new FormControl(null);
  public cPhoneControl: FormControl = new FormControl('', [Validators.required])
  public vSelectedDay: Date = null;
  public vCompanySelected: string = "";
  public vWorkshopSelected: string = "";
  public vDepartmentSelected: string = "";
  public vAdviserAppointment: any[] = [];
  public aServiceColor: any[] = [];
  public vAgendaAppointment: any = null;
  public isDelete: boolean = false;
  public isCustomerComplete: boolean = false;
  public bMandatoryKM: boolean = false;
  public oDateFirstRange = null;
  public isPlateSearch = false;
  /*
  * Declare variables to agenda
  */
  public aDocumentTypes: any[] = [];
  public cControlDocumentType: FormControl = new FormControl(null, [Validators.required]);
  public cControlDocument: FormControl = new FormControl("", [Validators.required]);
  public cControlPlate: FormControl = new FormControl("", [Validators.required]);
  public cControlCompanyAdviser: FormControl = new FormControl(null, [Validators.required]);
  public cControlServiceAgenda: FormControl = new FormControl(null, [Validators.required]);
  public cControlMileage: FormControl = new FormControl(null);
  public cControlHour: FormControl = new FormControl(null, [Validators.required]);
  public cControlDetail: FormControl = new FormControl('', [Validators.required]);
  public cControlRepresentativeDocumentType: FormControl = new FormControl(null, [Validators.required]);
  public cControlRepresentativeDocument: FormControl = new FormControl('', [Validators.required]);
  public cControlRepresentativeFirstName: FormControl = new FormControl('', [Validators.required]);
  public cControlRepresentativeLastName: FormControl = new FormControl('', [Validators.required]);
  public cControlRepresentativeTelephone: FormControl = new FormControl('', [Validators.required]);
  public IsMileageFree: boolean = false;
  public HaveRepresentative: boolean = false;
  public vCustomerModel: any = null;
  public emails = new FormControl('', [
    Validators.required,
    Validators.pattern(/^[^@]+@[^@]+\.[a-zA-Z]{2,}$/),
  ]);
  public matcher = new MyErrorStateMatcher();
  private _viewDate: Date;
  /**
   * Declare variables for Drawer
  */
  public IsDrawerOpen = false;
  public IsDrawerLoading = false;
  public vDrawerView = 'new';
  /**
   * Declare variables for Calendar
  */
  public vRefresh: Subject<any> = new Subject();
  public IsPrincipalLoading: boolean = false;
  public vView: CalendarView = CalendarView.Week;
  public vCalendarView = CalendarView;
  public vViewDate: Date = new Date();
  public vCalendarAgenda: CalendarEvent[] = [];
  public vActiveDayIsOpen: boolean = false;
  public vWeekStartsOn: any = 1;
  public vHourSegments: number = 4;
  public vDayStartHour: number = 7;
  public vDayEndHour: number = 23;
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
  /**
  * Declare variables for restriction
 */
  public verRestriccion = false;
  public idWorkshop;
  public idAdviser;
  /**
* Declare variables for customer
*/
  IsLoadCustomer = false;
  @ViewChild(MatPaginator, { static: true }) paginatorCustomer: MatPaginator;
  displayedColumns: string[] = ['duenio', 'nombres', 'tipodocumento', 'documento', 'telefono', 'email', 'acciones'];
  selection = new SelectionModel<any>(false, []);
  dataSource;
  table_length;
  position = "below";
  aClientes = [];
  public cControlPlateFinal: FormControl = new FormControl("");
  public cControlPlaca: FormControl = new FormControl('');
  panelVal: boolean = false;
  clienteSeleccionado = [];
  cControlModel: FormControl = new FormControl("");
  cControlVersion: FormControl = new FormControl("");
  cControlYear: FormControl = new FormControl("");
  cControlName: FormControl = new FormControl("");
  datosVehiculo: boolean = false;
  cControlCita: FormControl = new FormControl();
  diaDisponible = new Date();
  public formatOptions: any;
  public formatViews: any;
  public activeLang = 'es';
  diasBloqueados = [];
  modoEdicion: boolean = false;
  modoEdicionPreOT: boolean = false;
  cControPickUp: FormControl = new FormControl(false);
  preot = "";
  cControlDecisiones: FormControl = new FormControl(false);
  cControMostrarPickUp: boolean = false;
  public labelDataStart: Date = new Date();
  public labelDataend: Date = new Date();
  constructor(
    public cCustomerService: CustomerService,
    private cTranslateService: TranslateService,
    private cConfigurationService: ConfigurationService,
    private cCompanyService: CompanyService,
    private cWorkshopService: WorkshopService,
    private cAdviserService: AdviserService,
    private cSnackbarService: SnackbarService,
    private cDatePipe: DatePipe,
    public cMatDialog: MatDialog
  ) {

    this.cTranslateService.setDefaultLang('es');
  }

  ngOnInit() {
    this.formatOptions = { day: 'numeric', month: 'long', weekday: 'narrow', year: 'numeric' };
    this.formatViews = { day: true, month: true, year: true };
    this.onLoadCompanies();
    this.onLoadSwitchControls(true);
    this.oDateFirstRange = null;
  }
  myFilter = (d: Date): boolean => {
    d.setHours(0, 0, 0, 0);
    // if(this.diaDisponible<d){
    //   return true;
    // }
    var salir = true;
    this.diasBloqueados.forEach(element => {
      if (element.IsAllDay) {
        var dia = this.utility.fnStringToDate(element.StartDate)
        if (d.getTime() == dia.getTime() || this.diaDisponible > d) {
          salir = false;
        }
      }
    });
    return salir;
  }
  limpiaCorreo() {
    this.emails.setValue(this.emails.value.trim());
  }
  ngAfterViewInit() {
    //ir arriba en la pagina
    let top = document.getElementById('top');
    if (top !== null) {
      top.scrollIntoView();
      top = null;
    }
  }
  onSelecionFecha(d_fecha_selecion: Date) {
  }
  fnObtenerPrimerDiaDisponible() {
    this.IsPrincipalLoading = true;
    var asesor = null;
    let oDataSend = {
      masterUserId: this.sCurrentCompanyUser.MasterUserId,
      companyId: this.cControlCompany.value,
      workshopId: this.cControlWorkshop.value,
      companyAdviserId: null,
      serviceId: null,
      channelId: 3
    };
    this.cConfigurationService.ObtenerPrimerDiaDisponible(oDataSend).subscribe(oRes => {
      if (oRes.length > 0) {
        this.diaDisponible = this.utility.fnStringToDate(oRes[0].AvailableDate);
        // var r = [new Date(oRes[0].AvailableDate)];    
        // this.calendar.disabledDates = [{ type: DateRangeType.Before, dateRange: r }];            
      }
      this.oDateFirstRange = oRes;
      this.onGenerateEventMaxMinDate(this.utility.fnStringToDate(this.oDateFirstRange[0].EndAvailableDate));
    }, oErr => {
      this.IsPrincipalLoading = false;

    });
  }
  onGenerateEventMaxMinDate(dateMax) {
    let oFechas = this.onGetRangoFechas();
    let oFechaInicio = oFechas.StartDate;
    let oFechafinal = oFechas.EndDate;
    let vDataAgendaShowAux = [];
    while (oFechaInicio.getTime() <= oFechafinal.getTime()) {
      let oDataIndex = oFechaInicio.getTime() >= dateMax.getTime()
      if (oDataIndex) {
        let dateFechaAux = oFechaInicio;
        let Title = 'Sin programación';
        let vActionAgenda = {
          title: Title,
          color: {
            primary: "#FF0000",
            secondary: "#FF0000",
          },
          draggable: false,
          allDay: true,
          start: startOfDay(dateFechaAux),
          end: endOfDay(dateFechaAux),
          meta: {}
        };
        vDataAgendaShowAux.push(vActionAgenda);
      }
      oFechaInicio = addDays(oFechaInicio, 1);
    }
    this.vCalendarAgenda = this.vCalendarAgenda.concat(vDataAgendaShowAux);
  }
  onLoadSwitchControls(sTrin: boolean) {
    if (sTrin) {
      this.cControlCompanyAdviser.disable();
      this.cControlServiceAgenda.disable();
      this.cControlMileage.disable();
      this.cControlHour.disable();
      this.cControlDetail.disable();
      this.cControlRepresentativeDocumentType.disable();
      this.cControlRepresentativeDocument.disable();
      this.cControlRepresentativeFirstName.disable();
      this.cControlRepresentativeLastName.disable();
      this.cControlRepresentativeTelephone.disable();
    } else {
      this.cControlCompanyAdviser.enable();
      this.cControlServiceAgenda.enable();
      this.cControlMileage.enable();
      this.cControlHour.enable();
      this.cControlDetail.enable();
      this.cControlRepresentativeDocumentType.enable();
      this.cControlRepresentativeDocument.enable();
      this.cControlRepresentativeFirstName.enable();
      this.cControlRepresentativeLastName.enable();
      this.cControlRepresentativeTelephone.enable();
    }

  }
  /**
   * Función que lista las companias
   */
  onLoadCompanies() {

    this.IsPrincipalLoading = true;
    let oDataSendCompany = {
      masterUserId: this.sCurrentCompanyUser.MasterUserId,
      companyId: null,
      isActived: null
    }
    this.cCompanyService.MasterCompanyGet(oDataSendCompany).subscribe((aCompaniesResponse) => {
      var companies = JSON.parse(localStorage.getItem("CompanyUser")).OrganizationUsersByCompany;
      var aCompañias = [];
      companies.forEach(element => {
        aCompaniesResponse.forEach(c => {
          if (element.CompanyId.toUpperCase() == c.CompanyId.toUpperCase()) {
            aCompañias.push(c);
          }
        });
      });
      this.aCompanies = aCompañias;
      this.aDepartments = [];
      this.aWorkshops = [];
      this.aAdvisers = [];
      this.aServices = [];
    }, (oError) => {
      this.IsPrincipalLoading = false;

    }, () => {
      this.IsPrincipalLoading = false;
      this.onLoadAgendaLocked(3);
    });
  }
  /**
   * Función que setea el nombre de la compania selecionada
   * @param event Datos de evento
   */
  onSelectedCompany(event) {
    let target = event.source.selected._element.nativeElement;
    this.vCompanySelected = target.innerText.trim();
    localStorage.setItem("CompanyId", this.cControlCompany.value);
    this.aServiceColor = [];
    this.vAdviserAppointment = [];
    this.oDateFirstRange = null;
    this.aCompanies.forEach(c => {
      if (event.value.toUpperCase() == c.CompanyId.toUpperCase()) {
        this.cControMostrarPickUp = c.PickUpAndDelivery;
      }
    });
    //this.onLoadServices();
  }
  /**
   * Función que setea el nombre del departamento
   * @param event Datos de evento
   */
  onSelectedDepartment(event) {
    let target = event.source.selected._element.nativeElement;
    this.vDepartmentSelected = target.innerText.trim();

    this.aServiceColor = [];
    this.vAdviserAppointment = [];
    this.oDateFirstRange = null;
  }
  /**
   * Función que setea el nombre del taller selecionado
   * @param event Datos de evento
   */
  onSelectedWorkshop(event) {
    this.verRestriccion = true;
    this.idWorkshop = event.value;
    let target = event.source.selected._element.nativeElement;
    this.vWorkshopSelected = target.innerText.trim();
    let oWorkshopAux = this.aWorkshops.find(oEle => oEle.WorkshopId.toLowerCase() == this.cControlWorkshop.value.toLowerCase());
    this.onSetHoourInitalCalendarWeek(oWorkshopAux);
    this.fnObtenerPrimerDiaDisponible();
  }

  onSetHoourInitalCalendarWeek(cWorkshopService) {

    let oStarHour = this.utility.fnStringToDate("2020-01-01T" + cWorkshopService.MasterSchedule[0].StartTime);
    let oEndHour = this.utility.fnStringToDate("2020-01-01T" + cWorkshopService.MasterSchedule[0].EndTime);
    cWorkshopService.MasterSchedule.forEach(element => {
      let DataStart = this.utility.fnStringToDate("2020-01-01T" + element.StartTime);
      if (oStarHour.getTime() > DataStart.getTime()) {
        oStarHour = DataStart;
      }
      let DataEnd = this.utility.fnStringToDate("2020-01-01T" + element.EndTime);
      if (oEndHour.getTime() < DataEnd.getTime()) {
        oEndHour = DataEnd;
      }
    });
    this.vDayStartHour = oStarHour.getHours();
    this.vDayEndHour = oEndHour.getHours();
  }
  /**
   * Función que lista los departamentos de talleres activos
   * Se ejecuta cuando se seleciona una compania
   */
  onLoadGeolocation(oDate?) {
    this.IsPrincipalLoading = true;
    let oDataSendGeolocation = {
      externalCode: 'X',
      masterUserId: this.sCurrentCompanyUser.MasterUserId,
      companyId: this.cControlCompany.value,
      flagGlobal: null
    };
    this.cConfigurationService.onGeolocationGet(oDataSendGeolocation).subscribe((aDepartmentsResponse) => {
      this.aDepartments = aDepartmentsResponse;
      this.cControlDepartment.setValue(null);
      this.cControlWorkshop.setValue(null);
      this.cControlAdviser.setValue(null);
      this.cControlService.setValue(null);
      this.aWorkshops = [];
      this.aAdvisers = [];
      this.aServices = [];

      this.aServiceColor = [];
      this.vAdviserAppointment = [];
      if (oDate != null) {
        this.cControlDepartment.setValue(oDate.GeoLocationId);
        this.onLoadWorkshop(oDate);
      }
    }, (oError) => {
      this.IsPrincipalLoading = false;

    }, () => {
      this.IsPrincipalLoading = false;
      if (oDate == null) {
        this.onLoadAgendaLocked(2);
      }

    });
  }
  /**
   * Función que lista los talleres activos en base a una compania y una region
   */
  onLoadWorkshop(oDate?) {
    this.IsPrincipalLoading = true;
    let oDataSendWorkshop = {
      masterUserId: this.sCurrentCompanyUser.MasterUserId,
      companyId: this.cControlCompany.value,
      workshopId: null,
      isActived: '1',
      geoLocationId: this.cControlDepartment.value
    }
    this.cWorkshopService.MasterWorkshopGet(oDataSendWorkshop).subscribe((aWorkshopsReponse) => {
      this.aWorkshops = aWorkshopsReponse;
      this.cControlWorkshop.setValue(null);
      this.cControlAdviser.setValue(null);
      this.cControlService.setValue(null);
      this.aAdvisers = [];
      this.aServices = [];
      if (oDate != null) {
        this.cControlWorkshop.setValue(oDate.WorkshopId);
        this.onLoadAdviser(oDate);
      }
    }, (oErr) => {
      this.IsPrincipalLoading = false;

    }, () => {
      this.IsPrincipalLoading = false;
      if (oDate == null) {
        this.onLoadAgendaLocked(2);
      }
    });
  }
  /**
   * Función que lista los asesores activos en base a la compania y taller
   */
  onLoadAdviser(oDate?) {
    this.IsPrincipalLoading = true;
    let oDataSendAviser = {
      masterUserId: this.sCurrentCompanyUser.MasterUserId,
      companyId: this.cControlCompany.value,
      workshopId: this.cControlWorkshop.value,
      companyAdviserId: null,
      isActived: '1'
    }
    this.cAdviserService.ObtenerAsesores(oDataSendAviser).subscribe((aAdvisersResponse) => {
      this.aAdvisers = aAdvisersResponse;
      this.cControlAdviser.setValue(null);
      this.cControlService.setValue(null);
      this.aServices = [];
      if (oDate != null) {
        this.cControlCompanyAdviser.setValue(oDate.CompanyAdviserId);
        this.envClickAgenda(oDate);
      }
    }, (oErrpr) => {
      this.IsPrincipalLoading = false;

    }, () => {
      this.IsPrincipalLoading = false;
      if (oDate == null) {
        this.onLoadAgendaLocked(3);
      }
    })
  }
  /**
 * Function que lista los servicios 
 */
  onLoadService(CompanyAdviserId) {
    this.idAdviser = CompanyAdviserId;
    this.onLoadAgendaLocked(4);

    this.cControlService.setValue(null);
    this.cControlMileage.setValue(null);
    if (this.vAgendaAppointment) {
      this.cControlServiceAgenda.setValue(this.vAgendaAppointment.ServiceId);
    }
    let oDataSend = {
      masterUserId: this.sCurrentCompanyUser.MasterUserId,
      companyId: this.cControlCompany.value
    };
    this.cCompanyService.BrandsByCompanyGet(oDataSend).subscribe((oData) => {
      var serviceAux = [];
      oData.forEach(element => {
        if (element.IsActived == "1") {
          serviceAux.push(element);
        }
      });
      this.aServices = serviceAux;
      this.onLoadMileage();
    }, (oErr) => {

    }, () => {

    });
  }
  /**
   * Function que lista los servicios de un asesor en base a su codigo de asesor
   * @param CompanyAdviserId 
   */
  // onLoadService(CompanyAdviserId) {
  //   this.idAdviser = CompanyAdviserId;
  //   this.onLoadAgendaLocked(4);
  //   this.cControlService.setValue(null);
  //   this.cControlMileage.setValue(null);
  //   let oAdviser = this.aAdvisers.find(oEle => oEle.CompanyAdviserId.toLowerCase() === CompanyAdviserId.toLowerCase());
  //   if (oAdviser) {
  //     this.aServices = oAdviser.ServicesByCompanyAdviser;
  //   }
  //   if (this.vAgendaAppointment) {
  //     this.cControlServiceAgenda.setValue(this.vAgendaAppointment.ServiceId.toString());
  //   }
  // }
  /**
   * Funcion que lista los kilometrajes para un servicio
   */
  onLoadMileage() {
    if (this.cControlServiceAgenda.value == null) {
      return;
    }
    this.onLoadHour();
    let oServiceSelected = this.aServices.find(oEle => String(oEle.ServiceId) === String(this.cControlServiceAgenda.value))
    this.bMandatoryKM = (oServiceSelected.MandatoryKM === "1") ? true : false;
    this.bMandatoryKM = oServiceSelected.MandatoryKM;
    this.IsDrawerLoading = true;
    let oDataSendMileage = {
      companyId: this.cControlCompany.value,
      masterUserId: this.sCurrentCompanyUser.MasterUserId,
      serviceId: this.cControlServiceAgenda.value,
      mileageId: null,
    }

    this.cCompanyService.MileagesByCompanyGet(oDataSendMileage).subscribe((aMileageResponse) => {
      this.aMileages = aMileageResponse;
      this.cControlMileage = new FormControl(null, [Validators.required]);
      if (this.aMileages.length > 0) {
        this.IsMileageFree = false;
      } else {
        this.IsMileageFree = true;
      }
      if (!this.bMandatoryKM) {
        this.cControlMileage = new FormControl(null);
      }
    }, (oErr) => {
      this.IsDrawerLoading = false;
    }, () => {
      this.IsDrawerLoading = false;
      if (this.vAgendaAppointment) {
        this.cControlMileage.setValue(this.vAgendaAppointment.MileageValue.toString());

      }
    });
  }
  /**
   * funcion que lista los rangos horarios validos para los agendamientos
   * 
   */

  onLoadHour() {
    this.IsDrawerLoading = true;
    let oDataSendHour = {
      masterUserId: this.sCurrentCompanyUser.MasterUserId,
      companyId: this.cControlCompany.value,
      workshopId: this.cControlWorkshop.value,
      companyAdviserId: this.cControlCompanyAdviser.value,
      serviceId: this.cControlServiceAgenda.value,
      filterDate: this.cDatePipe.transform(this.vSelectedDay, 'yyyy-MM-dd'),
      channelId: 3
    };
    this.cConfigurationService.ObtenerHorario(oDataSendHour).subscribe(aHourReponse => {

      aHourReponse.forEach(element => {

        element.Hour = this.utility.fnStringToDate('2020-01-01T' + element.ToHour)

      });
      this.aHours = aHourReponse;
    }, oErr => {
      this.IsDrawerLoading = false;
    }, () => {
      this.IsDrawerLoading = false;
      if (this.vAgendaAppointment) {
        var fecha = this.utility.fnStringToDate(this.vAgendaAppointment.StartDate);
        fecha.setHours(0, 0, 0, 0)
        if (fecha.getTime() == this.vSelectedDay.getTime()) {
          this.aHours.unshift({
            ToHour: this.vAgendaAppointment.StartDate.split("T")[1],
            Hour: this.utility.fnStringToDate(this.vAgendaAppointment.StartDate)
          })
          this.cControlHour.setValue(this.vAgendaAppointment.StartDate.split("T")[1]);
        }
      }
    });
  }
  /**
   * Funcion que lista las citas agendadas.
   */
  onLoadAgendaAppointment() {
    this.IsPrincipalLoading = true;
    let oRangoFechas = this.onGetRangoFechas();
    let vStartDateAux = this.cDatePipe.transform(oRangoFechas.StartDate, 'yyyy-MM-dd');
    let vEndDateAux = this.cDatePipe.transform(oRangoFechas.EndDate, 'yyyy-MM-dd');
    let oDataSendAppointment = {
      agendaId: null,
      masterUserId: this.sCurrentCompanyUser.MasterUserId,
      startDate: vStartDateAux,
      endDate: vEndDateAux,
      companies: this.cControlCompany.value,
      workshops: this.cControlWorkshop.value ? this.cControlWorkshop.value : '',
      channels: '',
      services: this.cControlService.value ? this.cControlService.value : '',
      advisers: this.cControlAdviser.value ? this.cControlAdviser.value : '',
      customerId: '',
      statusId: '1,2,3,5',
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
      this.OnBuildHorarioTaller();

    })
  }
  OnBuildHorarioTaller() {
    let oDiasCode = [1, 2, 3, 4, 5, 6, 7];
    let oDiasAuxLocked = [];
    let oWorkshop = this.aWorkshops.find(oEle => oEle.WorkshopId.toLowerCase() === this.cControlWorkshop.value.toLowerCase());
    if (oWorkshop) {
      oDiasCode.forEach(element => {
        let index = oWorkshop.MasterSchedule.findIndex(oEle => element.toString() === oEle.WeekDay.toString());
        if (index == -1) {
          oDiasAuxLocked.push((parseInt(element.toString()) - 1));
        }
      });
      this.onGenerateEventLocked(oDiasAuxLocked);
    }
  }
  onGenerateEventLocked(element) {
    let oFechas = this.onGetRangoFechas();
    let oFechaInicio = oFechas.StartDate;
    let oFechafinal = oFechas.EndDate;
    let vDataAgendaShowAux = [];
    while (oFechaInicio.getTime() <= oFechafinal.getTime()) {
      let oDataIndex = element.findIndex(oEle => oEle.toString() === oFechaInicio.getDay().toString());
      if (oDataIndex != -1) {
        let dateFechaAux = oFechaInicio;
        let Title = 'Taller cerrado';
        let vActionAgenda = {
          title: Title,
          color: {
            primary: "#FF0000",
            secondary: "#FF0000",
          },
          draggable: false,
          allDay: true,
          start: startOfDay(dateFechaAux),
          end: endOfDay(dateFechaAux),
          meta: {}
        };
        vDataAgendaShowAux.push(vActionAgenda);
      }
      oFechaInicio = addDays(oFechaInicio, 1);
    }
    this.vCalendarAgenda = this.vCalendarAgenda.concat(vDataAgendaShowAux);
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
  onValidateAgendaAppointment() {
    let flat = true;
    if (!this.vCustomerModel) {
      flat = false;
    }
    if (!this.cControlCompanyAdviser.valid) {
      this.cControlCompanyAdviser.markAsTouched();
      flat = false;
    }
    if (!this.cControlServiceAgenda.valid) {
      this.cControlServiceAgenda.markAsTouched();
      flat = false;
    }
    if (!this.emails.valid) {
      this.emails.markAsTouched();
      flat = false;
    }
    // if(!this.cPhoneControl.valid){
    //   this.cPhoneControl.markAsTouched();
    //   flat = false; 
    // }
    //aqui se valida el kilometraje

    if (this.bMandatoryKM) {
      if (!this.cControlMileage.valid) {
        this.cControlMileage.markAsTouched();
        flat = false;
      }
    }

    if (!this.cControlHour.valid) {
      this.cControlHour.markAsTouched();
      flat = false;
    }
    if (this.HaveRepresentative && !this.cControlRepresentativeDocumentType.valid) {
      this.cControlRepresentativeDocumentType.markAsTouched();
      flat = false;
    }
    if (this.HaveRepresentative && !this.cControlRepresentativeDocument.valid) {
      this.cControlRepresentativeDocument.markAsTouched();
      flat = false;
    }
    if (this.HaveRepresentative && !this.cControlRepresentativeFirstName.valid) {
      this.cControlRepresentativeFirstName.markAsTouched();
      flat = false;
    }
    if (this.HaveRepresentative && !this.cControlRepresentativeLastName.valid) {
      this.cControlRepresentativeLastName.markAsTouched();
      flat = false;
    }
    if (this.HaveRepresentative && !this.cControlRepresentativeTelephone.valid) {
      this.cControlRepresentativeTelephone.markAsTouched();
      flat = false;
    }
    return flat;
  }
  /**
   * Funcion que ingresa o modifica citas
   */
  onModifyAgendaAppointment() {
    if (!this.onValidateAgendaAppointment()) {
      this.cSnackbarService.openSnackBar("Ingrese todos los datos obligatorios", '', 'Error');
      return;
    }
    this.IsDrawerLoading = true;
    let vMileagePackage: string = ''; let oMileage;
    if (this.cControlMileage.value) {
      oMileage = this.aMileages.find(oEle => oEle.Value.toString() === this.cControlMileage.value.toString());
    }
    if (oMileage) {
      vMileagePackage = oMileage.ExternalId;
    }
    let status = 1;
    if (this.isDelete) {
      status = 4;
    }
    let oDataSendAppointment = {
      agendaId: this.vAgendaId,
      eventType: 100,
      startDate: this.cDatePipe.transform(this.vSelectedDay, 'yyyy-MM-dd') + 'T' + this.cControlHour.value,
      name: '',
      detail: this.cControlDetail.value,
      credentialId: this.sCurrentCompanyUser.OrganizationUserId,
      masterUserId: this.sCurrentCompanyUser.MasterUserId,
      companyId: this.cControlCompany.value,
      workshopId: this.cControlWorkshop.value,
      channelId: this.vDrawerView == 'new' ? 3 : this.vAgendaAppointment.ChannelId,
      serviceId: this.cControlServiceAgenda.value,
      companyAdviserId: this.cControlCompanyAdviser.value,
      vehicleId: null,
      mileageValue: (this.cControlMileage.value === null) ? "" : this.cControlMileage.value,
      mileagePackage: vMileagePackage,
      customerId: this.vCustomerModel.CustomerId,
      statusId: status,
      representativeId: null,
      identicationTypeId: this.cControlRepresentativeDocumentType.value,
      representativeFirstName: this.cControlRepresentativeFirstName.value,
      representativeLastName: this.cControlRepresentativeLastName.value,
      identicationDocument: this.cControlRepresentativeDocument.value,
      representativeTelephone: this.cControlRepresentativeTelephone.value,
      isRepresentativeControl: this.cControlDecisiones.value,
      plate: this.cControlPlate.value,
      IsPickUpAndDelivery: this.vDrawerView == 'new' ? this.cControPickUp.value : this.vAgendaAppointment.IsPickUpAndDelivery
    };
    this.cConfigurationService.AgendaAppointmentModify(oDataSendAppointment).subscribe((aAgendaAppointmentResponse) => {
      if (aAgendaAppointmentResponse.codeResponse) {
        if (this.vDrawerView == 'new') {
          let sMessage = '';
          let sTrans = "ContentInitModifyRequerideAgendaInsert";
          this.cTranslateService.get(sTrans).subscribe((text: string) => {
            sMessage = text;
          });
          this.cSnackbarService.openSnackBar(sMessage, '', 'Success');

        } else {
          let sMessage = '';
          let sTrans = "ContentInitModifyRequerideAgendaModify";
          this.cTranslateService.get(sTrans).subscribe((text: string) => {
            sMessage = text;
          });
          this.cSnackbarService.openSnackBar(sMessage, '', 'Success');

        } 
        this.onLimpiar();
        this.envCloseDrawer(); 
      } else {
        let sMessage = '';
        let sTrans = aAgendaAppointmentResponse.dataResponse;
        this.cTranslateService.get(sTrans).subscribe((text: string) => {
          sMessage = text;
        });
        this.cSnackbarService.openSnackBar(sMessage, '', 'Error');
      }
    }, (oErr) => {
      this.IsDrawerLoading = false;
    }, () => {
      this.IsDrawerLoading = false;
    })
  }
  onModificarCliente(odata) {
    let oDataSend = {
      CustomerId: odata.CustomerId,
      FirstName: odata.FirstName,
      LastName: odata.LastName,
      IdenticationTypeId: odata.IdenticationTypeId,
      IdenticationDocument: odata.IdenticationDocument.trim(),
      Phone: this.cPhoneControl.value,
      Address: odata.Address,
      Email: this.emails.value,
      GeolocationId: odata.GeolocationId,
      ChannelId: 3, //CallCenter
      Status: 5,
      CompanyId: this.cControlCompany.value,
      MasterUserId: this.sCurrentCompanyUser.MasterUserId,
    }
    this.cCustomerService.ModificarClientes(oDataSend).subscribe(
      oRes => {
        let sMessage = '';
        if (oRes.codeResponse) {
        } else {
          let sTrans = "UserCreateError";
          this.cTranslateService.get(sTrans).subscribe((text: string) => {
            sMessage = text;
          });
          this.cSnackbarService.openSnackBar(sMessage, '', 'Error');
        }
      }
    )
  }
  onEnvioCorreo() {

    var nombreRepre = "";
    var documentoRepre = "";
    var telefonoRepre = "";
    if (this.HaveRepresentative) {
      nombreRepre = this.cControlRepresentativeFirstName.value + " " + this.cControlRepresentativeLastName.value;
      documentoRepre = this.cControlRepresentativeDocument.value;
      telefonoRepre = this.cControlRepresentativeTelephone.value;
    }
    var direccionW = "";
    var nombreAsesor = "";
    var nombreServicio = "";
    var telefono = "";
    this.aWorkshops.forEach(element => {
      if (element.WorkshopId == this.cControlWorkshop.value) {
        direccionW = element.Address;
      }
    });
    this.aAdvisers.forEach(element => {
      if (element.CompanyAdviserId == this.cControlCompanyAdviser.value) {
        nombreAsesor = element.FirstName.trim() + element.LastName.trim();
      }
    });
    this.aServices.forEach(element => {
      if (element.ServiceId == this.cControlServiceAgenda.value) {
        nombreServicio = element.FriendlyName;
      }
    });
    this.aCompanies.forEach(element => {
      if (element.CompanyId == this.cControlCompany.value) {
        telefono = element.Phone;
      }
    });
    var ahoras = this.cControlHour.value.split(":");
    var fechaHora = this.vSelectedDay
    fechaHora.setHours(Number(ahoras[0]), Number(ahoras[1]), Number(ahoras[2]));
    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    var odata = {
      Plate: this.cControlPlate.value,
      Region: this.vDepartmentSelected,
      Taller: this.vWorkshopSelected,
      Direccion: direccionW,
      Asesor: nombreAsesor,
      Servicio: nombreServicio,
      Kilometraje: (this.cControlMileage.value) ? this.cControlMileage.value.toString() : "",
      Dia: this.vSelectedDay.toLocaleDateString(undefined, options),
      Hora: fechaHora.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }),
      isRepresentate: this.HaveRepresentative == null ? false : this.HaveRepresentative,
      NombreRepre: this.cControlRepresentativeTelephone.value == null ? '' : this.cControlRepresentativeTelephone.value,
      DocumentoRepre: this.cControlRepresentativeDocument.value == null ? '' : this.cControlRepresentativeDocument.value,
      TelefonoRepre: this.cControlRepresentativeTelephone.value == null ? '' : this.cControlRepresentativeTelephone.value,
      isTomaraDecisiones: this.HaveRepresentative == null ? '' : this.HaveRepresentative,
      telefono: telefono,//localStorage.getItem("telefono"),
      Email: this.emails.value,
      Nombre: this.onPascalCaseString(this.vCustomerModel.FirstName + " " + this.vCustomerModel.LastName),
      CustomerId: this.vCustomerModel.CustomerId,
    }
    this.cConfigurationService.enviarCorreo(odata).subscribe(oRespuesta => {
      if (oRespuesta.codeResponse) {
        this.envCloseDrawer();
      } else {
        var data = {
          tipo: "Error",
          mensajeCorto: "Hubo un error al enviar el correo para el agendamiento",
          mensajeLargo: oRespuesta.TraceMessage
        }
        this.onMostrarMensaje(data);
      }

    }, oErr => {
    })
  }
  closeOpenMonthViewDay() {
    this.vActiveDayIsOpen = false;
    if(!this.IsPrincipalLoading){
      this._viewDate = new Date(this.vViewDate);
      this.onLoadAgendaLocked(1)
      this.vViewDate = this._viewDate; 
    }else{
      this.vViewDate = this._viewDate;
    }
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
   * Función que obtiene los bloqueos de agenda desde una fecha a otra.
   * Para las vistas por mes, semana, dia y lista.
   * @param StartDate 
   * @param EndDate 
   */
  onLoadAgendaLocked(EventType: number): void {
    this.vCalendarAgenda = [];
    this.vSourceAgenda = new MatTableDataSource<any[]>([]);
    EventType = 1;
    if (this.cControlCompany.value !== null) {
      EventType = 2;
    }
    if (this.cControlWorkshop.value !== null) {
      EventType = 3;
    }
    if (this.cControlAdviser.value !== null) {
      EventType = 4;
    }
    this.IsPrincipalLoading = true;
    let OnlyHeader = true;
    let oRangoFechas = this.onGetRangoFechas();

    let vStartDateAux = this.cDatePipe.transform(oRangoFechas.StartDate, 'yyyy-MM-dd');
    let vEndDateAux = this.cDatePipe.transform(oRangoFechas.EndDate, 'yyyy-MM-dd');
    this.labelDataStart = oRangoFechas.StartDate;
    this.labelDataend = oRangoFechas.EndDate;
    let oParametersAgendaGet = {
      agendaId: null,
      masterUserId: this.sCurrentCompanyUser.MasterUserId,
      startDate: vStartDateAux,
      endDate: vEndDateAux,
      onlyHeader: OnlyHeader,
      companyId: this.cControlCompany.value,
      workshopId: this.cControlWorkshop.value,
      channelId: 3,
      serviceId: this.cControlService.value,
      companyAdviserId: this.cControlAdviser.value,
      eventType: EventType
    };
    this.cConfigurationService.AgendaGet(oParametersAgendaGet).subscribe((aResponseAgendaGet) => {

      aResponseAgendaGet.forEach(oAgenda => {
        this.vCalendarAgenda.push({
          title: oAgenda.Name,
          color: colors.red,
          draggable: false,
          allDay: oAgenda.IsAllDay,
          start: this.utility.fnStringToDate(oAgenda.StartDate),
          end: this.utility.fnStringToDate(oAgenda.EndDate),
          meta: oAgenda
        });
      });
      this.vSourceAgenda = new MatTableDataSource<any[]>(aResponseAgendaGet);
      this.vSourceAgenda.paginator = this.paginator;

    }, (Err) => {
      this.IsPrincipalLoading = false;
    }, () => {

      this.IsPrincipalLoading = false;
      if (this.cControlWorkshop.value) {
        this.onLoadAgendaAppointment();
        if (this.oDateFirstRange == null) {
          this.fnObtenerPrimerDiaDisponible();
        } else {
          this.onGenerateEventMaxMinDate(new Date(this.oDateFirstRange[0].EndAvailableDate));
        }
      }

    })
  }
  /**
   * Función que carga los tipos de documentos
   */
  onLoadDocumentType() {

    this.IsDrawerLoading = true;
    this.cConfigurationService.obtenerDocumentos().subscribe((aDocumentTypesResponse) => {
      this.aDocumentTypes = aDocumentTypesResponse;
    }, (oError) => {

      this.IsDrawerLoading = false;
    }, () => {

      this.IsDrawerLoading = false;
    })
  }
  onValidateSearchCustomer() {
    let flat = true;
    if (!this.cControlDocumentType.valid) {
      this.cControlDocumentType.markAsTouched();
      flat = false;
    }
    if (!this.cControlDocument.valid) {
      this.cControlDocument.markAsTouched();
      flat = false;
    }
    if (!this.cControlPlate.valid) {
      this.cControlPlate.markAsTouched();
      flat = false;
    }
    return flat;
  }
  /**
   * Función que busca los clientes por tipo de documento, numero de documento y placa
   */
  onSearchCustomer(oEvento) {
    this.IsDrawerLoading = true;
    let oDataSendcustomer = {
      Plate: this.cControlPlaca.value.trim(),
      DocumentId: this.clienteSeleccionado[0].IdenticationDocument.trim(),
      TypeDocId: this.clienteSeleccionado[0].IdenticationTypeId,
      Host: '0.0.0.0',
      AppId: localStorage.getItem("AppId"),
      CompanyId: this.cControlCompany.value,
      RequestType: 1
    }
    this.cConfigurationService.obtenerSesionPlaca(oDataSendcustomer).subscribe(oCustomerResponse => {
      let tipo = 1;
      var type = oCustomerResponse.CodeResponse ? "Success" : "Error";
      var data = {
        tipo: type,
        mensajeCorto: oCustomerResponse.RetMessage,
        mensajeLargo: oCustomerResponse.TraceMessage
      }
      switch (oCustomerResponse.idType) {
        case 0:
          //OK

          this.vCustomerModel = this.clienteSeleccionado[0];
          this.emails.setValue(this.vCustomerModel.Email);
          this.cPhoneControl.setValue(this.vCustomerModel.Phone);
          this.onLoadSwitchControls(false);
          this.cControlDocumentType.setValue(this.clienteSeleccionado[0].IdenticationTypeId);
          this.cControlDocument.setValue(this.clienteSeleccionado[0].IdenticationDocument.trim());
          this.cControlPlate.setValue(this.cControlPlaca.value);
          this.cControlDocumentType.setValue(this.clienteSeleccionado[0].IdenticationTypeId);
          this.cControlDocumentType.disable();
          this.cControlDocument.disable();
          this.cControlPlate.disable();
          this.vSelectedDay = oEvento;
          this.onLoadDocumentType();
          this.envOpenDrawer();
          if (this.cControlAdviser.value != null) {
            this.cControlCompanyAdviser.setValue(this.cControlAdviser.value);
            this.cControlServiceAgenda.setValue(this.cControlService.value);
            this.onLoadMileage();
          }
          break;
        case 3:
          var objMsg = { "placa": this.cControlPlate.value, "message": oCustomerResponse.RetMessage };
          if (tipo == 1) {
            this.fnShowDialogClienteAlternoMd(objMsg);
          } else {
            this.onMostrarMensaje(data);
          }
          this.envCloseDrawer();
          break;
        case 4:
          var objMsg = { "placa": this.cControlPlate.value, "message": oCustomerResponse.RetMessage };
          //usuario existe, pero no está asociado al vehículo
          if (tipo == 1) {
            this.fnShowDialogClienteAlternoMd(objMsg);
          } else {
            let sMessage = '';
            let sTrans = "home.no.matches.found";
            this.cTranslateService.get(sTrans).subscribe((text: string) => {
              sMessage = text;
            });
            let sMessageError = '';
            let sTransError = "home.no.matches.error";
            this.cTranslateService.get(sTransError).subscribe((text: string) => {
              sMessageError = text;
            });
            data = {
              tipo: sMessageError,
              mensajeCorto: sMessage,
              mensajeLargo: ''
            }
            this.onMostrarMensaje(data);
            this.envCloseDrawer();
          }
          break;
        default:
          let sMessage = '';
          let sTrans = "porfavor";
          this.cTranslateService.get(sTrans).subscribe((text: string) => {
            sMessage = text;
          });
          data.mensajeCorto = data.mensajeCorto.replace("Por favor, si se trata de un error, comunícate con nuestro Call Center.", "");
          this.onMostrarMensaje(data);
          this.envCloseDrawer();
          break;
      }
    }, oError => {
      this.IsDrawerLoading = false;
    }, () => {
      this.IsDrawerLoading = false;
    });
  }
  fnShowDialogClienteAlternoMd(element) {
    const dialogRef = this.cMatDialog.open(MessageFlujoAlternoComponent, {
      panelClass: 'popUp',
      data: element
    });
    dialogRef.afterClosed().subscribe(res => {

    });
  }
  fnShowDialogClienteAlterno(element) {
    const dialogRef = this.cMatDialog.open(MessageQuestionModifyComponent, {
      panelClass: 'popUp',
      data: element
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res == "onCancelarAppointment") {
        this.onCancelarAppointment();
      } else if (res == "onModifyAgendaAppointment") {
        this.onModifyAgendaAppointment();
      }
    });
  }
  onMostrarMensaje(element) {
    const dialogRef = this.cMatDialog.open(MessageAlertComponent, {
      panelClass: 'popUp',
      data: element
    });
    dialogRef.afterClosed().subscribe(res => {

    });
  }
  /**
   * Función que seleciona si tiene o no datos de representate
   * @param HaveRepresentativeAux valor selecion
   */
  onSelectRepresentative(HaveRepresentativeAux: boolean) {
    this.HaveRepresentative = HaveRepresentativeAux;
  }
  /**
   * Función que se ejecuta cuando se cambia la vista para Mes, Semana, Día y Listado   
   * @param pCalendarView  tipo de calendario
   */
  envChangeView(pView: CalendarView) {
    this.vView = pView;
    if (pView) {
      this.onLoadAgendaLocked(3);
    }
  }
  envDayHeadClick(evento) {

    let flat = true;
    if (evento.day.isPast) {
      let sMessage = '';
      let sTrans = "CallcenterSelectFutureDay";
      this.cTranslateService.get(sTrans).subscribe((text: string) => {
        sMessage = text;
      });
      this.cSnackbarService.openSnackBar(sMessage, '', 'Error');
      flat = false;
      return false;
    }
    if (!this.cControlCompany.valid) {
      this.cControlCompany.markAsTouched();
      let sMessage = '';
      let sTrans = "IngreseCompañía";
      this.cTranslateService.get(sTrans).subscribe((text: string) => {
        sMessage = text;
      });
      this.cSnackbarService.openSnackBar(sMessage, '', 'Error');
      flat = false;
      return false;
    }
    if (!this.cControlDepartment.valid) {
      this.cControlDepartment.markAsTouched();
      let sMessage = '';
      let sTrans = "IngreseRegion";
      this.cTranslateService.get(sTrans).subscribe((text: string) => {
        sMessage = text;
      });
      this.cSnackbarService.openSnackBar(sMessage, '', 'Error');
      flat = false;
      return false;
    }
    if (!this.cControlWorkshop.valid) {
      this.cControlWorkshop.markAsTouched();
      let sMessage = '';
      let sTrans = "IngreseTaller";
      this.cTranslateService.get(sTrans).subscribe((text: string) => {
        sMessage = text;
      });
      this.cSnackbarService.openSnackBar(sMessage, '', 'Error');
      flat = false;
      return false;
    }
    if (this.vCalendarAgenda.find(oEle => oEle.start.getTime() === evento.day.date.getTime() && oEle.allDay === true)) {
      let sMessage = '';
      let sTrans = "CallcenterSelectLockedDay";
      this.cTranslateService.get(sTrans).subscribe((text: string) => {
        sMessage = text;
      });
      this.cSnackbarService.openSnackBar(sMessage, '', 'Error');
      flat = false;
    }
    if (this.cControlWorkshop.value) {
      let oDataWorkshop = this.aWorkshops.find(oEle => oEle.WorkshopId.toLowerCase() === this.cControlWorkshop.value.toLowerCase());
      if (oDataWorkshop) {
        let oDatas = oDataWorkshop.ChannelsByWorkshop.find(oEle => oEle.ChannelId.toString() === '3');
        if (!oDatas) {
          let sMessage = '';
          let sTrans = "CallcenterSelectLockedChannel";
          this.cTranslateService.get(sTrans).subscribe((text: string) => {
            sMessage = text;
          });
          this.cSnackbarService.openSnackBar(sMessage, '', 'Error');
          flat = false;
        }
      }
    }
    if (this.clienteSeleccionado.length == 0) {
      let sMessage = '';
      let sTrans = "seleccionesCliente";
      this.cTranslateService.get(sTrans).subscribe((text: string) => {
        sMessage = text;
      });
      var data = {
        tipo: "Error",
        mensajeCorto: sMessage,
        mensajeLargo: ''
      }
      this.onMostrarMensaje(data);
      flat = false;
    }

    if (flat) {
      this.modoEdicion = false;
      this.modoEdicionPreOT = false;
      this.cControPickUp.enable();
      this.cControPickUp.setValue(false);
      this.cControlDecisiones.setValue(false);
      this.preot = "";
      this.onSearchCustomer(evento.day.date);

    }
  }
  /**
   * Función que se ejecuta cuando se da click en un dia del calendario
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
    }
  }
  envOpenDrawer() {
    this.IsDrawerOpen = true;
    this.fnObtenerPrimerDiaDisponible();
  }
  envCloseDrawer() {
    this.IsDrawerOpen = false;
    this.onResetDrawer();

  }
  onPascalCaseString(sPalabras: string): string {
    let aux = '';
    sPalabras.split(" ").forEach(element => {
      element = element.toLowerCase();
      aux += " " + element.charAt(0).toUpperCase() + '' + element.substring(1);
    });
    return aux;
  }
  // onCancelarAppointment() {
  //   this.isDelete = true;
  //   //this.onModifyAgendaAppointment();

  // }
  onmodifyReserva(type) {
    var message = "";
    let sTrans = "";
    if (type == "new") {
      sTrans = "estasegurocrearCita";
    } else {
      sTrans = "estaseguroactualizarCita";
    }
    this.cTranslateService.get(sTrans).subscribe((text: string) => {
      message = text;
    });
    var objMsg = { "placa": this.cControlPlate.value, "message": message, tipo: "Modify" };
    this.fnShowDialogClienteAlterno(objMsg);
  }
  onCancelReserva() {
    var objMsg = { "placa": this.cControlPlate.value, "message": "¿Esta seguro que desea cancelar esta reserva?", tipo: "Cancel" };
    this.fnShowDialogClienteAlterno(objMsg);
  }
  onCancelarAppointment() {
    this.IsDrawerLoading = true;
    var oData = {
      agendaId: this.vAgendaId,
      credentialId: this.sCurrentCompanyUser.OrganizationUserId
    }
    this.cConfigurationService.anularReservas(oData)
      .subscribe(resp => {
        let sDet = '';
        let sMessage = '';
        var data = {
          tipo: sMessage,
          mensajeCorto: sDet,
          mensajeLargo: ''
        }
        if (resp.codeResponse) { 
          this.onLimpiar();
          this.envCloseDrawer();
          this.cTranslateService.get("home.no.matches.cancelarreserva").subscribe((text: string) => {
            sDet = text;
          });
          this.cSnackbarService.openSnackBar(sDet, '', 'Error')
        } else {
          let sTransError = "home.no.matches.error";
          this.cTranslateService.get(sTransError).subscribe((text: string) => {
            sMessage = text;
          });
          data = {
            tipo: sMessage,
            mensajeCorto: resp.dataResponse,
            mensajeLargo: ''
          }
          this.onMostrarMensaje(data);
        }

        this.IsDrawerLoading = false;
      }, err => {
        this.IsDrawerLoading = false;
      });
  }
  onResetDrawer() {
    this.cControlDocumentType.setValue(null);
    this.cControlDocument.setValue("");
    this.cControlPlate.setValue("");
    this.cControlCompanyAdviser.setValue(null);
    this.cControlServiceAgenda.setValue(null);
    this.cControlMileage.setValue("");
    this.cControlHour.setValue(null);
    this.cControlDetail.setValue("");
    this.vCustomerModel = null;
    this.IsMileageFree = false;
    this.HaveRepresentative = false;
    this.cControlRepresentativeDocumentType.setValue(null);
    this.cControlRepresentativeDocument.setValue("");
    this.cControlRepresentativeFirstName.setValue("");
    this.cControlRepresentativeLastName.setValue("");
    this.cControlRepresentativeTelephone.setValue("");
    this.cControlDocumentType.enable();
    this.cControlDocument.enable();
    this.cControlPlate.enable();
    this.vDrawerView = 'new';
    this.vAgendaAppointment = null;
    this.vAgendaId = null;
    this.vChannelId = null;
    localStorage.setItem("CompanyId", this.cControlCompany.value);
    this.emails.setValue('');
    this.cPhoneControl.setValue('');
  }
  envClickAgenda(meta) {
    if (meta.EventType !== 100) {
      return;
    }
    this.onLoadSwitchControls(false);
    this.vDrawerView = 'edit';
    this.vSelectedDay = new Date(meta.StartDate);
    this.cControlCita.setValue(this.vSelectedDay);
    this.vAgendaId = meta.AgendaId;
    this.vChannelId = meta.ChannelId;
    this.vAgendaAppointment = meta;
    this.fnObtenerBloqueosEditar(meta);
    this.onSetAgendaAppointment(meta);
  }
  onSetAgendaAppointment(oAgendaModel) {
    this.preot = oAgendaModel.PreOt;
    var fechaAgenda = new Date(oAgendaModel.StartDate);
    var fechaAct = new Date();
    fechaAgenda.setHours(0, 0, 0, 0);
    fechaAct.setHours(0, 0, 0, 0);
    if (fechaAct > fechaAgenda) {
      this.modoEdicion = true;
    } else {
      this.modoEdicion = false;
    }
    if (oAgendaModel.PreOt != "") {
      this.modoEdicion = true;
      this.modoEdicionPreOT = true;
    } else {
      this.modoEdicionPreOT = false;
    }
    this.onLoadDocumentType();
    this.envOpenDrawer();
    this.cControlDocumentType.disable();
    this.cControlDocument.disable();
    this.cControlPlate.disable();
    this.cControPickUp.disable();
    this.cControPickUp.setValue(oAgendaModel.IsPickUpAndDelivery);
    this.cControlDocumentType.setValue(oAgendaModel.CustomerIdenticationTypeId);
    this.cControlDocument.setValue(oAgendaModel.CustomerIdenticationDocument);
    this.cControlPlate.setValue(oAgendaModel.PlateName);
    this.cControlCompanyAdviser.setValue(oAgendaModel.CompanyAdviserId);
    this.onLoadService(oAgendaModel.CompanyAdviserId);
    //this.onLoadMileage()

    this.cControlDetail.setValue(oAgendaModel.Detail);
    let oDataCustomer = {
      CustomerId: oAgendaModel.CustomerId,
      FirstName: this.onPascalCaseString(oAgendaModel.CustomerFirstName),
      LastName: this.onPascalCaseString(oAgendaModel.CustomerLastName),
      IdenticationDocument: this.onPascalCaseString(oAgendaModel.CustomerIdenticationDocument),
      IdenticationTypeId: oAgendaModel.CustomerIdenticationTypeId,
      Phone: oAgendaModel.Phone,
      Address: oAgendaModel.Address,
      Email: oAgendaModel.Email,
      GeolocationId: oAgendaModel.GeoLocationId,
    };
    this.emails.setValue(oDataCustomer.Email);
    this.cPhoneControl.setValue(oDataCustomer.Phone);
    this.vCustomerModel = oDataCustomer;
    this.onSelectRepresentative(oAgendaModel.IsRepresentativeControl);
    if (oAgendaModel.IsRepresentativeControl) {
      this.cControlRepresentativeDocumentType.setValue(parseInt(oAgendaModel.RepresentativeIdenticationTypeId));
      this.cControlRepresentativeDocument.setValue(oAgendaModel.RepresentativeIdenticationDocument);
      this.cControlRepresentativeFirstName.setValue(oAgendaModel.RepresentativeFirstName);
      this.cControlRepresentativeLastName.setValue(oAgendaModel.RepresentativeLastName);
      this.cControlRepresentativeTelephone.setValue(oAgendaModel.RepresentativeTelephone);
    }
  }
  onvRestricciones() {
    var data = [
      {
        talleres: [],
        asesores: []
      }
    ];
    this.aWorkshops.forEach(element => {
      if (this.idWorkshop == element.WorkshopId) {
        if (element.ServicesByWorkshop.length > 0) {
          data[0].talleres = element.ServicesByWorkshop;
        }
      }
    });
    this.aAdvisers.forEach(element => {
      if (this.idAdviser == element.CompanyAdviserId) {
        if (element.ServicesByCompanyAdviser.length > 0) {
          data[0].asesores = element.ServicesByCompanyAdviser;
        }
      }
    });
    const dialogRef = this.cMatDialog.open(MessageTopesComponent, {
      data: data
    });
  }
  onGetCliente() {
    this.cControlPlaca.setValue(this.cControlPlaca.value.trim());
    if (this.cControlPlaca.value == "" || this.cControlPlaca.value == undefined) {
      this.cSnackbarService.openSnackBar("Por favor ingrese una placa", '', 'Error');
      return;
    }
    this.onGetTableData();
    this.cControlPlateFinal.setValue(this.cControlPlaca.value);
    this.aClientes = [];
    this.IsLoadCustomer = true;
    let oDataSend = {
      plateName: this.cControlPlaca.value,
      identicationDocument: '',
      credentialId: null,
      name: '',
      docType: '',
      companyId: null,
      isOwner: null,
      customerId: null
    }
    this.table_length = 0
    this.cCustomerService.ObtenerClientes(oDataSend).subscribe(oContent => {
      this.aClientes = oContent;
      this.dataSource = new MatTableDataSource<any>(this.aClientes);
      this.dataSource.paginator = this.paginatorCustomer;
      this.table_length = this.aClientes.length;
      if (this.aClientes.length > 0) {
        this.panelVal = true;
        this.IsLoadCustomer = false;
        this.cControlCompany.setValue(this.aClientes[0].CompanyId);
        this.onGetCitaPorPlaca(this.cControlPlaca.value);
        this.isPlateSearch = true;
      } else { 
        let sMessage = '';
        let sTransError = "home.no.matches.found";
        this.cTranslateService.get(sTransError).subscribe((text: string) => {
          sMessage = text;
        });
        var data = {
          tipo: "Error",
          mensajeCorto: sMessage,
          mensajeLargo: ""
        }
        this.panelVal = false;
        this.datosVehiculo = false;
        this.table_length = 0
        this.onMostrarMensaje(data);
        this.cControlModel.setValue("");
        this.cControlVersion.setValue("");
        this.cControlYear.setValue("");
        this.clienteSeleccionado = [];
        this.IsLoadCustomer = false;
      }


    }, () => {
      this.IsLoadCustomer = false;
    }, () => {

    });
  }
  onLimpiar() {
    this.table_length = 0
    this.panelVal = false;
    this.datosVehiculo = false;
    this.cControlPlaca.setValue("");
    this.cControlName.setValue("");
    this.cControlModel.setValue("");
    this.cControlVersion.setValue("");
    this.cControlYear.setValue("");
    this.clienteSeleccionado = [];
    this.IsLoadCustomer = false;
    this.aClientes = [];
    this.dataSource = new MatTableDataSource<any>(this.aClientes);
    this.dataSource.paginator = this.paginatorCustomer;
    this.onLoadAgendaLocked(4);
  }
  onGetCitaPorPlaca(sPlaca: string) {
    this.isPlateSearch = true;
    this.IsPrincipalLoading = true;
    let oDataSendAppointment = {
      agendaId: null,
      masterUserId: this.sCurrentCompanyUser.MasterUserId,
      startDate: null,
      endDate: null,
      companies: '',
      workshops: '',
      channels: '',
      services: '',
      advisers: '',
      customerId: '',
      statusId: '1,5',
      geolocations: '',
      isPickUpAndDelibery: '',
      haveRepresentative: null,
      plateName: sPlaca
    };
    this.cConfigurationService.AgendaAppointmentDashboardGet(oDataSendAppointment).subscribe((aAgendaAppointmentResponse) => {

      if (aAgendaAppointmentResponse.length > 0) {
        //TODO
        let oDate = aAgendaAppointmentResponse[0];
        this.cControlCompany.setValue(oDate.CompanyId);
        this.onLoadGeolocation(oDate);
        /*
        
        this.cControlDepartment.setValue(oDate.GeoLocationId); 
        this.cControlWorkshop.setValue(oDate.WorkshopId);
        this.onLoadAdviser(CompanyAdviserId);
        this.cControlAdviser.setValue(oDate.CompanyAdviserId);
        this.onLoadService(oDate.CompanyAdviserId);
        this.cControlService.setValue(oDate.ServiceId);    
        this.envClickAgenda(oDate);
        */
      } else {

        this.cControlCompany.setValue(this.aClientes[0].CompanyId);
        this.onLoadGeolocation();
      }
    }, (oErr) => {

      this.IsPrincipalLoading = false;
    }, () => {
      this.IsPrincipalLoading = false;
    })
  }
  OnPonerCadaPalabraMayuscula(sPalabras: string): string {
    let aux = '';
    let aPalabra = sPalabras.split(" ");
    aPalabra.forEach(element => {
      element = element.toLowerCase();
      aux += " " + element.charAt(0).toUpperCase() + '' + element.substring(1);
    });
    return aux.trim();
  }
  onSeleccion(row) {
    this.selection.toggle(row);
    this.clienteSeleccionado = this.selection.selected;
  }
  fnShowDialogUpdate(element) {
    element.tipo = "UPDATE"
    localStorage.setItem('Trx', "");
    const dialogRef = this.cMatDialog.open(ModifyComponent, {
      data: element
    });
    dialogRef.afterClosed().subscribe(oResp => {
      if (localStorage.getItem('Trx') == "X") {
        this.onGetCliente();
      }
    });
  }
  fnShowDialogCreate() {
    localStorage.setItem('Trx', "");
    localStorage.setItem('Error', "");
    var element = {
      placa: this.cControlPlateFinal.value,
      CompanyId: this.aClientes[0].CompanyId,
      tipo: "CREATE"
    };
    const dialogRef = this.cMatDialog.open(ModifyComponent, {
      data: element
    });
    dialogRef.afterClosed().subscribe(oResp => {
      if (localStorage.getItem('Error') != "") {
        this.onMostrarMensaje(JSON.parse(localStorage.getItem('Error')));
      }
      if (localStorage.getItem('Trx') == "X") {
        this.onGetCliente();
      }

    });
    // var element = {
    //   placa: this.cControlPlateFinal.value,
    //   CompanyId:this.aClientes[0].CompanyId
    // };
    // const dialogRef = this.cMatDialog.open(CreateComponent, {
    //   data: element
    // });
    // dialogRef.afterClosed().subscribe(oResp => {
    //   if(localStorage.getItem('Error') != undefined ||localStorage.getItem('Error')!= "" ){
    //     this.onMostrarMensaje(JSON.parse(localStorage.getItem('Error')));
    //     localStorage.setItem('Error',"");
    //   }
    //   //this.onGetCliente();
    // });
  }
  onvAdvisers() {
    const dialogRef = this.cMatDialog.open(MessageAdvisersComponent, {
    });
  }
  onCerrar() {
    this.panelVal = false;
  }
  onGetTableData() {
    let oDataSend = {
      customerId: null,
      plate: this.cControlPlaca.value
    }
    this.cCustomerService.ObtenerVehiculos(oDataSend).subscribe(oContent => {
      if (oContent.length > 0) {
        this.datosVehiculo = true;
        this.cControlModel.setValue(oContent[0].Model);
        this.cControlVersion.setValue(oContent[0].Version);
        this.cControlYear.setValue(oContent[0].Year);
        this.cControlName.setValue(oContent[0].Name);
      }
    });
  }
  fnObtenerBloqueosEditar(oAgenda) {
    let OnlyHeader = true;
    var fecha = new Date();
    let oRangoFechas = {
      StartDate: new Date(),
      EndDate: new Date(fecha.getFullYear(), fecha.getMonth() + 4, 1)
    }
    let vStartDateAux = this.cDatePipe.transform(oRangoFechas.StartDate, 'yyyy-MM-dd');
    let vEndDateAux = this.cDatePipe.transform(oRangoFechas.EndDate, 'yyyy-MM-dd');
    let oParametersAgendaGet = {
      agendaId: null,
      masterUserId: this.sCurrentCompanyUser.MasterUserId,
      startDate: vStartDateAux,
      endDate: vEndDateAux,
      onlyHeader: OnlyHeader,
      companyId: oAgenda.CompanyId,
      workshopId: oAgenda.WorkshopId,
      channelId: 3,
      serviceId: oAgenda.ServiceId,
      companyAdviserId: oAgenda.CompanyAdviserId,
      eventType: 4
    };
    this.cConfigurationService.AgendaGet(oParametersAgendaGet).subscribe(oRes => {
      this.diasBloqueados = oRes;
    }, oError => {
    });
  }
  onSelectFirstDate() {
    this.vSelectedDay = this.cControlCita.value;
    this.onLoadHour();
  }
}
