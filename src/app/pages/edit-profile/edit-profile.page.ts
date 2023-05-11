import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CountryService } from 'src/app/services/country.service';
import { FormControl, FormBuilder, FormGroup,FormControlName, Validators } from '@angular/forms';
import { DatabaseService } from 'src/app/services/database.service';
import { AuthService } from 'src/app/services/auth.service';
import firebase from 'firebase/compat/app';
import { User } from 'src/app/models/user';
@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {

  country:string = "Algeria";
  diaCode!:string | null;
  editForm!:FormGroup;
  countryNames!:string[];
  user!:firebase.User;
  userModel!:User;
  

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
    ],
    country: [{type: "required",message:"The country is required"}],
    address: [{type:"required", message:"the address is required"}]
 }
  constructor(private countryService:CountryService, private modalController:ModalController, private formBuilder:FormBuilder, private dbService:DatabaseService, private authService: AuthService) {
    
    this.dbService.getAllCountries().subscribe((data) => {
      this.countryNames = data;
      console.log(this.countryNames[0]);
    })

    
    
    this.editForm = this.formBuilder.group({
      fullName: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')]),
      country: new FormControl('', [Validators.required]),
      address: new FormControl('', [Validators.required]),
      diale: new FormControl('',[Validators.required]),
      phone: new FormControl('', [Validators.required]),
      newPassword: new FormControl('', [Validators.minLength(8)]),
      confirmPassword: new FormControl('', [Validators.minLength(8)])
    })

    this.authService.getCurrentUser().subscribe((data) => {
      if(data){
        this.user = data;

        this.dbService.getUserById(this.user.uid).subscribe((u) => {
          this.userModel = u;
          console.log(this.userModel);
          this.editForm.get('fullName')?.setValue(this.user.displayName);
          this.editForm.get('email')?.setValue(this.user.email);
          this.editForm.get('phone')?.setValue(this.user.phoneNumber);
          if(this.userModel.getCountry() && this.userModel.getAddress()){
            this.editForm.get('country')?.setValue(this.userModel.getCountry());
            this.editForm.get('address')?.setValue(this.userModel.getAddress());
          }
        })
      }
      
    })
    
   }

  ngOnInit() {

    this.countryService.getDialCode(this.country).subscribe((data) => {
      this.diaCode = data;
      console.log(this.diaCode);
    });
  }

  onDismiss(){
    this.modalController.dismiss({
      'dismissed': true
    })
  }

  onSelectChange(event: any) {
    this.countryService.getDialCode(event.detail.value).subscribe((data) => {
      this.diaCode = data;
      console.log(this.diaCode);
      this.editForm.get('diale')?.setValue(this.diaCode);
    });
  }

  onSubmittForm(){
    console.log(this.editForm.value);
    this.dbService.updateUser(this.user, this.editForm);

  }

}
