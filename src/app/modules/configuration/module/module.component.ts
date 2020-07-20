import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog, MatSnackBar, MatPaginator, MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { ModuleEditComponent } from './edit/module-edit/module-edit.component';

@Component({
  selector: 'app-module',
  templateUrl: './module.component.html',
  styleUrls: ['./module.component.css']
})
export class ModuleComponent implements OnInit {
  public oModuleSelected = JSON.parse(localStorage.getItem('ModuleSelected')) ? JSON.parse(localStorage.getItem('ModuleSelected')) : -1;
  private companyUserModel = JSON.parse(localStorage.getItem('CompanyUser'));
  position = "below";
  /*i18n*/
  public activeLang = 'es';
  constructor(
    private cConfigurationService: ConfigurationService,
    private cTranslateService: TranslateService,
    public cMatDialog: MatDialog,
    // private moduloService: ModuloServiceService,
    private cMatSnackBar: MatSnackBar,
    /*ROUTER*/
    private cRouter: Router,
  ) {
    /*i18n*/
    this.cTranslateService.setDefaultLang(this.activeLang);
  }
  displayedColumns: string[] = ['modulo', 'acciones']
  dataSource;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  ngOnInit() {
    this.obtenerModulos();
  }
  onRegresar(){
    var modulo =JSON.parse(localStorage.getItem("ModuleSelected"));    
    this.cRouter.navigate([modulo.ModulePath]);
  }
  obtenerModulos() {
    let oDataSend = {
      masterUserId: this.companyUserModel.MasterUserId,
      credentialId: null
    };
    this.cConfigurationService.ModulesByCompanyUserGet(oDataSend)
      .subscribe(resp => {
        this.dataSource = new MatTableDataSource<any>(resp);
        this.dataSource.paginator = this.paginator;
      });
  }

  fnOpenDialogModificarDetalle(oData) {
    const dialogRef = this.cMatDialog.open(ModuleEditComponent, {
      panelClass: 'popUpUsuarios',
      data: oData
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.obtenerModulos();
      }
    });
  }

}
