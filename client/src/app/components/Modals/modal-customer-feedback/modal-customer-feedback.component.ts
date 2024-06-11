import { Component, OnInit } from '@angular/core';
import { ToastrService } from './../../../services/common-services/toastr.service';
import { BsModalRef } from 'ngx-bootstrap';
@Component({
  selector: 'app-modal-customer-feedback',
  templateUrl: './modal-customer-feedback.component.html',
  styleUrls: ['./modal-customer-feedback.component.css']
})
export class ModalCustomerFeedbackComponent implements OnInit {
  FeedBackDetails: any;
  Type: string;
  constructor(public Toastr: ToastrService,
              public modalRef: BsModalRef,
    ) {
}

  ngOnInit() {
  }

}
