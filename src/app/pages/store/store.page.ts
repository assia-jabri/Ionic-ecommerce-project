import { Component, OnInit, ViewChild } from '@angular/core';
import { DatabaseService } from 'src/app/services/database.service';
import  firebase from 'firebase/compat/app';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/user';
import { IonSlides } from '@ionic/angular';
import { Product } from 'src/app/models/product';
import { ModalController } from '@ionic/angular';
import { DetailsPage } from '../details/details.page';
@Component({
  selector: 'app-store',
  templateUrl: './store.page.html',
  styleUrls: ['./store.page.scss'],
})
export class StorePage implements OnInit {

  user!:firebase.User;
  userModel!:User;
  products!:Product[];
  searchNames!:string[];
  results !:string[];

  @ViewChild('slider', { static: true }) private slider!: IonSlides;

  public slideOpts = {
    initialSlide: 1,
    speed: 400
  };

  constructor(private dbSrvice:DatabaseService, private authService:AuthService, private modalController:ModalController) { 

    this.authService.getCurrentUser().subscribe((data) => {
      if(data){
        this.user = data;

        this.dbSrvice.getUserById(this.user.uid).subscribe((u) => {
          this.userModel = u;
          console.log(this.userModel);
        })
      }
      console.log(this.user);
      
    });

    this.dbSrvice.getAllProducts().subscribe((data) => {
      this.products = data;
      console.log(this.products);
    });

    this.dbSrvice.getAllProductsName().subscribe((data) => {
      this.searchNames = data;
      this.results = data;
    })


  }

  ngOnInit() {
  }

  public async ionSlideDidChange(): Promise<void> {
    const index = await this.slider.getActiveIndex();

  }
  segmentChanged(ev: any = 'all') {
    console.log(ev.detail.value);
    if(ev.detail.value !== 'all'){
      this.dbSrvice.getProductsByType(ev.detail.value).subscribe((data) => {
        this.products = data;
      })
    }
    else{
      this.dbSrvice.getAllProducts().subscribe((data) => {
        this.products = data;
      });
    }
  }

  range(end: number) {
    return Array.from({length: end}, (_, i) => i);
  }


  handleChange(event) {
    let p:Product[] = [];
    const query = event.target.value.toLowerCase();
    this.results = this.searchNames.filter((d) => d.toLowerCase().indexOf(query) > -1);
    console.log(this.results);
    for(let i =0; i<this.results.length; i++){
      this.dbSrvice.getProductsByName(this.results[i]).subscribe((d) => {
        p.push(d);
      });
    }
    this.products = p;
    console.log(this.products);
  }

  onLikeProduct(id:string){
    if(!this.userModel.getLikes().includes(id)){
    this.userModel.addLike(id);
    }
    else{
      this.userModel.deleteLike(id);
    }
    this.dbSrvice.productLike(this.userModel.getLikes(), this.user.uid);
  }

  async showDetails(prodId:string){
    const modal = await this.modalController.create({
      component: DetailsPage,
      componentProps: {
        productId: prodId,
        uid:this.user.uid
      }
    });
    return await modal.present();
  }

}
