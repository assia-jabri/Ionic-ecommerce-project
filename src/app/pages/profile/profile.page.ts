import { Component, OnInit } from '@angular/core';
import {AngularFireAuth} from '@angular/fire/compat/auth';
import {AngularFirestore} from '@angular/fire/compat/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import firebase from 'firebase/compat/app';
import { User } from 'src/app/models/user';
import {AuthService} from 'src/app/services/auth.service';
import { DatabaseService } from 'src/app/services/database.service';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  user!:firebase.User;
  userModel!:User;
  constructor(private route:ActivatedRoute, private router:Router, private dbSrvice:DatabaseService, private authService:AuthService) {

    this.authService.getCurrentUser().subscribe((data) => {
      if(data){
        this.user = data;

        this.dbSrvice.getUserById(this.user.uid).subscribe((u) => {
          this.userModel = u;
          console.log(this.userModel);
        })
      }
      
      
    })

   }

  ngOnInit() {
  }

  openSettings(){
    this.router.navigate(['/settings']);
  }

  logout(){
    this.authService.logout();
  }

}
