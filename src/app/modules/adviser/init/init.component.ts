import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog, MatPaginator, MatTableDataSource, MatOption } from '@angular/material';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { AdviserService } from 'src/app/services/adviser.service';
import { Router } from '@angular/router';
import { ConfigScheduleComponent } from '../config-schedule/config-schedule.component';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { CompanyService } from 'src/app/services/company.service';
import { FormControl, Validators } from '@angular/forms';
import { WorkshopService } from 'src/app/services/workshop.service';
import { UtilityClass } from 'src/app/compartido/Utility';

@Component({
  selector: 'app-init',
  templateUrl: './init.component.html',
  styleUrls: ['./init.component.css']
})
export class InitComponent implements OnInit {

  public oModuleSelected = JSON.parse(localStorage.getItem('ModuleSelected')) ? JSON.parse(localStorage.getItem('ModuleSelected')) : {};
  position = "below";
  utility = new UtilityClass();
  IsLoadAdviser = false;
  public activeLang = 'es'; 
  public aCompanies: any[] = [];
  public aDepartments: any[] = [];
  public aPicks: any[] = [];
  public aWorkshops: any[] = [];
  public cControlCompany: FormControl = new FormControl('', [Validators.required]);
  public d = [true]
  public cControlActive: FormControl = new FormControl(this.d);
  public cControlWorkshop: FormControl = new FormControl('');
    /**
   * Declare Views to select
   */
  @ViewChild('allSelectedPick', { static: false }) private allSelectedPick: MatOption;
  @ViewChild('allSelectedWorkshop', { static: false }) private allSelectedWorkshop: MatOption;
  constructor(
    private cAdviserService: AdviserService,
    private cTranslateService: TranslateService,
    public cMatDialog: MatDialog,
    private cSnackbarService: SnackbarService,
    private cRouter: Router,
    private cCompanyService: CompanyService,
    private cConfigurationService: ConfigurationService,
    private cWorkshopService: WorkshopService
  ) {
    this.cTranslateService.setDefaultLang(this.activeLang);
  }
  private companyUserModel = JSON.parse(localStorage.getItem('CompanyUser'));
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  displayedColumns: string[] = ['nombre', 'email', 'documento', 'taller', 'fecMod', 'acciones'];
  dataSource;
  ngOnInit() {
    //this.onGetTableData();
    this.onLlenarActive();
    this.onLoadCompanies();    
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
  onSelectAllWorkshops() {
    if (this.allSelectedWorkshop.selected) {
      this.cControlWorkshop.patchValue([...this.aWorkshops.map(item => item.WorkshopId), 0]);
    } else {
      this.cControlWorkshop.patchValue([]);
    }
  }
  onSelectPerOneWorkshops() {
    if (this.allSelectedWorkshop.selected) {
      this.allSelectedWorkshop.deselect();
      return false;
    }
    if (this.cControlWorkshop.value.length == this.aWorkshops.length)
      this.allSelectedWorkshop.select();
  }
  onLoadWorkshop() {
    this.IsLoadAdviser = true;
    let oDataSendWorkshop = {
      masterUserId:this.companyUserModel.MasterUserId,
      companyId: this.cControlCompany.value==""?null: this.cControlCompany.value,
      workshopId: null,
      isActived: '',
      geoLocationId:''
    }
    this.cWorkshopService.MasterWorkshopGet(oDataSendWorkshop).subscribe((aWorkshopsReponse) => {
      this.aWorkshops = aWorkshopsReponse;
    }, (oErr) => {
      this.IsLoadAdviser = false;

    }, () => {
      this.IsLoadAdviser = false;
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
   * Función que lista las companias
   */
  onLoadCompanies() {
    this.IsLoadAdviser = true;
    let oDataSendCompany = {
      masterUserId:this.companyUserModel.MasterUserId,
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
      this.onLoadWorkshop();
      this.onLoadFilters();
      this.onGetTableData();
      
    }, (oError) => {
      this.IsLoadAdviser = false;
    }, () => {
      this.IsLoadAdviser = false;
    });
  }
  
  onLoadFilters(){
    let oFilters = JSON.parse(localStorage.getItem("oFiltersAdviser"));

    if(oFilters !== null){
      this.cControlCompany.setValue(oFilters.CompanyId);
      this.cControlWorkshop.setValue(oFilters.WorkshopId);
      this.cControlActive.setValue(oFilters.IsActived)
    }

  }
  onGetTableData() {
    if (!this.onValidateFilter()) {
      return;
    }
    this.IsLoadAdviser = true;
    let aWorkshopAux = this.cControlWorkshop.value; 
    if (aWorkshopAux.length > 0) {
      let indexworkshop = aWorkshopAux.findIndex(oEle => oEle.toString() === '0');
      if (indexworkshop != -1) {
        aWorkshopAux = '';
      }
    } else {
      aWorkshopAux = '';
    }
    let oFilters = {
                    "CompanyId": this.cControlCompany.value, 
                    "WorkshopId": this.cControlWorkshop.value, 
                    "IsActived": this.cControlActive.value
                  };
    localStorage.setItem("oFiltersAdviser", JSON.stringify(oFilters));

    let oDataSend = {      
      masterUserId: this.companyUserModel.MasterUserId,
      companyId: this.cControlCompany.value,
      workshopId: aWorkshopAux.toString(),
      companyAdviserId: null,
      isActived: this.cControlActive.value,
    } 
    this.cAdviserService.ObtenerAsesores(oDataSend).subscribe(oContent => {  
      let oAux = [];
      oContent.forEach(element => {
        let oRes = this.companyUserModel.OrganizationUsersByCompany.find(oEle => oEle.CompanyId.toLowerCase() === element.CompanyId.toLowerCase());
        if (oRes) { 
          oAux.push(element);
        }
      });
      this.dataSource = new MatTableDataSource<any>(oAux);
      this.dataSource.paginator = this.paginator; 
    },()=>{
      this.IsLoadAdviser = false;
    }, ()=> {
      this.IsLoadAdviser = false;
    });
  }
  onSubmitDeleteAsesor(element) {
 
    let id = element.CompanyAdviserId;
    let send = {
      companyAdviserId: id,
      companyId: 1,
      isActived: !element.IsActived
    }
    //let p_i_usuariomod = this.oUsuario.p_i_usuarioinch;
    this.cAdviserService.CompanyAdviserModify(send).subscribe(
      oRes => {
        let sMessage = '';
        if (oRes.codeResponse) {
          this.onGetTableData();
          let sTrans = "AdviserUpdateSuccess";
          this.cTranslateService.get(sTrans).subscribe((text: string) => {
            sMessage = text;
          });
          this.cSnackbarService.openSnackBar(sMessage, '', 'Success');
        } else {
          let sTrans = "AdviserUpdateError";
          this.cTranslateService.get(sTrans).subscribe((text: string) => {
            sMessage = text;
          });
          this.cSnackbarService.openSnackBar(sMessage, '', 'Error');
        }
      }
    )
  }
  onEditarServicios(element){
    this.cAdviserService.asesorModel = element;
    this.cRouter.navigateByUrl('/home/adviser/config-services/' + element.CompanyId + '/' + element.CompanyAdviserId);
  }
  fnIrCalendario(element){
    this.cRouter.navigateByUrl("/home/adviser/config-calendar/" + element.CompanyId + "/" + element.CompanyAdviserId);

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
  onShowScheduleAdviser(element){
    const dialogRef = this.cMatDialog.open(ConfigScheduleComponent, { 
      data: element
    });
    dialogRef.afterClosed().subscribe(oResp => {
      if (oResp) { 
        this.onGetTableData();
      }
    });
  }
  onGetStringToDate(date: string) : Date{
    return this.utility.fnStringToDate(date);
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  onSaveWorkshop(oAsesorModel) {  
    oAsesorModel.SchedulesByCompanyAdviser.forEach(element => { 
      element.IsOpened = ( element.IsOpened === '1') ? true : false;
    });
    let oData = {
      companyAdviserId: oAsesorModel.CompanyAdviserId,
      firstName: oAsesorModel.FirstName,
      lastName: oAsesorModel.LastName,
      identicationDocument: oAsesorModel.IdenticationDocument,
      identicationTypeId: oAsesorModel.IdenticationTypeId,
      externalId: oAsesorModel.ExternalId,
      isActived: !oAsesorModel.IsActived,
      isDeleted: oAsesorModel.IsDeleted,
      geolocationId: oAsesorModel.GeolocationId ? oAsesorModel.GeolocationId : 1496,
      phone: oAsesorModel.Phone,
      address: oAsesorModel.Address,
      email: oAsesorModel.Email,
      scheduleId: oAsesorModel.ScheduleId,
      nameMS: '',
      detail: '',
      credentialId: this.companyUserModel.OrganizationUserId,
      detailSchedules: oAsesorModel.SchedulesByCompanyAdviser
    }
    this.cAdviserService.CompanyAdviserModify(oData).subscribe(oDatas => {
      this.onGetTableData();
    }, oErr => {

    },
      () => {

      }
    );
  }
  onSelectCompany(){
    this.onLoadWorkshop();
  }

}
