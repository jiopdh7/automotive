import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-delete-agenda',
  templateUrl: './delete-agenda.component.html',
  styleUrls: ['./delete-agenda.component.css']
})
export class DeleteAgendaComponent implements OnInit {

  constructor(public cMatDialogRef: MatDialogRef<DeleteAgendaComponent>,
    @Inject(MAT_DIALOG_DATA) public sMensaje: any,) { }

  ngOnInit() {
  }
  onCancel(){
    this.cMatDialogRef.close();
  }

  onDelete(){
    this.cMatDialogRef.close('OK');
  }

}
