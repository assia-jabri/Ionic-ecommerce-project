import { Order } from "./order";
import { Product } from "./product";

export class User{
    private country!:string;
    private address!:string;
    private image!:string;
    private orders!:string[]; // this table contains orders id 
    private phone!:string;
    constructor(
       
        public uid:string | null | undefined,
    ){
        this.image = "https://firebasestorage.googleapis.com/v0/b/ioniclogin-2f68a.appspot.com/o/users%2Fuser.png?alt=media&token=6e4972ff-ea52-4cbe-9e29-2c09fa162f18";
        this.orders = [];
        this.country = "";
        this.address = "";
        this.phone = "";
    }

    public setCountry(country:string){
        this.country = country;
    }

    public setAddress(addr:string){
        this.address = addr;
    }
    public setPhone(phone:string){
        this.phone = phone;
    }


    public setImage(img:string){
        this.image = img;
    }

    public addOrder(o:string){
        this.orders.push(o);
    }

    public setOrders(orders: string[]){
        this.orders = orders;
    }

    public getCountry(): string{
        return this.country;
    }
    public getPhone(): string{
        return this.phone;
    }
    public getAddress():string{
        return this.address;
    }

    public getImage(): string{
        return this.image;
    }

    public getOrders():string[]{
        return this.orders;
    }


    public deleteOrder(id:string){
        this.orders = this.orders.filter((order) => order!== id);
    }

    public toJSON() {
        return {
          
          uid:this.uid,
          image: this.image,
          country: this.country,
          address: this.address,
          orders: this.orders
        };
      }

}