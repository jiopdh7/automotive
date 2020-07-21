import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { MensajeDialogoComponent } from './../../components/mensaje-dialogo/mensaje-dialogo.component';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { ReservaService } from 'src/app/services/reserva/reserva.service';
import { ConfigService } from 'src/app/services/config.service';
import { CompanyService } from 'src/app/services/company.service';
import { AgendarGeneralService } from 'src/app/services/agendar-general.service';
import { MatSnackBar } from '@angular/material';
import { UtilityClass } from 'src/app/Utility';

@Component({
  selector: 'app-consultar-verificar',
  templateUrl: './consultar-verificar.component.html',
  styleUrls: ['./consultar-verificar.component.css']
})
export class ConsultarVerificarComponent implements OnInit {
  public activeLang = 'es';
  public IsPickUp: boolean = false;
  public isShown: boolean = false;
  utility = new UtilityClass();
  public mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;
  public aReservas = []; 
  shouldRun = [/(^|\.)plnkr\.co$/, /(^|\.)stackblitz\.io$/].some(h => h.test(window.location.host));
  public valCanal=false;
  public CompanyId =localStorage.getItem("CompanyId");
  public MasterUserId = localStorage.getItem("MasterUserId");
  p_i_marca;
  constructor(
    public cAgendarGeneralService: AgendarGeneralService,
    private cCompaniaService: CompanyService,
    private translate: TranslateService,
    private cRouter: Router,
    private cConfigService: ConfigService,
    private ReservasService: ReservaService,
    public cMatDialog: MatDialog,
    public changeDetectorRef: ChangeDetectorRef,
    public media: MediaMatcher,
    private cMatSnackBar: MatSnackBar,
  ) {
    this.translate.setDefaultLang(this.activeLang);
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    this.p_i_marca = cConfigService.onObtenerMarcaBase();
  }

  ngOnInit() {
    
  }
  ngAfterContentInit(){
    
    setTimeout(()=> {
      this.onObtenerReservas();
  }, 0);
  }
  onValidatePickUp(){
    var flat = false;
    if(this.ReservasService.reservaEditar.IsPickUpAndDelivery){

      var flat = true;
    }else if (!this.ReservasService.reservaEditar.IsPickUpAndDelivery && this.IsPickUp){

      var flat = true;
    }
return flat;
  }
  //Obtener datos de compañia
  onGetMasterCompany() {
    //Activa la barra de carga
    //Objeto JSON para enviar el request
    var oData = {
      masterUserId: this.MasterUserId,
      companyId: this.CompanyId,
      isActived: true
    }
    //Consumir API
    var canales=[];
    this.cCompaniaService.onMasterCompanyGet(oData).subscribe(oRes => { 
      //Obtener servicios por compañía y llenar el array de aTiposServicios
      this.cAgendarGeneralService.oAgenda.aTiposServicio = oRes[0].ServicesByCompany;
      this.cAgendarGeneralService.oAgenda.aCanales = oRes[0].ChannelsByCompany;
      oRes.forEach(element => {        
        canales = element.ChannelsByCompany;
      });
      canales.forEach(element => {
        if(element.ChannelId == 1){
          this.valCanal= true;
        }
      });
      this.IsPickUp = oRes[0].PickUpAndDelivery; 
    }, oErr => {
      //Desactiva la barra de carga 
    });
  }
  onObtenerReservas() {

    var user = JSON.parse(localStorage.getItem("UserData"));
    if(!user) this.onGoHome();//Add by security
    else user = JSON.parse(localStorage.getItem("UserData"))[0];//Add by security
    this.cAgendarGeneralService.isGlobalLoading = true;
    var oData = {
      agendaId: null,
      masterUserId:localStorage.getItem("MasterUserId"), 
      startDate:null, 
      endDate:null, 
      companies:"",
      workshops:"", 
      channels:"", 
      services:"", 
      advisers:"", 
      customerId:user.CustomerId, 
      statusId:'1,5',
      geolocations : '',
      isPickUpAndDelibery : '',
      haveRepresentative : null,
      plateName: ''
    }
    this.ReservasService.obtenerReservas(oData)
      .subscribe(resp => {
        var fechaAct = new Date();
        fechaAct.setHours(0,0,0,0);
        resp.forEach(element => {
          var fecha = this.utility.fnStringToDate(element.StartDate);
          fecha.setHours(0,0,0,0);
          element.mostrar = true;
          if(fechaAct.getTime()>fecha.getTime() || element.PreOt!=""){
            element.mostrar = false;
          }
        });
        this.aReservas = resp;
        this.cAgendarGeneralService.isGlobalLoading = false;
        this.onGetMasterCompany();
      }, () => {
        this.cAgendarGeneralService.isGlobalLoading = false;
      });
  }
   
  onFormatearFecha(sFecha) {
    var anio = sFecha.substr(0, 4)
    var mes = sFecha.substr(5, 2)
    var dia = sFecha.substr(8, 2)
    return dia + "/" + mes + "/" + anio;
  }

  onCancelarReserva(iReserva) {
    const dialogRef = this.cMatDialog.open(MensajeDialogoComponent, {
      width: '400px',
      height: '260px',
      data: {
        sMensaje: '¿Seguro que deseas cancelar la reserva seleccionada?',
        sButton: 'CANCELAR RESERVA',
        sNo: 'NO'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'OK') {
        this.onCancelarReservaService(iReserva);
      } else {
        return;
      }
    });
  }

  onCancelarReservaService(iReserva) {
    this.cAgendarGeneralService.isGlobalLoading = true;
    var oData = {
      agendaId: iReserva,
      credentialId: localStorage.getItem("CredentialId")
    }
    this.ReservasService.anularReservas(oData)
      .subscribe(resp => { 
        if (resp.codeResponse) {
          this.cMatSnackBar.open("Se cancelo la reserva con éxito", "cerrar", {
            verticalPosition: 'top',
            horizontalPosition: 'end',
            duration: 10000,
          });
          this.onObtenerReservas();
        }
        this.cAgendarGeneralService.isGlobalLoading = false;
      }, err => {
        this.cAgendarGeneralService.isGlobalLoading = false;
      });
  }

  onGoHome() {
    this.cRouter.navigateByUrl('/');
  }

  onGoAgendar() {
    this.cRouter.navigateByUrl('/agendar/' + localStorage.getItem("PlateName"));
  }

  onGoEditar(oReservas) {
    this.ReservasService.reservaEditar = oReservas;
    this.cRouter.navigateByUrl('/editar/' + localStorage.getItem("PlateName"));
  }

  onGoMsgCancel() {
    this.cRouter.navigateByUrl('/msg-cancelar');
  }

  toggleShow(bToggle) {
    bToggle.bToggle = !bToggle.bToggle;
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
  ngAfterViewInit() {
    //ir arriba en la pagina
    let top = document.getElementById('top');
    if (top !== null) {
      top.scrollIntoView();
      top = null;
    }
    this.modificarFont();
 }
 modificarFont(){
   switch (this.p_i_marca) {
     case 1://subaru
       var list, index;
       list = document.getElementsByClassName("containerExterno");
       for (index = 0; index < list.length; ++index) {
           list[index].style.fontFamily = "AvenirNext-Regular"
       }
       break;
       break;
     case 2://dfsk
       var list, index;
       list = document.getElementsByClassName("containerExterno");
       for (index = 0; index < list.length; ++index) {
           list[index].style.fontFamily = "HelveticaLTStd"
       }
       break;
     case 3://bmw
       var list, index;
       list = document.getElementsByClassName("containerExterno");
       for (index = 0; index < list.length; ++index) {
           list[index].style.fontFamily = "AvenirNextLTPro"
       }
       break;
   }
 }
  dateFromString(str) {
    var s = '2011-06-21T14:27:28';
    let dateString = s.split("T")[0];
    let hourString = s.split("T")[1].split(":");
    let dateTime = new Date(dateString);
    dateTime.setHours(parseInt(hourString[0]));
    dateTime.setMinutes(parseInt(hourString[1]));
    dateTime.setSeconds(parseInt(hourString[2]));
    return dateTime;
  }
  fnStringToDate(sFecha){ 
    var a = sFecha.split(/[^0-9]/);  
    return new Date(parseInt(a[0]), parseInt(a[1])-1 || 0, parseInt(a[2]) || 1, parseInt(a[3]) || 0, parseInt(a[4]) || 0, parseInt(a[5]) || 0, parseInt(a[6]) || 0);
  }
}
