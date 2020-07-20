import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatPaginator, MatTableDataSource, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { CustomerService } from 'src/app/services/customer.service';

@Component({
  selector: 'app-vehicles',
  templateUrl: './vehicles.component.html',
  styleUrls: ['./vehicles.component.css']
})
export class VehiclesComponent implements OnInit {
  public activeLang = 'es';
  table_length;
  isProgress: boolean = false;
  IsLoadAdviser = false;
  constructor(
    @Inject(MAT_DIALOG_DATA) public message: any,
    public dialogRef: MatDialogRef<VehiclesComponent>,
    public cCustomerService: CustomerService,
    private cTranslateService: TranslateService,
  ) {
    this.cTranslateService.setDefaultLang(this.activeLang);
  }

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  displayedColumns: string[] = ['foto', 'marca', 'modelo', 'version', 'anio', 'placa'];
  dataSource;

  ngOnInit() {
    this.onGetTableData();
  }
  

  onGetTableData() {
    this.isProgress = true;
    let oDataSend = {
      customerId: this.message.CustomerId,
      plate:""
    }
    this.table_length = 0
    this.cCustomerService.ObtenerVehiculos(oDataSend).subscribe(oContent => { 
      this.dataSource = new MatTableDataSource<any>(oContent);
      this.dataSource.paginator = this.paginator;
      this.table_length = oContent.length;
      this.isProgress = false;
    });
  }

}
