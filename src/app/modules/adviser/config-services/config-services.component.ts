import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatDialog, MatPaginatorIntl } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdviserService } from 'src/app/services/adviser.service';
import { ConfigServiceModifyComponent } from './modify/config-service-modify/config-service-modify.component';
import { CompanyService } from 'src/app/services/company.service';
import { WorkshopService } from 'src/app/services/workshop.service';

@Component({
  selector: 'app-config-services',
  templateUrl: './config-services.component.html',
  styleUrls: ['./config-services.component.css']
})
export class ConfigServicesComponent implements OnInit {
  position = "below";
  companyAdviserId = '';
  companyId = '';
  companyModel;
  public IsLoadedServices = false;
  private companyUserModel = JSON.parse(localStorage.getItem('CompanyUser'));
  public oModuleSelected = JSON.parse(localStorage.getItem('ModuleSelected')) ? JSON.parse(localStorage.getItem('ModuleSelected')) : {};
  displayedColumns: string[] = ['friendly', 'acciones'];
  dataSource: MatTableDataSource<any>;
  public oAdviserModel;
  public oWorkshopModel = [];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  constructor(
    private cAdviserService: AdviserService,
    private cTranslateService: TranslateService,
    private cActivatedRoute: ActivatedRoute,
    public cMatDialog: MatDialog,
    private cMatPaginatorIntl: MatPaginatorIntl,
    private cWorkshopService: WorkshopService,
    private cRouter: Router,
    private cCompanyService: CompanyService
  ) {
    this.cTranslateService.setDefaultLang('es');
    this.companyAdviserId = this.cActivatedRoute.snapshot.params.companyAdviserId;
    this.companyId = this.cActivatedRoute.snapshot.params.companyId;
    this.cMatPaginatorIntl.itemsPerPageLabel = "Filas por página";
    this.cMatPaginatorIntl.nextPageLabel = "Página siguiente";
    this.cMatPaginatorIntl.previousPageLabel = "Página anterior";
  }

  ngOnInit() {
    this.onGetAdviser();
  }
  onRegresar(){
    var modulo =JSON.parse(localStorage.getItem("ModuleSelected"));    
    this.cRouter.navigate([modulo.ModulePath]);
  }
  onGetAdviser() {
    this.IsLoadedServices = true;
    let oDataSend = {
      masterUserId: this.companyUserModel.MasterUserId,
      companyId: this.companyId,
      workshopId: '',
      companyAdviserId: this.companyAdviserId,
      isActived: ''
    }
    this.cAdviserService.ObtenerAsesores(oDataSend).subscribe(oContent => {
      this.oAdviserModel = oContent[0]; 
    }, (oErr) => {

      this.IsLoadedServices = false;
    }, () => {
      this.IsLoadedServices = false;
      this.onLoadService();
    });
  }
  onGetWorkshop() {
    this.IsLoadedServices = true;
    let oDataSend = {
      masterUserId: this.companyUserModel.MasterUserId,
      companyId: this.companyId,
      workshopId: this.oAdviserModel.WorkshopId,
      isActived: '1',
      geoLocationId: ''
    };
    this.cWorkshopService.MasterWorkshopGet(oDataSend).subscribe((oData) => {
      let DataAux = [];  
      this.oWorkshopModel = [] 
      oData[0].ServicesByWorkshop.forEach(element => { 
        this.oWorkshopModel.push(Object.assign({}, element));
        let oDataAuxSend = this.oAdviserModel.ServicesByCompanyAdviser.find(oEle => oEle.ServiceId.toString() === element.ServiceId.toString());
        if (oDataAuxSend) {
          element.FridayStop = oDataAuxSend.FridayStop;
          element.MondayStop = oDataAuxSend.MondayStop;
          element.SaturdayStop = oDataAuxSend.SaturdayStop;
          element.SundayStop = oDataAuxSend.SundayStop;
          element.ThursdayStop = oDataAuxSend.ThursdayStop;
          element.TuesdayStop = oDataAuxSend.TuesdayStop;
          element.WednesdayStop = oDataAuxSend.WednesdayStop;
          DataAux.push(oDataAuxSend);
        } else {
          element.FridayStop = '-1';
          element.MondayStop = '-1';
          element.SaturdayStop = '-1';
          element.SundayStop = '-1';
          element.ThursdayStop = '-1';
          element.TuesdayStop = '-1';
          element.WednesdayStop = '-1';
          DataAux.push(element);
        }
      }); 
      this.dataSource = new MatTableDataSource(DataAux);
      this.dataSource.paginator = this.paginator;
    }, (oErr) => {

    }, () => {

      this.IsLoadedServices = false;
    });
  }
  //
  onLoadService() {
    let oDataSend = {
      masterUserId: this.companyUserModel.MasterUserId,
      companyId: this.companyId
    };
    this.cCompanyService.BrandsByCompanyGet(oDataSend).subscribe((oData) => { 
      var serviceAux = [];
      let DataAux = [];  
      oData.forEach(element => {
        if(element.IsActived == "1"){
          serviceAux.push(element);
        }
      });
      serviceAux.forEach(element => {
        //this.oWorkshopModel.push(Object.assign({}, element));
        let oDataAuxSend = this.oAdviserModel.ServicesByCompanyAdviser.find(oEle => oEle.ServiceId.toString() === element.ServiceId.toString());
        if (oDataAuxSend) {
          element.FridayStop = oDataAuxSend.FridayStop;
          element.MondayStop = oDataAuxSend.MondayStop;
          element.SaturdayStop = oDataAuxSend.SaturdayStop;
          element.SundayStop = oDataAuxSend.SundayStop;
          element.ThursdayStop = oDataAuxSend.ThursdayStop;
          element.TuesdayStop = oDataAuxSend.TuesdayStop;
          element.WednesdayStop = oDataAuxSend.WednesdayStop;
          DataAux.push(oDataAuxSend);
        } else {
          element.FridayStop = '-1';
          element.MondayStop = '-1';
          element.SaturdayStop = '-1';
          element.SundayStop = '-1';
          element.ThursdayStop = '-1';
          element.TuesdayStop = '-1';
          element.WednesdayStop = '-1';
          DataAux.push(element);
        }
      }); 
      this.dataSource = new MatTableDataSource(DataAux);
      this.dataSource.paginator = this.paginator;
      //this.aServices = serviceAux;
    }, (oErr) => {

    }, () => {
    });
  }

  //
  onLoadServices() {
    let oDataSend = {
      masterUserId: this.companyUserModel.MasterUserId,
      companyAdviserId: this.companyAdviserId,
      brandId: this.cAdviserService.asesorModel.BrandId,
      workshopId: this.cAdviserService.asesorModel.WorkshopId,
      serviceId: 0
    };
    this.cAdviserService.ObtenerServiciosxAsesores(oDataSend).subscribe((oData) => {
      this.dataSource = new MatTableDataSource(oData);
      this.dataSource.paginator = this.paginator;
    }, (oErr) => {

    }, () => {
      this.IsLoadedServices = true;
    });
  }
  onActualizarEstado(element) {

  }
  onModifyService(element) { 
    element.CompanyAdviserId = this.companyAdviserId;
    element.ServicesByWorkshop = this.oWorkshopModel; 
    element.CompanyId = this.companyId;
    element.WorkshopId = this.oAdviserModel.WorkshopId;
    const dialogRef = this.cMatDialog.open(ConfigServiceModifyComponent, {
      data: element
    });
    dialogRef.afterClosed().subscribe(oResp => {
      if (oResp) {
        this.onGetAdviser();
      }
    });
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
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
}
