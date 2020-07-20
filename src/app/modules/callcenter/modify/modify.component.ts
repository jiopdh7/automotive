import { Component, OnInit, Inject } from '@angular/core';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { TranslateService } from '@ngx-translate/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { CustomerService } from 'src/app/services/customer.service';
import { Validators, FormControl } from '@angular/forms';
import { MyErrorStateMatcher } from 'src/app/compartido/MyErrorStateMatcher';
import { ConfigurationService } from 'src/app/services/configuration.service';

@Component({
  selector: 'app-modify',
  templateUrl: './modify.component.html',
  styleUrls: ['./modify.component.css']
})
export class ModifyComponent implements OnInit {
  public activeLang = 'es';
  public bPrevent: boolean = false;
  isProgress: boolean = false;
  public isBusqueda: boolean = false;
  matcher = new MyErrorStateMatcher();

  CustomerId = null;
  formTipoDocumento = new FormControl();
  formNDocumento = new FormControl();
  FullName = new FormControl();
  IdenticationTypeId;
  IdenticationType = new FormControl();
  IdenticationDocument = new FormControl();
  Phone = new FormControl();
  Address = new FormControl();
  Email = new FormControl('', [
    Validators.required,
    Validators.pattern(/^[^@]+@[^@]+\.[a-zA-Z]{2,}$/)
  ]);
  formDepartamento = new FormControl();
  formProvincia = new FormControl();
  formDistrito = new FormControl();
  formApellidos = new FormControl();
  formNombres = new FormControl();
  formIsOwner = new FormControl(true);
  aDepartamento: any[] = [];
  aProvincias: any[] = [];
  aDistritos: any[] = [];
  public aDocumentTypes: any[] = [];
  aUploadFiles: any[] = [];
  GeolocationId;
  CompanyId;
  ipAddress;
  IsLoadCustomer = false;
  bInvalido: boolean = false;
  public sCurrentCompanyUser = JSON.parse(localStorage.getItem('CompanyUser'));
  public vDepartamento: string = "";
  public vDistrito: string = "";
  public vProvincia: string = "";
  flagCliente: boolean = false;
  modify: boolean = false;
  creacion: boolean = false;
  titulo = "";
  constructor(
    @Inject(MAT_DIALOG_DATA) public message: any,
    public cCustomerService: CustomerService,
    public dialogRef: MatDialogRef<ModifyComponent>,
    private cTranslateService: TranslateService,
    private cSnackbarService: SnackbarService,
    public cConfiguratioService: ConfigurationService
  ) {
    this.cTranslateService.setDefaultLang(this.activeLang);
  }

  ngOnInit() {
    this.onLoadDocumentType();
    this.getIP();
    var sMessage = "";
    if (this.message.tipo == "UPDATE") {
      var sMessage = "";
      let sTrans = "clientes.dialog.update.titulo";
      this.cTranslateService.get(sTrans).subscribe((text: string) => {
        sMessage = text;
      });
      this.titulo = sMessage;
      this.flagCliente = true;
      this.modify = true;
      this.onSetData(this.message);
      this.creacion = false;
    } else {
      let sTrans = "clientes.btn.crear";
      this.cTranslateService.get(sTrans).subscribe((text: string) => {
        sMessage = text;
      });
      this.titulo = sMessage;
      this.modify = false;
      this.creacion = true;
      this.onSetDataCreate(this.message);
    }

    this.onObtenerDepartamentos();
  }
  onSetDataCreate(element) {
    this.CompanyId = element.CompanyId;
  }
  getIP() {
    this.cConfiguratioService.getIPAddress().subscribe(oRes => {
      this.ipAddress = oRes;
      this.ipAddress = this.ipAddress.ip;
    });
  }
  onSetData(element) {
    this.CompanyId = element.CompanyId;
    this.CustomerId = element.CustomerId;
    this.formNombres.setValue(this.OnPonerCadaPalabraMayuscula(element.FirstName.trim()));
    this.formApellidos.setValue(this.OnPonerCadaPalabraMayuscula(element.LastName.trim()));
    this.IdenticationTypeId = element.IdenticationTypeId
    this.formTipoDocumento.setValue(element.IdenticationTypeId);
    this.formNDocumento.setValue(element.IdenticationDocument.trim());
    this.Phone.setValue(element.Phone);
    this.Address.setValue(element.Address.trim());
    this.Email.setValue(element.Email.trim());
    this.GeolocationId = element.GeolocationId;
    let oDataGeo = element.GeoLocationName.split("|");
    this.vDepartamento = oDataGeo[0];
    this.vProvincia = oDataGeo[1];
    this.vDistrito = oDataGeo[2];
    let geolocationExternalCode: string = "";
    let departmentoExternalCode: string = "";
    let provinciaExternalCode: string = "";
    if (element.ExternalCodeGeolocation != undefined && element.ExternalCodeGeolocation != "") {
      geolocationExternalCode = element.ExternalCodeGeolocation;
      departmentoExternalCode = (geolocationExternalCode ? geolocationExternalCode.substr(0, 2) + '0000' : "");
      provinciaExternalCode = (geolocationExternalCode ? geolocationExternalCode.substr(0, 4) + '00' : "");
    }
    let distritoExternalCode: string = geolocationExternalCode;
    this.formDepartamento.setValue(departmentoExternalCode);
    this.onSelectionChangeDepartamento(departmentoExternalCode);
    this.formProvincia.setValue(provinciaExternalCode);
    this.onSelectionChangeProvincia(provinciaExternalCode);
    this.formDistrito.setValue(distritoExternalCode);
    //this.onSelectionChangeDistrito(distritoExternalCode);
  }


  fnValidarEmail() {
    let flat = true;
    if (!this.Email.valid) {
      flat = false;
    }
    return flat;
  }
  onTransaction() {
    localStorage.setItem('Trx', "X");
    if (this.message.tipo == "UPDATE") {
      this.onSubmitModificarCliente();
    } else {
      this.onCreateCliente();
    }
  }

  onSubmitModificarCliente() {
    if (this.fnValidarEmail()) {
      this.bPrevent = true;
      this.isProgress = true;
      let oDataSend = {
        CustomerId: this.CustomerId,
        Firstname: this.formNombres.value,
        Lastname: this.formApellidos.value,
        IdenticationTypeId: this.formTipoDocumento.value,
        IdenticationDocument: this.formNDocumento.value,
        Phone: this.Phone.value,
        Address: this.Address.value,
        Email: this.Email.value,
        GeolocationId: this.GeolocationId === 0 ? 1 : this.GeolocationId,
        ChannelId: 3, //CallCenter
        Status: 5,
        CompanyId: this.CompanyId,
        MasterUserId: this.sCurrentCompanyUser.MasterUserId,
      }
      this.cCustomerService.ModificarClientes(oDataSend).subscribe(
        oRes => {
          let sMessage = '';
          if (oRes.codeResponse) {
            let sTrans = "CustomerUpdateMessage";
            this.cTranslateService.get(sTrans).subscribe((text: string) => {
              sMessage = text;
            });
            this.cSnackbarService.openSnackBar(sMessage, '', 'Success');
            this.dialogRef.close();

            this.isProgress = false;
            this.bPrevent = false;
          } else {
            let sTrans = "UserCreateError";
            this.cTranslateService.get(sTrans).subscribe((text: string) => {
              sMessage = text;
            });
            this.isProgress = false;
            this.bPrevent = false;
            this.cSnackbarService.openSnackBar(sMessage, '', 'Error');
          }
        }
      )
    } else {
      let sMessage = '';
      let sTrans = "CustomerCreateMissingFields";
      this.cTranslateService.get(sTrans).subscribe((text: string) => {
        sMessage = text;
      });
      this.cSnackbarService.openSnackBar(sMessage, '', 'Error');
    }
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
      flagGlobal: true
    }
    this.cConfiguratioService.onGeolocationGet(oDataSend).subscribe(oContent => {
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
      flagGlobal: true
    }
    this.cConfiguratioService.onGeolocationGet(oDataSend).subscribe(oContent => {
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
      flagGlobal: true
    }
    this.cConfiguratioService.onGeolocationGet(oDataSend).subscribe(oContent => {
      this.aDistritos = oContent
    });
  }
  onSelectedDistrict(event) { 
    this.aDistritos.forEach(element => {
      if (element.ExternalCode === String(event.value)) {
        this.GeolocationId = element.GeoLocationId; 
      }
    });
  }
  /**
* Función que carga los tipos de documentos
*/
  onLoadDocumentType() {
    this.IsLoadCustomer = true;
    this.cConfiguratioService.obtenerDocumentos().subscribe((aDocumentTypesResponse) => {
      this.aDocumentTypes = aDocumentTypesResponse;
    }, (oError) => {

      this.IsLoadCustomer = false;
    }, () => {

      this.IsLoadCustomer = false;
    })
  }
  onGetCliente() {
    var iTipoDocumento = this.formTipoDocumento.value;
    let sDocumento = this.formNDocumento.value.trim();
    if (iTipoDocumento && iTipoDocumento === 1) {
      (sDocumento.length === 8) ? this.bInvalido = false : this.bInvalido = true;
    } else if (iTipoDocumento && iTipoDocumento === 6) {
      (sDocumento.length === 11) ? this.bInvalido = false : this.bInvalido = true;
      // this.bInvalido = (!this.validarInput(sDocumento));
    }else if(iTipoDocumento){
      this.bInvalido = false;
    }
    if (this.bInvalido) {
      return;
    }

    this.IsLoadCustomer = true;
    let oDataSend = {
      plateName: '',
      identicationDocument: this.formNDocumento.value,
      credentialId: null,
      name: '',
      docType: this.formTipoDocumento.value,
      companyId: null,
      isOwner: null,
      customerId: null
    }
    this.cCustomerService.ObtenerClientes(oDataSend).subscribe(oContent => {
      var aClientes = [];
      aClientes = oContent;
      if (aClientes.length > 0) {
        this.modify = true;
        this.onSetData(aClientes[0]);
      } else {
        this.modify = false;
        this.onGetDatosClienteApi();
      }
      this.flagCliente = true
      this.IsLoadCustomer = false;
    }, () => {
      this.IsLoadCustomer = false;
    }, () => {

    });
  }
  validarInput(input) {
    var ruc = input.replace(/[-.,[\]()\s]+/g, "");

    //Es entero?    
    if ((ruc = Number(ruc)) && ruc % 1 === 0
      && this.rucValido(ruc)) { // ⬅️ ⬅️ ⬅️ ⬅️ Acá se comprueba
      return true;
    } else {
      return false;
    }
  }

  // Devuelve un booleano si es un RUC válido
  // (deben ser 11 dígitos sin otro caracter en el medio)
  rucValido(ruc) {
    //11 dígitos y empieza en 10,15,16,17 o 20
    if (!(ruc >= 1e10 && ruc < 11e9
       || ruc >= 15e9 && ruc < 18e9
       || ruc >= 2e10 && ruc < 21e9))
        return false;
    var dRuc = ruc - 1 + 1;
    
    for (var suma = -(ruc%10<2), i = 0; i<11; i++, ruc = ruc/10|0)
        suma += (ruc % 10) * (i % 7 + (i/7|0) + 1);
    
    let complemento = 11 - (suma % 11);
    return dRuc % 10 == complemento % 10

    // return suma % 11 === 0;    
}
  onGetDatosClienteApi() {
    this.IsLoadCustomer = true;
    let oDataSend = {
      documentId: this.formNDocumento.value
    };
    this.cConfiguratioService.obtenerInfoCliente(oDataSend).subscribe(oContent => {
      if (oContent.CodeResponse) {
        let oData = JSON.parse(oContent.UserData);
        this.formNombres.setValue(this.OnPonerCadaPalabraMayuscula(oData.FirstName.trim()));
        this.formApellidos.setValue(this.OnPonerCadaPalabraMayuscula(oData.LastName.trim()));
        this.modify = true;
      } else {
        this.modify = false;
      }

      this.IsLoadCustomer = false;
    }, () => {
      this.IsLoadCustomer = false;
    }, () => {

    });
  }
  onCreateCliente() {
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
        geolocationId: this.GeolocationId === 0 ? 1 : this.GeolocationId,
        Host: this.ipAddress,
        AppId: localStorage.getItem("AppId"),
        CompanyId: this.message.CompanyId,
        b64files: JSON.stringify(this.aUploadFiles),
        Plate: this.message.placa,
        Status: this.CustomerId == undefined || this.CustomerId == null ? 3 : 4,
        channelId: 1,
        RequestType: 1,
        IsOwner: this.formIsOwner.value
      }
      this.cConfiguratioService.registrarUsuario(postData).subscribe(resp => {
        var type = "";
        resp.CodeResponse ? type = "Exito" : type = "Error"
        var data = {
          tipo: type,
          mensajeCorto: resp.RetMessage,
          mensajeLargo: resp.TraceMessage
        }
        if (resp.CodeResponse || resp.idType == 4) {
          this.cSnackbarService.openSnackBar("Se registro correctamente la información", '', 'Success');
          this.dialogRef.close();
        } else {
          this.dialogRef.close();
          localStorage.setItem('Error', JSON.stringify(data));
        }
      }, orr => {

      });
    } else {
      this.cSnackbarService.openSnackBar("Ingrese todos los Datos", '', 'Success');
    }
  }

}
