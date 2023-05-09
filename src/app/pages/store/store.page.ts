import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/app/services/database.service';
import  firebase from 'firebase/compat/app';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-store',
  templateUrl: './store.page.html',
  styleUrls: ['./store.page.scss'],
})
export class StorePage implements OnInit {

  user!:firebase.User;

  constructor(private dbSrvice:DatabaseService, private authService:AuthService) { 
    this.authService.getCurrentUser().subscribe((data) => {
      if(data){
        this.user = data;
      }
      console.log(this.user);
    })
  }

  ngOnInit() {
  }

}
