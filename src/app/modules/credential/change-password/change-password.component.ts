import { Component, OnInit, Inject } from '@angular/core';
import { Validators, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  private companyUserModel = JSON.parse(localStorage.getItem('CompanyUser'));
  claveActual = new FormControl('', [
    Validators.required
  ]);
  clave = new FormControl('', [
    Validators.required,
    Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])([A-Za-z\d$@$!%*?&]|[^ ]){8,15}$/)
  ]);
  claveConfirmar = new FormControl('', [
    Validators.required,
    Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])([A-Za-z\d$@$!%*?&]|[^ ]){8,15}$/)
  ]);
  public activeLang = 'es';
  public bPassSee: boolean = true;
  public bPassText: string = "Mostrar";
  constructor(
    public dialogRef: MatDialogRef<ChangePasswordComponent>,
    @Inject(MAT_DIALOG_DATA) 
    public message: any,
    private translate: TranslateService,
    private cMatSnackBar: MatSnackBar,
    private cLoginService: LoginService   
  ) { }

  ngOnInit() {
  }
  onvalidareg(){
    var flag = true;
    if(this.clave.valid){

    }
  }
  onSubmitCambiar(){
    if(this.claveConfirmar.value != this.clave.value){
      this.cMatSnackBar.open("Las contraseñas son distintas", "cerrar", {
        verticalPosition: 'top',
        horizontalPosition:'end',
        duration: 2000,
      });        
      return;
    }
    if(this.claveConfirmar.value == null || this.clave.value== null || this.claveActual.value== null){
      this.cMatSnackBar.open("Se deben llenar todos los campos", "cerrar", {
        verticalPosition: 'top',
        horizontalPosition:'end',
        duration: 2000,
      });        
      return;
    }
    if(this.claveConfirmar.value.trim() == "" || this.clave.value.trim() == "" || this.claveActual.value.trim() == ""){
      this.cMatSnackBar.open("Se deben llenar todos los campos", "cerrar", {
        verticalPosition: 'top',
        horizontalPosition:'end',
        duration: 2000,
      });        
      return;
    }
    var flag = !this.clave.valid;
    var flag2 = !this.claveConfirmar.valid;
    if(flag){
      this.cMatSnackBar.open("Se debe cumplir los requisitos para la creación  de la contraseña", "cerrar", {
        verticalPosition: 'top',
        horizontalPosition:'end',
        duration: 2000,
      });    
      return;
    }
    if(flag2){
      this.cMatSnackBar.open("Se debe cumplir los requisitos para la creación  de la contraseña", "cerrar", {
        verticalPosition: 'top',
        horizontalPosition:'end',
        duration: 2000,
      });    
      return;
    }
    var nueva = { 
      credentialId: this.companyUserModel.OrganizationUserId,
      password :this.claveConfirmar.value,
      oldPassword:this.claveActual.value
    }    
    this.cLoginService.MasterPasswordModify(nueva).subscribe(oData => {        
      if(oData.codeResponse){        
        this.cMatSnackBar.open("Se cambio la contraseña correctamente", "cerrar", {
          verticalPosition: 'top',
          horizontalPosition:'end',
          duration: 2000,
        });        
        this.dialogRef.close(`${JSON.stringify(oData)}`);
      }else{
        this.cMatSnackBar.open("La contraseña actual es incorrecta", "cerrar", {
          verticalPosition: 'top',
          horizontalPosition:'end',
          duration: 2000,
        });        
      }
    }, oErr => {
      this.cMatSnackBar.open("Ocurrió un error, verifique su conexión a internet", "cerrar", {
        verticalPosition: 'top',
        horizontalPosition:'end',
        duration: 2000,
      });
    })

  }
}
