import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatPaginator } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { BrandService } from 'src/app/services/brand.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { FormControl, Validators } from '@angular/forms';

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
    private cBrandService: BrandService,
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
      brandId: this.oServicioMarcaModel.BrandId,
      serviceId: this.oServicioMarcaModel.ServiceId,
      mileageId: null,
    }
    this.cBrandService.MileagesByCompanyGet(oDataSend).subscribe((oData) => { 
      let aMileagesAux = [
        {
          BrandId: this.oServicioMarcaModel.BrandId,
          CompanyId: this.oServicioMarcaModel.CompanyId,
          ExternalId: "",
          IsOwner: true,
          MileageId: null,
          Name: "",
          ServiceId: this.oServicioMarcaModel.ServiceId,
          Value: 0,
          cValue: new FormControl('',[
            Validators.required,
            Validators.pattern(/^\d+$/)]),
          cExternalId: new FormControl(''),
          IsDeleted: false,
          IsDeletedIcon: false
        }
      ]
      oData.forEach(element => {
        element.BrandId = this.oServicioMarcaModel.BrandId;
        element.CompanyId = this.oServicioMarcaModel.CompanyId;
        element.ServiceId = this.oServicioMarcaModel.ServiceId;
        element.cValue = new FormControl(element.Value ? element.Value : '',[
          Validators.required,
          Validators.pattern(/^\d+$/)]);
        element.IsOwner = (element.IsOwner == null) ? true :  element.IsOwner;
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
      BrandId: this.oServicioMarcaModel.BrandId,
      CompanyId: this.oServicioMarcaModel.CompanyId,
      ExternalId: "",
      IsOwner: true,
      MileageId: null,
      Name: "",
      ServiceId: this.oServicioMarcaModel.ServiceId,
      Value: 0,
      cValue: new FormControl('',[
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
  onSabeMileages() {
    this.IsCompleteSave = true;
    this.bPrevent = true;
    let oDataSend = {
      aDataSend: []
    }
    this.aMileages.forEach(element => {
      if (element.IsDeletedIcon) {
        let oAux = {
          mileageId: element.MileageId,
          brandId: element.BrandId,
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
    this.cBrandService.MileagesByCompanyModify(oDataSend).subscribe((oData) => {
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
  onFilterOnlyNumbers(event: any, cControlDay: FormControl){ 
    cControlDay.setValue(event.target.value.replace(/[^0-9]/g,""));
  }
}
