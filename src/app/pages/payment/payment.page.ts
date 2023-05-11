import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { DatabaseService } from 'src/app/services/database.service';
import firebase from 'firebase/compat/app';
import { Payment } from 'src/app/models/payment';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.page.html',
  styleUrls: ['./payment.page.scss'],
})
export class PaymentPage implements OnInit {

  payementForm!:FormGroup;
  method!:string;
  user!:firebase.User;
  payment!:Payment;

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

  constructor(private formbuilder:FormBuilder, private modalController: ModalController, private dbService:DatabaseService, private authService:AuthService) {
    this.payementForm = this.formbuilder.group({
      cardNumber: new FormControl('',[Validators.required, Validators.minLength(16), Validators.maxLength(16)]),
      expireDate: new FormControl('', [Validators.required]),
      cvv: new FormControl('', Validators.required),
      name: new FormControl('',[Validators.required])
    });
    
    // get the current user 

    this.authService.getCurrentUser().subscribe((data) => {
      if(data){
        this.user = data;

        this.dbService.getSavedPayment(this.user.uid).subscribe((pay) => {
          this.payment = pay;

          this.payementForm.get('cardNumber')?.setValue(this.payment.cardNumber);
          this.payementForm.get('expireDate')?.setValue(this.payment.expireDate);
          this.payementForm.get('cvv')?.setValue(this.payment.cvv);
          this.payementForm.get('name')?.setValue(this.payment.name);
        })
      }
    });

   }

  ngOnInit() {
  }

  segmentChanged(ev:any){
    this.method = ev.detail.value;
    console.log(this.method);
  }

  onDismiss(){
    this.modalController.dismiss({
      'dismissed': true
    })
  }

  onSubmitForm(value){

    this.dbService.savePayment(value, this.method, this.user.uid);
  }

}
