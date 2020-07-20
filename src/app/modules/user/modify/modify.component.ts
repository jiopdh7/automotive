import { Component, OnInit, Inject } from '@angular/core';
import { MyErrorStateMatcher } from 'src/app/compartido/MyErrorStateMatcher';
import { Validators, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { UserService } from 'src/app/services/user.service';
import { BrandService } from 'src/app/services/brand.service';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { TranslateService } from '@ngx-translate/core';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { CompanyService } from 'src/app/services/company.service';
import { CompanyUserService } from 'src/app/services/companyuser.service';
import { UtilityClass } from 'src/app/compartido/Utility';

@Component({
  selector: 'app-modify',
  templateUrl: './modify.component.html',
  styleUrls: ['./modify.component.css']
})
export class ModifyComponent implements OnInit {
  public activeLang = 'es';
  utility = new UtilityClass();
  public bPrevent: boolean = false;
  matcher = new MyErrorStateMatcher();
  isProgress: boolean = false;
  OrganizationUserId = null;
  private companyUserModel = JSON.parse(localStorage.getItem('CompanyUser'));
  FirstName = new FormControl('', [
    Validators.required,
    Validators.pattern(/^[ A-Za-zñÑäÄëËïÏöÖüÜáéíóúáéíóúÁÉÍÓÚÂÊÎÔÛâêîôûàèìòùÀÈÌÒÙ.-]+$/)
  ]);
  LastName = new FormControl('', [
    Validators.required,
    Validators.pattern(/^[ A-Za-zñÑäÄëËïÏöÖüÜáéíóúáéíóúÁÉÍÓÚÂÊÎÔÛâêîôûàèìòùÀÈÌÒÙ.-]+$/)
  ]);
  Email = new FormControl();
  IdenticationDocument = new FormControl('', [
    Validators.required,
    Validators.pattern(/^\d+$/)
  ]);
  BrandId = new FormControl([], [
    Validators.required,
  ]);
  RoleId = new FormControl(null, [
    Validators.required,
  ]);
  DateExpired = new FormControl;
  d_fecha_minima = new Date();
  d_fecha_caducidad = new FormControl;
  fechaCaducidad;
  aBrands: any[] = [];
  aRoles: any[] = [];
  constructor(
    @Inject(MAT_DIALOG_DATA) public message: any,
    public dialogRef: MatDialogRef<ModifyComponent>,
    private cCompanyUserService: CompanyUserService,
    private cCompanyService: CompanyService,
    private cConfigurationService: ConfigurationService,
    private cTranslateService: TranslateService,
    private cSnackbarService: SnackbarService,
  ) {
    this.cTranslateService.setDefaultLang(this.activeLang);
  }

  ngOnInit() { 
    this.obtenerMarcas();
  }

  onSetUsuario() {
    if (new Date(this.message.DateExpired).toString() === this.utility.fnStringToDate('2079-06-06T23:59:00').toString()) {
      this.d_fecha_caducidad.setValue(this.message.DateExpired)
      this.fechaCaducidad = this.message.DateExpired;
    } else {
      this.DateExpired.setValue(true);
      this.d_fecha_caducidad.setValue(this.message.DateExpired);
      this.fechaCaducidad = this.message.DateExpired;
    }
    this.OrganizationUserId = this.message.OrganizationUserId;
    this.FirstName.setValue(this.message.FirstName);
    this.LastName.setValue(this.message.LastName);
    this.Email.setValue(this.message.Email);
    this.IdenticationDocument.setValue(this.message.IdenticationDocument); 
    let aMarcaSelectedAux = [];
    this.message.OrganizationUsersByCompany.forEach(element => {
      aMarcaSelectedAux.push(element.CompanyId.toLowerCase());
    });  
    this.BrandId.setValue(aMarcaSelectedAux);
    this.RoleId.setValue(this.message.OrganizationRole[0].OrganizationRoleId.toString());
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
    } else if (!this.BrandId.valid) {
      flat = false;
    }
    return flat;
  }

  onSubmitModificarUsuario() {
    if (this.fnValidarDatosUsuario()) {
      this.bPrevent = true;
      this.isProgress = true;
      let oDataSend = {
        organizationUserId: this.OrganizationUserId, 
        masterUserId: this.companyUserModel.MasterUserId,
        firstName: this.FirstName.value,
        lastName: this.LastName.value,
        email: this.Email.value,
        identicationType: 2,
        identicationDocument: this.IdenticationDocument.value,
        organizationRoleId: this.RoleId.value,
        dateExpired: this.fechaCaducidad,
        companyId: this.BrandId.value.toString(),
        isDeleted: false,
        isActived: true
      };
      this.cCompanyUserService.OrganizationUserModify(oDataSend).subscribe(
        oRes => {
          let sMessage = '';
          if (oRes.codeResponse) {
            let sTrans = "UserUpdateSuccess";
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
              let sTrans = "UserUpdateError";
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
      this.getRoles();

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
      }, () => {

      }, () => {

        this.onSetUsuario();
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
