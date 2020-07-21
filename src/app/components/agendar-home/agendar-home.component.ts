import { MediaMatcher } from '@angular/cdk/layout';
import { Component, OnInit, ChangeDetectorRef, OnDestroy, AfterContentChecked, AfterViewChecked, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AgendarGeneralService } from 'src/app/services/agendar-general.service';
import { TranslateService } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { CompanyService } from 'src/app/services/company.service';
import { SharedService } from 'src/app/services/shared.service';
import { WorkshopService } from 'src/app/services/workshop.service';
import { ConfigService } from 'src/app/services/config.service';


@Component({
  selector: 'app-agendar-home',
  templateUrl: './agendar-home.component.html',
  styleUrls: ['./agendar-home.component.css']
})
export class AgendarHomeComponent implements OnInit, OnDestroy, AfterViewInit {
  public locale = 'es';
  public isLoad : boolean = true;
  public formatOptions: any;
  public formatViews: any;
  private PlateName: string = localStorage.getItem("PlateName"); 
  public disabledCombo = false;
  public mobileQuery: MediaQueryList;
  public CompanyId = localStorage.getItem("CompanyId");
  public MasterUserId = localStorage.getItem("MasterUserId");
  public habilitarPickUpDelivery = false;
  public bMandatoryKm = true;
  p_i_marca
  constructor(
    private translate: TranslateService,
    private cRouter: Router,
    private cMatSnackBar: MatSnackBar,
    private cCompaniaService: CompanyService,
    private cWorkshop: WorkshopService,
    private cSharedService: SharedService,
    public cAgendarGeneralService: AgendarGeneralService,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    public cConfigService: ConfigService,
  ) {
    this.translate.setDefaultLang(this.locale);
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    //this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    this.p_i_marca = cConfigService.onObtenerMarcaBase();
  }
  private _mobileQueryListener: () => void;

  ngOnInit() {
    var user = JSON.parse(localStorage.getItem("UserData"));
    if(!user) this.onGoHome();//Add by security
    else user = JSON.parse(localStorage.getItem("UserData"))[0];//Add by security
    
    this.cAgendarGeneralService.oAgenda.isPickUpAndDelivery.setValue(this.cAgendarGeneralService.oAgenda.isPickUpAndDelivery.value);
    this.cAgendarGeneralService.oAgenda.c_tipo_servicio.setValue(this.cAgendarGeneralService.oAgenda.c_tipo_servicio.value);
    this.cAgendarGeneralService.oAgenda.c_observaciones.setValue(this.cAgendarGeneralService.oAgenda.c_observaciones.value);
    this.cAgendarGeneralService.oAgenda.c_kilometraje.setValue(this.cAgendarGeneralService.oAgenda.c_kilometraje.value);
    //this.cAgendarGeneralService.oAgenda.c_kilometraje.setValidators([Validators.required, Validators.pattern(/^[0-9]*$/)]);
    this.cAgendarGeneralService.oAgenda.c_region.setValue(this.cAgendarGeneralService.oAgenda.c_region.value);
    this.formatOptions = { day: 'numeric', month: 'long', weekday: 'narrow', year: 'numeric' };
    this.formatViews = { day: true, month: true, year: true };
    //this.onMatchMobileQuery();
    this.onGetMasterCompany();
    localStorage.getItem("habilitarPickUp") == 'X' ? this.habilitarPickUpDelivery = true : this.habilitarPickUpDelivery = false;
  }
  modificarFont(){
    switch (this.p_i_marca) {
      case 1://subaru
        var list, index;
        list = document.getElementsByClassName("estiloGeneral");
        for (index = 0; index < list.length; ++index) {
            list[index].style.fontFamily = "AvenirNext-Regular"
        }
        break;
        break;
      case 2://dfsk
        var list, index;
        list = document.getElementsByClassName("estiloGeneral");
        for (index = 0; index < list.length; ++index) {
            list[index].style.fontFamily = "HelveticaLTStd"
        }
        break;
      case 3://bmw
        var list, index;
        list = document.getElementsByClassName("estiloGeneral");
        for (index = 0; index < list.length; ++index) {
            list[index].style.fontFamily = "AvenirNextLTPro"
        }
        break;
    }
  }
  //Obtener datos de compañia
  onGetMasterCompany() {
    //Activa la barra de carga
    this.cAgendarGeneralService.isGlobalLoading = true;
    //Objeto JSON para enviar el request
    var oData = {
      masterUserId: this.MasterUserId,
      companyId: this.CompanyId,
      isActived: true
    }
    //Consumir API
    this.cCompaniaService.onMasterCompanyGet(oData).subscribe(oRes => {
      if (oRes.length > 0) {
        //Obtener servicios por compañía y llenar el array de aTiposServicios
        this.cAgendarGeneralService.oAgenda.aTiposServicio = oRes[0].ServicesByCompany;
        this.cAgendarGeneralService.oAgenda.aCanales = oRes[0].ChannelsByCompany;
        this.habilitarPickUpDelivery = oRes[0].PickUpAndDelivery;
      }
      //Desactiva la barra de carga
      this.cAgendarGeneralService.isGlobalLoading = false;
    }, oErr => {
      //Desactiva la barra de carga
      this.cAgendarGeneralService.isGlobalLoading = false;
    });
  }

  //Selección de un tipo de servicio
  onSeleccionarServicio(oData) {
    
    //Obtiene el ServiceId
    //this.cAgendarGeneralService.oAgenda.p_i_servicio = oData.ServiceId;
    //Obtiene el FriendlyName para setearlo en el cuadro de resumen
    this.cAgendarGeneralService.oAgenda.sTipoServicio = oData.FriendlyName;
    //Obtiene el ServiceId y lo setea en el formControl
    this.cAgendarGeneralService.oAgenda.c_tipo_servicio.setValue(oData.ServiceId);
    //Evalua si el kilometraje es obligatorio
    this.bMandatoryKm = ((oData.MandatoryKM === '1') ? true : false);
    this.cAgendarGeneralService.oAgenda.c_kilometraje= new FormControl(null);
    if(this.bMandatoryKm){
      this.cAgendarGeneralService.oAgenda.c_kilometraje= new FormControl(null, [Validators.required]);
    }
    //Ejecuta función para obtener kilometrajes de acuerdo al servicio
    this.onObtenerKilometraje();
    //Ejecuta función para obtener departamentos con talleres habilitados de acuerdo al servicio
    this.onGetDepartamentos();
    this.cAgendarGeneralService.oAgenda.aTalleres = [];
    this.cAgendarGeneralService.oAgenda.sKilometraje = "";
  }

  //Obtener kilometrajes
  onObtenerKilometraje() {
    //Activa la barra de carga
    this.cAgendarGeneralService.isGlobalLoading = true;
    //Objeto JSON para enviar el request
    let oData = {
      serviceId: this.cAgendarGeneralService.oAgenda.c_tipo_servicio.value,
      masterUserId: this.MasterUserId,
      companyId: this.CompanyId,
      mileageId: null
    }
    //Consumir API
    this.cCompaniaService.onMileagesByCompanyGet(oData).subscribe(oRes => {
      if (oRes.length > 0) {
        //Si llegan datos, se llenará en el array de aKilometrajes
        this.cAgendarGeneralService.oAgenda.c_kilometraje.setValue('');
        this.cAgendarGeneralService.oAgenda.aKilometraje = oRes;
      } else {
        //Si no llegan datos, se seteará vacío en el array de aKilometrajes
        this.cAgendarGeneralService.oAgenda.c_kilometraje.setValue('');
        this.cAgendarGeneralService.oAgenda.aKilometraje = [];
      }
      //Desactiva la barra de carga
      this.cAgendarGeneralService.isGlobalLoading = false;
    }, oErr => {
      //Desactiva la barra de carga
      this.cAgendarGeneralService.isGlobalLoading = false;
    })
  }

  //Selección de un kilometraje
  onSeleccionarKilometraje(oData) {
    this.cAgendarGeneralService.oAgenda.sKilometraje = oData.Value + " KM";
    this.cAgendarGeneralService.oAgenda.c_kilometraje.setValue(oData.MileageId);
    this.cAgendarGeneralService.oAgenda.sPackage = oData.ExternalId;

  }

  //Función para validar texto ingresado en el input de kilometraje
  onBlurKilometraje() {
    var ext = this.cAgendarGeneralService.oAgenda.c_kilometraje.value;
    if (!this.cAgendarGeneralService.oAgenda.c_kilometraje.valid) {
      this.cAgendarGeneralService.oAgenda.sKilometraje = '------';
    } else {
      let sKilometraje = this.cAgendarGeneralService.oAgenda.c_kilometraje.value;
      this.cAgendarGeneralService.oAgenda.sKilometraje = sKilometraje + " KM";
    }
  }

  //Obtiene departamentos con talleres habilitados de acuerdo al servicio
  onGetDepartamentos() {
    //Activa la barra de carga
    this.cAgendarGeneralService.isGlobalLoading = true;
    //Objeto JSON para enviar el request
    let oData = {
      externalCode: 'X',
      masterUserId: this.MasterUserId,
      companyId: this.CompanyId,
      flagGlobal: null
    }
    //Consumir API
    this.cSharedService.onGeolocationGet(oData).subscribe(oRes => {
      if (oRes.length > 0) {
        this.cAgendarGeneralService.oAgenda.aRegiones = oRes;
        this.cAgendarGeneralService.oAgenda.c_region.setValue("");
        //this.cAgendarGeneralService.oAgenda.p_c_region = '';
      }
      //Desactiva la barra de carga
      this.cAgendarGeneralService.isGlobalLoading = false;
    }, err => {
      //Desactiva la barra de carga
      this.cAgendarGeneralService.isGlobalLoading = false;
    });
  }

  //Selección de un departamento
  onSeleccionarDepartamentos(oData) {
    this.cAgendarGeneralService.oAgenda.c_region.setValue(oData.GeoLocationIdDepartment);
    //this.cAgendarGeneralService.oAgenda.p_c_region = oData.GeoLocationIdDepartment;
    this.cAgendarGeneralService.oAgenda.sRegion = oData.Department;
    this.onGetTalleres();
  }

  //Obtiene talleres habilitados en el departamento
  onGetTalleres() {
    //Activa la barra de carga
    this.cAgendarGeneralService.isGlobalLoading = true;
    //Objeto JSON para enviar el request
    var oData = {
      masterUserId: this.MasterUserId,
      companyId: this.CompanyId,
      workshopId: null,
      isActived: true,
      geoLocationId: this.cAgendarGeneralService.oAgenda.c_region.value
    }
    //Consumir API
    this.cWorkshop.onMasterWorkshopGet(oData).subscribe(oRes => {
      if (oRes.length > 0) {
        this.cAgendarGeneralService.oOpciones.toogleTaller = true;
        oRes.forEach(element => {
          element.isSelected = false
        });

        this.cAgendarGeneralService.oAgenda.aTalleres = this.onValidateWorkshops(oRes);
      } else {

      }
      //Desactiva la barra de carga
      this.cAgendarGeneralService.isGlobalLoading = false;
    }, err => {
      //Desactiva la barra de carga
      this.cAgendarGeneralService.isGlobalLoading = false; 
      
    });
  }
  onloadFinalBottom(){
    let top = document.getElementById('bottom'); 
      if (top !== null && this.isLoad) {
        top.scrollIntoView();
        top = null;this.isLoad = false;
      }
    return '';
  }
  onValidateWorkshops(oData) {
    let aData = [];
    oData.forEach(element => {
      let channel = element.ChannelsByWorkshop.find(oEle => oEle.ChannelId.toString() === '1')
      if (channel) {
        aData.push(element);
      }
    });
    return aData;
  }

  //Selección de un taller
  onSeleccionarTaller(oTalleres) {
    this.cAgendarGeneralService.oAgenda.aTalleres.forEach(element => {
      element.isSelected = false
    });
    this.cAgendarGeneralService.oAgenda.sTaller = oTalleres.FriendlyName;
    this.cAgendarGeneralService.oAgenda.p_c_taller = oTalleres.WorkshopId;
    this.cAgendarGeneralService.oAgenda.sDireccionTaller = oTalleres.Address;
    oTalleres.isSelected = true;
    this.cAgendarGeneralService.oAgenda.c_asesor.setValue("");
    this.cAgendarGeneralService.oAgenda.d_horario = null; 
    this.cAgendarGeneralService.oAgenda.sAsesorFinal = ""; 
    this.cAgendarGeneralService.oAgenda.sFecha = "------";
    this.cAgendarGeneralService.oAgenda.c_fecha_calendario  = new FormControl(new Date())
    this.cAgendarGeneralService.oAgenda.aHorario = [];
    this.cAgendarGeneralService.oAgenda.d_fecha = null;
    this.cAgendarGeneralService.oAgenda.d_horario = null;
    this.cAgendarGeneralService.oAgenda.sHora = '------'; 
  }

  //Función usada para obtener los valores desde la vista móvil
  onSelectTipoServicio() {
    if (this.mobileQuery.matches) {
      this.cAgendarGeneralService.oOpciones.toogle = true;
      this.cAgendarGeneralService.oOpciones.sTitulo = 'Selecciona el tipo de servicio que deseas reservar:';
      this.cAgendarGeneralService.oOpciones.sControl = 'sTipoServicio';
      this.cAgendarGeneralService.oOpciones.aLista = this.cAgendarGeneralService.oAgenda.aTiposServicio;
      this.cAgendarGeneralService.oOpciones.tipo = "Servicio";
    }
  }

  //Función usada para obtener los valores desde desde la vista móvil
  onSelectKilometraje() {
    if (this.mobileQuery.matches && this.cAgendarGeneralService.oAgenda.aKilometraje.length > 0) {
      this.cAgendarGeneralService.oOpciones.toogle = true;
      this.cAgendarGeneralService.oOpciones.sTitulo = 'Selecciona el kilometraje:';
      this.cAgendarGeneralService.oOpciones.sControl = 'sKilometraje';
      this.cAgendarGeneralService.oOpciones.aLista = this.cAgendarGeneralService.oAgenda.aKilometraje;
      this.cAgendarGeneralService.oOpciones.tipo = "Kilometraje";
    }
  }

  //Función usada para obtener los valores desde desde la vista móvil
  onSelectRegion() {
    if (this.mobileQuery.matches) {
      this.cAgendarGeneralService.oOpciones.toogle = true;
      this.cAgendarGeneralService.oOpciones.sTitulo = 'Selecciona la región';
      this.cAgendarGeneralService.oOpciones.sControl = 'sRegion';
      this.cAgendarGeneralService.oOpciones.aLista = this.cAgendarGeneralService.oAgenda.aRegiones;
      this.cAgendarGeneralService.oOpciones.tipo = "Region";
    }
  }

  //Función usada para obtener los valores desde desde la vista móvil
  onSelectAsesor() {
    if (this.mobileQuery.matches) {
      this.cAgendarGeneralService.oOpciones.toogle = true;
      this.cAgendarGeneralService.oOpciones.sTitulo = 'Asesor';
      this.cAgendarGeneralService.oOpciones.sControl = 'sAsesor';
      this.cAgendarGeneralService.oOpciones.aLista = this.cAgendarGeneralService.oAgenda.aAsesores;
    }
  }

  //Función que permite únicamente digitar números
  onValidarSoloNumeros(e) {
    var key = window.event ? e.which : e.keyCode;
    if (key < 48 || key > 57) {
      e.preventDefault();
    }
  }
  
  onGoHome() {
    this.cRouter.navigateByUrl('/');
  }

  //Función que valida que todo esté correctamente seleccionado para pasar al paso 2
  onVerificarPasoSegundo() {
    let aServicios = this.cAgendarGeneralService.oAgenda.aTiposServicio;
    let oServicio = aServicios.find(oElement => oElement.ServiceId === this.cAgendarGeneralService.oAgenda.c_tipo_servicio.value);
    this.bMandatoryKm = (oServicio.MandatoryKM === "1") ? true : false ; 

    let flat = true;
    if (this.cAgendarGeneralService.oAgenda.c_tipo_servicio.value === 0) {
      this.cMatSnackBar.open("Selecionar servicio", "cerrar", {
        verticalPosition: 'top',
        horizontalPosition: 'end',
        duration: 22000,
      });
      flat = false;
    } else if (this.bMandatoryKm && !this.cAgendarGeneralService.oAgenda.c_kilometraje.valid) {
     
        this.cMatSnackBar.open("El kilometraje es requerido", "cerrar", {
          verticalPosition: 'top',
          horizontalPosition: 'end',
          duration: 2000,
        });
        flat = false;
     
    } else if (this.cAgendarGeneralService.oAgenda.c_region.value === '') {
      this.cMatSnackBar.open("Selecionar región", "cerrar", {
        verticalPosition: 'top',
        horizontalPosition: 'end',
        duration: 2000,
      });
      flat = false;
    } else if (this.cAgendarGeneralService.oAgenda.p_c_taller.length.toString() == "0") {
       
      this.cMatSnackBar.open("Selecionar taller", "cerrar", {
        verticalPosition: 'top',
        horizontalPosition: 'end',
        duration: 2000,
      });
      flat = false;
    }
    return flat;
  }

  //Función para ir al paso 2
  onContinuar() {
    if (this.onVerificarPasoSegundo()) {
      this.cRouter.navigateByUrl('/agendar/' + this.PlateName + '/segundo');
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.cAgendarGeneralService.oAgenda.bPasoSegundo = true;
    });
    //ir arriba en la pagina
    let top = document.getElementById('top');
    if (top !== null) {
      top.scrollIntoView();
      top = null;
    }
    this.modificarFont();
  }

  onMatchMobileQuery() {
    if (this.mobileQuery.matches) {
      this.disabledCombo = true;
    } else {
      this.disabledCombo = false;
    }
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  shouldRun = [/(^|\.)plnkr\.co$/, /(^|\.)stackblitz\.io$/].some(h => h.test(window.location.host));
}
