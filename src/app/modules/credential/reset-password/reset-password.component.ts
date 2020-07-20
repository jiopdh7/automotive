import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MyErrorStateMatcher } from 'src/app/compartido/MyErrorStateMatcher';
import { TranslateService } from '@ngx-translate/core';
import { LoginService } from 'src/app/services/login.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  public activeLang = 'es';
  public emails = new FormControl('', [
    Validators.required,
    Validators.pattern(/^[^@]+@[^@]+\.[a-zA-Z]{2,}$/),
  ]);
  matcher = new MyErrorStateMatcher();
  public bButtonDisabled: boolean = false;
  constructor(    
    private cRouter: Router,
    private cLogin: LoginService,
    private cTranslateService: TranslateService,
    private cMatSnackBar: MatSnackBar
  ) {
    this.cTranslateService.setDefaultLang(this.activeLang);

   }

  ngOnInit() {
  }
  onRegresar(){
    this.cRouter.navigateByUrl('/');
  }
  
  onRestaurarPass(){ 
    this.bButtonDisabled = true;
    let oData = {
      UserName: this.emails.value,
      Host : '192.68.1.62',
      AppId: localStorage.getItem("AppId"),
      AccountId: 'InchcapePeru'
    }; 
    this.cLogin.onRestaurarContraseña(oData).subscribe(oData => { 
      if(oData.CodeResponse){
        this.bButtonDisabled = true;
        this.cMatSnackBar.open("Se ha actualizado la contraseña con exito,le llegara un correo con la nueva contraseña", "cerrar", {
          verticalPosition: 'top',
          horizontalPosition: 'end',
          duration: 4000,
        });
      }
    }, oErr => {
      this.bButtonDisabled = false;
    })
  }

}
