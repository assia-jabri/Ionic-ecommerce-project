import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { DatabaseService } from 'src/app/services/database.service';
import firebase from 'firebase/compat/app';
import { User } from 'src/app/models/user';
import { Order } from 'src/app/models/order';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-feeds',
  templateUrl: './feeds.page.html',
  styleUrls: ['./feeds.page.scss'],
})
export class FeedsPage implements OnInit {
  
  user!:firebase.User;
  userModel!:User;
  ordersId!:string[];
  orders!:Order[];
  order!:Order;
  cardTotal:Number = 0;
  total:Number = 10.75;

  constructor(private route:ActivatedRoute, private router:Router, private dbSrvice:DatabaseService, private authService:AuthService, private toast:ToastController) {

    this.authService.getCurrentUser().subscribe((data) => {
      if(data){
        this.user = data;

        this.dbSrvice.getOrderById(this.user.uid).subscribe((d) => {
          this.orders = d;

          for(let i=0 ; i<this.orders.length ; i++){
            this.dbSrvice.getProductById(this.orders[i].productId).subscribe((p) => {
              this.cardTotal = this.cardTotal.valueOf() + (p.price * this.orders[i].quantity);
              if(i == this.orders.length -1){
                this.total = 10.75 + this.cardTotal.valueOf();
              }
            });
          }
          
         
        })
      }
      
      
    })

   }

  ngOnInit() {
    
  }

  confirmOrders(){

  }

  


}
