import { Component, OnInit, ViewChild } from '@angular/core';
import { CustomerService } from 'src/app/services/customer.service';
import { MatDialog, MatPaginator, MatTableDataSource, MatOption } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { ModifyComponent } from '../modify/modify.component';
import { CreateComponent } from '../create/create.component';
import { VehiclesComponent } from '../vehicles/vehicles.component';
import { CompanyService } from 'src/app/services/company.service';
import { FormControl, Validators } from '@angular/forms';
import { ConfigurationService } from 'src/app/services/configuration.service';

@Component({
  selector: 'app-init',
  templateUrl: './init.component.html',
  styleUrls: ['./init.component.css']
})
export class InitComponent implements OnInit {
  public oModuleSelected = JSON.parse(localStorage.getItem('ModuleSelected')) ? JSON.parse(localStorage.getItem('ModuleSelected')) : {};
  position = "below";
  table_length;
  public activeLang = 'es';
  IsLoadCustomer = false;
  IsLoadCustomer2 = false;
  public sCurrentCompanyUser = JSON.parse(localStorage.getItem('CompanyUser'));
  public aCompanies: any[] = [];
  public aDocumentTypes: any[] = [];
  public aPicks: any[] = [];
  public d = [true]
  public cControlDocumentType: FormControl = new FormControl(null);
  public cControlCompany: FormControl = new FormControl('', [Validators.required]);
  public cControlNombre: FormControl = new FormControl('');
  public cControlPlaca: FormControl = new FormControl('');
  public cControlDocumento: FormControl = new FormControl('');
  public cControlPick: FormControl = new FormControl(this.d);
  @ViewChild('allSelectedPick', { static: false }) private allSelectedPick: MatOption;
  constructor(
    public cCustomerService: CustomerService,
    private cTranslateService: TranslateService,
    public cMatDialog: MatDialog,
    private cCompanyService: CompanyService,
    private cSnackbarService: SnackbarService,
    private cConfigurationService: ConfigurationService
  ) {
    this.cTranslateService.setDefaultLang(this.activeLang);
  }

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  displayedColumns: string[] = ['nombres', 'tipodocumento', 'documento', 'telefono', 'autos', 'login', 'acciones'];
  dataSource;

  ngOnInit() {
    //this.onGetTableData();
    this.onLoadCompanies();
    this.onLoadDocumentType();
    this.onLlenarPick();
  }
  ngAfterViewInit() {
    //ir arriba en la pagina
    let top = document.getElementById('top');
    if (top !== null) {
      top.scrollIntoView();
      top = null;
    }
  }
  onLlenarPick(){
    this.aPicks.push({nombre:"No",value:false});
    this.aPicks.push({nombre:"Si",value:true});    
    
  }
  onSelectAllPick() {
    
    if (this.allSelectedPick.selected) {
      this.cControlPick.patchValue([...this.aPicks.map(item => item.value), 0]);
    } else {
      this.cControlPick.patchValue([]);
    }
  }
  onSelectPerOnePick() {
    
    if (this.allSelectedPick.selected) {
      this.allSelectedPick.deselect();
      return false;
    }
    if (this.cControlPick.value.length == this.aPicks.length)
      this.allSelectedPick.select();
  }
     /**
   * Función que lista las companias
   */
  onLoadCompanies() {
    this.IsLoadCustomer = true;
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
      this.onGetTableData();
      this.IsLoadCustomer = false;
    }, (oError) => {
      this.IsLoadCustomer = false;
    }, () => {      
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
   * Función que carga los tipos de documentos
   */
  onLoadDocumentType() {

    this.IsLoadCustomer = true;
    this.cConfigurationService.obtenerDocumentos().subscribe((aDocumentTypesResponse) => {
      this.aDocumentTypes = aDocumentTypesResponse;
    }, (oError) => {

      this.IsLoadCustomer = false;
    }, () => {

      this.IsLoadCustomer = false;
    })
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  onValidateFilter() {
    let flat = true;
    if (!this.cControlCompany.valid) {
      this.cControlCompany.markAsTouched();
      flat = false;
    }
    return flat;

  }
  onGetTableData() {    
    if (!this.onValidateFilter()) {
      return;
    }
    this.IsLoadCustomer2 = true;
    let oDataSend = {
      plateName: this.cControlPlaca.value,
      identicationDocument: this.cControlDocumento.value,
      credentialId: null,
      name:this.cControlNombre.value,
      docType:this.cControlDocumentType.value,
      companyId:this.cControlCompany.value,
      isOwner:null,
      customerId:null
    }
    this.table_length = 0
    this.cCustomerService.ObtenerClientes(oDataSend).subscribe(oContent => { 
      var aClientes=[];
      if(this.cControlPick.value.length==1){
        oContent.forEach(element => {
          if(this.cControlPick.value[0]){
            if(element.Login!=""){
              aClientes.push(element);
            }
          }else{
            if(element.Login==""){
              aClientes.push(element);
            }
          }          
        });
      }else{
        aClientes = oContent;
      }
      
      this.dataSource = new MatTableDataSource<any>(aClientes);
      this.dataSource.paginator = this.paginator;
      this.table_length = aClientes.length;
      this.IsLoadCustomer2 = false;
    },()=>{
      this.IsLoadCustomer2 = false;
    }, ()=> {
      
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
  fnShowDialogCreate() {
    const dialogRef = this.cMatDialog.open(CreateComponent, {

    });
    dialogRef.afterClosed().subscribe(oResp => {
      this.onGetTableData();
    });
  }

  fnShowDialogUpdate(element) {

    const dialogRef = this.cMatDialog.open(ModifyComponent, {
      data: element
    });
    dialogRef.afterClosed().subscribe(oResp => {
      this.onGetTableData();
    });
  }

  fnShowDialogVehiculos(element) {
    const dialogRef = this.cMatDialog.open(VehiclesComponent, {
      data: element
    });
    dialogRef.afterClosed().subscribe(oResp => {
    });
  }
}
