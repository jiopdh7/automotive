import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { DatePipe } from '@angular/common';
import { CompanyService } from 'src/app/services/company.service';
import { WorkshopService } from 'src/app/services/workshop.service';
import { AdviserService } from 'src/app/services/adviser.service';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { MatOption, MatPaginator, MatTableDataSource, MatAccordion } from '@angular/material';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { CompanyUserService } from 'src/app/services/companyuser.service';
import { UtilityClass } from 'src/app/compartido/Utility';

@Component({
  selector: 'app-init',
  templateUrl: './init.component.html',
  styleUrls: ['./init.component.css'],
  providers: [DatePipe]
})
export class InitComponent implements OnInit {
  public EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  public EXCEL_EXTENSION = '.xlsx';
  /**
   * Declare variables for the class
   */

  utility = new UtilityClass();
  private fecha = new Date();
  private vAllData: any[] = [];
  public IsPrincipalLoading: boolean = false;
  public cControlStartDate: FormControl = new FormControl(new Date(this.fecha.getFullYear(), this.fecha.getMonth(), 1), [Validators.required]);
  public cControlEndDate: FormControl = new FormControl(new Date(this.fecha.getFullYear(), this.fecha.getMonth() + 1, 0));
  public cControlCompany: FormControl = new FormControl('', [Validators.required]);
  public cControlDepartment: FormControl = new FormControl('');
  public cControlWorkshop: FormControl = new FormControl('');
  public cControlAdviser: FormControl = new FormControl('');
  public cControlService: FormControl = new FormControl('');
  public cControlStatus: FormControl = new FormControl('');
  public cControlChannel: FormControl = new FormControl('');
  public cControlPickUp: FormControl = new FormControl('');
  public cControlPlate: FormControl = new FormControl('');
  public cControlUsuario: FormControl = new FormControl('');
  public cControlTipoDocumento: FormControl = new FormControl('');
  public cControlNumeroDocumento: FormControl = new FormControl('');
  public ccontrolFirstLastName: FormControl = new FormControl('');
  public isOpenAdvancedOpctions: boolean = false;
  public aCompanies: any[] = [];
  public aDepartments: any[] = [];
  public aWorkshops: any[] = [];
  public aAdvisers: any[] = [];
  public aServices: any[] = [];
  public aStatus: any[] = [];
  public aChannels: any[] = [];
  public vMinEndDate: Date = new Date();
  public aPicks: any[] = [];
  public aUsuarioCallCenter: any[] = [];
  public aTipoDocumento: any[] = [];
  /**
   * Declare variables for Chart One
   */
  public vTypeChartOne: string = 'ColumnChart';
  public vDataChartOne: any[] = [
    ['Taller', { v: 0, f: '0' }]
  ];
  public vColumnChartOne: any[] = ['Taller', 'Estado'];
  public vOptionChartOne = {
    isStacked: true,
    height: 500,
    legend: { position: 'right', textStyle: { color: '#000', fontSize: 12 } },
    vAxis: { minValue: 0 }

  }
  /**
   * Declare variable for chart two
   */
  public vTypeChartTwo: string = 'PieChart';
  public vDataChartTwo: any[] = [
    ['Canal', 0, 'Canal']
  ];
  public vColumnChartTwo: any[] = ['Canal', 'Cantidad', { role: 'annotation' }];
  public vOptionChartTwo = {
    isStacked: true,
    height: 500,
    vAxis: { minValue: 0 },
    is3D: false
  }
  /**
   * Declare variable for chart three
   */
  public vTypeChartThree: string = 'ColumnChart';
  public vDataChartThree: any[] = [
    ['Taller', { v: 0, f: '0' }]
  ];
  public vColumnChartThree: any[] = ['Taller', 'Estado'];
  public vOptionChartThree = {
    height: 500,
    isStacked: true,
    vAxis: { minValue: 0 },
    is3D: true
  }
  /**
   * Declare variables for chart four
   */
  public vTypeChartFour: string = 'ColumnChart';
  public vDataChartFour: any[] = [
    ['Taller', { v: 0, f: '0' }]
  ];
  public vColumnChartFour: any[] = ['Taller', 'Estado'];
  public vOptionChartFour = {
    height: 500,
    vAxis: { minValue: 0 },
    hAxis: { format: '#,###%' },
    is3D: true
  }
  /**
   * Declare Views to table
   */

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  displayedColumns: string[] = ['Taller', 'Asesor', 'Servicio', 'Canal', 'Pick', 'fecha', 'hora', 'placa', 'cliente', 'estado', 'UsuarioRegistra'];
  dataSource;
  /**
   * Declare Views to select
   */

  @ViewChild('allSelectedDepartment', { static: false }) private allSelectedDepartment: MatOption;
  @ViewChild('allSelectedAdviser', { static: false }) private allSelectedAdviser: MatOption;
  @ViewChild('allSelectedService', { static: false }) private allSelectedService: MatOption;
  @ViewChild('allSelectedChannel', { static: false }) private allSelectedChannel: MatOption;
  @ViewChild('allSelectedStatus', { static: false }) private allSelectedStatus: MatOption;
  @ViewChild('allSelectedWorkshop', { static: false }) private allSelectedWorkshop: MatOption;
  @ViewChild('allSelectedPick', { static: false }) private allSelectedPick: MatOption;
  @ViewChild('allSelectedUser', { static: false }) private allSelectedUser: MatOption;
  @ViewChild('allSelectedDocumentType', { static: false }) private allSelectedDocumentType: MatOption;
  @ViewChild(MatAccordion, { static: true }) accordion: MatAccordion;

  /**
   * Declare variables for session
  */
  public sCurrentModule = JSON.parse(localStorage.getItem('ModuleSelected'));
  public sCurrentCompanyUser = JSON.parse(localStorage.getItem('CompanyUser'));
  /**
   * Declare variables for selection filters
  */

  constructor
    (
      private cTranslateService: TranslateService,
      private cConfigurationService: ConfigurationService,
      private cCompanyService: CompanyService,
      private cWorkshopService: WorkshopService,
      private cAdviserService: AdviserService,
      private cSnackbarService: SnackbarService,
      private cDatePipe: DatePipe,
      private cCompanyUserService: CompanyUserService
    ) {
    this.cTranslateService.setDefaultLang('es');
  }

  ngOnInit() { 
    this.onLoadCompanies();
    this.onLoadGeolocation();
    this.onLoadWorkshop();
    this.onLoadAdviser();
    this.onLoadStatus();
    this.onLoadChannels();
    this.onLoadServices();
    this.onLlenarPick();
    this.onLlenarTabla();
    this.onLoadTipoDocument();
    this.onLoadUsersCallCenter();
    // this.exportAsExcelFile([], 'sample');
    // this.onLoadDataDashboard();
  }
  /**
* This function inverses text from PHP's nl2br() with default parameters.
*
* @param {string} str Input text
* @param {boolean} replaceMode Use replace instead of insert
* @return {string} Filtered text
*/
  br2nl(str, replaceMode) {
    var replaceStr = (replaceMode) ? "\n" : '';
    // Includes <br>, <BR>, <br />, </br>
    return str.replace(/<\s*\/?br\s*[\/]?>/gi, replaceStr);
  }
  ngAfterViewInit() {
    //ir arriba en la pagina
    let top = document.getElementById('top');
    if (top !== null) {
      top.scrollIntoView();
      top = null;
    }
  }
  onLlenarPick() {
    this.aPicks.push({ nombre: "No", value: false });
    this.aPicks.push({ nombre: "Si", value: true });

  }
  onSelectFirstDate() {
    this.vMinEndDate = this.cControlStartDate.value;

  }
  onSearchAgendaAppointment() {
    this.onLoadDataDashboard();
  }
  onSelectAllPick() {

    if (this.allSelectedPick.selected) {
      this.cControlPickUp.patchValue([...this.aPicks.map(item => item.value), 0]);
    } else {
      this.cControlPickUp.patchValue([]);
    }
  }
  onSelectPerOnePick() {

    if (this.allSelectedPick.selected) {
      this.allSelectedPick.deselect();
      return false;
    }
    if (this.cControlPickUp.value.length == this.aPicks.length)
      this.allSelectedPick.select();
  }
  /**
   * 
   */
  onSelectAllDepartment() {

    if (this.allSelectedDepartment.selected) {
      this.cControlDepartment.patchValue([...this.aDepartments.map(item => item.GeoLocationId), 0]);
    } else {
      this.cControlDepartment.patchValue([]);
    }
    this.onLoadWorkshop();
  }
  onSelectPerOneDepartment() {

    if (this.allSelectedDepartment.selected) {
      this.allSelectedDepartment.deselect();
      this.onLoadWorkshop();
      return false;
    }
    if (this.cControlDepartment.value.length == this.aDepartments.length)
      this.allSelectedDepartment.select();
    this.onLoadWorkshop();
  }
  /**
   * 
   */
  onSelectAllAdviser() {
    if (this.allSelectedAdviser.selected) {
      this.cControlAdviser.patchValue([...this.aAdvisers.map(item => item.CompanyAdviserId), 0]);
    } else {
      this.cControlAdviser.patchValue([]);
    }
  }
  onSelectPerOneAdviser() {
    if (this.allSelectedAdviser.selected) {
      this.allSelectedAdviser.deselect();
      return false;
    }
    if (this.cControlAdviser.value.length == this.aAdvisers.length)
      this.allSelectedAdviser.select();
  }
  /**
   * 
   */
  onSelectAllService() {
    if (this.allSelectedService.selected) {
      this.cControlService.patchValue([...this.aServices.map(item => item.ServiceId), 0]);
    } else {
      this.cControlService.patchValue([]);
    }
  }
  onSelectPerOneService() {
    if (this.allSelectedService.selected) {
      this.allSelectedService.deselect();
      return false;
    }
    if (this.cControlService.value.length == this.aServices.length)
      this.allSelectedService.select();
  }
  /**
  * 
  */
  onSelectAllChannel() {
    if (this.allSelectedChannel.selected) {
      this.cControlChannel.patchValue([...this.aChannels.map(item => item.ChannelId), 0]);
    } else {
      this.cControlChannel.patchValue([]);
    }
  }
  onSelectPerOneChannel() {
    if (this.allSelectedChannel.selected) {
      this.allSelectedChannel.deselect();
      return false;
    }
    if (this.cControlChannel.value.length == this.aChannels.length)
      this.allSelectedChannel.select();
  }
  onSelectAllUser() {
    if (this.allSelectedUser.selected) {
      this.cControlUsuario.patchValue([...this.aUsuarioCallCenter.map(item => item.OrganizationUserId), 0]);
    } else {
      this.cControlUsuario.patchValue([]);
    }
  }
  onSelectPerOneUser() {
    if (this.allSelectedUser.selected) {
      this.allSelectedUser.deselect();
      return false;
    }
    if (this.cControlUsuario.value.length == this.aUsuarioCallCenter.length)
      this.allSelectedUser.select();
  }
  /**
   * 
   */
  onSelectAllStatus() {
    if (this.allSelectedStatus.selected) {
      this.cControlStatus.patchValue([...this.aStatus.map(item => item.StatusId), 0]);
    } else {
      this.cControlStatus.patchValue([]);
    }
  }
  onSelectPerOneStatus() {
    if (this.allSelectedStatus.selected) {
      this.allSelectedStatus.deselect();
      return false;
    }
    if (this.cControlStatus.value.length == this.aStatus.length)
      this.allSelectedStatus.select();
  }
  /**
   * 
   */
  onSelectAllDocumentType() {
    if (this.allSelectedDocumentType.selected) {
      this.cControlTipoDocumento.patchValue([...this.aTipoDocumento.map(item => item.IdenticationTypeId), 0]);
    } else {
      this.cControlTipoDocumento.patchValue([]);
    }
  }
  onSelectPerOneDocumentType() {
    if (this.allSelectedDocumentType.selected) {
      this.allSelectedDocumentType.deselect();
      return false;
    }
    if (this.cControlTipoDocumento.value.length == this.aTipoDocumento.length)
      this.allSelectedDocumentType.select();
  }
  /**
   * 
   */
  onSelectAllWorkshops() {
    if (this.allSelectedWorkshop.selected) {
      this.cControlWorkshop.patchValue([...this.aWorkshops.map(item => item.WorkshopId), 0]);
    } else {
      this.cControlWorkshop.patchValue([]);
    }
    this.onLoadAdviser();
  }
  onSelectPerOneWorkshops() {
    if (this.allSelectedWorkshop.selected) {
      this.allSelectedWorkshop.deselect();
      this.onLoadAdviser();
      return false;
    }
    if (this.cControlWorkshop.value.length == this.aWorkshops.length)
      this.allSelectedWorkshop.select();
    this.onLoadAdviser();
  }
  onLoadChannels() {
    this.IsPrincipalLoading = true;
    let oDataS = {
      masterUserId: this.sCurrentCompanyUser.MasterUserId,
      channelId: null
    }
    this.cConfigurationService.ChannelsByCompanyGet(oDataS).subscribe((oData) => {
      this.aChannels = oData;
    }, (oErr) => {
      this.IsPrincipalLoading = false;

    }, () => {
      this.IsPrincipalLoading = false;
    });
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

    }, (oError) => {
      this.IsPrincipalLoading = false;
    }, () => {
      this.IsPrincipalLoading = false;
    });
  }
  /**
   * Function que lista los servicios 
   */
  onLoadServices() {
    let oDataSend = {
      masterUserId: this.sCurrentCompanyUser.MasterUserId,
      companyId: this.cControlCompany.value,
      isActived: null
    };
    this.cCompanyService.BrandsByCompanyGet(oDataSend).subscribe((oData) => {
      this.aServices = oData;
    }, (oErr) => {

    }, () => {
    });
  }
  /**
   * Función que lista los departamentos de talleres activos
   * Se ejecuta cuando se seleciona una compania
   */
  onLoadGeolocation() {
    this.IsPrincipalLoading = true;
    let oDataSendGeolocation = {
      externalCode: 'X',
      masterUserId: this.sCurrentCompanyUser.MasterUserId,
      companyId: this.cControlCompany.value,
      flagGlobal: null
    };
    this.cConfigurationService.onGeolocationGet(oDataSendGeolocation).subscribe((aDepartmentsResponse) => {
      this.aDepartments = aDepartmentsResponse;
    }, (oError) => {
      this.IsPrincipalLoading = false;

    }, () => {
      this.IsPrincipalLoading = false;

    });
  }
  /**
   * Función que lista los talleres activos en base a una compania y una region
   */
  onLoadWorkshop() {
    this.IsPrincipalLoading = true;
    let oDataSendWorkshop = {
      masterUserId: this.sCurrentCompanyUser.MasterUserId,
      companyId: this.cControlCompany.value == "" ? null : this.cControlCompany.value,
      workshopId: null,
      isActived: '',
      geoLocationId: this.cControlDepartment.value
    }
    this.cWorkshopService.MasterWorkshopGet(oDataSendWorkshop).subscribe((aWorkshopsReponse) => {
      this.aWorkshops = aWorkshopsReponse;
    }, (oErr) => {
      this.IsPrincipalLoading = false;

    }, () => {
      this.IsPrincipalLoading = false;
    });
  }
  /**
   * Función que lista los asesores activos en base a la compania y taller
   */
  onLoadAdviser() {
    let aWorkshopAux = this.cControlWorkshop.value;
    if (aWorkshopAux.length > 0) {
      let indexworkshop = aWorkshopAux.findIndex(oEle => oEle.toString() === '0');
      if (indexworkshop != -1) {
        aWorkshopAux = '';
      }
    } else {
      aWorkshopAux = '';
    }
    this.IsPrincipalLoading = true;
    let oDataSendAviser = {
      masterUserId: this.sCurrentCompanyUser.MasterUserId,
      companyId: this.cControlCompany.value == "" ? null : this.cControlCompany.value,
      workshopId: aWorkshopAux.toString(),
      companyAdviserId: null,
      isActived: ''
    }
    this.cAdviserService.ObtenerAsesores(oDataSendAviser).subscribe((aAdvisersResponse) => {
      var tempAsesores = []
      aAdvisersResponse.forEach(element => {
        element.FirstName = this.onPascalCaseString(element.FirstName);
        element.LastName = this.onPascalCaseString(element.LastName);
        tempAsesores.push(element);
      });
      this.aAdvisers = tempAsesores;
    }, (oErrpr) => {
      this.IsPrincipalLoading = false;

    }, () => {
      this.IsPrincipalLoading = false;
    })
  }
  onLoadStatus() {
    this.IsPrincipalLoading = true;
    this.cConfigurationService.AppointmentStatusGet().subscribe((aStatusResponse) => {
      this.aStatus = aStatusResponse;
    }, (oErrpr) => {
      this.IsPrincipalLoading = false;

    }, () => {
      this.IsPrincipalLoading = false;
    })
  }
  onValidateFilter() {
    let flat = true;
    if (!this.cControlStartDate.valid) {
      this.cControlStartDate.markAsTouched();
      flat = false;
    }
    if (!this.cControlCompany.valid) {
      this.cControlCompany.markAsTouched();
      flat = false;
    }
    return flat;

  }
  onFilterLocalData(oData) { 
    let oDataAux = []; 
    oData.forEach(element => {
      let flat = true;
      let aTipoAux = this.cControlTipoDocumento.value;
      if (aTipoAux.length > 0) {
        let indextipo = aTipoAux.findIndex(oEle => oEle.toString() === '0');
        if (indextipo != -1) {
          aTipoAux = '';
        }
      } else {
        aTipoAux = '';
      }
      if (aTipoAux != '') {
        let indextipodocument = aTipoAux.findIndex(oEle => oEle.toString() == element.CustomerIdenticationTypeId.toString());
        if (indextipodocument != -1) {
          flat = true;
        } else {
          flat = false;
        }
      }

      let aUsuarioAux = this.cControlUsuario.value;
      if (aUsuarioAux.length > 0) {
        let indextipoUsu = aUsuarioAux.findIndex(oEle => oEle.toString() === '0');
        if (indextipoUsu != -1) {
          aUsuarioAux = '';
        }
      } else {
        aUsuarioAux = '';
      }

      if (aUsuarioAux != '') {
        let indextipodocument = aUsuarioAux.findIndex(oEle => oEle.toLowerCase().toString() == element.RegistrationoUserId.toLowerCase().toString());
        if (indextipodocument != -1) {
          flat = true;
        } else {
          flat = false;
        }
      }

      if (this.ccontrolFirstLastName.value.toString().length > 0) {
        let oFirstLastName = element.CustomerFirstName.trim().toLowerCase() + ' ' + element.CustomerLastName.trim().toLowerCase();
        if (oFirstLastName.indexOf(this.ccontrolFirstLastName.value.toLowerCase()) != -1) {
          flat = true

        } else {
          flat = false
        }

      }
      if (this.cControlNumeroDocumento.value.toString().length > 0) {
        let oFirstLastName = element.CustomerIdenticationDocument.trim().toLowerCase();
        if (oFirstLastName.indexOf(this.cControlNumeroDocumento.value) != -1) {
          flat = true

        } else {
          flat = false
        }
      }

      if (flat) {
        oDataAux.push(element);
      }
      // element.CustomerLastName
    });
    return oDataAux;
  }
  /**
   * Funcion que obtiene los datos de agendamiento
  */
  onLoadDataDashboard() {
    if (!this.onValidateFilter()) {
      return;
    }
    let aWorkshopAux = this.cControlWorkshop.value;
    if (aWorkshopAux.length > 0) {
      let indexworkshop = aWorkshopAux.findIndex(oEle => oEle.toString() === '0');
      if (indexworkshop != -1) {
        aWorkshopAux = '';
      }
    } else {
      aWorkshopAux = '';
    }
    let aChannelAux = this.cControlChannel.value;
    if (aChannelAux.length > 0) {
      let indexChannel = aChannelAux.findIndex(oEle => oEle.toString() === '0');
      if (indexChannel != -1) {
        aChannelAux = '';
      }
    } else {
      aChannelAux = '';
    }
    let aServiceAux = this.cControlService.value;
    if (aServiceAux.length > 0) {
      let indexService = aServiceAux.findIndex(oEle => oEle.toString() === '0');
      if (indexService != -1) {
        aServiceAux = '';
      }
    } else {
      aServiceAux = '';
    }
    let aAdviserAux = this.cControlAdviser.value;
    if (aAdviserAux.length > 0) {
      let indexAdviser = aAdviserAux.findIndex(oEle => oEle.toString() === '0');
      if (indexAdviser != -1) {
        aAdviserAux = '';
      }
    } else {
      aAdviserAux = '';
    }
    let aStatusAux = this.cControlStatus.value;
    if (aStatusAux.length > 0) {
      let indexStatus = aStatusAux.findIndex(oEle => oEle.toString() === '0');
      if (indexStatus != -1) {
        aStatusAux = '';
      }
    } else {
      aStatusAux = '';
    }
    let aDepartmentAux = this.cControlDepartment.value;
    if (aDepartmentAux.length > 0) {
      let indexDepartment = aDepartmentAux.findIndex(oEle => oEle.toString() === '0');
      if (indexDepartment != -1) {
        aDepartmentAux = '';
      }
    } else {
      aDepartmentAux = '';
    }

    let vStartDateAux = this.cDatePipe.transform(this.cControlStartDate.value, 'yyyy-MM-dd');
    let vEndDateAux = this.cDatePipe.transform(this.cControlEndDate.value, 'yyyy-MM-dd');
    let oDataSendAppointment = {
      agendaId:null,
      masterUserId: this.sCurrentCompanyUser.MasterUserId,
      startDate: vStartDateAux,
      endDate: vEndDateAux,
      companies: this.cControlCompany.value,
      workshops: aWorkshopAux.toString(),
      channels: aChannelAux.toString(),
      services: aServiceAux.toString(),
      advisers: aAdviserAux.toString(),
      customerId: '',
      statusId: aStatusAux.toString(),
      geolocations: aDepartmentAux.toString(),
      isPickUpAndDelibery: this.cControlPickUp.value,
      haveRepresentative: null,
      plateName: this.cControlPlate.value.trim()
    };

    this.cConfigurationService.AgendaAppointmentDashboardGet(oDataSendAppointment).subscribe((aDataResponse) => {
      aDataResponse.forEach(element => {
        element.CompanyAdviserFirstName = this.onPascalCaseString(element.CompanyAdviserFirstName);
        element.CompanyAdviserLastName = this.onPascalCaseString(element.CompanyAdviserLastName);
      });

      this.vAllData = this.onFilterLocalData(aDataResponse);
      this.onLlenarTabla();
      if (this.vAllData.length > 0) {
        this.onLoadChartBar(this.vAllData, 'WorkshopId', 'StatusId', 'vColumnChartOne', 'vDataChartOne', 'Taller', 'WorkshopFriendlyName', 'StatusName', '');
        this.onLoadChartBar(this.vAllData, 'WorkshopId', 'ServiceId', 'vColumnChartThree', 'vDataChartThree', 'Taller', 'WorkshopFriendlyName', 'ServiceFriendlyName', '');
        this.onLoadChartBar(this.vAllData, 'WorkshopId', 'CompanyAdviserId', 'vColumnChartFour', 'vDataChartFour', 'Taller', 'WorkshopFriendlyName', 'CompanyAdviserFirstName', 'CompanyAdviserLastName');
        this.onLoadChartPie(this.vAllData, 'ChannelId', 'vDataChartTwo', 'ChannelFriendlyName');
      } else {
        this.onResetChartDate();
      }
    }, (oErr) => {

    }, () => {

    });

  }
  onResetChartDate() {
    this.vDataChartOne = [
      ['Taller', { v: 0, f: '0' }]
    ];
    this.vColumnChartOne = ['Taller', 'Estado'];
    this.vDataChartTwo = [
      ['Canal', 0, 'Canal']
    ];
    this.vColumnChartTwo = ['Canal', 'Cantidad', { role: 'annotation' }];
    this.vDataChartThree = [
      ['Taller', { v: 0, f: '0' }]
    ];
    this.vColumnChartThree = ['Taller', 'Estado'];
    this.vDataChartFour = [
      ['Taller', { v: 0, f: '0' }]
    ];
    this.vColumnChartFour = ['Taller', 'Estado'];
  }
  /**
   * Funcion que llega los graficos de estados por taller
   * @param cData Data en de agendamiento
   * @param cBaseX Parametro base del grafico
   * @param cBaseY : Parametro filtro
   * @param cColumnChartOne Nombre de la variable glocal del grafico
   * @param cDataChartOne Nombre de la variable global de la data donde almacena el grafico
   * @param cInitiaLabel nombre del table inicial
   */
  onLoadChartBar(cData: any[], cBaseX: string, cBaseY: string, cColumnChartOne: string, cDataChartOne: string, cInitiaLabel: string, cBaseXLabel: string, cBaseYLabel: string, cLabelAux: string) {
    let ColumnChartOne = [cInitiaLabel];
    let DataChartOne = [];
    let aDataFinal = [];
    let oDataCita = [];
    cData.forEach(element => {
      let oData = oDataCita.find(oEle => oEle[cBaseY].toString() === element[cBaseY].toString());
      if (oData) {
        oData.count++;
        oData.child.push(element);
      } else {
        let oDataLocal = { child: [], count: 0, position: null };
        oDataLocal = Object.assign(oDataLocal, element);
        oDataLocal.count++;
        oDataLocal.child.push(element);
        oDataLocal.position = ColumnChartOne.length;
        let cName = "";
        cName = element[cBaseYLabel];
        if (cLabelAux !== '') {
          cName = cName + " " + element[cLabelAux].trim()
        }
        ColumnChartOne.push(cName);
        oDataCita.push(oDataLocal)
      }
    });
    this[cColumnChartOne] = ColumnChartOne;
    cData.forEach(element => {
      let oData = aDataFinal.find(oEle => oEle[cBaseX].toLowerCase() === element[cBaseX].toLowerCase());
      if (oData) {
        oData.count++;
        let oDataStatus = oDataCita.find(oEle => oEle[cBaseY].toString() === element[cBaseY].toString());
        for (let index = 0; index < oDataStatus.child.length; index++) {
          const elementAux = oDataStatus.child[index];
          if (element.AgendaId.toString() === elementAux.AgendaId.toString()) {
            DataChartOne[oData.index][oDataStatus.position].v++;
            DataChartOne[oData.index][oDataStatus.position].f = DataChartOne[oData.index][oDataStatus.position].v.toString();
          }
        }
      } else {
        let oDataLocal = { child: [], count: 0, index: 0 };
        oDataLocal = Object.assign(oDataLocal, element);
        oDataLocal.count++;
        let oData = [element[cBaseXLabel].trim()];
        for (let index = 0; index < oDataCita.length; index++) {
          oData.push({ v: 0, f: '0' });
        }
        let indexAux = DataChartOne.length;
        oDataLocal.index = indexAux;
        DataChartOne.push(oData);
        aDataFinal.push(oDataLocal);
        let oDataStatus = oDataCita.find(oEle => oEle[cBaseY].toString() === element[cBaseY].toString());
        for (let index = 0; index < oDataStatus.child.length; index++) {
          const elementAux = oDataStatus.child[index];
          if (element.AgendaId.toString() === elementAux.AgendaId.toString()) {
            DataChartOne[oDataLocal.index][oDataStatus.position].v++;
            DataChartOne[oDataLocal.index][oDataStatus.position].f = DataChartOne[oDataLocal.index][oDataStatus.position].v.toString();
          }
        }
      }
    });
    this[cDataChartOne] = DataChartOne;
  }
  onLoadChartPie(cData: any[], cBaseY: string, cDataChartOne: string, cBaseYLabel: string) {
    let ColumnChartOne = [];
    let DataChartOne = [];
    let aDataFinal = [];
    let oDataCita = [];
    cData.forEach(element => {
      let oData = oDataCita.find(oEle => oEle[cBaseY].toString() === element[cBaseY].toString());
      if (oData) {
        // oData.count++;
        // oData.child.push(element);
        ColumnChartOne[oData.index][1]++;
      } else {
        let oDataLocal = { child: [], count: 0, index: 0 };
        oDataLocal = Object.assign(oDataLocal, element);
        oDataLocal.index = ColumnChartOne.length;
        let cName = "";
        cName = element[cBaseYLabel].trim();
        ColumnChartOne.push([cName, 1, cName]);
        oDataCita.push(oDataLocal)
      }
    });
    this[cDataChartOne] = ColumnChartOne;
  }

  onPascalCaseString(sPalabras: string): string {
    let aux = '';
    sPalabras.split(" ").forEach(element => {
      element = element.toLowerCase();
      aux += " " + element.charAt(0).toUpperCase() + '' + element.substring(1);
    });
    return aux;
  }
  onCleanData(oDataFull) {
    let aData = [];
    oDataFull.forEach(element => {
      let oData = {
        "Compañía": element.CompanyFullName,
        "Región": element.Department,
        "Taller": element.WorkshopFriendlyName,
        "Asesor": this.onPascalCaseString(element.CompanyAdviserFirstName.trim() + ' ' + element.CompanyAdviserLastName.trim()),
        "Servicio": element.ServiceFriendlyName,
        "Canal": element.ChannelFriendlyName,
        "Pick Up And Delivery": element.IsPickUpAndDelivery ? 'Si' : 'No',
        "Fecha": this.cDatePipe.transform(this.utility.fnStringToDate(element.StartDate), 'dd/MM/yyyy'),
        "Hora": this.cDatePipe.transform(this.utility.fnStringToDate(element.StartDate), 'HH:mm:ss'),
        "Placa": element.PlateName,
        "Tipo Doc.": this.onPascalCaseString(element.CustomerIdenticationTypeName),
        "Núm. Doc": element.CustomerIdenticationDocument.trim(),
        "Cliente": this.onPascalCaseString(element.CustomerFirstName.trim() + ' ' + element.CustomerLastName.trim()),
        "Estado": element.StatusName,
        "Núm. Ot": element.Ot,
        "Pre Ot":element.PreOt,
        "Cliente se presentará": element.RepresentativeFirstName.trim().length === 0 ? 'No' : 'Si',
        "Representante Toma acciones": element.IsRepresentativeControl ? 'Si' : 'No',
        "Nombre Representante": this.onPascalCaseString(element.RepresentativeFirstName + ' ' + element.RepresentativeLastName).trim(),
        "Núm. Doc Representante": element.RepresentativeIdenticationDocument ? element.RepresentativeIdenticationDocument.trim() : '',
        "Teléfono Representante": element.RepresentativeTelephone ? element.RepresentativeTelephone : '',
        "Usuario que Registro": this.onPascalCaseString(element.RegistrationUser)
      };
      aData.push(oData);
    });
    return aData;
  }
  onExportData() {

    if (this.vAllData.length > 0) {
      let oClearData = this.onCleanData(this.vAllData);
      let vStartDateAux = this.cDatePipe.transform(this.cControlStartDate.value, 'yyyy-MM-dd');
      let vEndDateAux = this.cDatePipe.transform(this.cControlEndDate.value ? this.cControlEndDate.value : this.cControlStartDate.value, 'yyyy-MM-dd');;
      let oFileName = 'Desde_' + vStartDateAux + '_Hasta_' + vEndDateAux;
      this.exportAsExcelFile(oClearData, oFileName);
    } else {
      //No se encontraron Datos cargados, ejecute un filtrado
      let sMessage = '';
      let sTrans = "DasboardChartErrorExport";
      this.cTranslateService.get(sTrans).subscribe((text: string) => {
        sMessage = text;
      });
      this.cSnackbarService.openSnackBar(sMessage, '', 'Error');
    }
  }
  public exportAsExcelFile(json: any[], excelFileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }
  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: this.EXCEL_TYPE });
    FileSaver.saveAs(data, fileName + '_' + new Date().getTime() + this.EXCEL_EXTENSION);
  }
  onSelectCompany() {
    this.onLoadWorkshop();
    this.onLoadGeolocation()
    this.onLoadServices();

  }
  onLlenarTabla() {
    this.dataSource = new MatTableDataSource<any>(this.onCleanData(this.vAllData));
    this.dataSource.paginator = this.paginator;
  }
  onLoadTipoDocument() {
    this.cConfigurationService.obtenerDocumentos().subscribe(oContent => {
      this.aTipoDocumento = oContent;
    });

  }
  onLoadUsersCallCenter() {
    let oDataSend = {
      masterUserId: this.sCurrentCompanyUser.MasterUserId,
      organizationUserId: null,
      companyId: this.cControlCompany.value == "" ? null : this.cControlCompany.value,
      organizationRoleId: 4,
      isActived: true
    }
    this.cCompanyUserService.OrganizationUserGet(oDataSend).subscribe(oContent => {
      this.aUsuarioCallCenter = oContent;
    });
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
}
