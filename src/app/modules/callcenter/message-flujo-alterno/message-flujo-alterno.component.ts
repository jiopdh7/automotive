import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-message-flujo-alterno',
  templateUrl: './message-flujo-alterno.component.html',
  styleUrls: ['./message-flujo-alterno.component.css']
})
export class MessageFlujoAlternoComponent implements OnInit {

  public activeLang = 'es';
  constructor(
    public dialogRef: MatDialogRef<MessageFlujoAlternoComponent>,
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
    }else if(this.element.tipo=="Modify"){ 
    }
    
  }

  private onGoFlujoAlterno() {
    this.cRouter.navigateByUrl('/registrar/' + this.element.placa);
    this.dialogRef.close();
  }

}
