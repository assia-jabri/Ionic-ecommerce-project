export class Payment{


    constructor(
        public name:string,
        public cardNumber:string,
        public cvv:string,
        public expireDate:Date,
        public methode:string,
        public useUID
    ){}
}