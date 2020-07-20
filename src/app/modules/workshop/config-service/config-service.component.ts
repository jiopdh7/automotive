import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatDialog } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { WorkshopService } from 'src/app/services/workshop.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyService } from 'src/app/services/company.service';
import { ModifyServicesStopComponent } from './modify/modify-services-stop/modify-services-stop.component';

@Component({
  selector: 'app-config-service',
  templateUrl: './config-service.component.html',
  styleUrls: ['./config-service.component.css']
})
export class ConfigServiceComponent implements OnInit {
  private p_c_taller: string = '';
  IsLoadedWorkshops = false;
  oWorkshopSelected;
  table_length;
  WorkshopId = "";
  public activeLang = 'es';
  displayedColumns: string[] = ['servicios', 'acciones'];
  dataSource; companyId;
  oCompanyModel
  private companyUserModel = JSON.parse(localStorage.getItem('CompanyUser'));
  public oModuleSelected = JSON.parse(localStorage.getItem('ModuleSelected')) ? JSON.parse(localStorage.getItem('ModuleSelected')) : {};
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor
    (
      private cTranslateService: TranslateService,
      private cWorkshopService: WorkshopService,
      private cCompanyService: CompanyService,
      private cActivatedRoute: ActivatedRoute,
      private cMatDialog: MatDialog,
      private cRouter: Router
    ) {
    cTranslateService.setDefaultLang(this.activeLang);
    this.WorkshopId = this.cActivatedRoute.snapshot.params.workshopId;
    this.companyId = this.cActivatedRoute.snapshot.params.companyId;
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
      companyId: this.companyId,
      isActived: null
    };
    this.cCompanyService.MasterCompanyGet(oDataSend).subscribe((oData) => {
      this.oCompanyModel = oData[0];
    }, (oErr) => {

    }, () => {
      this.onLoadWorkshops();

    });
  }
  onLoadWorkshops() {
    this.IsLoadedWorkshops = true;
    let oDataSend = {
      masterUserId: this.companyUserModel.MasterUserId,
      workshopId: this.WorkshopId,
      companyId: this.companyId,
      isActived: '',
      geoLocationId: ''
    };
    this.cWorkshopService.MasterWorkshopGet(oDataSend).subscribe((oData) => {
      let DataAux = [];
      this.oWorkshopSelected = oData[0];
      this.oCompanyModel.ServicesByCompany.forEach(element => {
        element.WorkshopId = this.WorkshopId;
        element.IsActived = element.IsActived === "1" ? true : false;
        element.IsOwner = element.IsOwner === "1" ? true : false;
        element.IsDeleted = element.IsDeleted === "1" ? true : false;
        if (element.IsActived) {
          let oDataAuxSend = this.oWorkshopSelected.ServicesByWorkshop.find(oEle => oEle.ServiceId.toString() === element.ServiceId.toString());
          if (oDataAuxSend) {
            oDataAuxSend.IsActived = oDataAuxSend.IsActived === "1" ? true : false;
            oDataAuxSend.IsOwner = oDataAuxSend.IsOwner === "1" ? true : false;
            oDataAuxSend.IsDeleted = oDataAuxSend.IsDeleted === "1" ? true : false;

            DataAux.push(oDataAuxSend);
          } else { 
            DataAux.push(element);
          }
        }
      }); 
      this.dataSource = new MatTableDataSource(DataAux);
      this.dataSource.paginator = this.paginator;
    }, (oErr) => {

      this.IsLoadedWorkshops = false;
    }, () => {

      this.IsLoadedWorkshops = false;
    });
  }
  fnShowDialogUpdate(element) {
    element.ServicesByCompany = this.oCompanyModel.ServicesByCompany;
    const dialogRef = this.cMatDialog.open(ModifyServicesStopComponent, {
      data: element
    });
    dialogRef.afterClosed().subscribe(oResp => {
      if (oResp) {
        this.onLoadBrand();
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
    return aux;

  }
}
