import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog, MatPaginator, MatTableDataSource, MatOption } from '@angular/material';
import { UserService } from 'src/app/services/user.service';
import { ModifyComponent } from '../modify/modify.component';
import { DeleteComponent } from '../delete/delete.component';
import { CreateComponent } from '../create/create.component';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { CompanyUserService } from 'src/app/services/companyuser.service';
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
  public activeLang = 'es';
  public IsLoadedUser = false;
  public aCompanies: any[] = [];
  public aPicks: any[] = [];
  aRoles: any[] = [];
  public cControlCompany: FormControl = new FormControl('', [Validators.required]);
  public d = [true]
  public cControlActive: FormControl = new FormControl(this.d);
  RoleId = new FormControl('');
    /**
   * Declare Views to select
   */
  @ViewChild('allSelectedPick', { static: false }) private allSelectedPick: MatOption;
  @ViewChild('allSelectedRole', { static: false }) private allSelectedRole: MatOption;
  constructor(
    private cCompanyUserService: CompanyUserService,
    private cTranslateService: TranslateService,
    public cMatDialog: MatDialog,
    private cSnackbarService: SnackbarService,
    private cConfigurationService: ConfigurationService,
    private cCompanyService: CompanyService
  ) {
    this.cTranslateService.setDefaultLang(this.activeLang);
  }

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  displayedColumns: string[] = ['nombres', 'correo', 'documento', 'marca', 'rol', 'estado', 'acciones'];
  dataSource = new MatTableDataSource<any[]>([]);

  private companyUserModel = JSON.parse(localStorage.getItem('CompanyUser'));
  ngOnInit() {
    //this.onGetTableData();
    this.onLoadCompanies();
    this.onLlenarActive();
    this.getRoles();
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
  getRoles() {
    let oDataSend = {
      masterUserId: this.companyUserModel.MasterUserId,
      organizationRoleId: null
    }
    this.cConfigurationService.CompanyRoleGet(oDataSend)
      .subscribe(resp => {
        let aux = [];
        resp.forEach(element => {
          if (element.IsActived) {
            aux.push(element);
          }
        });
        this.aRoles = aux;
      });
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
  onSelectAllRole() {
    
    if (this.allSelectedRole.selected) {
      this.RoleId.patchValue([...this.aRoles.map(item => item.OrganizationRoleId), 0]);
    } else {
      this.RoleId.patchValue([]);
    }
  }
  onSelectPerOneRole() {
    
    if (this.allSelectedRole.selected) {
      this.allSelectedRole.deselect();
      return false;
    }
    if (this.RoleId.value.length == this.aRoles.length)
      this.allSelectedRole.select();
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
    this.IsLoadedUser = true;
    let oDataSendCompany = {
      masterUserId:  this.companyUserModel.MasterUserId,
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
      this.aCompanies = aCompañias;
      this.cControlCompany.setValue(companieDefect.toLocaleLowerCase());
      this.onGetTableData();
    }, (oError) => {
      this.IsLoadedUser = false;
    }, () => {
      this.IsLoadedUser = false;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  onGetTableData() {
    if (!this.onValidateFilter()) {
      return;
    }
    let aRoleAux = this.RoleId.value;
    if (aRoleAux.length > 0) {
      let indexRole = aRoleAux.findIndex(oEle => oEle.toString() === '0');
      if (indexRole != -1) {
        aRoleAux = '';
      }
    } else {
      aRoleAux = '';
    }
    let oDataSend = {
      masterUserId: this.companyUserModel.MasterUserId,
      organizationUserId: null,
      companyId:this.cControlCompany.value,
      organizationRoleId:aRoleAux.toString(),
      isActived:this.cControlActive.value
    }
    this.cCompanyUserService.OrganizationUserGet(oDataSend).subscribe(oContent => {
      //extraer la compañia
      var companies = JSON.parse(localStorage.getItem("CompanyUser")).OrganizationUsersByCompany;
      oContent.forEach(user => {
        user.OrganizationUsersByCompany.forEach(company => {
          companies.forEach(element => {
            if(company.CompanyId == element.CompanyId){
              user.valido = true;
            }
          });
        });
        
      });
      var usuarios=[];
      oContent.forEach(element => {
        if(element.valido){
          usuarios.push();
        }
      });
      //
      let oAux = [];
      oContent.forEach(element => {
        let oflat = false;
        element.OrganizationUsersByCompany.forEach(element => {
          let oRes = this.companyUserModel.OrganizationUsersByCompany.find(oEle => oEle.CompanyId.toLowerCase() === element.CompanyId.toLowerCase());
          if (oRes) {
            oflat = true;
          }
        });
        if (oflat) {
          oAux.push(element);
        }

      });
      this.dataSource = new MatTableDataSource<any[]>(oAux);
      this.dataSource.paginator = this.paginator;
    });
  }

  fnShowDialogModify(element) {
    const dialogRef = this.cMatDialog.open(ModifyComponent, {
      data: element
    });
    dialogRef.afterClosed().subscribe(oResp => {
      this.onGetTableData();
    });
  }

  fnShowDialogDelete(element) {
    const dialogRef = this.cMatDialog.open(DeleteComponent, {
      data: element
    });
    dialogRef.afterClosed().subscribe(oResp => {
      this.onGetTableData();
    });
  }

  fnShowDialogCreate() {
    const dialogRef = this.cMatDialog.open(CreateComponent, {
    });
    dialogRef.afterClosed().subscribe(oResp => {
      this.onGetTableData();
    });
  }

  onChangeStatus(element, event) {
    //Los datos se mantienes a excepcion de IsDeleted = 0 e IsActived =
    let oOrgnanizationux = [];
    element.OrganizationUsersByCompany.forEach(element => {
      oOrgnanizationux.push(element.CompanyId.toString());
    });
    let oDataSend = {
      organizationUserId: element.OrganizationUserId,
      companyId: oOrgnanizationux.toString(),
      masterUserId: this.companyUserModel.MasterUserId,
      firstName: element.FirstName,
      lastName: element.LastName,
      email: element.Email,
      identicationType: 2,
      identicationDocument: element.IdenticationDocument,
      organizationRoleId: element.OrganizationRoleId,
      dateExpired: element.DateExpired,
      isDeleted: false,
      isActived: event.checked
    };
    this.cCompanyUserService.OrganizationUserModify(oDataSend).subscribe(
      oRes => {
        let sMessage = '';
        if (oRes.codeResponse) {
          let sTrans = "UserUpdateSuccess";
          this.cTranslateService.get(sTrans).subscribe((text: string) => {
            sMessage = text;
          });
          this.cSnackbarService.openSnackBar(sMessage, '', 'Success');
        } else {
          let sTrans = "UserUpdateError";
          this.cTranslateService.get(sTrans).subscribe((text: string) => {
            sMessage = text;
          });
          this.cSnackbarService.openSnackBar(sMessage, '', 'Error');
        }
      }
    )
  }
  onGetCompanyName(element) {
    let oData = [];
    element.OrganizationUsersByCompany.forEach(element => {
      oData.push(element.Name);
    });
    let sData = oData.toString().replace(/,/gi, "/");
    return sData;
  }
}
