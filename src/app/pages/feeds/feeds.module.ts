import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FeedsPageRoutingModule } from './feeds-routing.module';

import { FeedsPage } from './feeds.page';
import { OrderComponent } from 'src/app/components/order/order.component';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FeedsPageRoutingModule
  ],
  declarations: [FeedsPage, OrderComponent]
})
export class FeedsPageModule {}
