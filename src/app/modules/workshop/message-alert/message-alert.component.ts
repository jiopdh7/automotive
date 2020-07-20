import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-message-alert',
  templateUrl: './message-alert.component.html',
  styleUrls: ['./message-alert.component.css']
})
export class MessageAlertComponent implements OnInit {

  data;
  constructor(
    public dialogRef: MatDialogRef<MessageAlertComponent>,
    @Inject(MAT_DIALOG_DATA) public cConfirmModel: any
  ) { }

  ngOnInit() {
    this.data = this.cConfirmModel;
  }

}
