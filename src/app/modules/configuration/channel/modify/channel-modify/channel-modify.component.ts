import { Component, OnInit, Inject } from '@angular/core';
import { MyErrorStateMatcher } from 'src/app/compartido/MyErrorStateMatcher';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-channel-modify',
  templateUrl: './channel-modify.component.html',
  styleUrls: ['./channel-modify.component.css']
})
export class ChannelModifyComponent implements OnInit {
  private companyUserModel = JSON.parse(localStorage.getItem('CompanyUser'));
  matcher = new MyErrorStateMatcher();
  cFriendlyName = new FormControl('', [
    Validators.required,
    Validators.pattern(/^[ A-Za-zñÑäÄëËïÏöÖüÜáéíóúáéíóúÁÉÍÓÚÂÊÎÔÛâêîôûàèìòùÀÈÌÒÙ.-]+$/)
  ]);
  cIsActived = new FormControl(true, []);
  bPrevent: boolean = false;
  constructor(
    public dialogRef: MatDialogRef<ChannelModifyComponent>,
    @Inject(MAT_DIALOG_DATA) public oCanalModel: any,
    private cSnackbarService: SnackbarService,
    private cConfigurationService: ConfigurationService,
    private cTranslateService: TranslateService
  ) { }

  ngOnInit() {
    if (this.oCanalModel.ChannelId) {
      this.onSetChannel();
    }
  }
  onSetChannel() {
    this.cFriendlyName.setValue(this.oCanalModel.FriendlyName);
    this.cIsActived.setValue(this.oCanalModel.IsActived);
  }
  OnModifyChannel() {
    if (!this.cFriendlyName.valid) {
      return;
    }
    this.bPrevent = true;
    let oData = {
      "channelId": this.oCanalModel.ChannelId,
      "masterUserId": this.companyUserModel.MasterUserId,
      "friendlyName": this.cFriendlyName.value,
      "isActived": this.cIsActived.value,
      "isDeleted": this.oCanalModel.IsDeleted
    }
    this.cConfigurationService.ChannelsByCompanyModify(oData).subscribe((oData) => {
      let sMessage = '';
      if (oData.codeResponse) {
        let sTrans = "";
        if(this.oCanalModel.ChannelId){
          sTrans = "ConfigurationChannelModifyOkActualizado";
        }else{
          sTrans = "ConfigurationChannelModifyOkRegistro";
        }
        this.cTranslateService.get(sTrans).subscribe((text: string) => {
          sMessage = text;
        });
        this.cSnackbarService.openSnackBar(sMessage, '', 'Success');
        this.dialogRef.close(oData.codeResponse);

      } else {
        let sTrans = "";
        if(this.oCanalModel.ChannelId){
          sTrans = "ConfigurationChannelModifyErrorActualizado";
        }else{
          sTrans = "ConfigurationChannelModifyErrorRegistro";
        }
        this.cTranslateService.get(sTrans).subscribe((text: string) => {
          sMessage = text;
        });
        this.cSnackbarService.openSnackBar(sMessage, '', 'Error');
      }
    });
  }
}
