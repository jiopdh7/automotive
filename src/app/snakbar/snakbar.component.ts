import { Component, OnInit, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material';

@Component({
  selector: 'app-snakbar',
  templateUrl: './snakbar.component.html',
  styleUrls: ['./snakbar.component.css']
})
export class SnakbarComponent implements OnInit {

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) { 
  }
 

  ngOnInit() {}

  get getIcon() {
    switch (this.data.snackType) {
      case 'Success':
        return 'done';
      case 'Error':
        return 'error';
      case 'Warn':
        return 'warning';
      case 'Info':
        return 'info';
    }
  }

}
