import { Component, OnInit, Inject } from '@angular/core';
import { Validators, FormControl } from '@angular/forms';
import { MatDialogRef, MatSnackBar } from '@angular/material';
import { MyErrorStateMatcher } from 'src/app/compartido/MyErrorStateMatcher';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from 'src/app/services/user.service';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { CompanyService } from 'src/app/services/company.service';
import { CompanyUserService } from 'src/app/services/companyuser.service';
@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {
  public activeLang = 'es';
  public bPrevent: boolean = false;
  matcher = new MyErrorStateMatcher();
  isProgress: boolean = false;
  private companyUserModel = JSON.parse(localStorage.getItem('CompanyUser'));
  FirstName = new FormControl('', [
    Validators.required,
    Validators.pattern(/^[ A-Za-zñÑäÄëËïÏöÖüÜáéíóúáéíóúÁÉÍÓÚÂÊÎÔÛâêîôûàèìòùÀÈÌÒÙ.-]+$/)
  ]);
  LastName = new FormControl('', [
    Validators.required,
    Validators.pattern(/^[ A-Za-zñÑäÄëËïÏöÖüÜáéíóúáéíóúÁÉÍÓÚÂÊÎÔÛâêîôûàèìòùÀÈÌÒÙ.-]+$/)
  ]);
  Email = new FormControl('', [
    Validators.required,
    Validators.pattern(/^[^@]+@[^@]+\.[a-zA-Z]{2,}$/)
  ]);
  IdenticationDocument = new FormControl('', [
    Validators.required,
    Validators.pattern(/^\d+$/)
  ]);
  BrandId = new FormControl([''], [
    Validators.required,
  ]);
  RoleId = new FormControl('', [
    Validators.required,
  ]);
  DateExpired = new FormControl;
  d_fecha_minima = new Date();
  d_fecha_caducidad = new FormControl;
  fechaCaducidad = '2079-06-06T23:59:00';
  aBrands: any[] = [];
  aRoles: any[] = [];
  constructor(
    public dialogRef: MatDialogRef<CreateComponent>,
    private cCompanyService: CompanyService,
    private cConfigurationService: ConfigurationService,
    private cCompanyUserService: CompanyUserService,
    private cTranslateService: TranslateService,
    private cSnackbarService: SnackbarService,
  ) {
    this.cTranslateService.setDefaultLang(this.activeLang);
  }

  ngOnInit() {
    this.getRoles();
    this.obtenerMarcas();
  }

  fnValidarDatosUsuario() {
    let flat = true;
    if (!this.FirstName.valid) {
      flat = false;
    } else if (!this.LastName.valid) {
      flat = false;
    } else if (!this.Email.valid) {
      flat = false;
    } else if (!this.IdenticationDocument.valid) {
      flat = false;
    } else if (!this.RoleId.valid) {
      flat = false;
    } else if (!this.RoleId.valid) {
      flat = false;
    }
    return flat;
  }

  onSubmitCrearUsuario() {  
    if (this.fnValidarDatosUsuario()) { 
      this.bPrevent = true;
      this.isProgress = true;
      let oDataSend = {
        organizationUserId: null, 
        masterUserId: this.companyUserModel.MasterUserId,
        firstName: this.FirstName.value,
        lastName: this.LastName.value,
        email: this.Email.value,
        identicationType: 2,
        identicationDocument: this.IdenticationDocument.value,
        organizationRoleId: this.RoleId.value,
        dateExpired: this.fechaCaducidad,
        companyId: this.BrandId.value.toString(),
        isDeleted: 0,
        isActived: 1
      };
      this.cCompanyUserService.OrganizationUserModify(oDataSend).subscribe(
        oRes => {
          let sMessage = '';
          if (oRes.codeResponse) {
            let sTrans = "UserCreateSuccess";
            this.cTranslateService.get(sTrans).subscribe((text: string) => {
              sMessage = text;
            });
            this.cSnackbarService.openSnackBar(sMessage, '', 'Success');
            this.isProgress = false;
            this.bPrevent = false;
            this.dialogRef.close();
          } else {
            if (oRes.dataresponse === 'EMAIL') {
              let sTrans = "UserDuplicateErrorEmail";
              this.cTranslateService.get(sTrans).subscribe((text: string) => {
                sMessage = text;
              });
            } else if (oRes.dataresponse === 'DOCUMENTO') {
              let sTrans = "UserDuplicateErrorDocumento";
              this.cTranslateService.get(sTrans).subscribe((text: string) => {
                sMessage = text;
              });
            } else {
              let sTrans = "UserCreateError";
              this.cTranslateService.get(sTrans).subscribe((text: string) => {
                sMessage = text;
              });
            }
            this.isProgress = false;
            this.bPrevent = false;
            this.cSnackbarService.openSnackBar(sMessage, '', 'Error');
          }
        }
      )
    } else {
      let sMessage = '';
      let sTrans = "UserCreateMissingFields";
      this.cTranslateService.get(sTrans).subscribe((text: string) => {
        sMessage = text;
      });
      this.cSnackbarService.openSnackBar(sMessage, '', 'Error');
    }
  }
  obtenerMarcas() {
    let oDataSend = {
      masterUserId: this.companyUserModel.MasterUserId,
      companyId: null,
      isActived: null
    };
    this.cCompanyService.MasterCompanyGet(oDataSend).subscribe((oData) => {
      let aux = [];
      oData.forEach(element => {
        if (element.IsActived) {
          aux.push(element);
        }
      });
      this.aBrands = aux;
    }, (oErr) => {

    }, () => {

    });
  }
  getRoles() {
    let oDataSend = {
      masterUserId: this.companyUserModel.MasterUserId,
      organizationRoleId: null
    }
    this.cConfigurationService.CompanyRoleGet(oDataSend)
      .subscribe(resp => {
        let aux = [];
        resp.forEach(element => {
          if (element.IsActived) {
            aux.push(element);
          }
        });
        this.aRoles = aux;
      });
  }
  changeCaducidad() {
    if (this.DateExpired.value) {
      this.d_fecha_caducidad.setValue(new Date());
      let fechaCaducidadAux = this.formatDate(this.d_fecha_caducidad.value) + 'T23:59:00';
      this.fechaCaducidad = fechaCaducidadAux;
    } else {
      this.fechaCaducidad = '2079-06-06T23:59:00';
    }
  }

  changeFechaCaducidad(evento) {
    let fechaCaducidadAux = this.formatDate(evento.value) + 'T23:59:00';
    this.fechaCaducidad = fechaCaducidadAux;
  }

  formatDate(date) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;

    return [year, month, day].join('-');
  }
}
