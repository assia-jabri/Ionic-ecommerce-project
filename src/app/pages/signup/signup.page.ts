import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup , Validators , FormControl} from '@angular/forms';
import { Router } from '@angular/router';
import {AuthService} from 'src/app/services/auth.service';
import {AlertController , NavController , LoadingController} from '@ionic/angular';



@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  validationMessages = {
    names: [{type:"required", message:"Please Enter your Full Names"}],
    phone: [{type:"required", message:"Please Enter your Phone No."}],
    email: [
      {type: 'required',message:"Enter your Email Adress"},
      {type:"pattern", meesage:"Please the Email Entered is Incorrect. Try again.."}
    ],
    password: [
      {type: "required", message: "password is required here"},
      {type:"minlength", message: "Passwrd must be at least 6 character"}
    ]
 }
 ValidationFormUSer !: FormGroup;
 loading : any;

  constructor(private router : Router,private formBuilder :FormBuilder ,  private navCtr : NavController , private authService : AuthService ,
    private loadingCtrl :LoadingController , 
    private alertCtrl : AlertController
    ) { this.loading = this.loadingCtrl}
 
  ngOnInit() {
    this.ValidationFormUSer = this.formBuilder.group({
      names: new FormControl('', Validators.compose([
        Validators.required
     ])),
 
     phone: new FormControl('', Validators.compose([
       Validators.required
     ])),
     email: new FormControl('', Validators.compose([
       Validators.required,
       Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
     ])),
 
     password: new FormControl('', Validators.compose([
       Validators.required,
       Validators.minLength(6)
     ]))
    })
  }

  registerUser(value){
    this.showalert();
    try{
      this.authService.userRegistration(value).then(response =>{
        console.log(response);
        if(response.user){
          this.loading.dismiss();
          this.router.navigateByUrl('loginscreen');
        }
      })
    }catch(error){
      console.log(error);
      
    }

  }
 
 async errorLoading(message: any){
    const loading = await this.alertCtrl.create({
      header:"Error Registering",
      message:message,
      buttons:[{
        text:'ok',
        handler: ()=>{
        this.navCtr.navigateBack(['signup'])
      }
      }]
    })
     await loading.present();
  }




  async showalert(){
 var load = await this.loadingCtrl.create({
   message:"please wait....",

 })
  load.present();
}


}
