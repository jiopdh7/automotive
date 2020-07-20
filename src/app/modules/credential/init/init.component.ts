import { Component, OnInit } from '@angular/core';
import { MyErrorStateMatcher } from 'src/app/compartido/MyErrorStateMatcher';
import { Validators, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { TranslateService, TranslateParser } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { OnExecuteData, ReCaptchaV3Service } from 'ng-recaptcha';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-init',
  templateUrl: './init.component.html',
  styleUrls: ['./init.component.css']
})
export class InitComponent implements OnInit {

  public emails = new FormControl('', [
    Validators.required,
    Validators.pattern(/^[^@]+@[^@]+\.[a-zA-Z]{2,}$/),
  ]);
  public password = new FormControl('', [
    Validators.required
  ]);
  public recentToken: string = '';
  public readonly executionLog: OnExecuteData[] = [];
  private allExecutionsSubscription: Subscription;
  private singleExecutionSubscription: Subscription;
  public matcher = new MyErrorStateMatcher();
  public bPassSee: boolean = true;
  public bPassText: string = "Mostrar";
  public bButtonDisabled: boolean = false;
  public activeLang = 'es';
  constructor(
    private cTranslateService: TranslateService,
    private cRouter: Router,
    private cLogin: LoginService,
    private cMatSnackBar: MatSnackBar,
    private cReCaptchaV3Service: ReCaptchaV3Service,
  ) {
    // this.allExecutionsSubscription = this.cReCaptchaV3Service.onExecute
    //   .subscribe((data) => this.executionLog.push(data),(err)=>{},()=>{console.log(this.executionLog)});
    this.cTranslateService.setDefaultLang(this.activeLang);
  }

  ngOnInit() {
    this.bButtonDisabled = false;
    this.emails.setValue('');
    this.password.setValue('');
  }

  onVerPass() {
    this.bPassSee = !this.bPassSee;
    if (this.bPassSee) {
      this.cTranslateService.get('CredentialInitMostar').subscribe((text: string) => {
        this.bPassText = text;
      });
    } else {
      this.cTranslateService.get('CredentialInitOcultar').subscribe((text: string) => {
        this.bPassText = text;
      });

    }
  }
  onGoRestaurarPassword() {
    this.cRouter.navigateByUrl('/logon/credential/reset-password');
  }

  onSubmitIniciarSesion() {
    this.cRouter.navigateByUrl('/home');
  }
  onLogin() {
    if (this.validationLogin()) {
      this.bButtonDisabled = true;
      this.executeAction('ReCaptchaSuperadmin');
    }
  }
  onObtenerSesion(sToken) {
    this.bButtonDisabled = true;
    let oData = {
      UserName: this.emails.value,
      Password: this.password.value, 
      Host : '192.68.1.62', 
      AppId: localStorage.getItem("AppId") ,
      AccountId: 'InchcapePeru' 
    }; 
    
    this.cLogin.onLogin(oData, sToken).subscribe(oData => {
      if (oData.CodeResponse == 1) {
        localStorage.setItem('CredentialId', oData.CredentialId);
        localStorage.setItem('SessionId', oData.SessionId);
        this.onSubmitIniciarSesion();
      } else {
        let ErrorMessage = '';
        if(oData.RetMessage ==""){          
          this.cTranslateService.get('CredentialInitError1').subscribe((text: string) => {
            ErrorMessage = text;
          });
        }else{
          ErrorMessage= oData.RetMessage;
        }        
        this.cMatSnackBar.open(ErrorMessage, "cerrar", {
          verticalPosition: 'top',
          horizontalPosition: 'end',
          duration: 4000,
        });
        this.bButtonDisabled = false;
      }
    }, oErr => {
      this.bButtonDisabled = false;
    })
  }
  validationLogin() {
    let flag = true;
    if (!this.emails.valid) {
      flag = false;
    } else if (!this.password.valid) {
      flag = false;
    }
    return flag;
  }
  limpiaCorreo() {
    this.emails.setValue(this.emails.value.trim());
  }
  public executeAction(action: string): void {
    if (this.singleExecutionSubscription) {
      this.singleExecutionSubscription.unsubscribe();
    }
    this.singleExecutionSubscription = this.cReCaptchaV3Service.execute(action)
      .subscribe((token) => {
        this.recentToken = token;
      }, (error) => { }, () => {
        this.onObtenerSesion(this.recentToken);
      });
  }

}
