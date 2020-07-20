import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ModuleComponent } from '../../../module/module.component';
import { MyErrorStateMatcher } from 'src/app/compartido/MyErrorStateMatcher';
import { FormControl, Validators } from '@angular/forms';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { TranslateService } from '@ngx-translate/core';
import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-role-modify',
  templateUrl: './role-modify.component.html',
  styleUrls: ['./role-modify.component.css']
})
export class RoleModifyComponent implements OnInit {

  public oModuleSelected = JSON.parse(localStorage.getItem('ModuleSelected')) ? JSON.parse(localStorage.getItem('ModuleSelected')) : -1;
  private companyUserModel = JSON.parse(localStorage.getItem('CompanyUser'));
  IsLoadedServices = true;
  aModulos: any[] = [];
  matcher = new MyErrorStateMatcher();
  bPrevent: boolean = false;
  nombres = new FormControl('', [
    Validators.required,
    Validators.pattern(/^[ A-Za-zñÑäÄëËïÏöÖüÜáéíóúáéíóúÁÉÍÓÚÂÊÎÔÛâêîôûàèìòùÀÈÌÒÙ.-]+$/)
  ]);
  constructor(
    public dialogRef: MatDialogRef<RoleModifyComponent>,
    @Inject(MAT_DIALOG_DATA) public oRoleModel: any,
    private cConfigurationService: ConfigurationService,
    private cTranslateService: TranslateService,
    private cSnackbarService:SnackbarService
  ) { }

  ngOnInit() {
    if (this.oRoleModel.OrganizationRoleId) {
      this.onSetModulos();
    }
    this.onLoadModules();
  }
  onLoadModules() {
    this.IsLoadedServices = false;
    let oDataSend = {
      masterUserId: this.companyUserModel.MasterUserId, 
      credentialId: null
    }
    this.cConfigurationService.ModulesByCompanyUserGet(oDataSend).subscribe(oData => {
      oData.forEach(element => {
        let oDataAux: any = {
          Name: element.ModuleName,
          OrganizationModuleId: element.OrganizationModuleId,
          c_form: new FormControl()
        }; 
        let oDataModule = this.oRoleModel.Modules.find(oEle => oEle.OrganizationModuleId.toString() === element.OrganizationModuleId.toString());
        if (oDataModule) {
          oDataAux.c_form.setValue(true);
        } else {
          oDataAux.c_form.setValue(false);
        } 
        let disabled = (element.ModuleName.toLowerCase() === 'ajustes' || element.ModuleName.toLowerCase() === 'usuarios') ? true : false;
        if (disabled  && (this.oRoleModel.Name) && this.oRoleModel.Name.toLowerCase() === 'superadmin') {
          oDataAux.c_form.disable();
        }
        this.aModulos.push(oDataAux);
      });

    }, oErr => {
      this.IsLoadedServices = true;
    }, () => {
      this.IsLoadedServices = true;
    })
  }

  onSetModulos() {
    this.nombres.setValue(this.oRoleModel.Name);
  }
  onValidar() {
    let sMessage = '';
    if (!this.nombres.valid) {      
      this.cTranslateService.get('ConfigurationRoleModifyErrorNombre').subscribe((text: string) => {
        sMessage = text;
      });
      this.cSnackbarService.openSnackBar(sMessage, '', 'Error');
      return false;
    }
    let aux = this.aModulos.findIndex(oEle => oEle.c_form.value === true);
    if(aux == -1){
      this.cTranslateService.get('ConfigurationRoleModifyErrorModulos').subscribe((text: string) => {
        sMessage = text;
      });
      this.cSnackbarService.openSnackBar(sMessage, '', 'Error');
      return false;
    }
    return true;
  }
  onSabeRolsByModule() {
    if (!this.onValidar()) {
      return;
    }
    this.IsLoadedServices = false;
    let aData = {
      masterUserId: this.companyUserModel.MasterUserId,
      name: this.nombres.value,
      isActived: this.oRoleModel.IsActived==undefined?1:this.oRoleModel.IsActived,
      organizationRoleId: this.oRoleModel.OrganizationRoleId,
      modules: ''
    };
    let aux = [];
    this.aModulos.forEach(element => {
      if (element.c_form.value) {
        aux.push(element.OrganizationModuleId);
      }
    });
    aData.modules = aux.toString(); 
    this.cConfigurationService.CompanyRolModify(aData).subscribe(oData => {

      let sMessage = '';
      if (oData.codeResponse) {
        let sTrans = "";
        if(this.oRoleModel.OrganizationRoleId){
          sTrans = "ConfigurationRoleModifyOkActualizado";
        }else{
          sTrans = "ConfigurationRoleModifyOkRegistro";
        }
        this.cTranslateService.get(sTrans).subscribe((text: string) => {
          sMessage = text;
        });
        this.cSnackbarService.openSnackBar(sMessage, '', 'Success');
        this.dialogRef.close(oData.codeResponse);

      } else {
        let sTrans = "";
        if(this.oRoleModel.OrganizationRoleId){
          sTrans = "ConfigurationRoleModifyErrorActualizado";
        }else{
          sTrans = "ConfigurationRoleModifyErrorRegistro";
        }
        this.cTranslateService.get(sTrans).subscribe((text: string) => {
          sMessage = text;
        });
        this.cSnackbarService.openSnackBar(sMessage, '', 'Error');
      }
    }, oErr => {
      this.IsLoadedServices = true;
    }, () => {
      this.IsLoadedServices = true;
    })
  }

}
