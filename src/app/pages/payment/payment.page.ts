import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.page.html',
  styleUrls: ['./payment.page.scss'],
})
export class PaymentPage implements OnInit {

  payementForm!:FormGroup;
  method!:string;

  validationMessages = {
    names: [{type:"required", message:"The name is required!"}],
    cvv: [{type:"required", message:"The CVV number is required!"}],
    expireDate: [
      {type: 'required',message:"Enter The Expire date!"}
    ],
    cardNumber: [
      {type: "required", message: "The card Number is required!"},
      {type:"minLength", message: "The card number must have exactly 16 caracters"},
      {type: "maxLength", message: "The card number must have exactly 16 caracters"}
    ]
 }

  constructor(private formbuilder:FormBuilder, private modalController: ModalController) {
    this.payementForm = this.formbuilder.group({
      cardNumber: new FormControl('',[Validators.required, Validators.minLength(16), Validators.maxLength(16)]),
      expireDate: new FormControl('', [Validators.required]),
      cvv: new FormControl('', Validators.required),
      name: new FormControl('',[Validators.required])
    })
   }

  ngOnInit() {
  }

  segmentChanged(ev:any){
    console.log(ev.detail.value);
  }

  onDismiss(){
    this.modalController.dismiss({
      'dismissed': true
    })
  }

}
