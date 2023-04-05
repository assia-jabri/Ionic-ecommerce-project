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
import { AppPreferences } from '@ionic-native/app-preferences/ngx';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, IonicModule.forRoot(), 
    AppRoutingModule , 
    ReactiveFormsModule, 
    FormsModule ,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
    AngularFirestoreModule,

  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    Facebook,
    GooglePlus,
    AppPreferences
    
  ],
  bootstrap: [AppComponent],
})


export class AppModule {}
