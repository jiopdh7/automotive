import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { TranslateService } from '@ngx-translate/core';
import { CustomerRequestService } from 'src/app/services/customer-request.service';

@Component({
  selector: 'app-approve',
  templateUrl: './approve.component.html',
  styleUrls: ['./approve.component.css']
})
export class ApproveComponent implements OnInit {
  public activeLang = 'es';
  public bPrevent: boolean = false;
  constructor(
    @Inject(MAT_DIALOG_DATA) public message: any,
    private cTranslateService: TranslateService,
    private cSnackbarService: SnackbarService,
    public dialogRef: MatDialogRef<ApproveComponent>,
    private cCustomerRequestService: CustomerRequestService,
  ) {
    this.cTranslateService.setDefaultLang(this.activeLang);
  }

  ngOnInit() { 
  }

  onSubmit() {
    let oDataSend = {
      RequestId: this.message.RequestId,
      Action: 1,
    }
    this.bPrevent = true; 
    this.cCustomerRequestService.ModificarSolicitudesClientes(oDataSend).subscribe(
      oRes => {
        let sMessage = '';
        if (oRes.codeResponse) {
          let sTrans = "CustomerRequestClienteAprobado";
          this.cTranslateService.get(sTrans).subscribe((text: string) => {
            sMessage = text;
          });
          this.bPrevent = false;
          this.dialogRef.close();
          this.cSnackbarService.openSnackBar(sMessage, '', 'Success');
        } else {
          let sTrans = "CustomerRequestClienteAprobadoFailed";
          this.cTranslateService.get(sTrans).subscribe((text: string) => {
            sMessage = text;
          });
          this.bPrevent = false;
          this.dialogRef.close();
          this.cSnackbarService.openSnackBar(sMessage, '', 'Error');
        }
      }
    )
  }

}
