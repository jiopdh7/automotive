import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MatTableDataSource, MatPaginator, MatDialogRef } from '@angular/material';
import { FormControl } from '@angular/forms';
import { ConfigurationService } from 'src/app/services/configuration.service';

@Component({
  selector: 'app-block-duration',
  templateUrl: './block-duration.component.html',
  styleUrls: ['./block-duration.component.css']
})
export class BlockDurationComponent implements OnInit {
  private companyUserModel = JSON.parse(localStorage.getItem('CompanyUser'));
  public oModuleSelected = JSON.parse(localStorage.getItem('ModuleSelected')) ? JSON.parse(localStorage.getItem('ModuleSelected')) : {};
  public IsCompleteSave = false;
  public bPrevent = false;
  displayedColumns: string[] = ['descripcion', 'acciones','usuario']
  dataSource: MatTableDataSource<any>;
  private nAlncace = 5;
  private nBase = 15;
  private sBLOCK_DURATION = 'BLOCK_DURATION';
  public aDuracion: any[] = [];
  public c_bloque = new FormControl('', []);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  constructor(
    public dialogRef: MatDialogRef<BlockDurationComponent>,
    private cTranslateService: TranslateService,
    private cConfigurationService: ConfigurationService
  ) {
    this.cTranslateService.setDefaultLang('es');
  }

  ngOnInit() {
    this.onGenerarDuraciones();
  }
  onGenerarDuraciones() {
    for (let index = 1; index <= this.nAlncace; index++) {
      let aValor = this.nBase * index;
      this.aDuracion.push({ c_descripcion: aValor + " min.", n_valor: '' + aValor })
    }
    this.onLoadBloques();
  }
  onLoadBloques() {
    this.IsCompleteSave = true;
    let oDataSend = {
      masterUserId: this.companyUserModel.MasterUserId,
      name: this.sBLOCK_DURATION,
      property: ""
    };
    this.cConfigurationService.CompanyConfigurationGet(oDataSend).subscribe((oData) => {
      oData.forEach(element => {
        if (element.IsActived) {
          this.c_bloque.setValue(element.Value)
        }
      });
      this.dataSource = new MatTableDataSource<any>(oData);
      this.dataSource.paginator = this.paginator;
    }, () => {
      this.IsCompleteSave = false;
    }, () => {
      this.IsCompleteSave = false;

    })
  }
  onCancelar() {
    this.dialogRef.close();
  }
  onObtenerFecha(d_fecha) {
    return new Date(d_fecha);
  }
  onSaveConfiguration() {
    this.IsCompleteSave = true;

    let oDataSend = {
      aDataSend: [
        {
          masterUserId: this.companyUserModel.MasterUserId,
          name: this.sBLOCK_DURATION,
          property: "MINUTE",
          value: this.c_bloque.value,
          isActived: true,
          isDeleted: false,
          credentialId: this.companyUserModel.OrganizationUserId
        }
      ]

    };
    this.cConfigurationService.CompanyConfigurationModify(oDataSend).subscribe((oData) => {

      this.dialogRef.close();
    }, () => {
      this.IsCompleteSave = false;
    }, () => {
      this.IsCompleteSave = false;

    })
  }
  onPascalCaseString(sPalabras: string): string {
    let aux = '';
    sPalabras.split(" ").forEach(element => {
      element = element.toLowerCase();
      aux += " " + element.charAt(0).toUpperCase() + '' + element.substring(1);
    });
    return aux;
  }
}
