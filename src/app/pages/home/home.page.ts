import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import {Facebook , FacebookLoginResponse} from '@ionic-native/facebook/ngx'
import {firebaseAuth} from '../../../environments/authconfig';
import firebase from 'firebase/compat/app';
import {NavController} from'@ionic/angular';
@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  constructor(private router :Router , private gooleService : AuthService, private fbook : Facebook, private nav : NavController) { }

  ngOnInit() {
  }

  gotoLogin(){
    this.router.navigateByUrl('loginscreen');
  }
  gotoSignup(){
    this.router.navigateByUrl('signup');
  }

 
  loginwithFacebook(){
                  
    this.fbook.login(["public_profile","email"]).then( (response: FacebookLoginResponse)=>{
      console.log(response);
      const userId = response.authResponse.userID;
      const userToken = response.authResponse.accessToken;
 
      if(response.status === "connected"){
       console.log("FacebookRESP", response)                  
 
       firebaseAuth().signInWithCredential(firebase.auth.FacebookAuthProvider.credential(userToken)).then( response=>{
         console.log("user", response);
        if(response.user){
          this.nav.navigateForward(['tabs']);
        }
 
        this.fbook.api('/me?fields=name,email',['public_profile','email']).then( response=>{
           console.log("user-fb-API",response);
        
         response.picture = 'https://graph.facebook.com' + userId + 'picture?type=large';
 
         console.log("Userprofile-Picture:::",response.picture);
   
 
        }).catch(e=>{
          console.log(e);
        })
 
 
 
       }).catch(e =>{
         console.log(e);
       });
 
      }
    }, errro=>{
      console.log("FIRE:ERROR", errro)
    })
   }
  }
      