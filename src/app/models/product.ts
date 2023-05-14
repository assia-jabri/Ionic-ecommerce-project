export class Product{

    private productId!:string;
    constructor(
        public type:string,
        public name:string,
        public description:string,
        public price:number,
        public image:string
    ){
        this.productId = "";
    }


    public getProductId(): string{
        return this.productId;
    }
    public setProductId(id:string){
        this.productId = id;
    }
}