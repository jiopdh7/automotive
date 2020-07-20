import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatPaginatorIntl, MatDialog, MatOption } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { WorkshopService } from 'src/app/services/workshop.service';
import { Router } from '@angular/router';
import { SendReportComponent } from '../send-report/send-report.component';
import { CompanyService } from 'src/app/services/company.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { FormControl, Validators } from '@angular/forms';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { UtilityClass } from 'src/app/compartido/Utility';

@Component({
  selector: 'app-init',
  templateUrl: './init.component.html',
  styleUrls: ['./init.component.css']
})
export class InitComponent implements OnInit {

  utility = new UtilityClass();
  public IsLoadedWorkshops = false;
  private companyUserModel = JSON.parse(localStorage.getItem('CompanyUser'));
  position = "below";
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  dataSource = new MatTableDataSource<any>([]);;
  displayedColumns: string[] = ['nombre_compania', 'estado', 'canales', 'direccion', 'telefono', 'usuario', 'horarios', 'acciones'];
  public oModuleSelected = JSON.parse(localStorage.getItem('ModuleSelected')) ? JSON.parse(localStorage.getItem('ModuleSelected')) : {};
  public sCurrentCompanyUser = JSON.parse(localStorage.getItem('CompanyUser'));
  public aCompanies: any[] = [];
  public aDepartments: any[] = [];
  public aPicks: any[] = [];
  public cControlCompany: FormControl = new FormControl('', [Validators.required]);
  public cControlDepartment: FormControl = new FormControl('');
  public d = [true]
  public cControlActive: FormControl = new FormControl(this.d);
  /**
   * Declare Views to select
   */

  @ViewChild('allSelectedDepartment', { static: false }) private allSelectedDepartment: MatOption;
  @ViewChild('allSelectedPick', { static: false }) private allSelectedPick: MatOption;
  constructor
    (
      private cTranslateService: TranslateService,
      private cMatPaginatorIntl: MatPaginatorIntl,
      private cWorkshopService: WorkshopService,
      private cRouter: Router,
      private cMatDialog: MatDialog,
      private cSnackbarService: SnackbarService,
      private cCompanyService: CompanyService,
      private cConfigurationService: ConfigurationService
    ) {
    this.cTranslateService.setDefaultLang('es');
    this.cMatPaginatorIntl.itemsPerPageLabel = "Filas por página";
    this.cMatPaginatorIntl.nextPageLabel = "Página siguiente";
    this.cMatPaginatorIntl.previousPageLabel = "Página anterior";
  }
  ngOnInit() {
    //this.onLoadWorkshops();
    this.onLoadCompanies();
    this.onLoadGeolocation();
    this.onLlenarActive();
  }
  onLlenarActive(){
    this.aPicks.push({nombre:"Desactivado",value:false});
    this.aPicks.push({nombre:"Activo",value:true});    
  }
  onSelectAllPick() {
    
    if (this.allSelectedPick.selected) {
      this.cControlActive.patchValue([...this.aPicks.map(item => item.value), 0]);
    } else {
      this.cControlActive.patchValue([]);
    }
  }
  onSelectPerOnePick() {
    
    if (this.allSelectedPick.selected) {
      this.allSelectedPick.deselect();
      return false;
    }
    if (this.cControlActive.value.length == this.aPicks.length)
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
  }
  onSelectPerOneDepartment() {
    
    if (this.allSelectedDepartment.selected) {
      this.allSelectedDepartment.deselect();
      return false;
    }
    if (this.cControlDepartment.value.length == this.aDepartments.length)
      this.allSelectedDepartment.select();
  }
   /**
   * Función que lista las companias
   */
  onLoadCompanies() {
    this.IsLoadedWorkshops = true;
    let oDataSendCompany = {
      masterUserId: this.sCurrentCompanyUser.MasterUserId,
      companyId: null,
      isActived: null
    }
    this.cCompanyService.MasterCompanyGet(oDataSendCompany).subscribe((aCompaniesResponse) => {
      var companies = JSON.parse(localStorage.getItem("CompanyUser")).OrganizationUsersByCompany;
      var aCompañias=[];
      var companieDefect = companies[0].CompanyId;
      companies.forEach(element => {
        aCompaniesResponse.forEach(c => {
          if(element.CompanyId.toUpperCase()==c.CompanyId.toUpperCase()){
            aCompañias.push(c);
          }
        });
      });
      this.aCompanies = aCompañias;
      this.cControlCompany.setValue(companieDefect.toLocaleLowerCase());    
      this.onLoadFilters();
      this.onLoadWorkshops();
    }, (oError) => {
      this.IsLoadedWorkshops = false;
    }, () => {
      this.IsLoadedWorkshops = false;
    });
  }
  
  onPascalCaseString(sPalabras: string): string {
    let aux = '';
    sPalabras.split(" ").forEach(element => {
      element = element.toLowerCase();
      aux += " " + element.charAt(0).toUpperCase() + '' + element.substring(1);
    });
    return aux;
  }
    /**
   * Función que lista los departamentos de talleres activos
   * Se ejecuta cuando se seleciona una compania
   */
  onLoadGeolocation() {
    this.IsLoadedWorkshops = true;
    let oDataSendGeolocation = {
      externalCode: 'X',
      masterUserId: this.sCurrentCompanyUser.MasterUserId,
      companyId: 'X',
      flagGlobal: true
    };
    this.cConfigurationService.onGeolocationGet(oDataSendGeolocation).subscribe((aDepartmentsResponse) => {
      this.aDepartments = aDepartmentsResponse;
    }, (oError) => {
      this.IsLoadedWorkshops = false;

    }, () => {
      this.IsLoadedWorkshops = false;

    });
  }
  ngAfterViewInit() {
    //ir arriba en la pagina
    let top = document.getElementById('top');
    if (top !== null) {
      top.scrollIntoView();
      top = null;
    }
  }
  onValidateFilter() {
    let flat = true;
    if (!this.cControlCompany.valid) {
      this.cControlCompany.markAsTouched();
      flat = false;
    }
    return flat;

  }
  onLoadFilters(){
    let oFilters = JSON.parse(localStorage.getItem("oFiltersWorkshop"));

    if(oFilters !== null){
      this.cControlCompany.setValue(oFilters.CompanyId);
      this.cControlDepartment.setValue(oFilters.Departments);
      this.cControlActive.setValue(oFilters.IsActived)
    }
  }
  onLoadWorkshops() {
    if (!this.onValidateFilter()) {
      return;
    }    
    let oFilters = {
      "CompanyId": this.cControlCompany.value, 
      "Departments": this.cControlDepartment.value, 
      "IsActived": this.cControlActive.value
    };
    localStorage.setItem("oFiltersWorkshop", JSON.stringify(oFilters));
    let aDepartmentAux = this.cControlDepartment.value;
    if (aDepartmentAux.length > 0) {
      let indexDepartment = aDepartmentAux.findIndex(oEle => oEle.toString() === '0');
      if (indexDepartment != -1) {
        aDepartmentAux = '';
      }
    } else {
      aDepartmentAux = '';
    }
    this.IsLoadedWorkshops = true;
    let oDataSend = {
      masterUserId: this.companyUserModel.MasterUserId,
      companyId: this.cControlCompany.value,
      workshopId: null,
      isActived: this.cControlActive.value,
      geoLocationId: aDepartmentAux.toString()
    };
    this.cWorkshopService.MasterWorkshopGet(oDataSend).subscribe((oData) => {
      let oAux = [];
      oData.forEach(element => {
        let oRes = this.companyUserModel.OrganizationUsersByCompany.find(oEle => oEle.CompanyId.toLowerCase() === element.CompanyId.toLowerCase());
        if (oRes) {
          element.Address = this.br2nl(element.Address,true)
          element.c_horarios = this.onObtenerHorarios(element.MasterSchedule);
          oAux.push(element);
        }
      });
      this.dataSource = new MatTableDataSource<any>(oAux);
      this.dataSource.paginator = this.paginator;
    }, (oErr) => {

    }, () => {

      this.IsLoadedWorkshops = false;
    });
  }
  onEditWorkshop(element) {
    this.cRouter.navigateByUrl("/home/workshop/workshop-modify/" + element.WorkshopId + "/" + element.CompanyId + "/0")
  }
  onObtenerHorarios(aData) {
    let aAux = [];
    if (aData.length > 0) {
      aData.forEach(element => {
        element.IsOpened = element.IsOpened === '1' ? true : false;
        if (element.IsOpened) {
          let sDia = element.WeekDay;
          let sFechaInicio = element.StartTime;
          let sFechaFin = element.EndTime;
          let nDia = element.WeekDay;
          let sInde = aAux.findIndex(oEle => oEle.d_fechainicio == sFechaInicio && oEle.d_fechafin == sFechaFin)
          if (sInde === -1) {
            let oDataAux = {
              sLabelInicio: this.utility.fnStringToDate('1999-01-01T' + sFechaInicio),
              sLabelfin: this.utility.fnStringToDate('1999-01-01T' + sFechaFin),
              d_fechainicio: sFechaInicio,
              d_fechafin: sFechaFin,
              aDias: [{ sDia: this.obtenerDiaNombre(sDia), nDia: nDia }]
            };
            aAux.push(oDataAux)
          } else {
            aAux[sInde].aDias.push({ sDia: this.obtenerDiaNombre(sDia), nDia: nDia });
          }
        }

      });
      aAux.forEach(element => {
        element.cLabel = this.onObtenerRangoDias(element.aDias)
      })
    }

    return aAux;
  }

  obtenerDiaNombre(dFecha: number): string {
    let aDias = ['', 'Domingo', 'Lunes', 'Martes', 'Miércoles', 'jueves', 'Viernes', 'Sábado'];
    let dDia = aDias[dFecha];
    return dDia;

  }
  onObtenerRangoDias(aData) {
    let Candera = "";
    let min = 10;
    let max = -1;
    aData.forEach(element => {
      if (min > parseInt(element.nDia)) {
        min = parseInt(element.nDia)
      }
      if (max < parseInt(element.nDia)) {
        max = parseInt(element.nDia)
      }
    });
    if (min === max) {
      let sDiaMin = aData.find(oEle => oEle.nDia == '' + min).sDia;
      Candera = '' + sDiaMin.substring(0, 3)
    } else {
      let sDiaMin = aData.find(oEle => oEle.nDia == '' + min).sDia;
      let sDiaMax = aData.find(oEle => oEle.nDia == '' + max).sDia;
      Candera = "" + sDiaMin.substring(0, 3) + ' - ' + sDiaMax.substring(0, 3)

    }
    return Candera;

  }
  onOpenMail(oServicioMarca) {
    const dialogRef = this.cMatDialog.open(SendReportComponent, {
      data: oServicioMarca
    });
    dialogRef.afterClosed().subscribe(oResp => {
      if (oResp) {

      }
    });
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  onGoServices(element) {
    this.cRouter.navigateByUrl("/home/workshop/config-service/" + element.WorkshopId + "/" + element.CompanyId);
  }
  onGoConfigCalendar(element) {
    this.cRouter.navigateByUrl("/home/workshop/config-calendar/" + element.WorkshopId + "/" + element.CompanyId);
  }

  onGuardarWorkshop(oDataWorkshop) {

    this.IsLoadedWorkshops = true;
    let aSchedule = [];
    let scheduleId = null;
    oDataWorkshop.MasterSchedule.forEach(element => {
      scheduleId = element.ScheduleId;
      let oDataSendxml = {
        WeekDay: element.WeekDay,
        StartTime: element.StartTime,
        EndTime: element.EndTime,
        IsOpened: element.IsOpened
      };
      aSchedule.push(oDataSendxml)
    });
    let aChannels = [];
    oDataWorkshop.ChannelsByWorkshop.forEach(element => {
      aChannels.push(element.ChannelId);
    });
    let dataSend = {
      workshopId: oDataWorkshop.WorkshopId,
      geoLocationId: oDataWorkshop.GeoLocationId,
      telephone: oDataWorkshop.Telephone,
      address: oDataWorkshop.Address,
      latitude: 0.0,
      longitude: 0.0,
      name: oDataWorkshop.Name,
      friendlyName: oDataWorkshop.FriendlyName,
      isActived: !oDataWorkshop.IsActived,
      isDeleted: oDataWorkshop.IsDeleted,
      isPublic: oDataWorkshop.IsPublic,
      managerId: oDataWorkshop.ManagerId,
      source: "WEB",
      companyId: oDataWorkshop.CompanyId,
      masterUserId: oDataWorkshop.MasterUserId,
      externalId: oDataWorkshop.ExternalId,
      isOwner: oDataWorkshop.IsOwner,
      channels: aChannels.toString(),
      scheduleId: scheduleId,
      nameMS: "",
      detail: "",
      credentialId: this.companyUserModel.OrganizationUserId,
      detailSchedules: aSchedule
    }
    this.cWorkshopService.MasterWorkshopModify(dataSend).subscribe((oData) => {
      let sMessage = '';
      if (oData.codeResponse) {
        let sTrans = "BrandInitSavedOk";
        this.cTranslateService.get(sTrans).subscribe((text: string) => {
          sMessage = text;
        });
        this.cSnackbarService.openSnackBar(sMessage, '', 'Success');
        this.onLoadWorkshops();

      } else {
        let sTrans = "BrandInitSavedError";
        this.cTranslateService.get(sTrans).subscribe((text: string) => {
          sMessage = text;
        });
        this.cSnackbarService.openSnackBar(sMessage, '', 'Error');
      }
    }, (oErr) => {
      this.IsLoadedWorkshops = false;
    }, () => {
      this.IsLoadedWorkshops = false;
    });

  }
   /**
 * This function inverses text from PHP's nl2br() with default parameters.
 *
 * @param {string} str Input text
 * @param {boolean} replaceMode Use replace instead of insert
 * @return {string} Filtered text
 */
br2nl (str, replaceMode) {   	
  var replaceStr = (replaceMode) ? "\n" : '';
  // Includes <br>, <BR>, <br />, </br>
  return str.replace(/<\s*\/?br\s*[\/]?>/gi, replaceStr);
}
}
