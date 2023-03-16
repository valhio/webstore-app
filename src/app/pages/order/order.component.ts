import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StoreService } from '../../services/store.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {

  orderId: string = this.route.snapshot.params['id'];
  order$ = this.storeService.getOrderByOrderId(this.orderId);

  constructor(private route: ActivatedRoute, private storeService: StoreService) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      console.log(params['id']);
    });

    this.route.paramMap.subscribe(params => {
      console.log(params.get('id'));
    });

    console.log(this.route.snapshot.params['id']);


  }

}
