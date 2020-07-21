import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MensajeDialogoModel } from 'src/app/models/mensaje-dialogo.model';
import { ConfigService } from 'src/app/services/config.service';

@Component({
  selector: 'app-mensaje-dialogo',
  templateUrl: './mensaje-dialogo.component.html',
  styleUrls: ['./mensaje-dialogo.component.css']
})
export class MensajeDialogoComponent {
  p_i_marca;
  constructor(
    public dialogRef: MatDialogRef<MensajeDialogoComponent>,
    private cConfigService: ConfigService,
    @Inject(MAT_DIALOG_DATA) public cConfirmModel: MensajeDialogoModel
  ) { 
    this.p_i_marca = cConfigService.onObtenerMarcaBase();
  }
  onYesClick(): void {
    this.cConfirmModel.sRespuesta = 'OK';
    this.dialogRef.close(`${this.cConfirmModel.sRespuesta}`);
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  ngAfterViewInit() {
    //ir arriba en la pagina
    let top = document.getElementById('top');
    if (top !== null) {
      top.scrollIntoView();
      top = null;
    }
    this.modificarFont();
 }
 modificarFont(){
   switch (this.p_i_marca) {
     case 1://subaru
       var list, index;
       list = document.getElementsByClassName("content");
       for (index = 0; index < list.length; ++index) {
           list[index].style.fontFamily = "AvenirNext-Regular"
       }
       break;
       break;
     case 2://dfsk
       var list, index;
       list = document.getElementsByClassName("content");
       for (index = 0; index < list.length; ++index) {
           list[index].style.fontFamily = "HelveticaLTStd"
       }
       break;
     case 3://bmw
       var list, index;
       list = document.getElementsByClassName("content");
       for (index = 0; index < list.length; ++index) {
           list[index].style.fontFamily = "AvenirNextLTPro"
       }
       break;
   }
 }

}
