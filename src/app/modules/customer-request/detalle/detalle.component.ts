import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { FormControl } from '@angular/forms';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { CustomerRequestService } from 'src/app/services/customer-request.service';
import { ApproveComponent } from '../approve/approve.component';
import { RejectComponent } from '../reject/reject.component';
import { InitComponent } from '../init/init.component';

export class UploadFile {
  constructor(public base64: string, public name: string, public size: number, public type: string) { }
}

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnInit {

  public fechaSolicitud: FormControl = new FormControl('');
  public fechaModificacion: FormControl = new FormControl('');
  public tipoSolicitud: FormControl = new FormControl('');
  public estadoSolicitud: FormControl = new FormControl('');
  public apellidos: FormControl = new FormControl('');
  public nombres: FormControl = new FormControl('');
  public departamento: FormControl = new FormControl('');
  public provincia: FormControl = new FormControl('');
  public distrito: FormControl = new FormControl('');
  public direccion: FormControl = new FormControl('');
  public email: FormControl = new FormControl('');
  public telefono: FormControl = new FormControl('');
  public tipoDocumento: FormControl = new FormControl('');
  public documento: FormControl = new FormControl('');
  public marca: FormControl = new FormControl('');
  public modelo: FormControl = new FormControl('');
  public version: FormControl = new FormControl('');
  public color: FormControl = new FormControl('');
  public placa: FormControl = new FormControl('');
  public vin: FormControl = new FormControl('');
  selectedFileDocumento: any[];
  aUploadFiles: UploadFile[] = [];
  public bShowSubirArchivos = true;
  constructor(
    private cTranslateService: TranslateService,
    public dialogRef: MatDialogRef<DetalleComponent>,
    private cCustomerRequestService: CustomerRequestService,
    private cSnackbarService: SnackbarService,
    public cMatDialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public oSolicitud: any,
  ) { }

  ngOnInit() {
    this.fechaSolicitud.setValue(this.oSolicitud.DateAdd.split("T")[0]);
    this.fechaModificacion.setValue(this.oSolicitud.DateUpd.split("T")[0]);
    this.tipoSolicitud.setValue("");
    this.apellidos.setValue(this.oSolicitud.LastName);
    this.nombres.setValue(this.oSolicitud.Name1);
    this.departamento.setValue(this.oSolicitud.Department);
    this.provincia.setValue(this.oSolicitud.Province);
    this.distrito.setValue(this.oSolicitud.District);
    this.email.setValue(this.oSolicitud.Email);
    this.direccion.setValue(this.oSolicitud.Address);
    this.telefono.setValue(this.oSolicitud.Phone);
    this.tipoDocumento.setValue(this.oSolicitud.Name);
    this.marca.setValue(this.oSolicitud.BrandName);
    this.modelo.setValue(this.oSolicitud.Model);
    this.version.setValue(this.oSolicitud.Version);
    this.color.setValue(this.oSolicitud.Color);
    this.placa.setValue(this.oSolicitud.Plate);
    this.vin.setValue(this.oSolicitud.Vin);
    this.documento.setValue(this.oSolicitud.IdenticationDocument);
    this.tipoSolicitud.setValue(this.oSolicitud.ReqTypeText);
    this.estadoSolicitud.setValue(this.oSolicitud.StatusText);
    (this.oSolicitud.ReqType !== 5 && this.oSolicitud.Status === 0 ) ? this.oSolicitud.bShowSubirArchivos = true : this.oSolicitud.bShowSubirArchivos = false; 
  }
  fnDescargarZip(){
    var element = this.oSolicitud;
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
  onAprobar(){
    this.onActualizarRequest(2,this.oSolicitud,"Se aprobó con éxito la solicitud");
  }
  onRechazar(){
    this.onActualizarRequest(1,this.oSolicitud,"Se rechazó con éxito la solicitud");
  }
  onActualizarRequest(estado,request,mensaje){
    var oDataSend={
      RequestId:request.RequestId,
      CustomerId:request.CustomerId,
      VehicleId:request.VehicleId,
      ChannelId:3,
      Status:estado,
      IsDeleted:0,
      ResourcePath:request.ResourcePath,
      b64files: JSON.stringify(this.aUploadFiles),
    };
    this.cCustomerRequestService.ModificarSolicitudesClientes(oDataSend).subscribe(oContent => { 
      if(oContent.codeResponse){
        this.cSnackbarService.openSnackBar(mensaje, '', 'Exito');
        this.dialogRef.close();
      }else{
        this.cSnackbarService.openSnackBar(mensaje, '', 'Error');
      }
      
    });
  }
  selectFileDocumento(fileInput: any) {
    let that = this;
    if (fileInput.target.files.length !== 0) {
      this.selectedFileDocumento = fileInput.target.files;
      this.aUploadFiles = [];
      Array.from(this.selectedFileDocumento).forEach(element => {
        let reader = new FileReader();
        let splitBase64;
        reader.readAsDataURL(element);
        reader.onload = function () {
          let base64: string = reader.result.toString();
          splitBase64 = base64.split(',')[1];
          that.aUploadFiles.push(new UploadFile(splitBase64, element.name, element.size, element.type));
        };
      });  
    }
  }

}
