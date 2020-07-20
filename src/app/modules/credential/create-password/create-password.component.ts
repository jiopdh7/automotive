import { Component, OnInit } from '@angular/core';
import { Validators, FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { MyErrorStateMatcher } from 'src/app/compartido/MyErrorStateMatcher';
import { Router, ActivatedRoute } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';
import { CustomerService } from 'src/app/services/customer.service';
import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-create-password',
  templateUrl: './create-password.component.html',
  styleUrls: ['./create-password.component.css']
})
export class CreatePasswordComponent implements OnInit {

  private sToken: string = '';
  private sCompanyId: string = '';
  public password = new FormControl('', [
    Validators.required
  ]);
  public confirmPassword = new FormControl('', [
    Validators.required
  ]);
  public bPassSee: boolean = true;
  public bPassSee2: boolean = true;
  public bPassText: string = 'MOSTRAR';
  public activeLang = 'es';
  public bButtonDisabled: boolean = false;
  public matcher = new MyErrorStateMatcher();
  public isComplete: boolean = false;
  constructor(
    private cRouter: Router,
    private cTranslateService: TranslateService,
    private cLoginService: LoginService,
    private cSnackbarService: SnackbarService,
    public cCustomerService: CustomerService,
    private cActivatedRoute: ActivatedRoute,
  ) {
    this.sToken = decodeURIComponent(this.cActivatedRoute.snapshot.params.sToken);
    this.sCompanyId = this.cActivatedRoute.snapshot.params.sCompanyId;
    this.cTranslateService.setDefaultLang(this.activeLang);
  }

  ngOnInit() {
    this.bButtonDisabled = false;
    this.password.setValue('');
    this.confirmPassword.setValue('');
    this.onValidateToken();
  }

  onValidateToken() {
    let oDatasend = {
      masterUserId: this.sCompanyId,
      tokenId: this.sToken
    };
    this.cLoginService.onValidateToken(oDatasend).subscribe((oData) => {
      if (!oData.codeResponse) {
        this.onGoIniciarSesion();
      }
    }, (oErr) => {

    }, () => {

    })

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

  onSubmitCrearClave() {
    if (this.onValidar()) {
      this.bButtonDisabled = true;
      let oDataSend = {
        tokenId: decodeURIComponent(this.sToken),
        masterUserId: this.sCompanyId,
        passwordId: this.password.value,
      }
      this.cLoginService.onChangePassowrd(oDataSend).subscribe(oRes => {
        let sMessage = '';
        if (oRes.codeResponse) {
          let sTrans = "CredentialCreatePasswordSuccess";
          this.cTranslateService.get(sTrans).subscribe((text: string) => {
            sMessage = text;
          });
          this.cSnackbarService.openSnackBar(sMessage, '', 'Success');
          this.isComplete = true;
        } else {
          if (oRes.dataresponse === 'CATCH') {
            let sTrans = "CredentialCreatePasswordCatch";
            this.cTranslateService.get(sTrans).subscribe((text: string) => {
              sMessage = text;
            });
            this.cSnackbarService.openSnackBar(sMessage, '', 'Error');
          } else {
            let sTrans = "CredentialCreatePasswordError";
            this.cTranslateService.get(sTrans).subscribe((text: string) => {
              sMessage = text;
            });
            this.cSnackbarService.openSnackBar(sMessage, '', 'Error');
          }
        }
        this.password.setValue('');
        this.confirmPassword.setValue('');
        this.bButtonDisabled = false;
      }, oErr => {
        this.bButtonDisabled = false;
      })
    } else {
      let sMessage = '';
      let sTrans = "CredentialCreatePasswordErrorFields";
      this.cTranslateService.get(sTrans).subscribe((text: string) => {
        sMessage = text;
      });
      this.cSnackbarService.openSnackBar(sMessage, '', 'Error');
    }
  }

  onValidar() {
    let flat = true;
    if (!this.password.valid) {
      flat = false;
    } else if (!this.confirmPassword.valid) {
      flat = false;
    } else if (this.password.value !== this.confirmPassword.value) {
      flat = false;
    }
    return flat;
  }

  onGoIniciarSesion() {
    this.cRouter.navigate(['/'], { replaceUrl: true, skipLocationChange: false });
  }
}
