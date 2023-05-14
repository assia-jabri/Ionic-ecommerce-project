import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { Country } from '../models/country';
import { map } from 'rxjs/operators';
import { User } from '../models/user';
import firebase from 'firebase/compat/app';
import { initializeApp } from 'firebase/app';
import {firebaseConfig} from 'src/environments/environment';
import 'firebase/compat/firestore';
import { getFirestore, collection, addDoc, query, where, getDocs, doc, updateDoc, deleteDoc, setDoc } from 'firebase/firestore/lite';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { error } from 'console';
import { Payment } from '../models/payment';
import { FormGroup } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { Product } from '../models/product';
import { Order } from '../models/order';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
   
  private countriesUrl = '../assets/json/countries.json';
  app!:any;
  firestore!:any;
  constructor(private http:HttpClient, private fauth:AngularFireAuth, private toast:ToastController) {
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

  
 // get user info using the uid
  getUserById(uid:string):Observable<User>{
    let user!:User;

    const collectionInstance = collection(this.firestore, 'users');
    const q = query(collectionInstance, where('uid','==',uid));
    return from(getDocs(q)).pipe(
      map((val) => {
        const doc = val.docs[0];

        user = new User(doc.get('uid'));
            user.setAddress(doc.get('address'));
            user.setCountry(doc.get('coutry'));
            user.setImage(doc.get('image'));
            user.setOrders(doc.get('orders'));
            user.setLikes(doc.get('likes'));
        
        return user;
      })
    );
  }

  // get User Model id
  getUserModelId(uid:string): Observable<string>{
    let userId!:string;
    const collectionInstance = collection(this.firestore, 'users');
    const q = query(collectionInstance, where('uid','==',uid));
    return from(getDocs(q)).pipe(
      map((val) => {
        const doc = val.docs[0];
        userId = doc.id;
        
        return userId;
      })
    );

  }

  // update a user info 
  updateUser(user: firebase.User, form:FormGroup){
    let userId!:string;

    this.getUserModelId(user.uid).subscribe(async (data) => {
      userId = data;
      // update the document : 
      const documentRef = doc(this.firestore, 'users', userId);
      updateDoc(documentRef, {
        country: form.value.country,
        address: form.value.address,
        phone: `${form.value.diale} ${form.value.phone}`
      }).then(()=> {
        console.log("user Model updated");
      }).catch((err) => {
        console.log(err);
      });

      // update authentication User info 

      if(form.value.email !== user.email){
        user.updateEmail(form.value.email).then(() => {
          console.log("update email");
        }).catch((err) => {
          console.log(err);
        });
      }


      

      if(form.value.newPassword && form.value.confirmPassword){
        if(form.value.newPassword !== form.value.confirmPassword){
          const toast =  await this.toast.create({
            message: 'Password has not been updated: invalid password!',
            duration: 1500,
            position: 'bottom'
          });
      
          (await toast).present();
        }
        else{
          user.updatePassword(form.value.confirmPassword).then(async () => {
            console.log("pssword updated");
            const toast =  await this.toast.create({
              message: 'successfuly  updated!',
              duration: 1500,
              position: 'top'
            });
        
            (await toast).present();
          }).catch((err) => {
            console.log(err);
          })
        }
      }
      else{
        const toast =  await this.toast.create({
          message: 'successfuly  updated!',
          duration: 1500,
          position: 'top'
        });
    
        (await toast).present();
      }
    });

    
  }

  // on like a product
  productLike(likes:string[], uid:string){
    let userId!:string;

    this.getUserModelId(uid).subscribe(async (data) => {
      userId = data;
      // update the document : 
      const documentRef = doc(this.firestore, 'users', userId);
      updateDoc(documentRef, {
       likes: likes
      }).then(()=> {
        console.log("Product liked!");
      }).catch((err) => {
        console.log(err);
      });
    })
  }

  // the function that dd a payementMethode 
  savePayment(values, methode:string, uid:string){
    const collectionData = collection(this.firestore,'payment');

    let paymentId!:string;
    if(values){
        this.getPaymentModelId(uid).subscribe(async (data) => {
          paymentId = data;
          // update the document : 
          const documentRef = doc(this.firestore, 'payment', paymentId);
          updateDoc(documentRef, {
            methode: methode,
            name: values.name,
            cardNumber: values.cardNumber,
            cvv: values.cvv,
            expireDate: values.expireDate

          }).then(()=> {
            console.log("Payment Model updated");
          }).catch((err) => {
            console.log(err);
          });

        });
    }
  }

  // get Payment Model id
  getPaymentModelId(uid:string): Observable<string>{
    let paymentId!:string;
    
    const collectionInstance = collection(this.firestore, 'payment');
    const q = query(collectionInstance, where('useUID','==',uid));

    return from(getDocs(q)).pipe(
      map((val) => {
        const doc = val.docs[0];
        paymentId = doc.id;
        
        console.log(paymentId);
        return paymentId;
      })
    );

  }

  // the function that gets the payment info for of the current user 
  getSavedPayment(uid:string):Observable<Payment> {

    let payment!:Payment;

    const collectionInstance = collection(this.firestore, 'payment');
    const q = query(collectionInstance, where('useUID','==',uid));
    return from(getDocs(q)).pipe(
      map((val) => {
        const doc = val.docs[0];
        payment = new Payment(doc.get('name'), doc.get('cardNumber'), doc.get('cvv'), doc.get('expireDate'), doc.get('methode'),uid);
        
        return payment;
      })
    );
  }


  // get Product info using the uid
  getProductById(id:string):Observable<Product>{
    let product!:Product;

    const collectionInstance = collection(this.firestore, 'products');
    const q = query(collectionInstance, where('proId','==',id));
    return from(getDocs(q)).pipe(
      map((val) => {
        const doc = val.docs[0];

        product = new Product(doc.get('type'), doc.get('name'), doc.get('description'), doc.get('price'), doc.get('image'));


        return product;
      })
    );
  }

  getOrderById(uid:string) :Observable<Order[]> {
    let o!:Order;
    let orders:Order[] = [];
    
    console.log(uid);
    const collectionInstance = collection(this.firestore, 'orders');
    if(!collectionInstance){
      console.log("no collection");
    }
    const q = query(collectionInstance, where('uid','==',uid));
    return from(getDocs(q)).pipe(
      map((val) => {
        
        const length = val.docs.length;
        console.log(length);
        let doc;
        for(let i =0 ; i<length ; i++){
          doc = val.docs[i];
          console.log(doc);
           o = new Order(doc.get('orderId'), doc.get('productId'), doc.get('quantity'), doc.get('uid'));
          if(!orders.some((s) =>s.orderId == o.orderId && s.productId == o.productId && s.quantity == o.quantity && s.uid== o.uid)){
            orders.push(o);
          }
        }
        
            
        
        console.log(orders);
        return orders;
      })
    );
  }

  deleteUserOrder(orderId:string){
    const documentRef = doc(this.firestore, 'orders', orderId);
    deleteDoc(documentRef).then(async () => {
      const toast = await this.toast.create({
        message: 'Commande deleted!',
        duration: 1500,
        position: 'top'
      });
      (await toast).present();

      window.location.reload();
    }).catch((err) => {
      console.log(err);
    })
  }

  getAllProducts(): Observable<Product[]>{

    let produncts:Product[] = [];
    let product!:Product;

    const collectionInstance = collection(this.firestore, 'products');
    const q = query(collectionInstance);

    return from(getDocs(q)).pipe(
      map((val) => {
        const length = val.docs.length;
        let doc;
        for(let i =0 ; i<length ; i++){
          doc = val.docs[i];
          
          product = new Product(doc.get('type'), doc.get('name'), doc.get('description'), doc.get('price'), doc.get('image'));
          product.setProductId(doc.get('proId'));
          if(!produncts.some((s) =>s.type == product.type && s.name == product.name && s.description == product.description && s.price== product.price && s.getProductId()== product.getProductId())){
            produncts.push(product);
          }
        }

        return produncts;
      })
    )
  }
  getAllProductsName(): Observable<string[]>{

    let produncts:string[] = [];
    let product!:string;

    const collectionInstance = collection(this.firestore, 'products');
    const q = query(collectionInstance);

    return from(getDocs(q)).pipe(
      map((val) => {
        const length = val.docs.length;
        let doc;
        for(let i =0 ; i<length ; i++){
          doc = val.docs[i];
          
          product = doc.get('name');
          if(!produncts.some((s) =>s == product)){
            produncts.push(product);
          }
        }

        return produncts;
      })
    )
  }

  getProductsByName(name:string): Observable<Product>{

    let produncts:Product[] = [];
    let product!:Product;

    const collectionInstance = collection(this.firestore, 'products');
    const q = query(collectionInstance, where('name', '==', name));

    return from(getDocs(q)).pipe(
      map((val) => {
        let doc = val.docs[0];
          
          product = new Product(doc.get('type'), doc.get('name'), doc.get('description'), doc.get('price'), doc.get('image'));
          product.setProductId(doc.get('proId'));

        return product;
      })
    )
  }

  getProductsByType(type:string): Observable<Product[]>{

    let produncts:Product[] = [];
    let product!:Product;

    const collectionInstance = collection(this.firestore, 'products');
    const q = query(collectionInstance, where('marque', '==', type));

    return from(getDocs(q)).pipe(
      map((val) => {
        const length = val.docs.length;
        let doc;
        for(let i =0 ; i<length ; i++){
          doc = val.docs[i];
          
          product = new Product(doc.get('type'), doc.get('name'), doc.get('description'), doc.get('price'), doc.get('image'));
          product.setProductId(doc.get('proId'));
          if(!produncts.some((s) =>s.type == product.type && s.name == product.name && s.description == product.description && s.price== product.price && s.getProductId() == product.getProductId())){
            produncts.push(product);
          }
        }

        return produncts;
      })
    )
  }

  addToCard(quantity:number, proId:string, uid:string){
    let order!:Order;

    const myCollection =collection(this.firestore,'orders');
    const newDocRef = doc(myCollection);
    order = new Order(newDocRef.id, proId, quantity, uid);

    setDoc(newDocRef, JSON.parse(JSON.stringify(order))).then(async () => {
      const toast =  await this.toast.create({
        message: 'Product added to card !',
        duration: 1500,
        position: 'top'
      });
  
      (await toast).present();
    }).catch((err) => {
      console.log(err);
    })


  }

  
}




