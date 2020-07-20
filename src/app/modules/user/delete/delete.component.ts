import { Component, OnInit, Inject } from '@angular/core';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from 'src/app/services/user.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CompanyUserService } from 'src/app/services/companyuser.service';

@Component({
  selector: 'app-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.css']
})
export class DeleteComponent implements OnInit {
  public activeLang = 'es';
  public bPrevent: boolean = false;
  isProgress: boolean = false;
  constructor(
    @Inject(MAT_DIALOG_DATA) public message: any,
    public dialogRef: MatDialogRef<DeleteComponent>,
    private cCompanyUserService: CompanyUserService,
    private cTranslateService: TranslateService,
    private cSnackbarService: SnackbarService,
  ) {
    this.cTranslateService.setDefaultLang(this.activeLang);
   }

  ngOnInit() {
  }

  onSubmitBorrarUsuario() {
      let oDataSend = {
        organizationUserId: this.message.OrganizationUserId, 
        masterUserId: this.message.MasterUserId, 
      }; 
      this.cCompanyUserService.OrganizationUserDelete(oDataSend).subscribe(
        oRes => {
          let sMessage = '';
          if (oRes.codeResponse) {
            let sTrans = "UserDeleteSuccess";
            this.cTranslateService.get(sTrans).subscribe((text: string) => {
              sMessage = text;
            });
            this.cSnackbarService.openSnackBar(sMessage, '', 'Success');
            this.dialogRef.close();
          } else {
            let sTrans = "UserDeleteError";
            this.cTranslateService.get(sTrans).subscribe((text: string) => {
              sMessage = text;
            });
            this.cSnackbarService.openSnackBar(sMessage, '', 'Error');
          }
        }
      )
  }

}
