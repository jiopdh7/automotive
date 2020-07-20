import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatDialog, MatPaginatorIntl } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { CompanyService } from 'src/app/services/company.service';
import { ConfigServiceModifyComponent } from './modify/config-service-modify/config-service-modify.component';
import { ConfigMileagesModifyComponent } from './modify/config-mileages-modify/config-mileages-modify.component';

@Component({
  selector: 'app-config-services',
  templateUrl: './config-services.component.html',
  styleUrls: ['./config-services.component.css']
})
export class ConfigServicesComponent implements OnInit {

  private companyUserModel = JSON.parse(localStorage.getItem('CompanyUser'));
  public oModuleSelected = JSON.parse(localStorage.getItem('ModuleSelected')) ? JSON.parse(localStorage.getItem('ModuleSelected')) : {};
  public oCompanyModel;
  private CompanyId = "";
  position = "below";
  public IsLoadedServices = false;
  displayedColumns: string[] = ['servicios', 'friendly', 'duracion', 'estado', 'acciones'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  constructor(
    private cTranslateService: TranslateService,
    private cActivatedRoute: ActivatedRoute,
    public cMatDialog: MatDialog,
    private cCompanyService: CompanyService,
    private cMatPaginatorIntl: MatPaginatorIntl,
    private cSnackbarService:SnackbarService,
    private cRouter: Router
    ) {
    this.cTranslateService.setDefaultLang('es');
    this.CompanyId = this.cActivatedRoute.snapshot.params.CompanyId;
    this.cMatPaginatorIntl.itemsPerPageLabel = "Filas por página";
    this.cMatPaginatorIntl.nextPageLabel = "Página siguiente";
    this.cMatPaginatorIntl.previousPageLabel = "Página anterior";
  }

  ngOnInit() {
    this.onLoadBrand();
  }
  onRegresar(){
    var modulo =JSON.parse(localStorage.getItem("ModuleSelected"));    
    this.cRouter.navigate([modulo.ModulePath]);
  }
  onLoadBrand() {
    let oDataSend = {
      masterUserId: this.companyUserModel.MasterUserId,
      companyId: this.CompanyId,
      isActived: null
    };
    this.cCompanyService.MasterCompanyGet(oDataSend).subscribe((oData) => { 
      this.oCompanyModel = oData[0]; 
    }, (oErr) => {

    }, () => {
      this.onLoadServices();

    });
  }
  onLoadServices() {
    let oDataSend = {
      masterUserId: this.companyUserModel.MasterUserId,
      companyId: this.CompanyId,
      isActived: 1
    };
    this.cCompanyService.BrandsByCompanyGet(oDataSend).subscribe((oData) => {
      let oDataAux = [];
      oData.forEach(element => {
        let oDatas = this.oCompanyModel.ServicesByCompany.find(oEle => oEle.ServiceId.toString() === element.ServiceId.toString() );
        if(oDatas){          
          oDatas.IsActived =  oDatas.IsActived === "1" ? true: false;
          oDatas.IsOwner =  oDatas.IsOwner === "1" ? true: false;
          oDatas.IsDeleted =  oDatas.IsDeleted === "1" ? true: false;
          oDatas.MandatoryKM =  oDatas.MandatoryKM === "1" ? true: false;
          oDataAux.push(oDatas);
        }else{          
          oDataAux.push(element);
        }
      });  
      this.dataSource = new MatTableDataSource(oDataAux);
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
        this.onLoadBrand();
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
      masterUserId: oServicioMarcaModel.MasterUserId,
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
      mandatoryKM:oServicioMarcaModel.MandatoryKM
    };
    this.cCompanyService.ServicesByCompanyModify(oDataSend).subscribe((oData) => {
      let sMessage = '';
      if (oData.codeResponse) {
        let sTrans = "BrandConfigServicesSavedOk"; 
        this.cTranslateService.get(sTrans).subscribe((text: string) => {
          sMessage = text;
        });
        this.cSnackbarService.openSnackBar(sMessage, '', 'Success'); 
        this.onLoadBrand();
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
