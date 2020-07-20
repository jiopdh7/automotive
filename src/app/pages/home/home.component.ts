
import { Component, OnInit, ChangeDetectorRef, AfterContentInit, AfterViewInit } from '@angular/core';
import { UserModel } from 'src/app/models/user.model';
import { MediaMatcher } from '@angular/cdk/layout';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { MatSnackBar, MatDialog } from '@angular/material';
import { CompanyUserService } from 'src/app/services/companyuser.service';
import { CompanyUserModel } from 'src/app/models/companyuser.model'; 
import { ConfigurationService } from 'src/app/services/configuration.service';
import { LoginService } from 'src/app/services/login.service';
import { ChangePasswordComponent } from 'src/app/modules/credential/change-password/change-password.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterContentInit, AfterViewInit {
  public onObtenerUsuarioValid = false;
  public companyUserModel: any  ;

  isMinimo = true;
  /*i18n*/
  public activeLang = 'es';
  aModulos: any[] = [];
  constructor(
    public changeDetectorRef: ChangeDetectorRef,
    public media: MediaMatcher,
    private cCompanyUserService: CompanyUserService,
    private cConfigurationService: ConfigurationService,
    /*i18n*/
    private cTranslateService: TranslateService,
    /*ROUTER*/
    private cRouter: Router,
    //private service: ModuloServiceService,
    //public cMenuactivoService:MenuactivoService,
    private cMatSnackBar: MatSnackBar,
    //private cLogin: LoginService,
    public dialog: MatDialog,
    private cLoginService:LoginService
  ) {
    /*i18n*/
    this.cTranslateService.setDefaultLang(this.activeLang);
  }
  ngAfterViewInit(): void {
     //ir arriba en la pagina
     let top = document.getElementById('top');
     if (top !== null) {
       top.scrollIntoView();
       top = null;
     }
  }
  ngAfterContentInit(): void {
  }
  ngOnInit() {
    // if(!localStorage.getItem('oUser')){
    //   this.cRouter.navigateByUrl("/")
    // }else{
    //   this.onListarModulos();
    // }
    this.onObtenerUsuario();
  }
  OnInitSecondary() {

  }

  onObtenerUsuario() {
    let oDataSend = {
      masterUserId: null,
      organizationUserId: localStorage.getItem("CredentialId"),
      companyId:localStorage.getItem("CompanyId"),
      organizationRoleId:"",
      isActived:""
    }
    this.cCompanyUserService.OrganizationUserGet(oDataSend).subscribe(oData => {
      this.companyUserModel = oData[0];
      localStorage.setItem('CompanyUser', JSON.stringify(oData[0])); 
      this.onObtenerUsuarioValid = true;
    }, (err) => { }, () => {
      this.onListarModulos();
    });
  }
  onToggleMenu() {
    
    this.isMinimo = this.isMinimo ? false : true;
  }
  onBuscarModuloSelecionado(aModulo) {
    let oModuleSelected = JSON.parse(localStorage.getItem('ModuleSelected')) ? JSON.parse(localStorage.getItem('ModuleSelected')) : {};
    aModulo.forEach(element => {
      if (element.OrganizationModuleId === oModuleSelected.OrganizationModuleId) {
        element.isSelected = "lista-item-menu";
      } else {
        element.isSelected = "";
      }
    });
    return aModulo;
  }
  onListarModulos() {
    let oDataSend = {
      masterUserId: this.companyUserModel.MasterUserId,
      credentialId: this.companyUserModel.OrganizationUserId
    };
    this.cConfigurationService.ModulesByCompanyUserGet(oDataSend).subscribe(
      (oData) => {
        this.aModulos = this.onBuscarModuloSelecionado(oData);
      }
    );
    // this.service.listarModulo(this.oUsuario.p_i_usuarioinch)
    // .subscribe(resp => {
    //     resp.forEach(element => {
    //       element.isSelected = '';
    //     });
    //     this.aModulos = resp ;
    //     // this.aModulos[0].isSelected = 'lista-item-menu';
    //     this.cMenuactivoService.setMenu(this.aModulos);
    //     //this.cRouter.navigateByUrl(this.aModulos[0].c_ruta);
    // }, oErr => {
    //   this.cMatSnackBar.open("Ocurrió un error, verifique su conexión a internet", "cerrar", {
    //     verticalPosition: 'top',
    //     horizontalPosition:'end',
    //     duration: 2000,
    //   });
    // });
  }
  CerrarSesion() {
    let oDataSend = {
      credentialId: localStorage.getItem("CredentialId"),
      sessionId: localStorage.getItem("SessionId")
    };
    this.cLoginService.onLogout(oDataSend).subscribe(oData => {
      if(oData.codeResponse){ 
        localStorage.clear();
        this.cRouter.navigate(['/'], { replaceUrl: true, skipLocationChange: false });

      }else{
         
      }
    }, oErr => {
       
    })

  }
  onGoSelectedModulo(oModulo) {
    
    this.aModulos.forEach(element => {
      element.isSelected = '';
    });
    oModulo.isSelected = "lista-item-menu"; 
    localStorage.setItem('ModuleSelected', JSON.stringify(oModulo));
    this.cRouter.navigate([oModulo.ModulePath]);
  }

  onGoHome() {
    this.cRouter.navigateByUrl('/home/dashboard');
  }
  onMensaje(msg) {
    this.cMatSnackBar.open(msg, "cerrar", {
      verticalPosition: 'top',
      horizontalPosition: 'end',
      duration: 2000,
    });
  }
  onAbrirCambiarPass() {
    const dialogRef = this.dialog.open(ChangePasswordComponent, {
      panelClass: 'popUpAsesores',
      data: {}
    });
    dialogRef.afterClosed().subscribe(res => {
    });
  }
  onObtenerDosLetrasUsuario(sApellidos: string, sNombres: string) {
    let aApe = sApellidos.split(" ");
    let aNom = sNombres.split(" ");
    return aNom[0].charAt(0).toUpperCase() + aApe[0].charAt(0).toUpperCase();
  }
  onPascalCaseString(sPalabras: string): string {
    let aux = '';
    sPalabras.split(" ").forEach(element => {
      element = element.toLowerCase();
      aux += " " + element.charAt(0).toUpperCase() + '' + element.substring(1);
    });
    return aux;
  }
  onGetCompanyName(element){
    let oData = [];
    element.OrganizationUsersByCompany.forEach(element => {
      oData.push(element.Name);      
    });
    let sData = oData.toString().replace(/,/gi,"/");
    return sData;
  }

}
