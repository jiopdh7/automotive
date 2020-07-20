import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatDialog } from '@angular/material';

export interface PeriodicElement {
  name: string;
  document: string;
  type: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {name: 'Hydrogen', document: '12345678', type: 'Cliente'},
  {name: 'Helium', document: '12345678', type: 'Asociado'},
  {name: 'Lithium', document: '12345678', type: 'Cliente'},
  {name: 'Beryllium', document: '12345678', type: 'Asociado'},
];


@Component({
  selector: 'app-message-advisers',
  templateUrl: './message-advisers.component.html',
  styleUrls: ['./message-advisers.component.css']
})
export class MessageAdvisersComponent implements OnInit {

  displayedColumns: string[] = ['name', 'document', 'type'];
  dataSource = ELEMENT_DATA;
  constructor() { }

  ngOnInit() {
  }

}
