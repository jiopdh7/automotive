import { Component, OnInit, ViewChild } from '@angular/core';
import { BrandService } from 'src/app/services/brand.service';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MatTableDataSource, MatPaginator, MatPaginatorIntl, MatDialog } from '@angular/material';
import { ConfigServiceModifyComponent } from './modify/config-service-modify/config-service-modify.component';
import { ConfigMileagesModifyComponent } from './modify/config-mileages-modify/config-mileages-modify.component';
import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-config-services',
  templateUrl: './config-services.component.html',
  styleUrls: ['./config-services.component.css']
})
export class ConfigServicesComponent implements OnInit {
  private companyUserModel = JSON.parse(localStorage.getItem('CompanyUser'));
  public oModuleSelected = JSON.parse(localStorage.getItem('ModuleSelected')) ? JSON.parse(localStorage.getItem('ModuleSelected')) : {};
  public oBrandModel;
  private BrandId = "";
  position = "below";
  public IsLoadedServices = false;
  displayedColumns: string[] = ['servicios', 'friendly', 'duracion', 'estado', 'acciones'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  constructor(
    private cTranslateService: TranslateService,
    private cActivatedRoute: ActivatedRoute,
    public cMatDialog: MatDialog,
    private cBrandService: BrandService,
    private cMatPaginatorIntl: MatPaginatorIntl,
    private cSnackbarService:SnackbarService
    ) {
    this.cTranslateService.setDefaultLang('es');
    this.BrandId = this.cActivatedRoute.snapshot.params.BrandId;
    this.cMatPaginatorIntl.itemsPerPageLabel = "Filas por página";
    this.cMatPaginatorIntl.nextPageLabel = "Página siguiente";
    this.cMatPaginatorIntl.previousPageLabel = "Página anterior";
  }

  ngOnInit() {
    this.onLoadBrand();
    this.onLoadServices();
  }
  onLoadBrand() {
    let oDataSend = {
      masterUserId: this.companyUserModel.MasterUserId,
      brandId: this.BrandId
    };
    this.cBrandService.BrandsByCompanyGet(oDataSend).subscribe((oData) => {
      this.oBrandModel = oData[0];
    }, (oErr) => {

    }, () => {

    });
  }
  onLoadServices() {
    let oDataSend = {
      masterUserId: this.companyUserModel.MasterUserId,
      brandId: this.BrandId,
      serviceId: null,
    };
    this.cBrandService.ServicesByBrandByCompanyGet(oDataSend).subscribe((oData) => {
      this.dataSource = new MatTableDataSource(oData);
      this.dataSource.paginator = this.paginator;
    }, (oErr) => {

    }, () => {
      this.IsLoadedServices = true;
    });
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  onModifyService(oServicioMarca) {
    const dialogRef = this.cMatDialog.open(ConfigServiceModifyComponent, { 
      data: oServicioMarca
    });
    dialogRef.afterClosed().subscribe(oResp => {
      if (oResp) {
        this.onLoadServices();
      }
    });
  }
  onActualizarKilometrajeMarcaDialog(oServicioMarca) {
    const dialogRef = this.cMatDialog.open(ConfigMileagesModifyComponent, { 
      data: oServicioMarca
    });
    dialogRef.afterClosed().subscribe(oResp => {
      if (oResp) {
        
      }
    });
   }
  onActualizarEstado(oServicioMarcaModel) { 
    let oDataSend = {
      serviceId: oServicioMarcaModel.ServiceId,
      brandId: oServicioMarcaModel.BrandId,
      companyId: oServicioMarcaModel.CompanyId,
      externalId: oServicioMarcaModel.ExternalId,
      isOwner: oServicioMarcaModel.IsOwner,
      friendlyName: oServicioMarcaModel.FriendlyName,
      detail: oServicioMarcaModel.Detail,
      colorHex: oServicioMarcaModel.ColorHex,
      isActived: !oServicioMarcaModel.IsActived,
      isDeleted: oServicioMarcaModel.IsDeleted,
      blockCount: oServicioMarcaModel.BlockCount,
      blockDuration: oServicioMarcaModel.BlockDuration,
      duration: oServicioMarcaModel.Duration,
      mondayStop: oServicioMarcaModel.MondayStop,
      tuesdayStop: oServicioMarcaModel.TuesdayStop, 
      wednesdayStop: oServicioMarcaModel.WednesdayStop,
      thursdayStop: oServicioMarcaModel.ThursdayStop,
      fridayStop: oServicioMarcaModel.FridayStop,
      saturdayStop: oServicioMarcaModel.SaturdayStop, 
      sundayStop: oServicioMarcaModel.SundayStop, 
    };
    this.cBrandService.ServicesByBrandByCompanyModify(oDataSend).subscribe((oData) => {
      let sMessage = '';
      if (oData.codeResponse) {
        let sTrans = "BrandConfigServicesSavedOk"; 
        this.cTranslateService.get(sTrans).subscribe((text: string) => {
          sMessage = text;
        });
        this.cSnackbarService.openSnackBar(sMessage, '', 'Success'); 
        this.onLoadServices();
      } else {
        let sTrans = "BrandConfigServicesSavedError"; 
        this.cTranslateService.get(sTrans).subscribe((text: string) => {
          sMessage = text;
        });
        this.cSnackbarService.openSnackBar(sMessage, '', 'Error');
      }
    }, (oErr) => { 

    }, () => {       
    });

  }
}
