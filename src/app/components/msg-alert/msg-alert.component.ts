import { Component, OnInit, Inject } from '@angular/core';
import { MensajeDialogoComponent } from '../mensaje-dialogo/mensaje-dialogo.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MensajeDialogoModel } from 'src/app/models/mensaje-dialogo.model';

@Component({
  selector: 'app-msg-alert',
  templateUrl: './msg-alert.component.html',
  styleUrls: ['./msg-alert.component.css']
})
export class MsgAlertComponent implements OnInit {
  data;
  constructor(
    public dialogRef: MatDialogRef<MensajeDialogoComponent>,
    @Inject(MAT_DIALOG_DATA) public cConfirmModel: MensajeDialogoModel
  ) { }

  ngOnInit() {
    this.data = this.cConfirmModel;
  }

}
