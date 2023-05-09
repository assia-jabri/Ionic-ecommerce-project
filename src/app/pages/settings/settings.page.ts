import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { EditProfilePage } from '../edit-profile/edit-profile.page';
import { PaymentPage } from '../payment/payment.page';
@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  handlerMessage = '';
  roleMessage = '';

  constructor(private rout:ActivatedRoute, private router:Router, private alertController: AlertController, private modalController:ModalController, private modalPaymentController: ModalController) { }

  ngOnInit() {
  }

  backAction(){
    this.router.navigate(['/tabs/tabs/profile']);
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Are you sure you want to delete your account?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            this.handlerMessage = 'Alert canceled';
          },
        },
        {
          text: 'Delete',
          role: 'confirm',
          handler: () => {
            this.handlerMessage = 'Alert confirmed';
          },
        },
      ],
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
    this.roleMessage = `Dismissed with role: ${role}`;
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: EditProfilePage,
    });
    return await modal.present();
  }
  
  async presentPaymentModal(){
    const modal = await this.modalPaymentController.create({
      component: PaymentPage,
    });

    return await modal.present();
  }

}
