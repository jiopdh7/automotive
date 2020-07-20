import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-logon',
  templateUrl: './logon.component.html',
  styleUrls: ['./logon.component.css']
})
export class LogonComponent implements OnInit {

  constructor(
    public cTranslateService: TranslateService, ) {
    this.cTranslateService.setDefaultLang('es');
  }
  ngOnInit() {
    
    localStorage.setItem('Token', '11D56EDB-307B-491D-919E-52E9FE091106');
    localStorage.setItem('AccountId', 'A8F20DB0-D6DB-4617-9ADA-D0377CCE32C9');
    localStorage.setItem("AppId" ,'AF586A48-390C-457B-8FC0-4AEAB7FB400D');
  }
}
