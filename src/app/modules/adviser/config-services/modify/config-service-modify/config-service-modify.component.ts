import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { AdviserService } from 'src/app/services/adviser.service';
import { MyErrorStateMatcher } from 'src/app/compartido/MyErrorStateMatcher';
@Component({
  selector: 'app-config-service-modify',
  templateUrl: './config-service-modify.component.html',
  styleUrls: ['./config-service-modify.component.css']
})
export class ConfigServiceModifyComponent implements OnInit {
  cMondayStop = new FormControl(0, [
    Validators.required,
    Validators.pattern(/^[-+]{0,1}?\d+$/)
  ]);
  cTuesdayStop = new FormControl(0, [
    Validators.required,
    Validators.pattern(/^[-+]{0,1}?\d+$/)
  ]);
  cWednesdayStop = new FormControl(0, [
    Validators.required,
    Validators.pattern(/^[-+]{0,1}?\d+$/)
  ]);
  cThursdayStop = new FormControl(0, [
    Validators.required,
    Validators.pattern(/^[-+]{0,1}?\d+$/)
  ]);
  cFridayStop = new FormControl(0, [
    Validators.required,
    Validators.pattern(/^[-+]{0,1}?\d+$/)
  ]);
  cSaturdayStop = new FormControl(0, [
    Validators.required,
    Validators.pattern(/^[-+]{0,1}?\d+$/)
  ]);
  cSundayStop = new FormControl(0, [
    Validators.required,
    Validators.pattern(/^[-+]{0,1}?\d+$/)
  ]);
  bPrevent: boolean = false;
  IsCompleteSave = false;
  matcher = new MyErrorStateMatcher();
  constructor(
    public dialogRef: MatDialogRef<ConfigServiceModifyComponent>,
    @Inject(MAT_DIALOG_DATA) public oServicioMarcaModel: any,
    private cTranslateService: TranslateService,
    private cSnackbarService: SnackbarService,
    private cAdviserService: AdviserService,
  ) {
    this.cTranslateService.setDefaultLang('es');
  }

  ngOnInit() {
    this.onSetServiceAdviser();
  }
  onSetServiceAdviser() {
    this.cMondayStop.setValue(this.oServicioMarcaModel.MondayStop);
    this.cTuesdayStop.setValue(this.oServicioMarcaModel.TuesdayStop);
    this.cWednesdayStop.setValue(this.oServicioMarcaModel.WednesdayStop);
    this.cThursdayStop.setValue(this.oServicioMarcaModel.ThursdayStop);
    this.cFridayStop.setValue(this.oServicioMarcaModel.FridayStop);
    this.cSaturdayStop.setValue(this.oServicioMarcaModel.SaturdayStop);
    this.cSundayStop.setValue(this.oServicioMarcaModel.SundayStop);

  }
  onGuardarServicioMarca() {
    this.IsCompleteSave = true;
    this.bPrevent = true;
    if (!this.onValidateBeforeSave()) {
      this.bPrevent = false;
      this.IsCompleteSave = false;
      return;
    }
    let oDataSend = {
      serviceId: this.oServicioMarcaModel.ServiceId,
      masterUserId: this.oServicioMarcaModel.MasterUserId,
      companyId: this.oServicioMarcaModel.CompanyId,
      companyAdviserId: this.oServicioMarcaModel.CompanyAdviserId,
      isDeleted: this.oServicioMarcaModel.IsDeleted,
      workshopId: this.oServicioMarcaModel.WorkshopId,
      mondayStop: this.cMondayStop.value,
      tuesdayStop: this.cTuesdayStop.value,
      wednesdayStop: this.cWednesdayStop.value,
      thursdayStop: this.cThursdayStop.value,
      fridayStop: this.cFridayStop.value,
      saturdayStop: this.cSaturdayStop.value,
      sundayStop: this.cSundayStop.value,
      isActived: true
    };
    this.cAdviserService.CompanyAdviserServiceModify(oDataSend).subscribe((oData) => {
      let sMessage = '';
      if (oData.codeResponse) {
        let sTrans = "BrandConfigServicesSavedOk";
        this.cTranslateService.get(sTrans).subscribe((text: string) => {
          sMessage = text;
        });
        this.cSnackbarService.openSnackBar(sMessage, '', 'Success');
        this.dialogRef.close(oData.codeResponse);

      } else {
        let sTrans = "BrandConfigServicesSavedError";
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
  onValidateBeforeSave() {
    let sMessage = '';
    if (!this.cMondayStop.valid) {
      this.cTranslateService.get('BrandConfigServicesMondayStopError').subscribe((text: string) => {
        sMessage = text;
      });
      this.cSnackbarService.openSnackBar(sMessage, '', 'Error');
      return false;
    }
    if (!this.cMondayStop.valid) {
      this.cTranslateService.get('BrandConfigServicesTuesdayStopError').subscribe((text: string) => {
        sMessage = text;
      });
      this.cSnackbarService.openSnackBar(sMessage, '', 'Error');
      return false;
    }
    if (!this.cWednesdayStop.valid) {
      this.cTranslateService.get('BrandConfigServicesWednesdayStopError').subscribe((text: string) => {
        sMessage = text;
      });
      this.cSnackbarService.openSnackBar(sMessage, '', 'Error');
      return false;
    }

    if (!this.cThursdayStop.valid) {
      this.cTranslateService.get('BrandConfigServicesThursdayStopError').subscribe((text: string) => {
        sMessage = text;
      });
      this.cSnackbarService.openSnackBar(sMessage, '', 'Error');
      return false;
    }
    if (!this.cFridayStop.valid) {
      this.cTranslateService.get('BrandConfigServicesFridayStopError').subscribe((text: string) => {
        sMessage = text;
      });
      this.cSnackbarService.openSnackBar(sMessage, '', 'Error');
      return false;
    }
    if (!this.cSaturdayStop.valid) {
      this.cTranslateService.get('BrandConfigServicesSaturdayStopError').subscribe((text: string) => {
        sMessage = text;
      });
      this.cSnackbarService.openSnackBar(sMessage, '', 'Error');
      return false;
    }
    if (!this.cSundayStop.valid) {
      this.cTranslateService.get('BrandConfigServicesSundayStopError').subscribe((text: string) => {
        sMessage = text;
      });
      this.cSnackbarService.openSnackBar(sMessage, '', 'Error');
      return false;
    }
    return true;
  }

  onFilterOnlyNumbers(event: any, cControlDay: FormControl, dayStop: string) {
    let pattern = /[-+]{0,1}?\d+$/;
    let valid = pattern.test(event.target.value);
    if (!valid) {
      event.preventDefault();
      cControlDay.setValue(event.target.value.replace(/[^0-9-+]/g, ""));

      // invalid character, prevent input)
    }
    let oDataService = this.oServicioMarcaModel.ServicesByWorkshop.find(oEle => oEle.ServiceId.toString() === this.oServicioMarcaModel.ServiceId.toString());
    if (oDataService) {
      let valueStop = oDataService[dayStop];
      if( parseInt(valueStop) == -1){

      }else if (parseInt(event.target.value) > parseInt(valueStop)) {
        cControlDay.setValue(valueStop);
      }
    }
    if (parseInt(event.target.value) < -1) {
      cControlDay.setValue(-1);
    }
  }

}
