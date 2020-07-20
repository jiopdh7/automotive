import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { MatTableDataSource, MatPaginator, MatDialog } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { ChannelModifyComponent } from './modify/channel-modify/channel-modify.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-channel',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.css']
})
export class ChannelComponent implements OnInit {
  IsLoadedServices = true;
  displayedColumns: string[] = ['descripcion', 'estado', 'acciones']
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
    this.onObtenerCanales();
  }
  onRegresar(){
    var modulo =JSON.parse(localStorage.getItem("ModuleSelected"));    
    this.cRouter.navigate([modulo.ModulePath]);
  }
  onObtenerCanales(){
    this.IsLoadedServices = false;
    let oDataS = {
      masterUserId:this.companyUserModel.MasterUserId,
      channelId : null
    }
    this.cConfigurationService.ChannelsByCompanyGet(oDataS).subscribe((oData) => { 
      this.dataSource = new MatTableDataSource<any>(oData);
      this.dataSource.paginator = this.paginator;
    },()=>{
      this.IsLoadedServices = true;

    }, ()=>{
      this.IsLoadedServices = true;

    })
  } 
  onCambiarEstado(element){ 
    element.IsActived =!element.IsActived;
  }
  fnOpenDialogModificarCanal(oCanalItem){
    const dialogRef = this.cMatDialog.open(ChannelModifyComponent, {
      panelClass: 'popUpUsuarios',
      data: oCanalItem
    });
    dialogRef.afterClosed().subscribe(res => {
      if(res){
        this.onObtenerCanales(); 
      }
    });
  }
}
