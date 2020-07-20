import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { SendScheduleComponent } from '../send-schedule/send-schedule.component';
import { BlockDurationComponent } from '../block-duration/block-duration.component';
export interface Ajustes {
  id: number;
  ajuste: string;
}
const ELEMENT_DATA: Ajustes[] = [
  { id: 1, ajuste: 'Configuración de envío de cronograma de citas' },
  { id: 2, ajuste: 'Canales' },
  { id: 3, ajuste: 'Configuración de duración de bloques' },
  { id: 4, ajuste: 'Roles' },
  { id: 5, ajuste: 'Calendario General' },
  { id: 6, ajuste: 'Descripciones de módulos' },
]
@Component({
  selector: 'app-init',
  templateUrl: './init.component.html',
  styleUrls: ['./init.component.css']
})
export class InitComponent implements OnInit {
  IsLoadedBrands = true;
  public oModuleSelected = JSON.parse(localStorage.getItem('ModuleSelected')) ? JSON.parse(localStorage.getItem('ModuleSelected')) : {};
  position="below";
  /*i18n*/
  public activeLang = 'es';
  constructor(
    /*i18n*/
    // public cMenuactivoService:MenuactivoService,
    private cTranslateService: TranslateService,
    public dialog: MatDialog,
    /*ROUTER*/
    private cRouter: Router) {
    /*i18n*/
    this.cTranslateService.setDefaultLang(this.activeLang);
  }

  displayedColumns: string[] = ['descripcion', 'acciones']
  dataSource = ELEMENT_DATA;

  ngOnInit() {
  }
  ngAfterViewInit() {
    //ir arriba en la pagina
    let top = document.getElementById('top');
    if (top !== null) {
      top.scrollIntoView();
      top = null;
    }
  }

  fnShowNext(element) {
    switch (element.id) {
      case 1: {
         this.fnSelectDialog(SendScheduleComponent);
        break;
      }
      case 2: {
        this.fnShowComponent('/home/configuration/channel');
        break;
      }
      case 3: {
        this.fnSelectDialog(BlockDurationComponent);
        break;
      }
      case 4: {
        this.fnShowComponent('/home/configuration/role');
        break;
      }
      case 5: {
        this.fnShowComponent('/home/configuration/config-agenda');
        break;
      }
      case 6: {
        this.fnShowComponent('/home/configuration/module');
        break;
      }
      default: break;
    }
  }

  fnSelectDialog(dialogo) {
    const dialogRef = this.dialog.open(dialogo, {
      panelClass: 'popUpUsuarios'
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
      }
    });
  }

  fnShowComponent(ruta) {
    this.cRouter.navigateByUrl(ruta);
  }


}
