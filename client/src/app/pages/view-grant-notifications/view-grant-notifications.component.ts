import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-view-grant-notifications',
  templateUrl: './view-grant-notifications.component.html',
  styleUrls: ['./view-grant-notifications.component.scss'],
})
export class ViewGrantNotificationsComponent implements OnInit {

  constructor(public modalCtrl : ModalController) { }

  ngOnInit() {
  }

  dismiss(){
    this.modalCtrl.dismiss()
  }

}
