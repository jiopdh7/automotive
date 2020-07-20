import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatDialog } from '@angular/material';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { TranslateService } from '@ngx-translate/core';
import { RoleModifyComponent } from './modify/role-modify/role-modify.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-config-role',
  templateUrl: './config-role.component.html',
  styleUrls: ['./config-role.component.css']
})
export class ConfigRoleComponent implements OnInit {

  IsLoadedServices = true;
  displayedColumns: string[] = ['descripcion', 'estado','acciones']
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  public oModuleSelected = JSON.parse(localStorage.getItem('ModuleSelected')) ? JSON.parse(localStorage.getItem('ModuleSelected')) : -1;
  private companyUserModel = JSON.parse(localStorage.getItem('CompanyUser'));
  constructor(
    private cConfigurationService:ConfigurationService,
    private cTranslateService: TranslateService,
    public cMatDialog: MatDialog,    
    private cRouter: Router
    ) {
      cTranslateService.setDefaultLang('es');

     }

  ngOnInit() {
    this.onObtenerRoles();
  }
  onRegresar(){
    var modulo =JSON.parse(localStorage.getItem("ModuleSelected"));    
    this.cRouter.navigate([modulo.ModulePath]);
  }
  onObtenerRoles(){
    this.IsLoadedServices = false;
    let oDataSend = {
      masterUserId: this.companyUserModel.MasterUserId,
      organizationRoleId: null
    }
    this.cConfigurationService.CompanyRoleGet(oDataSend).subscribe(oData=> {
      this.dataSource = new MatTableDataSource(oData);
      this.dataSource.paginator = this.paginator;
    }, oErr => {
      this.IsLoadedServices = true;
    }, ()=>{
      this.IsLoadedServices = true;
    })
  }
  onEditarRol(oRolItem){ 
    const dialogRef = this.cMatDialog.open(RoleModifyComponent, {
      panelClass: 'popUpUsuarios',
      data: oRolItem
    });
    dialogRef.afterClosed().subscribe(res => {
      if(res){
        this.onObtenerRoles();         
      }
    });
  }
  onEliminarRol(oRolItem){
    let aData = {
      masterUserId: this.companyUserModel.MasterUserId,
      name: oRolItem.Name,
      isActived: !oRolItem.IsActived,
      organizationRoleId: oRolItem.OrganizationRoleId,
      modules: ''
    };
    let aux = [];
    oRolItem.Modules.forEach(element => {      
      aux.push(element.OrganizationModuleId);
    });
    aData.modules = aux.toString(); 
    this.cConfigurationService.CompanyRolModify(aData).subscribe(oData => {
      let sMessage = '';
      if (oData.codeResponse) {
        let sTrans = "";
        // if(this.oCanalModel.ChannelId){
        //   sTrans = "ConfigurationChannelModifyOkActualizado";
        // }else{
        //   sTrans = "ConfigurationChannelModifyOkRegistro";
        // }
        // this.cTranslateService.get(sTrans).subscribe((text: string) => {
        //   sMessage = text;
        // });
        // this.cSnackbarService.openSnackBar(sMessage, '', 'Success'); 

        this.onObtenerRoles();
      } else {
        let sTrans = "";
        // if(this.oCanalModel.ChannelId){
        //   sTrans = "ConfigurationChannelModifyErrorActualizado";
        // }else{
        //   sTrans = "ConfigurationChannelModifyErrorRegistro";
        // }
        // this.cTranslateService.get(sTrans).subscribe((text: string) => {
        //   sMessage = text;
        // });
        // this.cSnackbarService.openSnackBar(sMessage, '', 'Error');
      }
    }, oErr => {
      this.IsLoadedServices = true;
    }, () => {
      this.IsLoadedServices = true;
    })
  }
  onCrearRol(){
    const dialogRef = this.cMatDialog.open(RoleModifyComponent, {
      panelClass: 'popUpUsuarios',
      data: {Modules:[], RoleId:null}
    });
    dialogRef.afterClosed().subscribe(res => {
      if(res){
        this.onObtenerRoles();
      }
    });
  }

}
