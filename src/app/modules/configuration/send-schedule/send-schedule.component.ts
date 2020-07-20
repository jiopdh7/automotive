import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { MatDialogRef } from '@angular/material';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { UtilityClass } from 'src/app/compartido/Utility';

@Component({
  selector: 'app-send-schedule',
  templateUrl: './send-schedule.component.html',
  styleUrls: ['./send-schedule.component.css']
})
export class SendScheduleComponent implements OnInit {

  utility = new UtilityClass();
  private companyUserModel = JSON.parse(localStorage.getItem('CompanyUser'));
  public oModuleSelected = JSON.parse(localStorage.getItem('ModuleSelected')) ? JSON.parse(localStorage.getItem('ModuleSelected')) : {};
  public IsCompleteSave = false;
  public bPrevent = false;
  private CONFIG_SEND_SCHEDULE = 'CONFIG_SEND_SCHEDULE';
  private sCurrentDay = this.utility.fnStringToDate('2020-01-01 00:00:00');
  public hora: FormControl = new FormControl('');
  public cControlDia: FormControl = new FormControl(0);

  public diasSemana=[];
  public alistaHoras=[];
  public aDiasA: any[] = [

    {
      c_descripcion: "Lunes", codigo: 2,
      c_control_hora: new FormControl(this.sCurrentDay),
      c_control_check: new FormControl(false, [])
    },
    {
      c_descripcion: "Martes", codigo: 3,
      c_control_hora: new FormControl(this.sCurrentDay),
      c_control_check: new FormControl(false, [])
    },
    {
      c_descripcion: "Miércoles", codigo: 4,
      c_control_hora: new FormControl(this.sCurrentDay),
      c_control_check: new FormControl(false, [])
    },
    {
      c_descripcion: "Jueves", codigo: 5,
      c_control_hora: new FormControl(this.sCurrentDay),
      c_control_check: new FormControl(false, [])
    },
    {
      c_descripcion: "Viernes", codigo: 6,
      c_control_hora: new FormControl(this.sCurrentDay),
      c_control_check: new FormControl(false, [])
    },
    {
      c_descripcion: "Sábado", codigo: 7,
      c_control_hora: new FormControl(this.sCurrentDay),
      c_control_check: new FormControl(false, [])
    },
    {
      c_descripcion: "Domingo", codigo: 1,
      c_control_hora: new FormControl(this.sCurrentDay),
      c_control_check: new FormControl(false, [])
    }];
  constructor(
    public dialogRef: MatDialogRef<SendScheduleComponent>,
    private cTranslateService: TranslateService,
    private cConfigurationService: ConfigurationService,
    private cSnackbarService: SnackbarService
  ) {

    this.cTranslateService.setDefaultLang('es');
  }

  ngOnInit() {
    this.onObtenerConfiguration();
    this.diasSemana=[
      {dia:"",valor:1},
      {dia:"",valor:2},
      {dia:"",valor:3},
      {dia:"",valor:4},
      {dia:"",valor:5},
      {dia:"",valor:6},
      {dia:"",valor:7}
    ];
    this.obtenerTexto('BrandConfigServicesMonday',0);
    this.obtenerTexto('BrandConfigServicesTuesday',1);
    this.obtenerTexto('BrandConfigServicesWednesday',2);
    this.obtenerTexto('BrandConfigServicesThursday',3);
    this.obtenerTexto('BrandConfigServicesFriday',4);
    this.obtenerTexto('BrandConfigServicesSaturday',5);
    this.obtenerTexto('BrandConfigServicesSunday',6);
  }
  obtenerTexto(texto,pos){ 
    this.cTranslateService.get(texto).subscribe((text: string) => {
      this.diasSemana[pos].dia = text;
    });
  }
  onDisabledControl(cControl: FormControl) {
    cControl.disable();
  }
  onObtenerConfiguration() {
    this.IsCompleteSave = true;
    let oDataSend = {
      companyId:null,
      jobIdentifier:"ADVISERMAILNOTIF",
      masterUserId: this.companyUserModel.MasterUserId,
      masterJobConfigId:null,
      isActive:1
    };
    this.cConfigurationService.obtenerConfiguracion(oDataSend).subscribe((oData) => { 
      oData.forEach(element => {
        element.diaSemana = this.diasSemana[element.WeekDay-1].dia;
        var a = element.ExecTime.split("T");
        element.hora = a[1];
      });
      this.alistaHoras = oData; 
    }, () => {
      this.IsCompleteSave = false;
    }, () => {
      this.IsCompleteSave = false;

    })
  }
  onCrearConfiguracion(){
    if(this.cControlDia.value == 0 || this.hora.value == ""){
      this.cSnackbarService.openSnackBar("Ingrese todos los datos", '', 'Error');     
      return;
    }
    let oDataSend = {
      companyId:null,
      jobIdentifier:"ADVISERMAILNOTIF",
      weekDay:this.cControlDia.value,
      execTime:this.fnConvertirDateToString(this.hora.value),
      masterUserId: this.companyUserModel.MasterUserId,
      credentialId:localStorage.getItem("CredentialId"),
      masterJobConfigId:null,
      isActive:1
    };
    this.cConfigurationService.onCrearConfiguracion(oDataSend).subscribe((oData) => { 
      this.onObtenerConfiguration();
      this.cSnackbarService.openSnackBar("Se creo con exito la configuración", '', 'Success');            
    }, () => {
      this.IsCompleteSave = false;
    }, () => {
      this.IsCompleteSave = false;

    })
  }
  // onObtenerConfiguration() {
  //   this.IsCompleteSave = true;
  //   let oDataSend = {
  //     masterUserId: this.companyUserModel.MasterUserId,
  //     name: this.CONFIG_SEND_SCHEDULE,
  //     property: ""
  //   };
  //   this.cConfigurationService.CompanyConfigurationGet(oDataSend).subscribe((oData) => { 
  //     oData.forEach(element => { 
  //       if (element.IsActived) {
  //         this.aDiasA.forEach(elementAux => {
  //           if(''+element.Property === ''+elementAux.codigo){ 
  //             let caux = new Date('2020-05-29T'+element.Value);  
  //             elementAux.c_control_hora.setValue(caux);
  //             elementAux.c_control_check.setValue(element.IsActived);
  //           }
  //         });
  //       }
  //     }); 
  //   }, () => {
  //     this.IsCompleteSave = false;
  //   }, () => {
  //     this.IsCompleteSave = false;

  //   })
  // }
  onSaveConfiguration() {
    this.IsCompleteSave = true;
    let oDataSend = {
      aDataSend: []

    };
    this.aDiasA.forEach(element => {
      let aData = {
        masterUserId: this.companyUserModel.MasterUserId,
        name: this.CONFIG_SEND_SCHEDULE,
        property: element.codigo,
        value: this.fnConvertDateToStringHour(element.c_control_hora.value),
        isActived: element.c_control_check.value,
        isDeleted: !element.c_control_check.value,
        credentialId: this.companyUserModel.OrganizationUserId
      };
      oDataSend.aDataSend.push(aData)
    });
    this.cConfigurationService.CompanyConfigurationModify(oDataSend).subscribe((oData) => {

      this.dialogRef.close();
    }, () => {
      this.IsCompleteSave = false;
    }, () => {
      this.IsCompleteSave = false;

    })
  }
  fnConvertirDateToString(d_fecha: Date) {
    let d_fecha_aux = d_fecha.toLocaleString('es', { year: "numeric", month: "2-digit", day: "2-digit", hour: '2-digit', minute: '2-digit', second: "2-digit", hour12: false }).split(" ");
    let fecha = d_fecha_aux[0].split("/");
    let hora = d_fecha_aux[1];
    return fecha[2] + '-' + fecha[1] + '-' + fecha[0] + 'T' + hora;
  }
  fnConvertDateToStringHour(d_fecha) {
    let d_fecha_full = d_fecha.toLocaleString('default', { hour:"2-digit",minute:"2-digit",second:"2-digit" }); 
    return d_fecha_full;
  }
  onEliminarConfig(horas){

    let oDataSend = {
      companyId:null,
      jobIdentifier:"ADVISERMAILNOTIF",
      weekDay:null,
      execTime:null,
      masterUserId: this.companyUserModel.MasterUserId,
      credentialId:localStorage.getItem("CredentialId"),
      masterJobConfigId:horas.MasterJobConfigId,
      isActive:0
    };
    this.cConfigurationService.onCrearConfiguracion(oDataSend).subscribe((oData) => { 
      this.onObtenerConfiguration();
      this.cSnackbarService.openSnackBar("Se eliminó con exito la configuración", '', 'Success');
    }, () => {
      this.IsCompleteSave = false;
    }, () => {
      this.IsCompleteSave = false;

    })
  }
}
