import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-delivery-approved',
  templateUrl: './delivery-approved.component.html',
  styleUrls: ['./delivery-approved.component.css']
})
export class DeliveryApprovedComponent implements OnInit {

  onClose: Subject<any>;

  Icon = '';
  ColorCode = '';
  TextOne = '';
  TextTwo = '';
  TextThree = '';
  TextDescription = '';

  constructor(public ModalRef: BsModalRef) { }

  ngOnInit() {
     this.onClose = new Subject();
  }
  Cancel() {
     this.onClose.next({Status: false});
     this.ModalRef.hide();
  }
  Proceed() {
     this.onClose.next({Status: true});
     
     this.ModalRef.hide();

  }

} 
