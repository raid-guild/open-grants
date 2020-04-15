import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-view-grunt-unmark-as-complete',
  templateUrl: './view-grunt-unmark-as-complete.component.html',
  styleUrls: ['./view-grunt-unmark-as-complete.component.scss'],
})
export class ViewGruntUnmarkAsCompleteComponent implements OnInit {

  constructor(public modalCtrl : ModalController) { }
  dismiss(){
    this.modalCtrl.dismiss()
  }
  items = [
    {status:"completed", title:"Milestone 1", date:"02.02.2019", cost:"1,500", totalcost:"5,000",milestoneStatus:"Unmark as complete", request:"REQUEST PAYMENT"},
    {status:"completed", title:"Milestone 2", date:"02.02.2019", cost:"1,500", totalcost:"5,000",milestoneStatus:"Unmark as complete", request:"REQUEST PAYMENT"},
    {status:"tobereceivesd", title:"Milestone 3", date:"02.02.2019", cost:"1,500", totalcost:"5,000",milestoneStatus:"Complete Milestone", request:""},
    {status:"pending", title:"Milestone 4", date:"02.02.2019", cost:"1,500", totalcost:"5,000",milestoneStatus:"Complete Milestone", request:""},
    {status:"pending", title:"Milestone 5", date:"02.02.2019", cost:"1,500", totalcost:"5,000",milestoneStatus:"Complete Milestone", request:""}
  ]
  ngOnInit() {
  }

}
