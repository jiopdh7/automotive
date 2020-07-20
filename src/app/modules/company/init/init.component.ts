import { Component, OnInit, ViewChild } from '@angular/core';
import { Validators, FormControl } from '@angular/forms';
import { MatTableDataSource, MatPaginator, MatPaginatorIntl } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { CompanyService } from 'src/app/services/company.service';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { element } from 'protractor';

@Component({
  selector: 'app-init',
  templateUrl: './init.component.html',
  styleUrls: ['./init.component.css']
})
export class InitComponent implements OnInit {
  public isToggle: boolean = false;
  public IsLoadedBrands = false;
  public IsLoadedServices = true;
  public oModelBrandSelect: any;
  public cDiasDisponibles: FormControl = new FormControl();
  over = 'over';
  aCanal = [];
  private companyUserModel = JSON.parse(localStorage.getItem('CompanyUser'));
  position = "below";
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  dataSource = new MatTableDataSource<any>([]);
  displayedColumns: string[] = ['compania', 'estado','pickup','acciones'];
  public oModuleSelected = JSON.parse(localStorage.getItem('ModuleSelected')) ? JSON.parse(localStorage.getItem('ModuleSelected')) : {};
  constructor(
    private cTranslateService: TranslateService,
    private cCompanyService: CompanyService,
    private cConfigurationService: ConfigurationService,
    private cRouter: Router,
    private cMatPaginatorIntl: MatPaginatorIntl,
    private cSnackbarService: SnackbarService
  ) {
    this.cTranslateService.setDefaultLang('es');
    this.cMatPaginatorIntl.itemsPerPageLabel = "Filas por página";
    this.cMatPaginatorIntl.nextPageLabel = "Página siguiente";
    this.cMatPaginatorIntl.previousPageLabel = "Página anterior";
  }
  closedStart() {
    this.isToggle = false;
  }
  ngOnInit() {
    this.obtenerMarcas();
  } 
  ngAfterViewInit() {
    //ir arriba en la pagina
    let top = document.getElementById('top');
    if (top !== null) {
      top.scrollIntoView();
      top = null;
    }
  }
  obtenerMarcas() {
    let oDataSend = {
      masterUserId: this.companyUserModel.MasterUserId,
      companyId: null,
      isActived: null
    };
    this.cCompanyService.MasterCompanyGet(oDataSend).subscribe((oData) => {
      let oAux = [];
      oData.forEach(element => {
        let oRes = this.companyUserModel.OrganizationUsersByCompany.find(oEle => oEle.CompanyId.toLowerCase() === element.CompanyId.toLowerCase());
        if(oRes){
          oAux.push(element);
        }
      })
      this.dataSource = new MatTableDataSource<any>(oAux);
      this.dataSource.paginator = this.paginator;
    }, (oErr) => {

    }, () => {

      this.IsLoadedBrands = true;
    });
  }
  onEditarServicios(oBrand): void {
    this.cRouter.navigateByUrl('/home/company/config-services/' + oBrand.CompanyId);
  }
  onEditarMarca(oBrandModel) {
    this.oModelBrandSelect = oBrandModel;
    this.cDiasDisponibles.setValue(oBrandModel.MinDayCalendar);
    this.IsLoadedServices = false;
    this.isToggle = true;
    let oDataS = {
      masterUserId: this.companyUserModel.MasterUserId,
      channelId: null
    }
    this.cConfigurationService.ChannelsByCompanyGet(oDataS).subscribe((oData) => {
      let oDtaAux = []; 
      oData.forEach(element => {
        if (element.IsActived) {
          let aDataChannel = this.oModelBrandSelect.ChannelsByCompany.find(oEle => oEle.ChannelId.toString() === element.ChannelId.toString());
          if (aDataChannel) {
            aDataChannel.IsActived = (aDataChannel.IsActived === "1" || aDataChannel.IsActived === true) ? true : false;
            aDataChannel.c_control_check = new FormControl(aDataChannel.IsActived);
            aDataChannel.c_control_hora = new FormControl(aDataChannel.MinTime, [
              Validators.required,
              Validators.pattern(/^\d+$/)]);
            if (!aDataChannel.c_control_check.value) {
              aDataChannel.c_control_hora.disable();
            }
            oDtaAux.push(aDataChannel);
          } else {
            element.c_control_check = new FormControl(false);
            element.c_control_hora = new FormControl('', [
              Validators.required,
              Validators.pattern(/^\d+$/)]);
            if (!element.c_control_check.value) {
              element.c_control_hora.disable();
            }
            oDtaAux.push(element);
          }
        }

      }); 
      this.aCanal = oDtaAux;
    }, (oErr) => {
      this.IsLoadedServices = true;

    }, () => {
      this.IsLoadedServices = true;
    });

  }
  onAcceptOlnyNumbers(event, control) {
    event.preventDefault();
    control.setValue(event.target.value.replace(/[^0-9]/g, ""));
  }
  onCancelar() {
    this.isToggle = false;
  }
  fnShowVerCalendarioComponent(oBrand) {
    this.cRouter.navigateByUrl('/home/company/config-calendar/' + oBrand.CompanyId);
  }
  onEditarMensajeBienvenida(oBrand): void {
    this.cRouter.navigateByUrl('/home/company/welcome-message/' + oBrand.CompanyId);
  }
  onChangeEstadoMarca(oDatas) {
    //oData.IsActived = !oData.IsActived;
    let oDataSend = {
      companyId: oDatas.CompanyId,
      masterUserId: oDatas.MasterUserId,
      externalId: oDatas.ExternalId,
      isActived: !oDatas.IsActived,
      pickUpAndDelivery: oDatas.PickUpAndDelivery,
      isDeleted: false,
      welcomeMessage: oDatas.WelcomeMessage,
      minDayCalendar: oDatas.MinDayCalendar
    };
    this.cCompanyService.MasterCompanyModify(oDataSend).subscribe((oData) => {
      let sMessage = '';
      if (oData.codeResponse) {
        let sTrans = "BrandInitSavedOk";
        this.cTranslateService.get(sTrans).subscribe((text: string) => {
          sMessage = text;
        });
        this.cSnackbarService.openSnackBar(sMessage, '', 'Success');

      } else {
        let sTrans = "BrandInitSavedError";
        this.cTranslateService.get(sTrans).subscribe((text: string) => {
          sMessage = text;
        });
        this.cSnackbarService.openSnackBar(sMessage, '', 'Error');
      }
      this.obtenerMarcas();
    }, (oErr) => {

    }, () => {

    });
  }
  onChangeEstadoPickUp(oDatas) {
    //oData.IsActived = !oData.IsActived;
    let oDataSend = {
      companyId: oDatas.CompanyId,
      masterUserId: oDatas.MasterUserId,
      externalId: oDatas.ExternalId,
      isActived: oDatas.IsActived,
      pickUpAndDelivery: !oDatas.PickUpAndDelivery,
      isDeleted: false,
      welcomeMessage: oDatas.WelcomeMessage,
      minDayCalendar: oDatas.MinDayCalendar
    };
    this.cCompanyService.MasterCompanyModify(oDataSend).subscribe((oData) => {
      let sMessage = '';
      if (oData.codeResponse) {
        let sTrans = "CompanyInitPUDSavedOk";
        this.cTranslateService.get(sTrans).subscribe((text: string) => {
          sMessage = text;
        });
        this.cSnackbarService.openSnackBar(sMessage, '', 'Success');

      } else {
        let sTrans = "CompanyInitPUDSavedError";
        this.cTranslateService.get(sTrans).subscribe((text: string) => {
          sMessage = text;
        });
        this.cSnackbarService.openSnackBar(sMessage, '', 'Error');
      }
      this.obtenerMarcas();
    }, (oErr) => {

    }, () => {

    });
  }
  onSaveMinDate(oDatas){
    let oDataSend = {
      companyId: oDatas.CompanyId,
      masterUserId: oDatas.MasterUserId,
      externalId: oDatas.ExternalId,
      isActived: oDatas.IsActived,
      pickUpAndDelivery: oDatas.PickUpAndDelivery,
      isDeleted: false,
      welcomeMessage: oDatas.WelcomeMessage,
      minDayCalendar: this.cDiasDisponibles.value
    };
    this.cCompanyService.MasterCompanyModify(oDataSend).subscribe((oData) => {
      let sMessage = '';
      if (oData.codeResponse) {
        let sTrans = "CompanyInitMinDateOk";
        this.cTranslateService.get(sTrans).subscribe((text: string) => {
          sMessage = text;
        });
        this.cSnackbarService.openSnackBar(sMessage, '', 'Success');

      } else {
        let sTrans = "CompanyInitMinDateError";
        this.cTranslateService.get(sTrans).subscribe((text: string) => {
          sMessage = text;
        });
        this.cSnackbarService.openSnackBar(sMessage, '', 'Error');
      }
      this.obtenerMarcas();
    }, (oErr) => {

    }, () => {

    });
  }
  onCheckedCanal(oCanal) {
    if (!oCanal.c_control_check.value) {
      oCanal.c_control_hora.disable();
      oCanal.c_control_hora.setValue(0);
    } else {
      oCanal.c_control_hora.enable();
    }
  }
  onSaveChanelsByCompanyBand() {
    if (!this.onValidateSavechannels()) {
      return;
    }
    this.IsLoadedServices = false;
    let oDataSend = {
      aDataSend: []
    }
    this.aCanal.forEach(element => {
      let oAux = {
        channelId: element.ChannelId,
        masterUserId: this.oModelBrandSelect.MasterUserId,
        companyId: this.oModelBrandSelect.CompanyId,
        minTime: element.c_control_hora.value,
        isActived: element.c_control_check.value
      };
      oDataSend.aDataSend.push(oAux);
    });
    this.cCompanyService.ChannelsByCompanyModify(oDataSend).subscribe((oData) => {
      let sMessage = '';
      if (oData.codeResponse) {
        let sTrans = "ContentInitModifyRequerideChannelOK";
        this.cTranslateService.get(sTrans).subscribe((text: string) => {
          sMessage = text;
        });
        this.cSnackbarService.openSnackBar(sMessage, '', 'Success');

      } else {
        let sTrans = "ContentInitModifyRequerideChannelError";
        this.cTranslateService.get(sTrans).subscribe((text: string) => {
          sMessage = text;
        });
        this.cSnackbarService.openSnackBar(sMessage, '', 'Error');
      }
      this.IsLoadedServices = true;
      this.obtenerMarcas();
    }, (oErr) => {

    }, () => {
      this.isToggle = false;
      this.IsLoadedServices = true;
      this.onSaveMinDate(this.oModelBrandSelect);
    });

  }
  onValidateSavechannels() {
    let flat = true;
    this.aCanal.forEach(element => {
      if (element.c_control_check.value) {
        if (!element.c_control_hora.valid) {
          let sMessage = '';
          let sTrans = "ContentInitModifyRequerideChannel";
          this.cTranslateService.get(sTrans).subscribe((text: string) => {
            sMessage = element.FriendlyName + ' ' + text;
          });
          this.cSnackbarService.openSnackBar(sMessage, '', 'Error');
          flat = false;
        }
      }
    });
    return flat;
  }

}
