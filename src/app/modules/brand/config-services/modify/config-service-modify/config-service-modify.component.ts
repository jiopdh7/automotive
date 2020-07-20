import { Component, OnInit, Inject } from '@angular/core';
import { MyErrorStateMatcher } from 'src/app/compartido/MyErrorStateMatcher';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { BrandService } from 'src/app/services/brand.service';
import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-config-service-modify',
  templateUrl: './config-service-modify.component.html',
  styleUrls: ['./config-service-modify.component.css']
})
export class ConfigServiceModifyComponent implements OnInit {
  cFriendlyName = new FormControl('', [
    Validators.required
  ]);
  cDetail = new FormControl('', [
    Validators.required
  ]);
  cExternalId = new FormControl('', [
    Validators.required  
  ]);
  cBlockCount = new FormControl(0, [
    Validators.required,
    Validators.pattern(/^\d+$/)
  ]);
  
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
    Validators.required ,
    Validators.pattern(/^[-+]{0,1}?\d+$/)
  ]);
  cIsActived = new FormControl(false, []);

  aDiasSemana: any[] = [];
  aTipoCodigo = [];
  matcher = new MyErrorStateMatcher();
  bPrevent: boolean = false;
  sCalculo: string = '';
  oBloque: number = 0;
  c_llave: string = 'DURACION_BLOQUE';
  c_llave_tipo: string = 'CODIGOS_TIPO_SERVICIO';
  IsCompleteSave = false;
  constructor(public dialogRef: MatDialogRef<ConfigServiceModifyComponent>,
    @Inject(MAT_DIALOG_DATA) public oServicioMarcaModel: any,
    private cTranslateService: TranslateService,
    private cBrandService: BrandService,
    private cSnackbarService:SnackbarService
  ) {
    this.cTranslateService.setDefaultLang('es');

  }

  ngOnInit() { 
    this.onSetServiceBrand();
  }
  onSetServiceBrand() {
    this.cFriendlyName.setValue(this.oServicioMarcaModel.FriendlyName);
    this.cBlockCount.setValue(this.oServicioMarcaModel.BlockCount);
    this.cIsActived.setValue(this.oServicioMarcaModel.IsActived);
    this.cDetail.setValue(this.oServicioMarcaModel.Detail);
    this.cMondayStop.setValue(this.oServicioMarcaModel.MondayStop);
    this.cTuesdayStop.setValue(this.oServicioMarcaModel.TuesdayStop);
    this.cWednesdayStop.setValue(this.oServicioMarcaModel.WednesdayStop);
    this.cThursdayStop.setValue(this.oServicioMarcaModel.ThursdayStop);
    this.cFridayStop.setValue(this.oServicioMarcaModel.FridayStop);
    this.cSaturdayStop.setValue(this.oServicioMarcaModel.SaturdayStop);
    this.cSundayStop.setValue(this.oServicioMarcaModel.SundayStop);
    this.cExternalId.setValue(this.oServicioMarcaModel.ExternalId ? this.oServicioMarcaModel.ExternalId:'-');
    this.onCalcularBloque();
  }
  onGuardarServicioMarca() {
    this.IsCompleteSave = true;
    this.bPrevent = true;
    if(!this.onValidateBeforeSave()){
      this.bPrevent = false;
      this.IsCompleteSave = false;
      return;
    }
    let oDataSend = {
      serviceId: this.oServicioMarcaModel.ServiceId,
      brandId: this.oServicioMarcaModel.BrandId,
      companyId: this.oServicioMarcaModel.CompanyId,
      externalId: this.cExternalId.value,
      isOwner: this.oServicioMarcaModel.IsOwner,
      friendlyName: this.cFriendlyName.value,
      detail: this.cDetail.value,
      colorHex: this.oServicioMarcaModel.ColorHex,
      isActived: this.cIsActived.value,
      isDeleted: this.oServicioMarcaModel.IsDeleted,
      blockCount: this.cBlockCount.value,
      blockDuration: this.oServicioMarcaModel.BlockDuration,
      duration: (this.oServicioMarcaModel.BlockDuration * this.cBlockCount.value),
      mondayStop: this.cMondayStop.value,
      tuesdayStop: this.cTuesdayStop.value, 
      wednesdayStop: this.cWednesdayStop.value,
      thursdayStop: this.cThursdayStop.value,
      fridayStop: this.cFridayStop.value,
      saturdayStop: this.cSaturdayStop.value, 
      sundayStop: this.cSundayStop.value, 
    };
    this.cBrandService.ServicesByBrandByCompanyModify(oDataSend).subscribe((oData) => {
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
  onValidateBeforeSave(){ 
    let sMessage = ''; 
    if(!this.cFriendlyName.valid){
      this.cTranslateService.get('BrandConfigServicesFaltaFriendlyName').subscribe((text: string) => {
        sMessage = text; 
      });
      this.cSnackbarService.openSnackBar(sMessage, '', 'Error');
      return false;
    }
    if(!this.cBlockCount.valid){
      this.cTranslateService.get('BrandConfigServicesFaltaBlockDuration').subscribe((text: string) => {
        sMessage = text;
      });
      this.cSnackbarService.openSnackBar(sMessage, '', 'Error');
      return false;
    }
    if (this.cBlockCount.value <= 0) { 
      this.cTranslateService.get('BrandConfigServicesFaltaBlockDuration').subscribe((text: string) => {
        sMessage = text;
      });
      this.cSnackbarService.openSnackBar(sMessage, '', 'Error');
      return false;
    }
    
    if(!this.cDetail.valid){
      this.cTranslateService.get('BrandConfigServicesFaltaBlocDetalle').subscribe((text: string) => {
        sMessage = text;
      });
      this.cSnackbarService.openSnackBar(sMessage, '', 'Error');
      return false;
    } 
    if(!this.cExternalId.valid){
      this.cTranslateService.get('BrandConfigServicesExternalIdError').subscribe((text: string) => {
        sMessage = text;
      });
      this.cSnackbarService.openSnackBar(sMessage, '', 'Error');
      return false;
    }  
    if(!this.cMondayStop.valid){
      this.cTranslateService.get('BrandConfigServicesMondayStopError').subscribe((text: string) => {
        sMessage = text;
      });
      this.cSnackbarService.openSnackBar(sMessage, '', 'Error');
      return false;
    }
    if(!this.cMondayStop.valid){
      this.cTranslateService.get('BrandConfigServicesTuesdayStopError').subscribe((text: string) => {
        sMessage = text;
      });
      this.cSnackbarService.openSnackBar(sMessage, '', 'Error');
      return false;
    }
    if(!this.cWednesdayStop.valid){
      this.cTranslateService.get('BrandConfigServicesWednesdayStopError').subscribe((text: string) => {
        sMessage = text;
      });
      this.cSnackbarService.openSnackBar(sMessage, '', 'Error');
      return false;
    }
    
    if(!this.cThursdayStop.valid){
      this.cTranslateService.get('BrandConfigServicesThursdayStopError').subscribe((text: string) => {
        sMessage = text;
      });
      this.cSnackbarService.openSnackBar(sMessage, '', 'Error');
      return false;
    }
    if(!this.cFridayStop.valid){
      this.cTranslateService.get('BrandConfigServicesFridayStopError').subscribe((text: string) => {
        sMessage = text;
      });
      this.cSnackbarService.openSnackBar(sMessage, '', 'Error');
      return false;
    }
    if(!this.cSaturdayStop.valid){
      this.cTranslateService.get('BrandConfigServicesSaturdayStopError').subscribe((text: string) => {
        sMessage = text;
      });
      this.cSnackbarService.openSnackBar(sMessage, '', 'Error');
      return false;
    }
    if(!this.cSundayStop.valid){
      this.cTranslateService.get('BrandConfigServicesSundayStopError').subscribe((text: string) => {
        sMessage = text;
      });
      this.cSnackbarService.openSnackBar(sMessage, '', 'Error');
      return false;
    }
    return true;
  } 
  
  onCalcularBloque() {
    if (this.oServicioMarcaModel.BlockDuration !== 0) {
      let nBlo = isNaN(this.cBlockCount.value) ? 0 : this.cBlockCount.value;
      this.sCalculo = 'Duración: ' + (this.oServicioMarcaModel.BlockDuration * nBlo) + ' min.';
    } else {
      this.sCalculo = 'La duración no definida.';
    }
  }
  onFilterOnlyNumbers(event: any, cControlDay: FormControl){   
    let pattern = /[-+]{0,1}?\d+$/; 
    let valid = pattern.test(event.target.value); 
    if (!valid ) {  
      event.preventDefault();      
      cControlDay.setValue(event.target.value.replace(/[^0-9-+]/g,""));
      // invalid character, prevent input)
    }
  }
}
