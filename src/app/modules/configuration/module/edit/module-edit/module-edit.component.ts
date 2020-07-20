import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { FormControl, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-module-edit',
  templateUrl: './module-edit.component.html',
  styleUrls: ['./module-edit.component.css']
})
export class ModuleEditComponent implements OnInit {

  private companyUserModel = JSON.parse(localStorage.getItem('CompanyUser'));
  cModuleName = new FormControl('');
  cModuleDetail = new FormControl('', [
    Validators.required
  ]);
  constructor(
    public dialogRef: MatDialogRef<ModuleEditComponent>,
    @Inject(MAT_DIALOG_DATA) public oCompanyModule: any,
    private cConfigurationService: ConfigurationService,
    private cSnackbarService: SnackbarService,
    private cTranslateService: TranslateService
  ) { }

  ngOnInit() {
    this.onSetModulo();
  }

  onSetModulo() {
    this.cModuleName.setValue(this.oCompanyModule.ModuleName);
    this.cModuleDetail.setValue(this.oCompanyModule.ModuleDetail);
  }

  onSubmitUpdateDetalleModulo() {
    if (!this.cModuleDetail.valid) {
      return;
    }
    let oDataSend = {
      "organizationModuleId": this.oCompanyModule.OrganizationModuleId,
      "masterUserId": this.companyUserModel.MasterUserId,
      "name": this.oCompanyModule.ModuleName,
      "detail": this.cModuleDetail.value,
      "path": this.oCompanyModule.ModulePath,
      "icon": this.oCompanyModule.ModuleIcon
    }
    this.cConfigurationService.CompanyModuleModify(oDataSend).subscribe((oData) => {
      let sMessage = '';
      if (oData.codeResponse) {
        this.cTranslateService.get('ConfigurationModuleEditOk').subscribe((text: string) => {
          sMessage = text;
        });
        this.cSnackbarService.openSnackBar(sMessage, '', 'Success');
        this.dialogRef.close(oData.codeResponse);

      } else {
        this.cTranslateService.get('ConfigurationModuleEditError').subscribe((text: string) => {
          sMessage = text;
        });
        this.cSnackbarService.openSnackBar(sMessage, '', 'Error');        
      }
    });
  }
}
