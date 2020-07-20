import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatPaginator, MatTableDataSource, MatOption } from '@angular/material';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { TranslateService } from '@ngx-translate/core';
import { CustomerRequestService } from 'src/app/services/customer-request.service';
import { ApproveComponent } from '../approve/approve.component';
import { RejectComponent } from '../reject/reject.component';
import { FormControl, Validators } from '@angular/forms';
import { CompanyService } from 'src/app/services/company.service';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { DatePipe } from '@angular/common';
import { DetalleComponent } from '../detalle/detalle.component';
import { debug } from 'console';

@Component({
  selector: 'app-init',
  templateUrl: './init.component.html',
  styleUrls: ['./init.component.css'],
  providers: [DatePipe]
})
export class InitComponent implements OnInit {
  public activeLang = 'es';
  public oModuleSelected = JSON.parse(localStorage.getItem('ModuleSelected')) ? JSON.parse(localStorage.getItem('ModuleSelected')) : {};
  position = "below";
  private companyUserModel = JSON.parse(localStorage.getItem('CompanyUser'));
  clienteSeleccionado;
  //variables de arreglos
  public aCompanies: any[] = [];
  public aDocumentTypes: any[] = [];
  public aPicks: any[] = [];
  public aTipos: any[] = [];
  public aEstados: any[] = [];
  public IsPrincipalLoading: boolean = false;
  private fecha = new Date();
  public vMinEndDate: Date = new Date();
  //form control
  public cControlSolicitud: FormControl = new FormControl(new Date(this.fecha.getFullYear(),this.fecha.getMonth(),1), [Validators.required]);
  public cControlCompany: FormControl = new FormControl('', [Validators.required]);
  public cControlDocumentType: FormControl = new FormControl(null);
  public cControlNombre: FormControl = new FormControl('');
  public cControlPlaca: FormControl = new FormControl('');
  public cControlDocumento: FormControl = new FormControl('');
  public cControlPick: FormControl = new FormControl('');
  public cControlEndDate: FormControl = new FormControl(new Date(this.fecha.getFullYear(),this.fecha.getMonth()+1,0));
  public cControlEstado: FormControl = new FormControl(null);
  public cControlTipo: FormControl = new FormControl(null);
  @ViewChild('allSelectedPick', { static: false }) private allSelectedPick: MatOption;
  @ViewChild('allSelectedEstado', { static: false }) private allSelectedEstado: MatOption;
  @ViewChild('allSelectedTipo', { static: false }) private allSelectedTipo: MatOption;
  constructor(
    private cTranslateService: TranslateService,
    public cMatDialog: MatDialog,
    private cSnackbarService: SnackbarService,
    private cCustomerRequestService: CustomerRequestService,
    private cCompanyService: CompanyService,
    private cConfigurationService: ConfigurationService,
    private cDatePipe: DatePipe
  ) {
    this.cTranslateService.setDefaultLang(this.activeLang);
  }
  public sCurrentCompanyUser = JSON.parse(localStorage.getItem('CompanyUser'));
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  displayedColumns: string[] = ['fechareg','tipoSol','nombres','tipoDoc','documento', 'telefono','placa', 'estado','acciones'];
  dataSource;

  ngOnInit() {    
    //this.onGetTableData();
    this.onLoadCompanies();
    this.onLoadDocumentType();
    this.onLlenarPick();
    this.onListarEstadosSolicitudes();
    this.onListarTiposSolicitudes();
  }
  onListarTiposSolicitudes(){
    this.IsPrincipalLoading = true;
    this.cConfigurationService.obtenerTiposSolicitudes().subscribe((oData) => {
      this.aTipos = oData;
    }, (oError) => {
      this.IsPrincipalLoading = false;
    }, () => {
      this.IsPrincipalLoading = false;
    })
  }
  // onSelectAllTipo() {
    
  //   if (this.allSelectedTipo.selected) {
  //     this.cControlTipo.patchValue([...this.aPicks.map(item => item.IdTypeCustomerRequest), 0]);
  //   } else {
  //     this.cControlTipo.patchValue([]);
  //   }
  // }
  // onSelectPerOneTipo() {
    
  //   if (this.allSelectedTipo.selected) {
  //     this.allSelectedTipo.deselect();
  //     return false;
  //   }
  //   if (this.cControlTipo.value.length == this.aTipos.length)
  //     this.allSelectedTipo.select();
  // }
  // onSelectAllEstado() {
    
  //   if (this.allSelectedEstado.selected) {
  //     this.cControlEstado.patchValue([...this.aPicks.map(item => item.IdStatusCustomerRequest), 0]);
  //   } else {
  //     this.cControlEstado.patchValue([]);
  //   }
  // }
  // onSelectPerOneEstado() {
    
  //   if (this.allSelectedEstado.selected) {
  //     this.allSelectedEstado.deselect();
  //     return false;
  //   }
  //   if (this.cControlEstado.value.length == this.aTipos.length)
  //     this.allSelectedEstado.select();
  // }
  onListarEstadosSolicitudes(){
    this.IsPrincipalLoading = true;
    this.cConfigurationService.obtenerEstadosSolicitudes().subscribe((oData) => {            
      this.aEstados = oData;
      this.cControlEstado.setValue(0);
    }, (oError) => {
      this.IsPrincipalLoading = false;
    }, () => {
      this.IsPrincipalLoading = false;
    })
  }
  onLlenarPick(){
    this.aPicks.push({nombre:"Rechazado",value:false});
    this.aPicks.push({nombre:"Aprobado",value:true});
    
  }
  onSelectFirstDate() {
    this.vMinEndDate = this.cControlSolicitud.value;

  }
  onSelectAllPick() {
    
    if (this.allSelectedPick.selected) {
      this.cControlPick.patchValue([...this.aPicks.map(item => item.value), 0]);
    } else {
      this.cControlPick.patchValue([]);
    }
  }
  onSelectPerOnePick() {
    
    if (this.allSelectedPick.selected) {
      this.allSelectedPick.deselect();
      return false;
    }
    if (this.cControlPick.value.length == this.aPicks.length)
      this.allSelectedPick.select();
  }
    /**
   * Función que carga los tipos de documentos
   */
  onLoadDocumentType() {

    this.IsPrincipalLoading = true;
    this.cConfigurationService.obtenerDocumentos().subscribe((aDocumentTypesResponse) => {
      this.aDocumentTypes = aDocumentTypesResponse;
    }, (oError) => {
      this.IsPrincipalLoading = false;
    }, () => {
      this.IsPrincipalLoading = false;
    })
  }
  onPascalCaseString(sPalabras: string): string {
    let aux = '';
    sPalabras.split(" ").forEach(element => {
      element = element.toLowerCase();
      aux += " " + element.charAt(0).toUpperCase() + '' + element.substring(1);
    });
    return aux;
  }
  ngAfterViewInit() {
    //ir arriba en la pagina
    let top = document.getElementById('top');
    if (top !== null) {
      top.scrollIntoView();
      top = null;
    }
  }
    /**
   * Función que lista las companias
   */
  onLoadCompanies() {
    this.IsPrincipalLoading = true;
    let oDataSendCompany = {
      masterUserId: this.sCurrentCompanyUser.MasterUserId,
      companyId: null,
      isActived: null
    }
    this.cCompanyService.MasterCompanyGet(oDataSendCompany).subscribe((aCompaniesResponse) => {
      var companies = JSON.parse(localStorage.getItem("CompanyUser")).OrganizationUsersByCompany;
      var aCompañias=[];
      var companieDefect = companies[0].CompanyId;
      companies.forEach(element => {
        aCompaniesResponse.forEach(c => {
          if(element.CompanyId.toUpperCase()==c.CompanyId.toUpperCase()){
            aCompañias.push(c);
          }
        });
      });
      this.aCompanies = aCompañias;
      this.cControlCompany.setValue(companieDefect.toLocaleLowerCase());
      this.onGetTableData();
    }, (oError) => {
      this.IsPrincipalLoading = false;
    }, () => {
      this.IsPrincipalLoading = false;
    });
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onGetTableData() {
    let vStartDateAux = this.cDatePipe.transform(this.cControlSolicitud.value, 'yyyy-MM-dd');
    let vEndDateAux = this.cDatePipe.transform(this.cControlEndDate.value, 'yyyy-MM-dd');
    this.clienteSeleccionado === undefined;
    let oDataSend = {
      masterUserId: this.companyUserModel.MasterUserId,
      companyId: this.cControlCompany.value,
      requestId:null,
      customerId:null,
      brandId: null,
      status: this.cControlEstado.value,
      isDeleted: null,
      dateFrom: vStartDateAux,
      dateTo: vEndDateAux,
      docType:this.cControlDocumentType.value,
      name:this.cControlNombre.value,
      identificationDocument:this.cControlDocumento.value,
      typeRequest:this.cControlTipo.value
    }

    this.cCustomerRequestService.ObtenerSolicitudesClientes(oDataSend).subscribe(oContent => {
      var datos = [];
      if(this.cControlPlaca.value !=null || this.cControlPlaca.value !=undefined || this.cControlPlaca.value !=""){
        
        oContent.forEach(element => {   
          var index = element.Plate.indexOf(this.cControlPlaca.value);
          if(index!=-1){
            datos.push(element);
          }
        });
        this.dataSource = new MatTableDataSource<any>(datos);
      }else{
        this.dataSource = new MatTableDataSource<any>(oContent);
      }
          
      this.dataSource.paginator = this.paginator;
    });
  }
  fnDescargarZip(element){
    var oDataSend= {
      url: element.ResourcePath
    }
    if(element.ResourcePath=="" || element.ResourcePath==null || element.ResourcePath== undefined){
      this.cSnackbarService.openSnackBar("No se encontro el archivo", '', 'Error');
      return;
    }
    this.cCustomerRequestService.ObtenerBase64S3(oDataSend).subscribe(oContent => { 
      if(oContent=="" || oContent==null || oContent== undefined){
        this.cSnackbarService.openSnackBar("No se encontro el archivo", '', 'Error');
        return;
      }
      const linkSource = 'data:application/x-bzip;base64,'+ oContent;
      const downloadLink = document.createElement("a");
      const fileName = element.CustomerId+".zip";
      downloadLink.href = linkSource;
      downloadLink.download = fileName;
      downloadLink.click();
    });
  }
  fnShowDialogAprobar() {
    if (this.clienteSeleccionado !== undefined) {
      const dialogRef = this.cMatDialog.open(ApproveComponent, {
        data: this.clienteSeleccionado
      });
      dialogRef.afterClosed().subscribe(oResp => {
        this.onGetTableData();
      });
    } else {
      let sMessage = '';
      let sTrans = "CustomerRequestNoSelectCliente";
      this.cTranslateService.get(sTrans).subscribe((text: string) => {
        sMessage = text;
      });
      this.cSnackbarService.openSnackBar(sMessage, '', 'Error');
    }
  }

  fnShowDialogRechazar() {
    if (this.clienteSeleccionado !== undefined) {
      const dialogRef = this.cMatDialog.open(RejectComponent, {
        data: this.clienteSeleccionado
      });
      dialogRef.afterClosed().subscribe(oResp => {
        this.onGetTableData();
      });
    } else {
      let sMessage = '';
      let sTrans = "CustomerRequestNoSelectCliente";
      this.cTranslateService.get(sTrans).subscribe((text: string) => {
        sMessage = text;
      });
      this.cSnackbarService.openSnackBar(sMessage, '', 'Error');
    }
  }

  onSelectionChange(element) {
    this.clienteSeleccionado = element;
  }
  onAprobar(element){
    this.onActualizarRequest(2,element,"Se aprobó con éxito la solicitud");
  }
  onRechazar(element){
    this.onActualizarRequest(1,element,"Se rechazó con éxito la solicitud");
  }
  onActualizarRequest(estado,request,mensaje){
    var oDataSend={
      RequestId:request.RequestId,
      CustomerId:request.CustomerId,
      VehicleId:request.VehicleId,
      ChannelId:null,
      Status:estado,
      IsDeleted:null,
      ResourcePath:request.ResourcePath
    };
    this.cCustomerRequestService.ModificarSolicitudesClientes(oDataSend).subscribe(oContent => { 
      if(oContent.codeResponse){
        this.cSnackbarService.openSnackBar(mensaje, '', 'Exito');
      }else{
        this.cSnackbarService.openSnackBar(mensaje, '', 'Error');
      }
      
    });
  }
  onVerDetalle(solicitud){
    const dialogRef = this.cMatDialog.open(DetalleComponent, {
      data: solicitud
    });

    dialogRef.afterClosed().subscribe(res => {
      this.onGetTableData();
    });
  }
}
