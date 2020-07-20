import { Component, OnInit, Inject } from '@angular/core';
import { MyErrorStateMatcher } from 'src/app/compartido/MyErrorStateMatcher';
import { FormControl, Validators } from '@angular/forms';
import { CustomerService } from 'src/app/services/customer.service';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { SnackbarService } from 'src/app/services/snackbar.service';
@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {
  public activeLang = 'es';
  public bPrevent: boolean = false;
  isProgress: boolean = false;
  public isBusqueda: boolean = false;
  matcher = new MyErrorStateMatcher();

  CustomerId = null;
  formTipoDocumento = new FormControl();
  formNDocumento = new FormControl();
  UbigeoName = new FormControl();
  Phone = new FormControl();
  Address = new FormControl();
  formApellidos =  new FormControl();
  formNombres =  new FormControl();
  Email = new FormControl('', [
    Validators.required,
    Validators.pattern(/^[^@]+@[^@]+\.[a-zA-Z]{2,}$/)
  ]);
  formDepartamento = new FormControl();
  formProvincia = new FormControl();
  formDistrito = new FormControl();
  aDepartamento: any[] = [];
  aProvincias: any[] = [];
  aDistritos: any[] = [];
  public aDocumentTypes: any[] = [];
  GeolocationId;
  flagCliente:boolean = false;
  IsLoadCustomer = false;
  modify:boolean=true;
  ipAddress;
  aUploadFiles: any[] = [];
  public sCurrentCompanyUser = JSON.parse(localStorage.getItem('CompanyUser'));
  constructor(
    @Inject(MAT_DIALOG_DATA) public message: any,
    public cCustomerService: CustomerService,
    private cConfigurationService: ConfigurationService,
    private cTranslateService: TranslateService,
    private cSnackbarService: SnackbarService,
    public dialogRef: MatDialogRef<CreateComponent>,
  ) { }

  ngOnInit() {
    this.onLoadDocumentType();
    this.onObtenerDepartamentos();
    this.getIP();
  }
  getIP()  
  {  
      this.cConfigurationService.getIPAddress().subscribe(oRes => {
        this.ipAddress=oRes;  
        this.ipAddress = this.ipAddress.ip;
      });
  } 
    /**
   * Función que carga los tipos de documentos
   */
  onLoadDocumentType() {

    this.IsLoadCustomer = true;
    this.cConfigurationService.obtenerDocumentos().subscribe((aDocumentTypesResponse) => {
      this.aDocumentTypes = aDocumentTypesResponse;
    }, (oError) => {

      this.IsLoadCustomer = false;
    }, () => {

      this.IsLoadCustomer = false;
    })
  }
  onGetCliente() {
    this.IsLoadCustomer = true;
    let oDataSend = {
      plateName: '',
      identicationDocument: this.formNDocumento.value,
      credentialId: null,
      name:'',
      docType:this.formTipoDocumento.value,
      companyId:null,
      isOwner:null,
      customerId:null
    }
    this.cCustomerService.ObtenerClientes(oDataSend).subscribe(oContent => { 
      var aClientes=[];
      aClientes = oContent;
      if(aClientes.length>0){
        this.modify=true;
        this.onSetDatos(aClientes[0]);
      }else{
        this.onGetDatosClienteApi();
        this.modify=false;
      }
      this.flagCliente = true
      this.IsLoadCustomer = false;
    },()=>{
      this.IsLoadCustomer = false;
    }, ()=> {
      
    });
  }
  fnValidarEmail() {
    let flat = true;
    if (!this.Email.valid) {
      flat = false;
    }
    return flat;
  }

  onCreateCliente(){
    if (this.fnValidarEmail()) {
      
      let postData = {
        CustomerId: this.CustomerId,
        Firstname: this.formNombres.value,
        Lastname: this.formApellidos.value,
        TypeDocId: this.formTipoDocumento.value,
        DocumentId: this.formNDocumento.value,
        Phone: this.Phone.value,
        Address: this.Address.value,
        Email: this.Email.value,
        geolocationId: this.GeolocationId === 0 ? 1:this.GeolocationId,
        Host:this.ipAddress,
        AppId: localStorage.getItem("AppId"),
        CompanyId:this.message.CompanyId,
        b64files: JSON.stringify(this.aUploadFiles),
        Plate: this.message.placa,
        Status:this.CustomerId==undefined|| this.CustomerId==null ?3:4,
        channelId: 1,
        RequestType:1,        
      } 
      this.cConfigurationService.registrarUsuario(postData).subscribe(resp => {
        var type="";
        resp.CodeResponse? type="Exito":type="Error"     
        var data = {
          tipo:type,
          mensajeCorto:resp.RetMessage,
          mensajeLargo:resp.TraceMessage
        }
        if(resp.CodeResponse || resp.idType==4){
          this.cSnackbarService.openSnackBar("Se registro correctamente la información", '', 'Success');
          this.dialogRef.close();
        }else{
          this.dialogRef.close();
          localStorage.setItem('Error', JSON.stringify(data));
        }
      }, orr => {

      });
    } else {
      this.cSnackbarService.openSnackBar("Ingrese todos los Datos", '', 'Success');
    }
  }

  onGetDatosClienteApi(){
    this.IsLoadCustomer = true;
    let oDataSend = {
      documentId:this.formNDocumento.value
    };
    this.cConfigurationService.obtenerInfoCliente(oDataSend).subscribe(oContent => { 
      if(JSON.parse(oContent.UserData).FirstName !=null){
        this.modify=true;
      }else{
        this.modify=false;
      }
      
      this.IsLoadCustomer = false;
    },()=>{
      this.IsLoadCustomer = false;
    }, ()=> {
      
    });
  }
  onSetDatos(element){
    this.CustomerId = element.CustomerId;
    this.formApellidos.setValue(this.OnPonerCadaPalabraMayuscula(element.LastName.trim()));
    this.formNombres.setValue(this.OnPonerCadaPalabraMayuscula(element.FirstName.trim()));
    this.UbigeoName.setValue(element.GeoLocationName.trim());
    this.Phone.setValue(element.Phone);
    this.Address.setValue(element.Address.trim());
    this.Email.setValue(element.Email.trim());
    this.GeolocationId = element.GeolocationId;
    let geolocationExternalCode: string="";
    let departmentoExternalCode: string="";
    let provinciaExternalCode: string="";
    if(element.ExternalCodeGeolocation !=undefined && element.ExternalCodeGeolocation !="" ){
      geolocationExternalCode= element.ExternalCodeGeolocation;
      departmentoExternalCode= (geolocationExternalCode ? geolocationExternalCode.substr(0, 2) + '0000' : "");
      provinciaExternalCode = (geolocationExternalCode ? geolocationExternalCode.substr(0, 4) + '00' : "");
    }
    let distritoExternalCode: string = geolocationExternalCode;
    this.formDepartamento.setValue(departmentoExternalCode);
    this.onSelectionChangeDepartamento(departmentoExternalCode);
    this.formProvincia.setValue(provinciaExternalCode);
    this.onSelectionChangeProvincia(provinciaExternalCode);
    this.formDistrito.setValue(distritoExternalCode);

  }
  OnPonerCadaPalabraMayuscula(sPalabras: string): string {
    let aux = '';
    let aPalabra = sPalabras.split(" ");
    aPalabra.forEach(element => {
      element = element.toLowerCase();
      aux += " " + element.charAt(0).toUpperCase() + '' + element.substring(1);
    });
    return aux.trim();
  }
  onObtenerDepartamentos() {
    let oDataSend = {
      externalCode: 'X',
      masterUserId: null,
      companyId: null,
      flagGlobal:true
    } 
    this.cConfigurationService.onGeolocationGet(oDataSend).subscribe(oContent => {
      this.aDepartamento = oContent
    });
  }
  onSelectionChangeDepartamento(departamentoExternalCode) {
    // this.formProvincia.setValue('');
     //this.formDistrito.setValue('');
     let trimExternalCode = departamentoExternalCode.substr(0, 2);
     this.onObtenerProvincias(trimExternalCode);
   }
 
   onObtenerProvincias(externalCode) {
     let oDataSend = {
       externalCode: externalCode.toString(),
       masterUserId: null,
       companyId: null,
       flagGlobal:true
     }
     this.cConfigurationService.onGeolocationGet(oDataSend).subscribe(oContent => {
       this.aProvincias = oContent
     });
   }
 
   onSelectionChangeProvincia(provinciaExternalCode) {
     //this.formDistrito.setValue('');
     let trimExternalCode = provinciaExternalCode.substr(0, 4);
     this.onObtenerDistritos(trimExternalCode);
   }
 
   onObtenerDistritos(externalCode) {
     let oDataSend = {
       externalCode: externalCode.toString(),
       masterUserId: null,
       companyId: null,
       flagGlobal:true
     }
     this.cConfigurationService.onGeolocationGet(oDataSend).subscribe(oContent => {
       this.aDistritos = oContent
     });
   }
  onSelectedDistrict(event){ 
    this.aDistritos.forEach(element => {
      if (element.ExternalCode === String(event.value)) {
        this.GeolocationId = element.GeoLocationId;  
      }
    });
  }

}
