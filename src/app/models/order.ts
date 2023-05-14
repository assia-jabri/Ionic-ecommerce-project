export class Order{

    constructor(
        public orderId:string,
        public productId:string,
        public quantity:number,
        public uid:string
    ){}


    public totapPrice(price:number): number{
        return price*this.quantity;
    }
}