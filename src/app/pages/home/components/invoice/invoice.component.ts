import {Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {StoreService} from 'src/app/services/store.service';
import {catchError, Observable, of} from 'rxjs';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss']
})
export class InvoiceComponent {

  orderNumber: string = this.route.snapshot.params['orderNumber'];
  order$: Observable<any> = this.storeService.getOrderByOrderNumber(this.orderNumber).pipe(
    catchError(err => {
      // If the order is not found, redirect to home page
      this.router.navigate(['/']);
      return of();
    })
  );

  constructor(private route: ActivatedRoute, private storeService: StoreService, private router: Router) {
  }
}
