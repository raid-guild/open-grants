import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-view-grant-request-refund',
  templateUrl: './view-grant-request-refund.component.html',
  styleUrls: ['./view-grant-request-refund.component.scss'],
})
export class ViewGrantRequestRefundComponent implements OnInit {

  constructor( public modalCtrl : ModalController ) { }
  dismiss(){
    this.modalCtrl.dismiss()
  }
  items = [
    {status:"completed", title:"Milestone 1", date:"02.02.2019", cost:"1,500", totalcost:"5,000"},
    {status:"completed", title:"Milestone 1", date:"02.02.2019", cost:"1,500", totalcost:"5,000"},
    {status:"tobereceivesd", title:"Milestone 1", date:"02.02.2019", cost:"1,500", totalcost:"5,000"},
    {status:"pending", title:"Milestone 1", date:"02.02.2019", cost:"1,500", totalcost:"5,000"},
    {status:"pending", title:"Milestone 1", date:"02.02.2019", cost:"1,500", totalcost:"5,000"}
  ]
  ngOnInit() {
  }

}
