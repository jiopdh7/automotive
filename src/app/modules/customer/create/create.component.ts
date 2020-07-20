import { Component, OnInit } from '@angular/core';
import { MyErrorStateMatcher } from 'src/app/compartido/MyErrorStateMatcher';
import { MatDialogRef } from '@angular/material';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { TranslateService } from '@ngx-translate/core';
import { Validators, FormControl } from '@angular/forms';
import { CustomerService } from 'src/app/services/customer.service';

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

  CustomerId;
  PlateName = new FormControl('', [
    Validators.required
  ]);
  FirstName;
  LastName;
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
  PlateNameForCreate;
  GeolocationId;
  public vDepartamento: string = "";
  public vDistrito: string = "";
  public vProvincia: string = "";
  constructor(
    public cCustomerService: CustomerService,
    public dialogRef: MatDialogRef<CreateComponent>,
    private cTranslateService: TranslateService,
    private cSnackbarService: SnackbarService,
  ) {
    this.cTranslateService.setDefaultLang(this.activeLang);
  }

  ngOnInit() {

  }

  fnValidarPlaca() {
    let flat = true;
    if (!this.PlateName.valid) {
      flat = false;
    }
    return flat;
  }

  onSetData(data) {
    data.forEach(element => {
      this.CustomerId = element.CustomerId;
      this.FirstName = element.FirstName;
      this.LastName = element.LastName;
      this.GeolocationId = element.GeolocationId;
      this.FullName.setValue(element.FirstName + " " + element.LastName);
      this.IdenticationTypeId = element.IdenticationTypeId;
      this.IdenticationType.setValue(element.IdenticationType);
      this.IdenticationDocument.setValue(element.IdenticationDocument);
      this.Phone.setValue(element.Phone);
      this.Address.setValue(element.Address);
      this.Email.setValue(element.Email);
      let oDataGeo = element.GeoLocationName.split("|");
      this.vDepartamento = oDataGeo[0];
      this.vProvincia = oDataGeo[1];
      this.vDistrito = oDataGeo[2];
    });
  }

  onBuscarPlaca() {
    if (this.fnValidarPlaca()) {
      this.bPrevent = true;
      this.isProgress = true;
      this.PlateNameForCreate = this.PlateName.value;
      let oDataSend = {
      plateName: this.PlateName.value,
      identicationDocument: '',
      credentialId: null,
      name:'',
      docType:'',
      companyId:null,
      isOwner:null,
      customerId:null 
      }
      this.cCustomerService.ObtenerClientes(oDataSend).subscribe(oContent => {
        if (oContent.length !== 0) {
          this.isBusqueda = true;
          this.bPrevent = false;
          this.isProgress = false;
          this.onSetData(oContent);
        } else {
          let sMessage = '';
          let sTrans = "CustomerCreatePlateNoCoindence";
          this.cTranslateService.get(sTrans).subscribe((text: string) => {
            sMessage = text;
          });
          this.cSnackbarService.openSnackBar(sMessage, '', 'Error');
          this.bPrevent = false;
          this.isProgress = false;
        }
      });
    } else {
      let sMessage = '';
      let sTrans = "CustomerCreateMissingFields";
      this.cTranslateService.get(sTrans).subscribe((text: string) => {
        sMessage = text;
      });
      this.cSnackbarService.openSnackBar(sMessage, '', 'Error');
    }
  }

  fnValidarEmail() {
    let flat = true;
    if (!this.Email.valid) {
      flat = false;
    }
    return flat;
  }

  onSubmitCrearUsuarioCliente() {
    if (this.fnValidarEmail()) {
      this.bPrevent = true;
      this.isProgress = true;
      let oDataSend = {
        CustomerId: this.CustomerId,
        CredentialId: null,
        PlateName: this.PlateNameForCreate,
        Login: this.IdenticationDocument.value,
        Phone: this.Phone.value,
        Address: this.Address.value,
        Email: this.Email.value,
        GeolocationId: this.GeolocationId === 0 ? 1:this.GeolocationId,
        IsCreate: true,
        IsActive: true,
        FirstName: this.FirstName,
        LastName: this.LastName,
      } 
      this.cCustomerService.CrearUsuarioCliente(oDataSend).subscribe(
        oRes => {
          let sMessage = '';
          if (oRes.codeResponse) {
            if (oRes.dataresponse === 'EMAIL_SEND') {
              let sTrans = "UserCreateSuccess";
              this.cTranslateService.get(sTrans).subscribe((text: string) => {
                sMessage = text;
              });
              this.cSnackbarService.openSnackBar(sMessage, '', 'Success');
              this.dialogRef.close();
            }else{
              let sTrans = "UserCreateSuccessUpdate";
              this.cTranslateService.get(sTrans).subscribe((text: string) => {
                sMessage = text;
              });
              this.cSnackbarService.openSnackBar(sMessage, '', 'Success');
              this.dialogRef.close();
            }
            this.isProgress = false;
            this.bPrevent = false;
          } else {
            if (oRes.dataresponse === 'EXIST') {
              let sTrans = "CustomerCreateUserExist";
              this.cTranslateService.get(sTrans).subscribe((text: string) => {
                sMessage = text;
              });
              this.cSnackbarService.openSnackBar(sMessage, '', 'Error');
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
}
