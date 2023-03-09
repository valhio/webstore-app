import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  constructor(private snackBar: MatSnackBar) {
  }

  openSnackBar(message: string,
    duration: number = 5000,
    appearance: 'fill' | 'outline' | 'soft' = 'fill', // = means default value
    type: 'info' | 'success' | 'error' = 'info'): void {

    const config: MatSnackBarConfig = {
      duration: duration,
      verticalPosition: 'top',
      horizontalPosition: 'end',
      panelClass: [`snackbar-type-${ appearance }-${ type }`]
    };
    this.snackBar.open(message, '', config);
  }

}
