import { Component, OnInit, Inject } from '@angular/core';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { TranslateService } from '@ngx-translate/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { CustomerService } from 'src/app/services/customer.service';
import { Validators, FormControl } from '@angular/forms';
import { MyErrorStateMatcher } from 'src/app/compartido/MyErrorStateMatcher';

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

  CustomerId;
  FirstName;
  LastName;
  FullName = new FormControl();
  IdenticationTypeId;
  CompanyId;
  IdenticationType = new FormControl();
  IdenticationDocument = new FormControl();
  UbigeoName = new FormControl();
  Phone = new FormControl();
  Address = new FormControl();
  Email = new FormControl('', [
    Validators.required,
    Validators.pattern(/^[^@]+@[^@]+\.[a-zA-Z]{2,}$/)
  ]);
  GeolocationId
  public vDepartamento: string = "";
  public vDistrito: string = "";
  public vProvincia: string = "";
  public sCurrentCompanyUser = JSON.parse(localStorage.getItem('CompanyUser'));
  constructor(
    @Inject(MAT_DIALOG_DATA) public message: any,
    public cCustomerService: CustomerService,
    public dialogRef: MatDialogRef<ModifyComponent>,
    private cTranslateService: TranslateService,
    private cSnackbarService: SnackbarService,
  ) {
    this.cTranslateService.setDefaultLang(this.activeLang);
  }

  ngOnInit() {
    this.onSetData(this.message);
  }


  onSetData(element) { 
    this.CustomerId = element.CustomerId;
    this.FirstName = this.OnPonerCadaPalabraMayuscula(element.FirstName.trim());
    this.LastName = this.OnPonerCadaPalabraMayuscula(element.LastName.trim());
    this.FullName.setValue(element.FirstName.trim() + " " + element.LastName.trim());
    this.IdenticationTypeId = element.IdenticationTypeId
    this.IdenticationType.setValue(element.IdenticationType);
    this.IdenticationDocument.setValue(element.IdenticationDocument.trim());
    this.UbigeoName.setValue(element.GeoLocationName.trim());
    this.Phone.setValue(element.Phone);
    this.Address.setValue(element.Address.trim());
    this.Email.setValue(element.Email.trim());
    this.GeolocationId = element.GeolocationId;
    let oDataGeo = element.GeoLocationName.split("|");
    this.vDepartamento = oDataGeo[0];
    this.vProvincia = oDataGeo[1];
    this.vDistrito = oDataGeo[2];
    this.CompanyId = element.CompanyId;
  }


  fnValidarDatos() {
    let flat = true;
    if (!this.Email.valid) {
      flat = false;
    }
    if (!this.Phone.valid) {
      flat = false;
    }
    if (!this.Address.valid) {
      flat = false;
    }
    return flat;
  }

  onSubmitModificarCliente() {
    if (this.fnValidarDatos()) {
      this.bPrevent = true;
      this.isProgress = true;
      let oDataSend = {
        CustomerId: this.CustomerId,
        FirstName: this.FirstName,
        LastName: this.LastName,
        IdenticationTypeId: this.IdenticationTypeId,
        IdenticationDocument: this.IdenticationDocument.value,
        Phone: this.Phone.value,
        Address: this.Address.value,
        Email: this.Email.value,
        GeolocationId: this.GeolocationId === 0 ? 1 : this.GeolocationId,
        ChannelId : 3, //CallCenter
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
}
