import { Injectable } from '@angular/core';
import  firebase from 'firebase/compat/app';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { AngularFireAuth } from '@angular/fire/compat/auth';
import 'firebase/compat/auth';
export interface UserPro{
  username :string;
  uid :string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private user !: UserPro;

  constructor() { }


  loginFireauth(value){
    return new Promise<any> ( (resolve, reject)=>{
      firebase.auth().signInWithEmailAndPassword(value.email, value.password).then(
        res => resolve(res),
        error => reject(error),
    
      )
    })
   }
  setUser(user : UserPro){
    return this.user = user;
  }
  getUID() :String{
    return this.user.uid
  }

  userRegistration(value){
    return new Promise<any> ( (resolve, reject)=>{
      firebase.auth().createUserWithEmailAndPassword(value.email,value.password).then(
        res => resolve(res),
        error => reject(error)
        
      )
    })
  }

}
