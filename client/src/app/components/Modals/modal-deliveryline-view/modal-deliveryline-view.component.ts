import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { BsModalRef } from 'ngx-bootstrap';

@Component({
  selector: 'app-modal-deliveryline-view',
  templateUrl: './modal-deliveryline-view.component.html',
  styleUrls: ['./modal-deliveryline-view.component.css']
})
export class ModalDeliverylineViewComponent implements OnInit {
  onClose: Subject<any>;
  Info: any;
  constructor(public modalRef: BsModalRef) {
  }

  ngOnInit() {
    this.onClose = new Subject();
  }

}
