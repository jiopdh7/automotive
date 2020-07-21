import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-mensaje-dialogo-flujocliente-alterno',
  templateUrl: './mensaje-dialogo-flujocliente-alterno.component.html',
  styleUrls: ['./mensaje-dialogo-flujocliente-alterno.component.css']
})
export class MensajeDialogoFlujoclienteAlternoComponent implements OnInit {
  public activeLang = 'es';
  constructor(
    public dialogRef: MatDialogRef<MensajeDialogoFlujoclienteAlternoComponent>,
    @Inject(MAT_DIALOG_DATA) public element,
    private cRouter: Router,
    private translate: TranslateService,
  ) {
    this.translate.setDefaultLang(this.activeLang);
  }

  ngOnInit() { 
  }

  onNoClick(){
    this.dialogRef.close();
  }

  onYesClick() {
    localStorage.setItem('c_Placa', this.element.placa);
    /*localStorage.setItem('p_i_usuario', this.message.p_i_usuario);
    localStorage.setItem('c_usuario', this.message.c_usuario);
    localStorage.setItem('c_origen', this.message.c_origen);
    localStorage.setItem('c_token', this.message.c_token);*/
    this.onGoFlujoAlterno();
  }

  private onGoFlujoAlterno() {
    this.cRouter.navigateByUrl('/registrar/' + this.element.placa);
    this.dialogRef.close();
  }
}
