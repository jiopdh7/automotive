import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MyErrorStateMatcher } from 'src/app/compartido/MyErrorStateMatcher';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatPaginatorIntl, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AdviserService } from 'src/app/services/adviser.service';
import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-send-report',
  templateUrl: './send-report.component.html',
  styleUrls: ['./send-report.component.css']
})
export class SendReportComponent implements OnInit {
  public c_correo = new FormControl('', [
    Validators.required,
    Validators.pattern(/^[^@]+@[^@]+\.[a-zA-Z]{2,}$/),]);    
  
  public matcher = new MyErrorStateMatcher();
  public IsDrawerLoading = false;
  constructor(
    private cActivatedRoute: ActivatedRoute,
    private cAdviser: AdviserService,
    private cSnackbarService: SnackbarService,
    @Inject(MAT_DIALOG_DATA) public oWorkshopModel: any) { }
  ngOnInit() {
  }

  onEnviarCorreo(){
    var sStartDate:any = new Date();
    sStartDate = sStartDate.toISOString().substring(0, 10);

    var sEndDate:any = new Date();
    sEndDate.setDate(sEndDate.getDate() + 7);
    sEndDate = sEndDate.toISOString().substring(0, 10);

    let oDataSend = {
      masterUserId : this.oWorkshopModel.MasterUserId,
      companyId : this.oWorkshopModel.CompanyId,
      workshopId : this.oWorkshopModel.WorkshopId,
      email : this.c_correo.value,
      startDate : sStartDate,
      endDate : sEndDate,
    };
    this.IsDrawerLoading = true;
    this.cAdviser.SendEmailOnDemand(oDataSend).subscribe((response) => { 
      this.IsDrawerLoading = false;      
      this.cSnackbarService.openSnackBar(response.dataResponse, '', 'Success');
    }, (oError) => {   
      this.IsDrawerLoading = false;
      this.cSnackbarService.openSnackBar(oError, '', 'Error');
    }, () => { 
      this.IsDrawerLoading = false;
    });
  }

}
