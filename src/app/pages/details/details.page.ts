import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { NavParams } from '@ionic/angular';
import { Product } from 'src/app/models/product';
import { DatabaseService } from 'src/app/services/database.service';
@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {

  productId!:string;
  uid!:string;
  count:number = 0;
  product!:Product;
  constructor(private modalController:ModalController, private navParam:NavParams, private dbService:DatabaseService, private toast:ToastController) {
    this.productId = this.navParam.get('productId');
    this.uid = this.navParam.get('uid');
    console.log(this.productId);

    this.dbService.getProductById(this.productId).subscribe((data) => {
      this.product = data;
    })
   }

  ngOnInit() {
  }

  onDismiss(){
    this.modalController.dismiss({
      'dismissed': true
    })
  }

  segmentChanged(ev:any){

  }
  

  increment() {
    this.count++;
  }

  decrement() {
    if(this.count>0){
    this.count--;
    }
  }

  async addTocard(quantity:number, proId:string,uid:string){
    if(this.count){
      this.dbService.addToCard(this.count, this.productId, this.uid);
    }
    else{
      const toast =  await this.toast.create({
        message: 'The quantity cannot be 0!',
        duration: 1500,
        position: 'bottom'
      });
  
      (await toast).present();
    }
  }

}
