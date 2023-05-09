import { Injectable } from '@angular/core';
import  firebase from 'firebase/compat/app';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { AngularFireAuth } from '@angular/fire/compat/auth';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { User } from '../models/user';
import { getFirestore, collection, addDoc } from 'firebase/firestore/lite';
import { initializeApp } from 'firebase/app';
import {firebaseConfig} from 'src/environments/environment';
import 'firebase/database';
import { Observable, from } from 'rxjs';
import { authState } from '@angular/fire/auth';
import { switchMap } from 'rxjs/operators';

export interface UserPro{
  username :string;
  uid :string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private user !: UserPro;
  app!:any;

  //authentication user
  userAuth!:firebase.User;

  constructor(private fauth:AngularFireAuth) {
    this.app = initializeApp(firebaseConfig);

    firebase.initializeApp(firebaseConfig);

   }

  getCurrentUser(): Observable<firebase.User | null> {
    console.log("start getCurrentUser");
    const auth = getAuth(this.app);
    return authState(auth) as Observable<firebase.User | null>;
    //return this.fauth.authState;
  }


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
    
      firebase.auth().createUserWithEmailAndPassword(value.email,value.password).then(
          (res) =>{
          res.user?.updateProfile({displayName: value.names,
                                   photoURL: "https://firebasestorage.googleapis.com/v0/b/ioniclogin-2f68a.appspot.com/o/users%2Fuser.png?alt=media&token=6e4972ff-ea52-4cbe-9e29-2c09fa162f18"
                                  });

            
            console.log("step 1");

            const firestore = getFirestore(this.app);
            const myCollection =collection(firestore,'users');
            const user = new User(value.names, res.user?.email, value.phone, res.user?.uid);
            addDoc(myCollection,user.toJSON()).then(()=> {
              console.log("user created!");
            }).catch((err) => {
              console.log(err);
            });
            
            console.log("step 2");

           
        },
        
        
      )
    
  }

  logout() {
    this.fauth.signOut();
  }

}
