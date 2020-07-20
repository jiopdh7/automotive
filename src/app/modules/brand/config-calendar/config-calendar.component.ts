import { Component, OnInit } from '@angular/core';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours,
} from 'date-fns';
import { Subject } from 'rxjs'; 
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView,
} from 'angular-calendar';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BrandService } from 'src/app/services/brand.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
@Component({
  selector: 'app-config-calendar',
  templateUrl: './config-calendar.component.html',
  styleUrls: ['./config-calendar.component.css']
})
export class ConfigCalendarComponent implements OnInit {
  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;
  private companyUserModel = JSON.parse(localStorage.getItem('CompanyUser'));
  public oModuleSelected = JSON.parse(localStorage.getItem('ModuleSelected')) ? JSON.parse(localStorage.getItem('ModuleSelected')) : {};
 
  IsLoadMessage = true;
  viewDate: Date = new Date();
  public isToggle: boolean = false;
  mode = 'over';
  over = 'over';
  oBrandModel;
  BrandId;
  constructor(
    private cTranslateService: TranslateService,
    private cActivatedRoute: ActivatedRoute,
    private cBrandService:BrandService,
    private cSnackbarService:SnackbarService,
    private cRouter: Router
    ) { 
      this.cTranslateService.setDefaultLang('es');       
      this.BrandId = this.cActivatedRoute.snapshot.params.BrandId;
    }

  ngOnInit() {
    this.onLoadBrand();
  }
  onLoadBrand(){
    this.IsLoadMessage = false;
    let oDataSend = {
      masterUserId: this.companyUserModel.MasterUserId,
      brandId: this.BrandId
    };
    this.cBrandService.BrandsByCompanyGet(oDataSend).subscribe((oData) => { 
      this.oBrandModel = oData[0]; 
    },(oErr)=>{
      this.IsLoadMessage = true;

    }, ()=>{

      this.IsLoadMessage = true;
    });
  }
  closedStart() {
    this.isToggle = false;
  }
  OnPonerCadaPalabraMayuscula(sPalabras: string): string {
    let aux = '';
    let aPalabra = sPalabras.split(" ");
    aPalabra.forEach(element => {
      element = element.toLowerCase();
      aux += " " + element.charAt(0).toUpperCase() + '' + element.substring(1);
    });
    return aux;

  } 
}
