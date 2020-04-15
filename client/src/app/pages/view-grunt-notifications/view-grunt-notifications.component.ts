import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-view-grunt-notifications',
  templateUrl: './view-grunt-notifications.component.html',
  styleUrls: ['./view-grunt-notifications.component.scss'],
})
export class ViewGruntNotificationsComponent implements OnInit {

  constructor(public modalCtrl : ModalController) { }

  ngOnInit() {
  }

  dismiss(){
    this.modalCtrl.dismiss()
  }

}
