import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';

@Component({
  selector: 'app-modal-customer-referral',
  templateUrl: './modal-customer-referral.component.html',
  styleUrls: ['./modal-customer-referral.component.css']
})
export class ModalCustomerReferralComponent implements OnInit {

   Info: any;
   CustomerReferralDetails: any;

   constructor(public modalRef: BsModalRef) { }

   ngOnInit() {
   }

}
