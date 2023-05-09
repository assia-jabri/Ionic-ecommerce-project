import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { Country } from '../models/country';
import { map } from 'rxjs/operators';
import { User } from '../models/user';

import { initializeApp } from 'firebase/app';
import {firebaseConfig} from 'src/environments/environment';
import 'firebase/compat/firestore';
import { getFirestore, collection, addDoc, query, where, getDocs } from 'firebase/firestore/lite';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
   
  private countriesUrl = '../assets/json/countries.json';
  app!:any;
  firestore!:any;
  constructor(private http:HttpClient, private fauth:AngularFireAuth) {
    this.app = initializeApp(firebaseConfig);
    this.firestore = getFirestore(this.app);
    
   }

    getCountries(): Observable<Country[]> {
    return this.http.get<Country[]>(this.countriesUrl);
   }
   getAllCountries(): Observable<string[]> {
    return this.http.get<Country[]>(this.countriesUrl).pipe(
      map(countries => countries.map(country => country.name))
    );
  }

  getUserById(uid:string):Observable<User>{
    let user!:User;

    const collectionInstance = collection(this.firestore, 'users');
    const q = query(collectionInstance, where('uid','==',uid));
    return from(getDocs(q)).pipe(
      map((val) => {
        val.forEach(v => {
          if(v['uid'] == uid){
            user = new User(v['fullName'],v['email'],v['phone'],v['uid']);
            user.setAddress(v['address']);
            user.setCountry(v['coutry']);
            user.setImage(v['image']);
            user.setOrders(v['orders']);
          }
        });
        console.log("test observable");
        return user;
      })
    );
  }
}


