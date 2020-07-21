import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MensajeDialogoModel } from 'src/app/models/mensaje-dialogo.model';

@Component({
  selector: 'app-mensaje-dialogo-ok',
  templateUrl: './mensaje-dialogo-ok.component.html',
  styleUrls: ['./mensaje-dialogo-ok.component.css']
})
export class MensajeDialogoOkComponent {

  constructor(
    public dialogRef: MatDialogRef<MensajeDialogoOkComponent>,
    @Inject(MAT_DIALOG_DATA) public cConfirmModel: MensajeDialogoModel
  ) { }
  onYesClick(): void {
    this.cConfirmModel.sRespuesta = 'OK';
    this.dialogRef.close(`${this.cConfirmModel.sRespuesta}`);
  }
}

