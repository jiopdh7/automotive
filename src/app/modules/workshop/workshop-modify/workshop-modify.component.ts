import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkshopService } from 'src/app/services/workshop.service';
import { Validators, FormControl } from '@angular/forms';
import { MyErrorStateMatcher } from 'src/app/compartido/MyErrorStateMatcher';
import { CompanyService } from 'src/app/services/company.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { UtilityClass } from 'src/app/compartido/Utility';

@Component({
  selector: 'app-workshop-modify',
  templateUrl: './workshop-modify.component.html',
  styleUrls: ['./workshop-modify.component.css']
})
export class WorkshopModifyComponent implements OnInit {
  public oWorkshopSelected: any;

  utility = new UtilityClass();
  scheduleId = null;
  public oModuleSelected = JSON.parse(localStorage.getItem('ModuleSelected')) ? JSON.parse(localStorage.getItem('ModuleSelected')) : {};
  aMeridiano = [
    { "meridiano": "a.m" },
    { "meridiano": "p.m" }
  ];
  aHorario = [
    {
      "p_i_dia": 2,
      "c_descripcion": "Horario de Lunes",
      c_horainicio: new FormControl(),
      c_horafin: new FormControl(),
      c_estado: new FormControl(false, [])
    },
    {
      "p_i_dia": 3, "c_descripcion": "Horario de Martes",
      c_horainicio: new FormControl(),
      c_horafin: new FormControl(),
      c_estado: new FormControl(false, [])
    },
    {
      "p_i_dia": 4, "c_descripcion": "Horario de Miércoles",
      c_horainicio: new FormControl(),
      c_horafin: new FormControl(),
      c_estado: new FormControl(false, [])
    },
    {
      "p_i_dia": 5, "c_descripcion": "Horario de Jueves",
      c_horainicio: new FormControl(),
      c_horafin: new FormControl(),
      c_estado: new FormControl(false, [])
    },
    {
      "p_i_dia": 6, "c_descripcion": "Horario de Viernes",
      c_horainicio: new FormControl(),
      c_horafin: new FormControl(),
      c_estado: new FormControl(false, [])
    },
    {
      "p_i_dia": 7, "c_descripcion": "Horario de Sábado",
      c_horainicio: new FormControl(),
      c_horafin: new FormControl(),
      c_estado: new FormControl(false, [])
    },
    {
      "p_i_dia": 1, "c_descripcion": "Horario de Domingo",
      c_horainicio: new FormControl(),
      c_horafin: new FormControl(),
      c_estado: new FormControl(false, [])
    }
  ];
  GuardarDisabled: boolean = false;
  aMarcas: any[] = [];
  aRegion: any[] = [];
  aTipos: any[] = [];
  aJefes: any[] = [];
  public aCanales = [];
  cCompanie = new FormControl('', [
    Validators.required
  ]);
  c_tipo = new FormControl('', [
    Validators.required
  ]);
  cFriendlyName = new FormControl('', [
    Validators.required
  ]);
  cAddress = new FormControl('', [
    Validators.required
  ]);
  cTelephone = new FormControl('', [
    Validators.required
  ]);
  cManagerId = new FormControl('', [
    Validators.required
  ]);
  c_canal = new FormControl('', [
    Validators.required
  ]);
  c_urlLocation = new FormControl('');
  c_estado = new FormControl(true, [])
  matcher = new MyErrorStateMatcher();
  companymodelselected;
  public companyModel;
  public activeLang = 'es';
  private p_c_taller = '';
  public IsLoadedWorkshops = false;
  private WorkshopId;
  private CompanyId;
  public Acction = 0;
  private companyUserModel = JSON.parse(localStorage.getItem('CompanyUser'));
  constructor
    (
      private cTranslateService: TranslateService,
      private cActivatedRoute: ActivatedRoute,
      private cWorkshopService: WorkshopService,
      private cCompanyService: CompanyService,
      private cSnackbarService: SnackbarService,
      private cRouter: Router
    ) {
    this.cTranslateService.setDefaultLang('es');
    this.WorkshopId = this.cActivatedRoute.snapshot.params.workshopId;
    this.CompanyId = this.cActivatedRoute.snapshot.params.companyId;
    this.Acction = this.cActivatedRoute.snapshot.params.acction;
    this.Acction = parseInt(this.Acction.toString());
  }

  ngOnInit() {
    this.onLoadJefesTaller();
  }
  onRegresar(){
    var modulo =JSON.parse(localStorage.getItem("ModuleSelected"));    
    this.cRouter.navigate([modulo.ModulePath]);
  }
  onLoadJefesTaller() {
    let oDataSend = {
      masterUserId: this.companyUserModel.MasterUserId,
      organizationUserId: null,
      organizationRoleId: 3
    };
    this.cWorkshopService.OrganizationUserManagerGet(oDataSend).subscribe((oData) => {
      this.aJefes = oData;
    }, (oErr) => {

      this.IsLoadedWorkshops = false;
    }, () => {
      this.IsLoadedWorkshops = false;
      this.obtenerCompanias();
    });
  }
  onGoInit() {
    this.cRouter.navigateByUrl("/home/workshop");
  }
  obtenerCompanias() {
    let oDataSend = {
      masterUserId: this.companyUserModel.MasterUserId,
      companyId: this.oModuleSelected.CompanyId,
      isActived: null
    };
    this.cCompanyService.MasterCompanyGet(oDataSend).subscribe((oData) => {
      this.companyModel = oData;
    }, (oErr) => {

    }, () => {
      switch (this.Acction) {
        case 0:
          this.onLoadWorkshops();
          break;
        case 1:
          this.onChangeCompany(this.companyModel[0]);
          break;
      }
    });
  }
  onLoadWorkshops() {
    this.IsLoadedWorkshops = true;
    let oDataSend = {
      masterUserId: this.companyUserModel.MasterUserId,
      workshopId: this.WorkshopId,
      companyId: this.CompanyId,
      isActived: '',
      geoLocationId: ''
    };
    this.cWorkshopService.MasterWorkshopGet(oDataSend).subscribe((oData) => {
      this.oWorkshopSelected = oData[0];
    }, (oErr) => {

      this.IsLoadedWorkshops = false;
    }, () => {
      this.IsLoadedWorkshops = false;
      this.onSetWorkshop();
    });
  }
  onChangeCompany(oDataauxCaha) {
    // this.companyModel = oData;
    //this.onSetWorkshop();
    let oAuxData = [];
    this.companymodelselected = oDataauxCaha;
    oDataauxCaha.ChannelsByCompany.forEach(element => {
      let oAuxChannel = this.oWorkshopSelected.ChannelsByWorkshop.find(oEle => oEle.ChannelId.toString() === element.ChannelId.toString());
      if (oAuxChannel) {
        element.c_control = new FormControl(true);
        oAuxData.push(element)
      } else {
        element.c_control = new FormControl(false);

        oAuxData.push(element)
      }
    });
    this.aCanales = oAuxData;
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
      element.c_estado.setValue(true);
      this.onChangeScheduleDetail([element.c_horainicio, element.c_horafin], true, oDateStart, oDateEnd);
    });

  }
  onSetWorkshop() {

    this.cFriendlyName.setValue(this.OnPonerCadaPalabraMayuscula(this.oWorkshopSelected.FriendlyName));
    this.cAddress.setValue(this.OnPonerCadaPalabraMayuscula(this.br2nl(this.oWorkshopSelected.Address,true)))
    this.cTelephone.setValue(this.oWorkshopSelected.Telephone);
    this.cManagerId.setValue(this.oWorkshopSelected.ManagerId);
    this.cCompanie.setValue(this.oWorkshopSelected.CompanyId);
    this.c_estado.setValue(this.oWorkshopSelected.IsActived);
    this.c_urlLocation.setValue(this.oWorkshopSelected.Urllocation);
    let oDataauxCaha = this.companyModel.find(oEle => oEle.CompanyId.toString() === this.oWorkshopSelected.CompanyId.toString());
    this.companymodelselected = oDataauxCaha;
    let oAuxData = [];
    oDataauxCaha.ChannelsByCompany.forEach(element => {
      let oAuxChannel = this.oWorkshopSelected.ChannelsByWorkshop.find(oEle => oEle.ChannelId.toString() === element.ChannelId.toString());
      if (oAuxChannel) {
        element.c_control = new FormControl(true);
        oAuxData.push(element)
      } else {
        element.c_control = new FormControl(false);

        oAuxData.push(element)
      }
    });
    this.aCanales = oAuxData;
    this.oWorkshopSelected.MasterSchedule.forEach(element => {
      this.scheduleId = element.ScheduleId;
      let dHoraInicio = this.utility.fnStringToDate('1999-01-01T' + element.StartTime);
      let dHoraFin = this.utility.fnStringToDate('1999-01-01T' + element.EndTime);
      let sIndex = this.aHorario.findIndex(oEle => oEle.p_i_dia.toString() === element.WeekDay.toString());
      if (sIndex !== -1) {
        this.aHorario[sIndex].c_horainicio.setValue(dHoraInicio);
        this.aHorario[sIndex].c_horafin.setValue(dHoraFin);
        this.aHorario[sIndex].c_estado.setValue(true);
      }
    });

  }
  OnPonerCadaPalabraMayuscula(sPalabras: string): string {
    let aux = '';
    let aPalabra = sPalabras.split(" ");
    aPalabra.forEach(element => {
      element = element.toLowerCase();
      aux += " " + element.charAt(0).toUpperCase() + '' + element.substring(1);
    });
    return aux.trim();
  }
  onGetHorasFormat12H(c_fecha_busqueda) {
    let d_fecha_aux = c_fecha_busqueda.toLocaleString('es', { year: "numeric", month: "2-digit", day: "2-digit", hour: '2-digit', minute: '2-digit', second: "2-digit", hour12: false }).split(" ");
    let fecha = d_fecha_aux[0].split("/");
    let hora = d_fecha_aux[1];
    return hora;
  }
  onReturnText(sTrans): string {
    let sTextResponse = '';
    this.cTranslateService.get(sTrans).subscribe((text: string) => {
      sTextResponse = text;
    });
    return sTextResponse

  }
  onReturnValid(flet: boolean, sMessage: string) {
    if (!flet) {
      this.cSnackbarService.openSnackBar(this.onReturnText(sMessage), '', 'Error');
    }
    return !flet;
  }
  onValidateSchedule() {
    let flat = false;
    this.aHorario.forEach(element => {
      if (element.c_estado.value) {
        let oResult = element.c_horafin.value > element.c_horainicio.value;
        let flats = this.onReturnValid(oResult, "WorkshopEditHorarioError");
        if (flats) {
          flat = true;
        }
      }
    });
    return flat;
  }
  onValidarWorkshop() {
    if (this.onReturnValid(this.cFriendlyName.valid, "WorkshopEditFriendlyNameError")) {
      return false;
    };
    if (this.onReturnValid(this.cManagerId.valid, "WorkshopEditManagerError")) {
      return false;
    };
    if (this.onReturnValid(this.cAddress.valid, "WorkshopEditAdrressError")) {
      return false;
    };
    if (this.onReturnValid(this.cTelephone.valid, "WorkshopEditTelephoneError")) {
      return false;
    };
    if (this.onValidateSchedule()) {
      return false;
    };
    return true;
  }

  onGuardarWorkshop() {
    if (!this.onValidarWorkshop()) {
      return;
    }
    this.IsLoadedWorkshops = true;
    let aChannels = [];
    this.aCanales.forEach(element => {
      if (element.c_control.value) {
        aChannels.push(element.ChannelId);
      }
    });
    let aSchedule = [];
    this.aHorario.forEach(element => {
      if (element.c_estado.value) {
        let oDataSendxml = {
          WeekDay: element.p_i_dia,
          StartTime: element.c_estado.value ? this.onGetHorasFormat12H(element.c_horainicio.value) : '00:00:00',
          EndTime: element.c_estado.value ? this.onGetHorasFormat12H(element.c_horafin.value) : '00:00:00',
          IsOpened: element.c_estado.value
        };
        aSchedule.push(oDataSendxml)
      }
    });
    var url = this.c_urlLocation.value.replace("https://","");
    url = url.replace("http://","");
    let dataSend = {
      workshopId: this.oWorkshopSelected.WorkshopId,
      geoLocationId: this.oWorkshopSelected.GeoLocationId ? this.oWorkshopSelected.GeoLocationId : 1,
      telephone: this.cTelephone.value,
      address: this.nl2br(this.cAddress.value,true, false),
      latitude: this.oWorkshopSelected.Latitude,
      longitude: this.oWorkshopSelected.Longitude,
      name: this.oWorkshopSelected.Name,
      friendlyName: this.cFriendlyName.value,
      isActived: this.c_estado.value,
      isDeleted: this.oWorkshopSelected.IsDeleted,
      isPublic: this.oWorkshopSelected.IsPublic,
      managerId: this.cManagerId.value,
      source: this.oWorkshopSelected.Source,
      companyId: this.cCompanie.value,
      masterUserId: this.companyUserModel.MasterUserId,
      externalId: this.oWorkshopSelected.ExternalId,
      isOwner: this.oWorkshopSelected.IsOwner,
      channels: aChannels.toString(),
      scheduleId: this.scheduleId,
      nameMS: "",
      detail: "",
      credentialId: this.companyUserModel.OrganizationUserId,
      detailSchedules: aSchedule,
      urlLocation:url
    }
    this.cWorkshopService.MasterWorkshopModify(dataSend).subscribe((oData) => {
      let sMessage = '';
      if (oData.codeResponse) {
        let sTrans = "";
        switch (this.Acction) {
          case 0:
            sTrans = "WorkshopModifyOkActualizado";
            break;
          case 1:
            sTrans = "WorkshopModifyOkRegistro";
            break;
        }
        this.cTranslateService.get(sTrans).subscribe((text: string) => {
          sMessage = text;
        });
        this.cSnackbarService.openSnackBar(sMessage, '', 'Success');

      } else {
        let sTrans = "";
        switch (this.Acction) {
          case 0:
            sTrans = "WorkshopModifyErrorActualizado";
            break;
          case 1:
            sTrans = "WorkshopModifyErrorRegistro";
            break;
        }
        this.cTranslateService.get(sTrans).subscribe((text: string) => {
          sMessage = text;
        });
        this.cSnackbarService.openSnackBar(sMessage, '', 'Error');
      }
      this.onGoInit();
    }, (oErr) => {
      this.IsLoadedWorkshops = false;
    }, () => {
      this.IsLoadedWorkshops = false;
    });
  }
  /**
 * This function is same as PHP's nl2br() with default parameters.
 *
 * @param {string} str Input text
 * @param {boolean} replaceMode Use replace instead of insert
 * @param {boolean} isXhtml Use XHTML 
 * @return {string} Filtered text
 */
  nl2br(str, replaceMode, isXhtml) {
    var breakTag = (isXhtml) ? '<br />' : '<br>';
    var replaceStr = (replaceMode) ? '$1' + breakTag : '$1' + breakTag + '$2';
    return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, replaceStr);
  }
  /**
 * This function inverses text from PHP's nl2br() with default parameters.
 *
 * @param {string} str Input text
 * @param {boolean} replaceMode Use replace instead of insert
 * @return {string} Filtered text
 */
  br2nl (str, replaceMode) {   	
    var replaceStr = (replaceMode) ? "\n" : '';
    // Includes <br>, <BR>, <br />, </br>
    return str.replace(/<\s*\/?br\s*[\/]?>/gi, replaceStr);
  }
}
