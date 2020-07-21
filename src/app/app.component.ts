import { Component } from '@angular/core';
import { ConfigService } from './services/config.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'automotive-agendamiento'; 
  p_i_marca;
  constructor(
    public cConfigService: ConfigService){
      this.p_i_marca = cConfigService.onObtenerMarcaBase();
      this.onSetStyle();
  }
  
  onSetStyle() {
    let stheme = '';
    let sTitulo = '';
    let favicon = '';
    switch (this.p_i_marca) {
      case 1:
        stheme = "subaru-theme";
        sTitulo = "Subaru Perú – Agendamiento online";
        favicon = "subaru.ico";
        break;
      case 2:
        stheme = "dfsk-theme";
        sTitulo = "DFSK Perú – Agendamiento online";
        favicon = "dfsk.ico";
        break;
      case 3:
        stheme = "bmw-theme";
        sTitulo = "BMW Perú – Agendamiento online";
        favicon = "bmw.ico";
        break;
    }

    document.getElementById('body-general').setAttribute("class", stheme);
    document.getElementById('titulo-general').innerHTML = sTitulo;
    document.getElementById('favicon').setAttribute("href",favicon);

  }
}
