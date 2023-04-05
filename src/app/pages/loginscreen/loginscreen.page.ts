import { Component, OnInit } from '@angular/core';
import {NavController} from '@ionic/angular'
import {FormGroup, FormBuilder, Validators, FormControl} from '@angular/forms';
import { Router } from '@angular/router';
import {AuthService} from 'src/app/services/auth.service';
import {AngularFirestore} from '@angular/fire/compat/firestore';
@Component({
  selector: 'app-loginscreen',
  templateUrl: './loginscreen.page.html',
  styleUrls: ['./loginscreen.page.scss'],
})
export class LoginscreenPage implements OnInit {

  validationUserMessage ={
    email:[
      {type:"required", message:"Please enter your Email"},
      {type:"pattern", message:"The Email entered is Incorrect.Try again"}
    ],
    password:[
      {type:"required", message:"please Enter your Password!"},
      {type:"minlength", message:"The Password must be at least 5 characters or more"}

    ]
  }

  validationFormUser !: FormGroup;

  constructor(public formbuider: FormBuilder, public authservice: AuthService,private router: Router
    
    ) { }

  ngOnInit() {



  this.validationFormUser = this.formbuider.group({
    email: new FormControl('', Validators.compose([
      Validators.required,
      Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
    ])),
    password: new FormControl('', Validators.compose([
      Validators.required,
      Validators.minLength(5)
    ]))
  })

  }

  LoginUser(value){
    console.log("connexion reussi");
    try{
        this.authservice.loginFireauth(value).then(resp =>{
          console.log(resp);
          this.router.navigateByUrl('tabs');
        })
    }catch(err){
      console.log(err);
    }
  }
registerUser(){
  this.router.navigateByUrl('signup');
}

}