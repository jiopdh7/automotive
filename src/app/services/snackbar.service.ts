import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material'; 
import { SnakbarComponent } from '../snakbar/snakbar.component';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  constructor(private snackBar: MatSnackBar) {}
  public openSnackBar(message: string, action: string, snackType?: string) {
    const _snackType: string =
      snackType !== undefined ? snackType : 'Success';

    this.snackBar.openFromComponent(SnakbarComponent, {
      duration: 4000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      data: { message: message, snackType: _snackType }
    });
  }
}
