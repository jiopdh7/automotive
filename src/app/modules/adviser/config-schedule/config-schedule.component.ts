import { Component, OnInit, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AdviserService } from 'src/app/services/adviser.service';
import { WorkshopService } from 'src/app/services/workshop.service';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog, MatPaginatorIntl, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { BaseRowDef } from '@angular/cdk/table';
import { UtilityClass } from 'src/app/compartido/Utility';

@Component({
  selector: 'app-config-schedule',
  templateUrl: './config-schedule.component.html',
  styleUrls: ['./config-schedule.component.css']
})
export class ConfigScheduleComponent implements OnInit {
  IsCompleteSave = false;
  utility = new UtilityClass();
  bPrevent = false;
  aHorario = [
    {
      "p_i_dia": 2,
      "c_descripcion": "Horario de Lunes",
      c_horainicio: new FormControl(),
      c_horafin: new FormControl(),
      c_estado: new FormControl(false, []),
      StartTime: new Date(),
      EndTime: new Date(),
      StartTimeBasic: new Date(),
      EndTimeBasic: new Date()
    },
    {
      "p_i_dia": 3, "c_descripcion": "Horario de Martes",
      c_horainicio: new FormControl(),
      c_horafin: new FormControl(),
      c_estado: new FormControl(false, []),
      StartTime: new Date(),
      EndTime: new Date(),
      StartTimeBasic: new Date(),
      EndTimeBasic: new Date()
    },
    {
      "p_i_dia": 4, "c_descripcion": "Horario de Miércoles",
      c_horainicio: new FormControl(),
      c_horafin: new FormControl(),
      c_estado: new FormControl(false, []),
      StartTime: new Date(),
      EndTime: new Date(),
      StartTimeBasic: new Date(),
      EndTimeBasic: new Date()
    },
    {
      "p_i_dia": 5, "c_descripcion": "Horario de Jueves",
      c_horainicio: new FormControl(),
      c_horafin: new FormControl(),
      c_estado: new FormControl(false, []),
      StartTime: new Date(),
      EndTime: new Date(),
      StartTimeBasic: new Date(),
      EndTimeBasic: new Date()
    },
    {
      "p_i_dia": 6, "c_descripcion": "Horario de Viernes",
      c_horainicio: new FormControl(),
      c_horafin: new FormControl(),
      c_estado: new FormControl(false, []),
      StartTime: new Date(),
      EndTime: new Date(),
      StartTimeBasic: new Date(),
      EndTimeBasic: new Date()
    },
    {
      "p_i_dia": 7, "c_descripcion": "Horario de Sábado",
      c_horainicio: new FormControl(),
      c_horafin: new FormControl(),
      c_estado: new FormControl(false, []),
      StartTime: new Date(),
      EndTime: new Date(),
      StartTimeBasic: new Date(),
      EndTimeBasic: new Date()
    },
    {
      "p_i_dia": 1, "c_descripcion": "Horario de Domingo",
      c_horainicio: new FormControl(),
      c_horafin: new FormControl(),
      c_estado: new FormControl(false, []),
      StartTime: new Date(),
      EndTime: new Date(),
      StartTimeBasic: new Date(),
      EndTimeBasic: new Date()
    }
  ];
  companyAdviserId;
  companyId;
  oWorkshopModel;
  cPhone = new FormControl();
  private companyUserModel = JSON.parse(localStorage.getItem('CompanyUser'));
  public oModuleSelected = JSON.parse(localStorage.getItem('ModuleSelected')) ? JSON.parse(localStorage.getItem('ModuleSelected')) : {};
  constructor(
    public dialogRef: MatDialogRef<ConfigScheduleComponent>,
    @Inject(MAT_DIALOG_DATA) public oAsesorModel: any,
    private cAdviserService: AdviserService,
    private cTranslateService: TranslateService,
    public cMatDialog: MatDialog,
    private cSnackbarService: SnackbarService,
    private cMatPaginatorIntl: MatPaginatorIntl,
    private cWorkshopService: WorkshopService
  ) {
    this.cTranslateService.setDefaultLang('es');
    this.cMatPaginatorIntl.itemsPerPageLabel = "Filas por página";
    this.cMatPaginatorIntl.nextPageLabel = "Página siguiente";
    this.cMatPaginatorIntl.previousPageLabel = "Página anterior";
  }

  ngOnInit() {
    this.cPhone.setValue(this.oAsesorModel.Phone);
    this.onGetWorkshop();
  }
  OnPonerCadaPalabraMayuscula(sPalabras: string): string {
    let aux = '';
    let aPalabra = sPalabras.split(" ");
    aPalabra.forEach(element => {
      element = element.toLowerCase();
      aux += " " + element.charAt(0).toUpperCase() + '' + element.substring(1);
    });
    return aux;

  }
  onchangeHorario(element) {
    element.c_horainicio.setValue(element.StartTime)
    element.c_horafin.setValue(element.EndTime)
  }
  onChangeScheduleDetail(cControllers: any[], isRepited, dFecha, dfechafin) {
    if (!isRepited) {
      dFecha = new Date();
      cControllers.forEach(element => {
        element.setValue(dFecha);
      });


    } else {
      cControllers[0].setValue(dFecha);
      cControllers[1].setValue(dfechafin);
    }
  }
  onMondayRepite() {
    let oDateStart = this.aHorario[0].c_horainicio.value;
    let oDateEnd = this.aHorario[0].c_horafin.value;
    this.aHorario.forEach(element => {
      if (!element.c_estado.disabled) {
        element.c_estado.setValue(true);
        this.onChangeScheduleDetail([element.c_horainicio, element.c_horafin], true, oDateStart, oDateEnd);
      }
    });

  }
  validateDateMax(element, event, tipo) {
    if (element.c_horainicio.value > element.c_horafin.value) {
      let sMessage = '';
      this.cTranslateService.get('BrandConfigServicesSaturdayStopError').subscribe((text: string) => {
        sMessage = text;
      });
      this.cSnackbarService.openSnackBar(sMessage, '', 'Error');
      if (tipo === 1) {
        let oDataAux = new Date(event.setMinutes(event.getMinutes() + 1));
        element.c_horafin.setValue(oDataAux)
      } else if (tipo === 2) {
        let oDataAux = new Date(element.c_horainicio.value.setMinutes(element.c_horainicio.value.getMinutes() + 1));
        element.c_horafin.setValue(oDataAux)
      }
    }
  }
  scheduleId = null;
  onGetWorkshop() {
    this.IsCompleteSave = true;
    let oDataSend = {
      masterUserId: this.companyUserModel.MasterUserId,
      companyId: this.companyId,
      workshopId: this.oAsesorModel.WorkshopId,
      isActived: '1',
      geoLocationId: ''
    };
    this.cWorkshopService.MasterWorkshopGet(oDataSend).subscribe((oData) => { 
      if (oData.length == 0) {
        this.dialogRef.close();
      } else {
        this.oWorkshopModel = oData[0];
        if (this.oWorkshopModel.MasterSchedule.length == 0) {
          this.dialogRef.close();
        } else {
          this.aHorario.forEach(element => {
            let oDataSchedule = this.oWorkshopModel.MasterSchedule.find(oEle => oEle.WeekDay.toString() === element.p_i_dia.toString());

            if (oDataSchedule) { 

              element.StartTime = this.utility.fnStringToDate('1999-01-02T' + oDataSchedule.StartTime);
              element.EndTime = this.utility.fnStringToDate('1999-01-02T' + oDataSchedule.EndTime); 
              element.StartTimeBasic = this.utility.fnStringToDate('1999-01-02T' + oDataSchedule.StartTime);
              element.EndTimeBasic = this.utility.fnStringToDate('1999-01-02T' + oDataSchedule.EndTime);          
              element.c_horainicio.setValue(element.StartTime);
              element.c_horafin.setValue(element.EndTime);
              element.c_estado.setValue(true);
            } else {
              element.c_estado.setValue(false);
              element.c_estado.disable();
            }

          }); 
          this.aHorario.forEach(element => {
            let oDataSchedule = this.oAsesorModel.SchedulesByCompanyAdviser.find(oEle => oEle.WeekDay.toString() === element.p_i_dia.toString());
            if (oDataSchedule) {
              this.scheduleId = oDataSchedule.ScheduleId;           
              element.c_horainicio.setValue( this.utility.fnStringToDate('1999-01-02T' + oDataSchedule.StartTime));
              element.c_horafin.setValue(this.utility.fnStringToDate('1999-01-02T' + oDataSchedule.EndTime));
              element.c_estado.setValue(oDataSchedule.IsOpened == '1' ? true:false);
            } 

          }); 

        }
      }

    }, (oErr) => {

    }, () => {

      this.IsCompleteSave = false;
    });
  }

  onGetHorasFormat12H(c_fecha_busqueda) {
    let d_fecha_aux = c_fecha_busqueda.toLocaleString('es', { year: "numeric", month: "2-digit", day: "2-digit", hour: '2-digit', minute: '2-digit', second: "2-digit", hour12: false }).split(" ");
    let fecha = d_fecha_aux[0].split("/");
    let hora = d_fecha_aux[1];
    return hora;
  }
  onSaveWorkshop() {
    let aSchedule = [];
    this.aHorario.forEach(element => {
      let oDataSendxml = {
        WeekDay: element.p_i_dia,
        StartTime: element.c_estado.value ? this.onGetHorasFormat12H(element.c_horainicio.value) : '00:00:00',
        EndTime: element.c_estado.value ? this.onGetHorasFormat12H(element.c_horafin.value) : '00:00:00',
        IsOpened: element.c_estado.value
      };
      aSchedule.push(oDataSendxml)
    });
    let oData = {
      companyAdviserId: this.oAsesorModel.CompanyAdviserId,
      firstName: this.oAsesorModel.FirstName,
      lastName: this.oAsesorModel.LastName,
      identicationDocument: this.oAsesorModel.IdenticationDocument,
      identicationTypeId: this.oAsesorModel.IdenticationTypeId,
      externalId: this.oAsesorModel.ExternalId,
      isActived: this.oAsesorModel.IsActived,
      isDeleted: this.oAsesorModel.IsDeleted,
      geolocationId: this.oAsesorModel.GeolocationId ? this.oAsesorModel.GeolocationId : 1496,
      phone: this.cPhone.value,
      address: this.oAsesorModel.Address,
      email: this.oAsesorModel.Email,
      scheduleId: this.scheduleId,
      nameMS: '',
      detail: '',
      credentialId: this.companyUserModel.OrganizationUserId,
      detailSchedules: aSchedule
    }
    this.cAdviserService.CompanyAdviserModify(oData).subscribe(oDatas => {
      this.dialogRef.close(oDatas);
    }, oErr => {

    },
      () => {

      }
    );
  }

}
