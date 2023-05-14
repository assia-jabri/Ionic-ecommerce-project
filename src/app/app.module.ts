import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import {ReactiveFormsModule , FormsModule} from '@angular/forms';
import {AngularFireAuthModule} from '@angular/fire/compat/auth';
import {AngularFireModule} from '@angular/fire/compat';
import {AngularFirestoreModule} from '@angular/fire/compat/firestore';
import {firebaseConfig} from 'src/environments/environment';
import {Facebook} from '@ionic-native/facebook/ngx'
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { AppPreferences } from '@ionic-native/app-preferences/ngx';
import { HttpClientModule } from '@angular/common/http';
import {provideAuth, getAuth} from '@angular/fire/auth';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
import {getStorage, provideStorage} from '@angular/fire/storage';
import { FIREBASE_OPTIONS } from '@angular/fire/compat';
import {OrderComponent} from './components/order/order.component';
@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, IonicModule.forRoot(), 
    HttpClientModule,
    AppRoutingModule , 
    IonicModule,
    ReactiveFormsModule, 
    FormsModule ,
    AngularFireAuthModule,
    AngularFireModule,
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
    

  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: FIREBASE_OPTIONS, useValue: firebaseConfig },
    Facebook,
    GooglePlus,
    AppPreferences,
    
    
  ],
  bootstrap: [AppComponent],
})


export class AppModule {}
