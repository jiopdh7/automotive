import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatPaginator, MatDialogRef } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { CompanyService } from 'src/app/services/company.service';

@Component({
  selector: 'app-config-mileages-modify',
  templateUrl: './config-mileages-modify.component.html',
  styleUrls: ['./config-mileages-modify.component.css']
})
export class ConfigMileagesModifyComponent implements OnInit {

  bPrevent = false;
  IsCompleteSave = false;
  aMileages = [];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  constructor(public dialogRef: MatDialogRef<ConfigMileagesModifyComponent>,
    @Inject(MAT_DIALOG_DATA) public oServicioMarcaModel: any,
    private cTranslateService: TranslateService,
    private cCompanyService: CompanyService,
    private cSnackbarService: SnackbarService
  ) {
    this.cTranslateService.setDefaultLang('es');

  }

  ngOnInit() {
    this.onLoadMileagesByCompany();
  }
  onEliminarKilometraje(e) {

  }
  onLoadMileagesByCompany() {
    this.IsCompleteSave = true;
    let oDataSend = {
      companyId: this.oServicioMarcaModel.CompanyId,
      masterUserId: this.oServicioMarcaModel.MasterUserId,
      serviceId: this.oServicioMarcaModel.ServiceId,
      mileageId: null,
    }
    this.cCompanyService.MileagesByCompanyGet(oDataSend).subscribe((oData) => {
      let aMileagesAux = [
        {
          MasterUserId: this.oServicioMarcaModel.MasterUserId,
          CompanyId: this.oServicioMarcaModel.CompanyId,
          ExternalId: "",
          IsOwner: true,
          MileageId: null,
          Name: "",
          ServiceId: this.oServicioMarcaModel.ServiceId,
          Value: 0,
          cValue: new FormControl('', [
            Validators.required,
            Validators.pattern(/^\d+$/)]),
          cExternalId: new FormControl(''),
          IsDeleted: false,
          IsDeletedIcon: false
        }
      ];
      oData.forEach(element => {
        element.MasterUserId = this.oServicioMarcaModel.MasterUserId;
        element.CompanyId = this.oServicioMarcaModel.CompanyId;
        element.ServiceId = this.oServicioMarcaModel.ServiceId;
        element.cValue = new FormControl(element.Value ? element.Value : '', [
          Validators.required,
          Validators.pattern(/^\d+$/)]);
        element.IsOwner = (element.IsOwner == null) ? true : element.IsOwner;
        element.cExternalId = new FormControl(element.ExternalId ? element.ExternalId : '');
        element.IsDeletedIcon = true;
        element.IsDeleted = false;
        aMileagesAux.push(element);
      });
      this.aMileages = aMileagesAux;
    }, (oErr) => {
      this.IsCompleteSave = false;
    }, () => {
      this.IsCompleteSave = false;
    });
  }
  onAddMileage() {
    this.aMileages.forEach(element => {
      element.IsDeletedIcon = true;
    });
    this.aMileages.unshift({
      MasterUserId: this.oServicioMarcaModel.MasterUserId,
      CompanyId: this.oServicioMarcaModel.CompanyId,
      ExternalId: "",
      IsOwner: true,
      MileageId: null,
      Name: "",
      ServiceId: this.oServicioMarcaModel.ServiceId,
      Value: 0,
      cValue: new FormControl('', [
        Validators.required,
        Validators.pattern(/^\d+$/)]),
      cExternalId: new FormControl(''),
      IsDeleted: false,
      IsDeletedIcon: false
    });
  }
  onDimissMileage(oMileage) {
    oMileage.IsDeleted = true;
  }
  onValidateKilometrajes() {
    let flat = true;
    let count = 0;
    this.aMileages.forEach(element => {
      if (element.IsDeletedIcon) {
        count++;
      }
    });
    if (count <= 0) {
      let sMessage = '';
      let sTrans = "CompanyMileageModifyErrorRegistro";
        this.cTranslateService.get(sTrans).subscribe((text: string) => {
          sMessage = text;
        });
        this.cSnackbarService.openSnackBar(sMessage, '', 'Error');
      flat = false;
    }
    this.aMileages.forEach(element => {
      if (element.IsDeletedIcon) {
        if (element.cValue.value.length <= 0) {
          flat = false;
        }
      }
    }); 
    return flat;
  }
  onSabeMileages() {
    if (!this.onValidateKilometrajes()) {
      return;
    }
    this.IsCompleteSave = true;
    this.bPrevent = true;
    let oDataSend = {
      aDataSend: []
    }
    this.aMileages.forEach(element => {
      if (element.IsDeletedIcon) {
        let oAux = {
          mileageId: element.MileageId,
          masterUserId: element.MasterUserId,
          serviceId: element.ServiceId,
          companyId: element.CompanyId,
          value: element.cValue.value,
          externalId: element.cExternalId.value,
          isOwner: element.IsOwner,
          isDeleted: element.IsDeleted
        };
        oDataSend.aDataSend.push(oAux);
      }
    });
    this.cCompanyService.MileagesByCompanyModify(oDataSend).subscribe((oData) => {
      let sMessage = '';
      if (oData.codeResponse) {
        let sTrans = "BrandConfigMileageOk";
        this.cTranslateService.get(sTrans).subscribe((text: string) => {
          sMessage = text;
        });
        this.cSnackbarService.openSnackBar(sMessage, '', 'Success');
        this.dialogRef.close(oData.codeResponse);

      } else {
        let sTrans = "BrandConfigMileageError";
        this.cTranslateService.get(sTrans).subscribe((text: string) => {
          sMessage = text;
        });
        this.cSnackbarService.openSnackBar(sMessage, '', 'Error');
      }

    }, (oErr) => {
      this.IsCompleteSave = false;
      this.bPrevent = false;

    }, () => {
      this.IsCompleteSave = false;
      this.bPrevent = false;

    });
  }
  onFilterOnlyNumbers(event: any, cControlDay: FormControl) {
    cControlDay.setValue(event.target.value.replace(/[^0-9]/g, ""));
  }

}
