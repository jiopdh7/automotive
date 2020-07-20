import { Component, OnInit, Inject } from '@angular/core';
import { MyErrorStateMatcher } from 'src/app/compartido/MyErrorStateMatcher';
import { Validators, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { WorkshopService } from 'src/app/services/workshop.service';
import { MessageAlertComponent } from '../../../message-alert/message-alert.component';

@Component({
  selector: 'app-modify-services-stop',
  templateUrl: './modify-services-stop.component.html',
  styleUrls: ['./modify-services-stop.component.css']
})
export class ModifyServicesStopComponent implements OnInit {

  
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
  constructor(public dialogRef: MatDialogRef<ModifyServicesStopComponent>,
    @Inject(MAT_DIALOG_DATA) public oServicioMarcaModel: any,
    private cTranslateService: TranslateService,
    private cWorkshopService: WorkshopService,
    private cSnackbarService:SnackbarService,
    private cMatDialog: MatDialog
  ) {
    this.cTranslateService.setDefaultLang('es');

  }

  ngOnInit() {  
    this.onSetService();
  }
  onSetService() {
    this.cMondayStop.setValue(this.oServicioMarcaModel.MondayStop);
    this.cTuesdayStop.setValue(this.oServicioMarcaModel.TuesdayStop);
    this.cWednesdayStop.setValue(this.oServicioMarcaModel.WednesdayStop);
    this.cThursdayStop.setValue(this.oServicioMarcaModel.ThursdayStop);
    this.cFridayStop.setValue(this.oServicioMarcaModel.FridayStop);
    this.cSaturdayStop.setValue(this.oServicioMarcaModel.SaturdayStop);
    this.cSundayStop.setValue(this.oServicioMarcaModel.SundayStop);

  }
  OnGuardarServicio() {
    this.IsCompleteSave = true;
    this.bPrevent = true;
    if(!this.onValidateBeforeSave()){
      this.bPrevent = false;
      this.IsCompleteSave = false;
      return;
    }
    let oDataSend = {
      masterUserId: this.oServicioMarcaModel.MasterUserId,
      serviceId: this.oServicioMarcaModel.ServiceId, 
      companyId: this.oServicioMarcaModel.CompanyId, 
      isDeleted: this.oServicioMarcaModel.IsDeleted,
      workshopId: this.oServicioMarcaModel.WorkshopId,
      mondayStop: this.cMondayStop.value,
      tuesdayStop: this.cTuesdayStop.value,
      wednesdayStop: this.cWednesdayStop.value,
      thursdayStop: this.cThursdayStop.value,
      fridayStop: this.cFridayStop.value,
      saturdayStop: this.cSaturdayStop.value,
      sundayStop: this.cSundayStop.value,
      isActived:true
    }; 
    this.cWorkshopService.ServicesByWorkshopModify(oDataSend).subscribe((oData) => {
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
  onFilterOnlyNumbers(event: any, cControlDay: FormControl, dayStop: string){   
    let pattern = /[-+]{0,1}?\d+$/; 
    let valid = pattern.test(event.target.value); 
    if (!valid ) {  
      event.preventDefault();      
      cControlDay.setValue(event.target.value.replace(/[^0-9-+]/g,""));
      
      // invalid character, prevent input)
    }
    let oDataService = this.oServicioMarcaModel.ServicesByCompany.find(oEle => oEle.ServiceId.toString() ===this.oServicioMarcaModel.ServiceId.toString() );
      if(oDataService){
        let valueStop = oDataService[dayStop] ;
        if( parseInt(valueStop) == -1){

        }else if(parseInt(event.target.value) > parseInt(valueStop) ){
          cControlDay.setValue(valueStop);
          this.onMessageTopeMaximo(valueStop);
        }
      }
      if (parseInt(event.target.value) < -1) {
        cControlDay.setValue(-1);
      }
  } 
  onMessageTopeMaximo(numero){

    
    let sMessage = "";
    this.cTranslateService.get('ErrorAdviserTope').subscribe((text: string) => {
      sMessage = text;
    });
    sMessage = sMessage.replace(/numero/gi,numero);
    let cConfirmModel = {
      "tipo":"Advertencia",
      "mensajeCorto":sMessage
    };
    const dialogRef = this.cMatDialog.open(MessageAlertComponent, {
      data: cConfirmModel,
      disableClose:true
    });
    dialogRef.afterClosed().subscribe(oResp => {
       
    });
  }
}
