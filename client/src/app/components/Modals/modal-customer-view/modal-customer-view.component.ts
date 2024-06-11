import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { BsModalRef } from 'ngx-bootstrap';

@Component({
  selector: 'app-modal-customer-view',
  templateUrl: './modal-customer-view.component.html',
  styleUrls: ['./modal-customer-view.component.css']
})
export class ModalCustomerViewComponent implements OnInit {
  onClose: Subject<any>;
  Info: any;
  FamilyCount: any; 
  // Family_Members: any;
  // Family_Members: any[] = [];

  constructor(public modalRef: BsModalRef) { }

  ngOnInit() {
    
  this.onClose = new Subject();
  // this.Family_Members = this.Info.Family_Members;
  
  // this.FamilyCount = parseInt(this.IMale_Count)+parseInt(this.Family_Members.Female_Count) + parseInt(this.Family_Members.Children_Count) + parseInt(this.Family_Members.Infants_Count) + parseInt(this.Family_Members.Senior_Citizen);
    
  }

}
