import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatPaginatorIntl } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { BrandService } from 'src/app/services/brand.service';
import { Router } from '@angular/router';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { FormControl, Validators } from '@angular/forms'; 
 

@Component({
  selector: 'app-init',
  templateUrl: './init.component.html',
  styleUrls: ['./init.component.css']
})
export class InitComponent implements OnInit {
  
  
  public isToggle: boolean = false;
  public IsLoadedBrands = false;
  public IsLoadedServices = true;
  public oModelBrandSelect:any  ;
  over = 'over';
  aCanal = [];
  private companyUserModel = JSON.parse(localStorage.getItem('CompanyUser'));
  position = "below";
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  dataSource = new MatTableDataSource<any>([]);;
  displayedColumns: string[] = ['compania', 'acciones'];
  public oModuleSelected = JSON.parse(localStorage.getItem('ModuleSelected')) ? JSON.parse(localStorage.getItem('ModuleSelected')) : {};
  constructor(
    private cTranslateService: TranslateService,
    private cBrandService: BrandService,
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
      brandId: null
    };
    this.cBrandService.BrandsByCompanyGet(oDataSend).subscribe((oData) => { 
      this.dataSource = new MatTableDataSource<any>(oData);
      this.dataSource.paginator = this.paginator;
    }, (oErr) => {

    }, () => {

      this.IsLoadedBrands = true;
    });
  }
  onEditarServicios(oBrand): void {
    this.cRouter.navigateByUrl('/home/brand/config-services/' + oBrand.BrandId);
  }
  onEditarMarca(oBrandModel) {
    this.oModelBrandSelect = oBrandModel;
    this.IsLoadedServices = false;
    this.isToggle = true;
    let oDataSend = {
      companyId: oBrandModel.CompanyId,
      brandId: oBrandModel.BrandId,
      channelId: null
    }
    this.cBrandService.ChannelsByBrandByCompanyGet(oDataSend).subscribe((oData) => {
      oData.forEach(element => {
        element.c_control_check = new FormControl(element.IsActived);
        element.c_control_hora = new FormControl(element.MinTime, [
          Validators.required,
          Validators.pattern(/^\d+$/)]);
        if (!element.c_control_check.value) {
          element.c_control_hora.disable();
        }
      });
      this.aCanal = oData;
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
    this.cRouter.navigateByUrl('/home/brand/config-calendar/' + oBrand.BrandId);
  }
  onEditarMensajeBienvenida(oBrand): void {
    this.cRouter.navigateByUrl('/home/brand/welcome-message/' + oBrand.BrandId);
  }
  onChangeEstadoMarca(oData) { 
    //oData.IsActived = !oData.IsActived;
    let oDataSend = {
      companyId: oData.CompanyId,
      brandId: oData.BrandId,
      externalId: oData.ExternalId,
      isOwner: oData.IsOwner,
      isActived: !oData.IsActived,
      isDeleted: false,
      domainUrl: oData.DomainUrl,
      imageUrl: oData.ImageUrl,
      welcomeMessage: oData.WelcomeMessage
    };
    this.cBrandService.BrandsByCompanyModify(oDataSend).subscribe((oData) => {
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
  onCheckedCanal(oCanal) {
    if (!oCanal.c_control_check.value) {
      oCanal.c_control_hora.disable();
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
        brandId: this.oModelBrandSelect.BrandId,
        companyId: this.oModelBrandSelect.CompanyId,
        minTime: element.c_control_hora.value,
        isActived: element.c_control_check.value
      };
      oDataSend.aDataSend.push(oAux);
    });
    this.cBrandService.ChannelsByBrandByCompanyModify(oDataSend).subscribe((oData) => {
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
    }, (oErr) => {

    }, () => {
      this.isToggle = false;
      this.IsLoadedServices = true;
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
