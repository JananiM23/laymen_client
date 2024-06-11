import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { BsModalRef } from 'ngx-bootstrap';

@Component({
  selector: 'app-modal-purchase-view',
  templateUrl: './modal-purchase-view.component.html',
  styleUrls: ['./modal-purchase-view.component.css']
})
export class ModalPurchaseViewComponent implements OnInit {

  onClose: Subject<any>;
  Info: any;
  Type: any;

  constructor(public modalRef: BsModalRef) { }

  ngOnInit() {
  }
}
