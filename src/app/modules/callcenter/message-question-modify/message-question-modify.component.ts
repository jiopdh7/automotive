import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-message-question-modify',
  templateUrl: './message-question-modify.component.html',
  styleUrls: ['./message-question-modify.component.css']
})
export class MessageQuestionModifyComponent implements OnInit {

  public activeLang = 'es';
  constructor(
    public dialogRef: MatDialogRef<MessageQuestionModifyComponent>,
    @Inject(MAT_DIALOG_DATA) public element,
    private cRouter: Router,
    private translate: TranslateService,
  ) {
    this.translate.setDefaultLang(this.activeLang);
  }

  ngOnInit() { 
  }

  onNoClick(){
    this.dialogRef.close("NO");
  }

  onYesClick() {
    if(this.element.tipo=="Cancel"){
      this.dialogRef.close("onCancelarAppointment");
    }else if(this.element.tipo=="Modify"){
      this.dialogRef.close("onModifyAgendaAppointment");
    }
    
  }

 

}
