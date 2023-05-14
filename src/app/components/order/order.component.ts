import { Component, Input, OnInit } from '@angular/core';
import { Order } from 'src/app/models/order';
import { Product } from 'src/app/models/product';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
})
export class OrderComponent  implements OnInit {
  count = 0;
  productImage!:string;
  product!:Product;
  calculePrice!:number;


  @Input()
  order!:Order;


  constructor(private dbService:DatabaseService) { 
    

  }

  ngOnInit() {
    console.log(this.order);
    this.count = this.order.quantity;

    this.dbService.getProductById(this.order.productId).subscribe((data) => {
      this.product = data;

      this.calculePrice = this.product.price * this.count;
    })
  }


  increment() {
    this.count++;
    this.calculePrice = this.product.price * this.count;
  }

  decrement() {
    this.count--;
    if(this.count<0){
      this.count = 0;
    }
    this.calculePrice = this.product.price * this.count;
  }

  deleteOrder(){
    this.dbService.deleteUserOrder(this.order.orderId);
  }

}
