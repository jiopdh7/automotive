import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AgendarGeneralService } from 'src/app/services/agendar-general.service';
import { OpcionesModel } from 'src/app/models/opciones.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl } from '@angular/forms';
import { CustomerService } from 'src/app/services/customer.service';
import { CompanyService } from 'src/app/services/company.service';
import { SharedService } from 'src/app/services/shared.service';
import { WorkshopService } from 'src/app/services/workshop.service';
import { ConfigService } from 'src/app/services/config.service';
import { SesionService } from 'src/app/services/sesion/sesion.service';

@Component({
  selector: 'app-agendar',
  templateUrl: './agendar.component.html',
  styleUrls: ['./agendar.component.css']
})
export class AgendarComponent implements OnInit, OnDestroy {
  public activeLang: string = 'es';
  public oDataMain: any = { "p_i_usuario_usuario": 0, "c_apellidos_usuario": "", "c_nombres_usuario": "", "c_documento_usuario": "", "c_correo_usuario": "", "p_i_usuario_cliente": 0, "c_apellidos_cliente": "", "c_nombres_cliente": "", "c_documento_cliente": "", "c_correo_cliente": "" };
  
  public OpcionesGeneral: OpcionesModel[] = [];
  public telefono: string = "";
  public cont: number = 0;
  public bPasoSegundo: boolean = true;
  public bSiguiente: boolean = false;
  private PlateName: string;
  public CompanyId: string;
  public MasterUserId: string;
  public mobileQuery: MediaQueryList;
  p_i_marca 
  private _mobileQueryListener: () => void;
  constructor(
    private cSesionService: SesionService,
    private translate: TranslateService,
    private cRouter: Router,
    private cMatSnackBar: MatSnackBar,
    public changeDetectorRef: ChangeDetectorRef,
    public media: MediaMatcher,
    private cActivatedRoute: ActivatedRoute,
    private cCustomerService: CustomerService,
    private cCompaniaService: CompanyService,
    private cWorkshop: WorkshopService,
    private cConfigService: ConfigService,
    private cSharedService: SharedService,
    public cAgendarGeneralService: AgendarGeneralService,
  ) {
    this.translate.setDefaultLang(this.activeLang);
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    this.PlateName = this.cActivatedRoute.snapshot.params.sPlaca;
    localStorage.setItem('PlateName', this.PlateName);
    this.p_i_marca = cConfigService.onObtenerMarcaBase();
  }

  ngOnInit() {
    //this.onObtenerDatosUsuario();
    //this.onObtenerCliente();
    this.CompanyId = localStorage.getItem("CompanyId");
    this.MasterUserId = localStorage.getItem("MasterUserId");
    this.telefono = localStorage.getItem("telefono");
  }
  ngAfterViewInit(){
    this.modificarFont();
  }
  modificarFont(){
    switch (this.p_i_marca) {
      case 1://subaru
        var list, index;
        list = document.getElementsByClassName("example-container");
        for (index = 0; index < list.length; ++index) {
            list[index].style.fontFamily = "AvenirNext-Regular"
        }
        break;
        break;
      case 2://dfsk
        var list, index;
        list = document.getElementsByClassName("example-container");
        for (index = 0; index < list.length; ++index) {
            list[index].style.fontFamily = "HelveticaLTStd"
        }
        break;
      case 3://bmw
        var list, index;
        list = document.getElementsByClassName("example-container");
        for (index = 0; index < list.length; ++index) {
            list[index].style.fontFamily = "AvenirNextLTPro"
        }
        break;
    }
  }
  //Obtiene los datos del cliente logueado por placa/documento
  //Obtiene los datos del cliente logueado por usuario/password
  //Función para llenar los campos ingresados por el menú lateral en la vista móvil
  onSelectOption(oLista, sCombo) {
    this.cAgendarGeneralService.oOpciones.toogle = false;
    if (this.cAgendarGeneralService.oOpciones.tipo == "Servicio") {
      this.cAgendarGeneralService.oAgenda.p_i_servicio = oLista.ServiceId;
      this.cAgendarGeneralService.oAgenda.c_tipo_servicio.setValue(oLista.ServiceId);
      this.cAgendarGeneralService.oAgenda.sTipoServicio = oLista.FriendlyName;
      this.onObtenerKilometraje();
      this.onGetDepartamentos();
    } else if (this.cAgendarGeneralService.oOpciones.tipo == "Kilometraje") {
      this.cAgendarGeneralService.oAgenda.sKilometraje = oLista.Value + " KM";
      this.cAgendarGeneralService.oAgenda.c_kilometraje.setValue(oLista.MileageId);
    } else if (this.cAgendarGeneralService.oOpciones.tipo == "Region") {
      this.cAgendarGeneralService.oAgenda.sRegion = oLista.Department;
      this.cAgendarGeneralService.oAgenda.c_region.setValue(oLista.GeoLocationIdDepartment);
      this.onGetTalleres();
    } else if (this.cAgendarGeneralService.oOpciones.tipo == "Asesor") {
      this.cAgendarGeneralService.oAgenda.c_asesor.setValue(oLista.CompanyAdviserId);
      this.cAgendarGeneralService.oAgenda.sAsesor = oLista.FirstName.trim() + ' ' + oLista.LastName.trim();
      this.cAgendarGeneralService.oAgenda.aHorario = [];
    }
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
        this.cAgendarGeneralService.oAgenda.c_kilometraje = new FormControl({ value: '', disabled: false });
        this.cAgendarGeneralService.oAgenda.aKilometraje = [];
      }
      //Desactiva la barra de carga
      this.cAgendarGeneralService.isGlobalLoading = false;
    }, oErr => {
      //Desactiva la barra de carga
      this.cAgendarGeneralService.isGlobalLoading = false;
    })
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
      flagGlobal:null
    }
    //Consumir API
    this.cSharedService.onGeolocationGet(oData).subscribe(oRes => { 
      if (oRes.length > 0) {
        this.cAgendarGeneralService.oAgenda.aRegiones = oRes;
        this.cAgendarGeneralService.oAgenda.p_c_region = '';
      } else {

      }
      //Desactiva la barra de carga
      this.cAgendarGeneralService.isGlobalLoading = false;
    }, err => {
      //Desactiva la barra de carga
      this.cAgendarGeneralService.isGlobalLoading = false;
    });
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
      isActived: 1,
      geoLocationId: this.cAgendarGeneralService.oAgenda.p_c_region
    }
    //Consumir API
    this.cWorkshop.onMasterWorkshopGet(oData).subscribe(oRes => { 
      if (oRes.length > 0) {
        this.cAgendarGeneralService.oOpciones.toogleTaller = true;
        oRes.forEach(element => {
          element.isSelected = false
        });
        this.cAgendarGeneralService.oAgenda.aTalleres = oRes;
      } else {
        this.cAgendarGeneralService.oOpciones.toogleTaller = false;
      }
      //Desactiva la barra de carga
      this.cAgendarGeneralService.isGlobalLoading = false;
    }, err => {
      //Desactiva la barra de carga
      this.cAgendarGeneralService.isGlobalLoading = false;
    });
  }

  //Validación para que permita ir a la verificación de datos
  onVerificarPasoSegundo() {
    let flat = true;
    if (this.cAgendarGeneralService.oAgenda.c_tipo_servicio.value === 0) {
      this.cMatSnackBar.open("Seleccionar servicio", "cerrar", {
        verticalPosition: 'top',
        horizontalPosition: 'end',
        duration: 2000,
      });
      flat = false;
    } else if (this.cAgendarGeneralService.oAgenda.c_kilometraje.invalid) {
      this.cMatSnackBar.open("Seleccionar kilometraje", "cerrar", {
        verticalPosition: 'top',
        horizontalPosition: 'end',
        duration: 2000,
      });
      flat = false;
    } else if (this.cAgendarGeneralService.oAgenda.c_region.value === '') {
      this.cMatSnackBar.open("Seleccionar región", "cerrar", {
        verticalPosition: 'top',
        horizontalPosition: 'end',
        duration: 2000,
      });
      flat = false;
    } else if (this.cAgendarGeneralService.oAgenda.p_c_taller === '') {
      this.cMatSnackBar.open("Seleccionar taller", "cerrar", {
        verticalPosition: 'top',
        horizontalPosition: 'end',
        duration: 2000,
      });
      flat = false;
    }
    return flat;
  }

  onValidarFinalizar() {
    let flag = true;
    if (this.cAgendarGeneralService.oAgenda.c_asesor.value === '') {
      flag = false;
      this.cMatSnackBar.open("Selecionar asesor", "cerrar", {
        verticalPosition: 'top',
        horizontalPosition: 'end',
        duration: 2000,
      });
    } else if (this.cAgendarGeneralService.oAgenda.d_fecha === null) {
      flag = false;
      this.cMatSnackBar.open("Selecionar fecha", "cerrar", {
        verticalPosition: 'top',
        horizontalPosition: 'end',
        duration: 2000,
      });
    } else if (this.cAgendarGeneralService.oAgenda.d_horario === null) {
      flag = false;
      this.cMatSnackBar.open("Selecionar horario", "cerrar", {
        verticalPosition: 'top',
        horizontalPosition: 'end',
        duration: 2000,
      });
    } else if (this.cAgendarGeneralService.oAgenda.isRepresentante) {
      if (this.cAgendarGeneralService.oAgenda.c_repre_nombre.value === '') {
        flag = false;
        this.cMatSnackBar.open("Ingresar nombre representante", "cerrar", {
          verticalPosition: 'top',
          horizontalPosition: 'end',
          duration: 2000,
        });
      } else if (this.cAgendarGeneralService.oAgenda.c_repre_documento.value === '') {
        flag = false;
        this.cMatSnackBar.open("Ingresar documento representante", "cerrar", {
          verticalPosition: 'top',
          horizontalPosition: 'end',
          duration: 2000,
        });
      } else if (this.cAgendarGeneralService.oAgenda.c_repre_telefono.value === '') {
        flag = false;
        this.cMatSnackBar.open("Ingresar telefono representante", "cerrar", {
          verticalPosition: 'top',
          horizontalPosition: 'end',
          duration: 2000,
        });
      } else if (!this.cAgendarGeneralService.oAgenda.c_terminos.value) {
        flag = false;
        this.cMatSnackBar.open("Aceptar términos y condiciones", "cerrar", {
          verticalPosition: 'top',
          horizontalPosition: 'end',
          duration: 2000,
        });
      }
      //  else if (!this.cAgendarGeneralService.oAgenda.c_repre_desicion.value) {
      //   flag = false;
      //   this.cMatSnackBar.open("Aceptar la política de privacidad para la protección de datos personales", "cerrar", {
      //     verticalPosition: 'top',
      //     horizontalPosition: 'end',
      //     duration: 2000,
      //   });
      // }
    } else if (!this.cAgendarGeneralService.oAgenda.isRepresentante) {
      if (!this.cAgendarGeneralService.oAgenda.c_terminos.value) {
        flag = false;
        this.cMatSnackBar.open("Aceptar términos y condiciones", "cerrar", {
          verticalPosition: 'top',
          horizontalPosition: 'end',
          duration: 2000,
        });
      }
      // else if (!this.cAgendarGeneralService.oAgenda.c_proteciondatos.value) {
      //   flag = false;
      //   this.cMatSnackBar.open("Aceptar la política de privacidad para la protección de datos personales", "cerrar", {
      //     verticalPosition: 'top',
      //     horizontalPosition: 'end',
      //     duration: 2000,
      //   });
      // }
    }
    return flag;
  }

  //Redirige a la página de login
  onGoHome() {
    this.cRouter.navigateByUrl('/');
  }

  //Cierra el menú lateral
  onCloseMenu() {
    this.cAgendarGeneralService.oOpciones.toogle = false;
  }

  //Redirige al paso 1 del agendamiento
  onIrPasoUno() {
    this.cRouter.navigateByUrl('/agendar/' + this.PlateName);
  }

  //Redirige al paso 2 del agendamiento
  onContinuar() {
    if (this.cAgendarGeneralService.oAgenda.bPasoSegundo) {
      if (this.onVerificarPasoSegundo()) {
        this.cRouter.navigateByUrl('/agendar/' + this.PlateName + '/segundo');
      }
    } else {
      this.onGoVerificar();
    }
  }

  //Redirige a la página de verificación de reserva
  onGoVerificar() {
    if (this.onValidarFinalizar()) {
      this.cRouter.navigateByUrl('/agendar/' + this.PlateName + '/verificar');
    }
  }

  //Cierra la sesión
  onCerrarSesion() {
    this.cAgendarGeneralService.fnRestaurarReservaSesion();
    var odata={
      "sessionId": localStorage.getItem('SessionId')
    }    
    this.cSesionService.onCerrarSesion(odata).subscribe(resp => {
      localStorage.setItem('SessionId', "");
      localStorage.setItem('CredentialId', "");
      localStorage.setItem('UserData', "");
      this.cRouter.navigate(["/"]);
    }, err => { 
    });
    
  }

  shouldRun = [/(^|\.)plnkr\.co$/, /(^|\.)stackblitz\.io$/].some(h => h.test(window.location.host));

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
    //localStorage.clear();
  }
  onCallTelefono(){
    window.open('tel:' + this.telefono, '_blank');
  }
}
