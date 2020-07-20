import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { debug } from 'console';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-message-topes',
  templateUrl: './message-topes.component.html',
  styleUrls: ['./message-topes.component.css']
})
export class MessageTopesComponent implements OnInit {

  public diasSemana=[];
  constructor(
    private cTranslateService: TranslateService,
    public dialogRef: MatDialogRef<MessageTopesComponent>,
    @Inject(MAT_DIALOG_DATA) public oRestriction: any,
  ) { }

  ngOnInit() { 
    this.diasSemana=[
      {dia:"",talleres:[],asesores:[]},
      {dia:"",talleres:[],asesores:[]},
      {dia:"",talleres:[],asesores:[]},
      {dia:"",talleres:[],asesores:[]},
      {dia:"",talleres:[],asesores:[]},
      {dia:"",talleres:[],asesores:[]},
      {dia:"",talleres:[],asesores:[]}
    ];
    this.obtenerTexto('BrandConfigServicesMonday',0);
    this.obtenerTexto('BrandConfigServicesTuesday',1);
    this.obtenerTexto('BrandConfigServicesWednesday',2);
    this.obtenerTexto('BrandConfigServicesThursday',3);
    this.obtenerTexto('BrandConfigServicesFriday',4);
    this.obtenerTexto('BrandConfigServicesSaturday',5);
    this.obtenerTexto('BrandConfigServicesSunday',6);

    this.oRestriction[0].talleres.forEach(element => {          
      this.diasSemana[0].talleres.push({nombre:element.FriendlyName,tope:element.MondayStop})
      this.diasSemana[1].talleres.push({nombre:element.FriendlyName,tope:element.TuesdayStop})
      this.diasSemana[2].talleres.push({nombre:element.FriendlyName,tope:element.WednesdayStop})
      this.diasSemana[3].talleres.push({nombre:element.FriendlyName,tope:element.ThursdayStop})
      this.diasSemana[4].talleres.push({nombre:element.FriendlyName,tope:element.FridayStop})
      this.diasSemana[5].talleres.push({nombre:element.FriendlyName,tope:element.SaturdayStop})
      this.diasSemana[6].talleres.push({nombre:element.FriendlyName,tope:element.SundayStop})
    });
    this.oRestriction[0].asesores.forEach(element => {          
      this.diasSemana[0].asesores.push({nombre:element.FriendlyName,tope:element.MondayStop})
      this.diasSemana[1].asesores.push({nombre:element.FriendlyName,tope:element.TuesdayStop})
      this.diasSemana[2].asesores.push({nombre:element.FriendlyName,tope:element.WednesdayStop})
      this.diasSemana[3].asesores.push({nombre:element.FriendlyName,tope:element.ThursdayStop})
      this.diasSemana[4].asesores.push({nombre:element.FriendlyName,tope:element.FridayStop})
      this.diasSemana[5].asesores.push({nombre:element.FriendlyName,tope:element.SaturdayStop})
      this.diasSemana[6].asesores.push({nombre:element.FriendlyName,tope:element.SundayStop})
    });
  }
  obtenerTexto(texto,pos){ 
    this.cTranslateService.get(texto).subscribe((text: string) => {
      this.diasSemana[pos].dia = text;
    });
  }

}
